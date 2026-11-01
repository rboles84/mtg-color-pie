#!/usr/bin/env python3
"""
Generate the runtime projection. GENERATED-ONLY AND DISPOSABLE.

    python tools/build_runtime.py --data data/

This artefact contains NO new judgments. Every value is indexed from two
already-accepted inputs: the frozen source layer and the frozen Vox taxonomy.
Delete the output and it regenerates identically. Nothing here may be edited
by hand -- if a value looks wrong, the fault is upstream, and upstream is
frozen, so it is almost certainly a bug in this file instead.

WHAT IT HOLDS
    meta         snapshot date and provenance, carried so the UI cannot omit it
    byMechanic   the mechanic, its per-colour ownership, its families, aliases
    byColor      each colour's mechanics at each tier
    byFamily     each Vox family's mechanics

SELECTION MATH lives in selection.py and is used by the fixtures, so the rules
are executable and golden-tested rather than described in prose.
"""

import argparse
import hashlib
import json
import pathlib
import shutil
import tempfile

from gate import require_source_gate, require_taxonomy_gate

# Limiting language in Rosewater's own explanation. Used ONLY to flag that a
# restriction exists and should be surfaced verbatim -- never to rewrite,
# summarise or score it. "Red is secondary in flying" is far less useful than
# "red is secondary in flying, on Dragons and Phoenixes".
RESTRICTION_MARKERS = (
    "only", "mostly", "restricted", "usually", "tends to", "tend to",
    "infrequent", "rarely", "rare occasion", "must ", "limitation", "narrow",
    "not every set", "occasionally",
)


def source_identity(value):
    return value.strip().lower().rstrip(".")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    ap.add_argument("--out", default="mechanical-color-pie.runtime.json")
    args = ap.parse_args()

    rec = json.loads((args.data / "mcp2021.reconciled.json").read_text(encoding="utf-8"))
    abil = json.loads((args.data / "mcp2021.abilities.json").read_text(encoding="utf-8"))
    tax = json.loads((args.data / "vox.families.json").read_text(encoding="utf-8"))

    fam = {a["key"]: a for a in tax["assignments"]}
    expl = {}
    grouped_expl = {}
    for a in abil["abilities"]:
        grouped_expl.setdefault((source_identity(a.get("group") or ""), source_identity(a["label"])), []).append(a.get("explanation") or "")
        if a.get("explanation"):
            expl.setdefault(a["label"], a["explanation"])

    by_mech, by_color, by_family = {}, {}, {}
    for c in "WUBRG":
        by_color[c] = {"primary": [], "secondary": [], "tertiary": []}

    for k, v in sorted(rec["mechanics"].items()):
        if v.get("structural_only"):
            continue                      # a heading is not a peer mechanic
        f = fam.get(k)
        if " :: " in k:
            group, _ = k.split(" :: ", 1)
            matches = grouped_expl.get((source_identity(group), source_identity(v["label"])), [])
            assert len(matches) == 1, ("grouped explanation must resolve uniquely", k, len(matches))
            text = matches[0]
        else:
            text = expl.get(v["label"], "")
        entry = {
            "label": v["label"],
            "colors": {},
            "family": (f or {}).get("primary"),
            "families_secondary": (f or {}).get("secondary", []),
            "source_aliases": v.get("source_aliases", []),
            "explanation": text,
            "has_restriction": bool(text) and any(m in text.lower()
                                                  for m in RESTRICTION_MARKERS),
        }
        for c, d in v["colors"].items():
            entry["colors"][c] = {"tier": d["tier"], "basis": d["basis"]}
            if "conflict" in d:
                # provenance survives into the runtime: a reader can still see
                # that the article contradicted itself and how it was ruled
                entry["colors"][c]["conflict"] = d["conflict"]
                entry["colors"][c]["ruling"] = d.get("ruling")
            by_color[c][d["tier"]].append(k)
        by_mech[k] = entry
        if entry["family"]:
            by_family.setdefault(entry["family"], []).append(k)

    payload = {
        "meta": {
            "document": "Mechanical Color Pie 2021",
            "author": "Mark Rosewater (with the Council of Colors)",
            "snapshot_date": "2021-10-18",
            "display_label": "Mechanical Color Pie 2021 · snapshot dated "
                             "October 18, 2021",
            "url": "https://magic.wizards.com/en/news/making-magic/"
                   "mechanical-color-pie-2021",
            "caution": "A snapshot that will continue to evolve. Per-set needs bend "
                       "the default and some entries are experiments. Never present "
                       "this as the current state of the colour pie.",
            "tier_meaning": "Primary, secondary and tertiary describe frequency and "
                            "ownership in design, NOT card quality. Never sum them "
                            "into a score, and never compare tiers across different "
                            "mechanics as if they were one unit.",
            "families_are": "vox_mana_derived navigation vocabulary, not Rosewater's",
            "generated": "by tools/build_runtime.py; do not hand-edit",
            "counts": {
                "projection_mechanics": len(by_mech),
                "families": len(by_family),
            },
        },
        "byMechanic": by_mech,
        "byColor": by_color,
        "byFamily": {k: sorted(v) for k, v in sorted(by_family.items())},
    }
    candidate = json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=False) + "\n"
    source = args.data.resolve()
    stage_root = pathlib.Path(tempfile.mkdtemp(prefix="mtg-color-pie-runtime-stage-")).resolve()
    stage_data = stage_root / "data"
    assert stage_root != source and source not in stage_root.parents and stage_root not in source.parents
    shutil.copytree(source, stage_data)
    frozen = ("mcp2021.abilities.json", "mcp2021.reconciled.json", "vox.families.json")
    digest = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
    assert all(digest(source / name) == digest(stage_data / name) for name in frozen)
    (stage_data / "mechanical-color-pie.runtime.json").write_text(candidate, encoding="utf-8")
    require_source_gate(stage_data)
    require_taxonomy_gate(stage_data)
    (source / args.out).write_text(candidate, encoding="utf-8")

    print("mechanics indexed   : %d" % len(by_mech))
    print("families indexed    : %d" % len(by_family))
    print("with restriction    : %d" % sum(1 for e in by_mech.values()
                                           if e["has_restriction"]))
    print("carrying aliases    : %d" % sum(1 for e in by_mech.values()
                                           if e["source_aliases"]))
    print("carrying a conflict : %d" % sum(1 for e in by_mech.values()
                                           for c in e["colors"].values()
                                           if "conflict" in c))
    for c in "WUBRG":
        print("  %s  primary %3d  secondary %3d  tertiary %3d"
              % (c, len(by_color[c]["primary"]), len(by_color[c]["secondary"]),
                 len(by_color[c]["tertiary"])))
    print("\nstaged validation : %s" % stage_data)
    print("wrote %s" % (source / args.out))


if __name__ == "__main__":
    main()
