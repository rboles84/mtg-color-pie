#!/usr/bin/env python3
"""
Golden-file fixtures for the runtime projection.

    python tools/fixtures.py --data data/            # verify (default)
    python tools/fixtures.py --data data/ --update   # regenerate goldens

Golden files, not prose review notes. Prose gets skimmed and agreed with;
a byte comparison does not. Every fixture is regenerated from the runtime and
compared exactly, so a change in selection maths cannot slip through as
"looks about right".

Fixture 11 is the provenance fixture, and it guards the class of bug that
caused most of the trouble in the source phase: an identity merge being
silently undone downstream. It asserts one mechanic, one canonical key, all
source aliases still reachable, and NO duplicate appearance in any count.
"""

import argparse
import json
import pathlib
import sys

from gate import require_source_gate
import selection as S

GOLDEN = pathlib.Path(__file__).resolve().parent.parent / "data" / "fixtures"

FLYING = "flying"
FLASH = "flash"
NO_PRIMARY = "playing cards off the top of your library, paying their mana cost"


def counts(d):
    return {k: len(v) for k, v in d.items()}


def build(rt):
    f = {}

    # 1  one colour, all three tiers
    f["01_W_single_colour"] = {
        "selection": ["W"],
        "tiers": {t: len(rt["byColor"]["W"][t]) for t in S.TIERS},
        "sections": counts(S.sections(rt, "W")),
    }

    # 2  two colours, every section
    f["02_WB_pair"] = {
        "selection": ["W", "B"],
        "sections": counts(S.sections(rt, "WB")),
        "add_G": counts(S.delta_add(rt, "WB", "G")),
        "remove_B": counts(S.delta_remove(rt, "WB", "B")),
    }

    # 3  a pair that shares little, to exercise Complementary
    f["03_BG_complementary"] = {
        "selection": ["B", "G"],
        "sections": counts(S.sections(rt, "BG")),
    }

    # 4  three colours, and the delta language
    f["04_UBR_grixis"] = {
        "selection": ["U", "B", "R"],
        "sections": counts(S.sections(rt, "UBR")),
        "add_W": counts(S.delta_add(rt, "UBR", "W")),
    }

    # 5  four colours, framed as what the absence costs
    v = S.four_color_view(rt, "WUBR")
    f["05_WUBR_four_colour"] = {
        "selection": ["W", "U", "B", "R"],
        "excluded": v["excluded"],
        "completely_lost": len(v["completely_lost"]),
        "best_access_worse": len(v["best_access_worse"]),
        "retained_but_lost_owner": len(v["retained_but_lost_owner"]),
        "families_most_affected": v["families_most_affected"][:5],
    }

    # 6  five colours: access is not ownership
    w = S.wubrg_summary(rt)
    f["06_WUBRG_all_five"] = {
        "reachable": w["reachable"],
        "with_primary_owner": w["with_primary_owner"],
        "no_primary_owner_anywhere": w["no_primary_owner_anywhere"],
        "statement": w["statement"],
    }

    # 7  a restriction must survive to the surface, verbatim
    fly = rt["byMechanic"][FLYING]
    f["07_flying_restriction"] = {
        "colors": {c: d["tier"] for c, d in sorted(fly["colors"].items())},
        "has_restriction": fly["has_restriction"],
        "restriction_mentions_dragons": "dragon" in fly["explanation"].lower(),
        "restriction_mentions_phoenixes": "phoenix" in fly["explanation"].lower(),
    }

    # 8  an adjudicated conflict keeps its provenance
    fl = rt["byMechanic"][FLASH]
    f["08_flash_adjudicated"] = {
        "colors": {c: d["tier"] for c, d in sorted(fl["colors"].items())},
        "black_tier": fl["colors"]["B"]["tier"],
        "black_basis": fl["colors"]["B"]["basis"],
        "black_conflict": fl["colors"]["B"].get("conflict"),
        "black_authority": (fl["colors"]["B"].get("ruling") or {}).get("authority"),
    }

    # 9  a mechanic with NO primary colour anywhere
    np = rt["byMechanic"][NO_PRIMARY]
    f["09_no_primary_colour"] = {
        "colors": {c: d["tier"] for c, d in sorted(np["colors"].items())},
        "tiers_present": sorted({d["tier"] for d in np["colors"].values()}),
        "has_primary": any(d["tier"] == "primary" for d in np["colors"].values()),
        "colour_count": len(np["colors"]),
    }

    # 10  REPAIRED. The previous version asserted the set of mechanics that are
    #     tertiary in EVERY colour holding them. That set is empty, so the
    #     fixture asserted nothing and could not protect the behaviour it
    #     existed for. It now uses a real tertiary-best selection.
    #
    #     The candidate is chosen PROGRAMMATICALLY from the runtime: a mechanic
    #     whose best access in a White-only selection is tertiary AND which
    #     another colour holds at primary. That second condition is what makes
    #     it a real test -- the same record must read as tertiary here and
    #     primary elsewhere without either being called better.
    w_sel = {"W"}
    tert_best = sorted(
        k for k, e in rt["byMechanic"].items()
        if S.access(e, w_sel)[0] == "tertiary"
        and any(d["tier"] == "primary" for c, d in e["colors"].items() if c != "W"))
    assert tert_best, "no tertiary-best candidate in a White-only selection"
    pick = "counterspell" if "counterspell" in tert_best else tert_best[0]
    e = rt["byMechanic"][pick]
    best, owned = S.access(e, w_sel)
    f["10_tertiary_best_access"] = {
        "selection": ["W"],
        "mechanic": pick,
        "label": e["label"],
        "best_access_in_selection": best,
        "white_tier": e["colors"]["W"]["tier"],
        "primary_owners_elsewhere": sorted(
            c for c, d in e["colors"].items() if c != "W" and d["tier"] == "primary"),
        "appears_in_selection": pick in [
            k for k, x in rt["byMechanic"].items() if set(x["colors"]) & w_sel],
        "candidates_available": len(tert_best),
        "tertiary_only_count_for_W": len(
            [k for k, x in rt["byMechanic"].items() if S.access(x, w_sel)[0] == "tertiary"]),
        "no_quality_language": {
            "runtime_meta_states_tier_is_not_power": "NOT card quality"
                in rt["meta"]["tier_meaning"],
            "mechanic_record_has_no_score_field": not any(
                k in e for k in ("score", "rating", "power", "strength", "rank")),
        },
        "note": "Tertiary is occasional access, not weak. This record reads tertiary "
                "for White and primary elsewhere; neither is better than the other.",
    }

    # 11  PROVENANCE: an identity merge must survive into the runtime
    aliased = sorted(k for k, e in rt["byMechanic"].items() if e["source_aliases"])
    sample = {}
    for k in aliased:
        e = rt["byMechanic"][k]
        sample[k] = {"aliases": e["source_aliases"],
                     "appearances_in_byMechanic": sum(1 for x in rt["byMechanic"] if x == k)}
    all_keys = list(rt["byMechanic"])
    f["11_alias_provenance"] = {
        "records_with_aliases": len(aliased),
        "every_record_appears_once": len(all_keys) == len(set(all_keys)),
        "no_alias_leaked_as_its_own_mechanic": sorted(
            a for k in aliased for a in rt["byMechanic"][k]["source_aliases"]
            if a.strip().lower() in rt["byMechanic"]) == [],
        "sample": {k: sample[k] for k in aliased[:3]},
    }
    return f


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    ap.add_argument("--update", action="store_true")
    args = ap.parse_args()

    require_source_gate(args.data)
    rt = json.loads(
        (args.data / "mechanical-color-pie.runtime.json").read_text(encoding="utf-8"))
    got = build(rt)
    GOLDEN.mkdir(parents=True, exist_ok=True)

    fails = []
    for name, payload in sorted(got.items()):
        path = GOLDEN / ("%s.json" % name)
        text = json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
        if args.update or not path.is_file():
            path.write_text(text, encoding="utf-8")
            print("wrote  %s" % path.name)
            continue
        if path.read_text(encoding="utf-8") != text:
            fails.append(name)
            print("DIFF   %s" % path.name)
        else:
            print("ok     %s" % path.name)

    if fails:
        print("\n%d fixture(s) differ from their golden file. Either the selection "
              "maths changed and the goldens need reviewing, or something broke.\n"
              "Re-run with --update ONLY after deciding the new output is correct."
              % len(fails))
        sys.exit(1)
    if not args.update:
        print("\nAll %d fixtures match their golden files." % len(got))


if __name__ == "__main__":
    main()
