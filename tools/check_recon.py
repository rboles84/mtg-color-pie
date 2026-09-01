#!/usr/bin/env python3
"""
Statistical assertions over the recon output.

    python tools/check_recon.py --data data/

Exits non-zero if any assertion fails. The recon is only trustworthy if its
arithmetic is internally consistent AND agrees with the frozen upstream
artifacts, so this checks both and treats a disagreement with an accepted
golden fixture as a failure rather than a tie to break.
"""

import argparse
import itertools
import json
import pathlib
import sys

from gate import require_source_gate

ORDER = "WUBRG"
N = 216


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    a = ap.parse_args()

    require_source_gate(a.data)

    S = json.loads((a.data / "recon" / "mechanics-statistics.json").read_text(encoding="utf-8"))
    rt = json.loads((a.data / "mechanical-color-pie.runtime.json").read_text(encoding="utf-8"))
    M = rt["byMechanic"]
    fails, oks = [], []

    def chk(cond, label, detail=""):
        (oks if cond else fails).append(label + (" — " + detail if detail and not cond else ""))

    # ---- universe ---------------------------------------------------------
    chk(S["overall"]["peer_mechanics"] == len(M) == N,
        "peer universe equals runtime peer universe",
        "%d vs %d" % (S["overall"]["peer_mechanics"], len(M)))
    chk(S["overall"]["structural_only"] == 1, "structural-only count is 1")
    chk(all(k in M for b in S["color_breadth"].values() for k in b["keys"]),
        "no structural-only record entered peer statistics")

    # ---- owners -----------------------------------------------------------
    chk(all(1 <= len(e["colors"]) <= 5 for e in M.values()),
        "every mechanic has between 1 and 5 WUBRG owners")

    # ---- per-colour totals ------------------------------------------------
    bad = [c for c in ORDER
           if S["per_color"][c]["primary"] + S["per_color"][c]["secondary"]
           + S["per_color"][c]["tertiary"] != S["per_color"][c]["total_reachable"]]
    chk(not bad, "per-colour tier totals equal per-colour reachable totals", str(bad))

    assign_sum = sum(S["per_color"][c]["total_reachable"] for c in ORDER)
    chk(assign_sum == S["overall"]["final_peer_color_assignments"],
        "sum of per-colour assignment counts equals total projection assignments",
        "%d vs %d" % (assign_sum, S["overall"]["final_peer_color_assignments"]))

    tiers = (S["overall"]["primary_assignments"] + S["overall"]["secondary_assignments"]
             + S["overall"]["tertiary_assignments"])
    chk(tiers == S["overall"]["final_peer_color_assignments"],
        "tier assignment totals equal total projection assignments")

    # ---- breadth ----------------------------------------------------------
    weighted = sum(int(n) * v["mechanics_assigned_to_exactly_n_colors"]
                   for n, v in S["color_breadth"].items())
    chk(weighted == S["overall"]["final_peer_color_assignments"],
        "colour-breadth weighted sum equals total projection assignments",
        "%d vs %d" % (weighted, S["overall"]["final_peer_color_assignments"]))
    breadth_total = sum(v["mechanics_assigned_to_exactly_n_colors"]
                        for v in S["color_breadth"].values())
    chk(breadth_total == N, "colour-breadth counts sum to the peer mechanic count")

    # ---- selection partitions --------------------------------------------
    chk(len(S["selections"]) == 31, "31 canonical colored selections")
    part_bad, share_bad = [], []
    for r in S["selections"]:
        if (r["primary_available"] + r["secondary_only"] + r["tertiary_only"]
                + r["unavailable_count"] != N):
            part_bad.append(r["key"])
        if r["color_count"] > 1 and (r["shared_any_access"] + r["complementary"]
                                     + r["unavailable_count"] != N):
            share_bad.append(r["key"])
    chk(not part_bad, "best-access partition sums to 216 for every selection", str(part_bad))
    chk(not share_bad, "shared + complementary + unavailable sums to 216 for every "
        "multicolor selection", str(share_bad))

    wubrg = [r for r in S["selections"] if r["key"] == "WUBRG"][0]
    chk(wubrg["reachable_count"] == N and wubrg["unavailable_count"] == 0,
        "WUBRG reaches all peer mechanics")

    # ---- marginal additions ----------------------------------------------
    add_bad = [r["base"] + "+" + r["added"] for r in S["marginal_additions"]
               if (r["newly_reachable"] + r["best_tier_improved"]
                   + r["new_owner_no_improvement"] + r["unchanged"]
                   + r["still_unavailable"]) != N]
    chk(not add_bad, "marginal-addition outcome buckets sum to 216", str(add_bad))
    expected = sum(1 for n in range(1, 5) for _ in itertools.combinations(ORDER, n)) * 1
    chk(len(S["marginal_additions"]) == sum(
        (5 - n) for n in range(1, 6) for _ in itertools.combinations(ORDER, n)),
        "every valid one-colour addition transition is present",
        "%d rows" % len(S["marginal_additions"]))

    # ---- derived, not assumed --------------------------------------------
    derived_zero = sum(1 for e in M.values()
                       if not any(d["tier"] == "primary" for d in e["colors"].values()))
    chk(S["overall"]["mechanics_with_zero_primary_owner"] == derived_zero,
        "no-primary count is derived from the runtime, not assumed",
        "%d vs %d" % (S["overall"]["mechanics_with_zero_primary_owner"], derived_zero))

    # ---- four-colour cross-check -----------------------------------------
    xf = [r["omitted"] for r in S["four_color_absence"] if not r["cross_check_pass"]]
    chk(not xf, "four-colour lost_completely equals the omitted colour's global "
        "exclusive-access count", str(xf))

    # ---- families ---------------------------------------------------------
    fam_sum = sum(f["primary_member_count"] for f in S["families"])
    chk(fam_sum == N, "primary-family member counts sum to 216", "%d" % fam_sum)

    # ---- Colorless and special identities --------------------------------
    sp = S["special_identities"]
    cl = [v for k, v in sp.items() if k.lower().startswith("colorless")]
    chk(bool(cl), "Colorless has an explicit record")
    if cl:
        chk(cl[0]["mechanical_projection_status"] == "not_measured",
            "Colorless is not_measured, never '0 mechanics'")
        chk(cl[0].get("excluded_from_mono_color_aggregates") is True,
            "Colorless is excluded from mono-colour aggregates")
    txt = json.dumps(S)
    chk('"Colorless": {"mechanics": 0' not in txt and '"colorless_mechanics": 0' not in txt,
        "no field reports Colorless as having 0 mechanics")
    unmapped = S["registry_audit"]["records_not_reducible_to_a_wubrg_subset"]
    chk(all(r["mechanical_projection_status"] == "not_measured" for r in unmapped),
        "special identities without a WUBRG mapping are not_measured")

    # ---- aliases never duplicate a canonical row -------------------------
    keys = [r["key"] for r in S["selections"]]
    chk(len(keys) == len(set(keys)), "aliases never create duplicate canonical rows")
    chk(S["registry_audit"]["unique_wubrg_color_sets_represented"] <= 31,
        "registry colour sets do not exceed the 31 canonical selections")

    # ---- agreement with accepted golden fixtures -------------------------
    fx = a.data / "fixtures"
    def gold(n):
        return json.loads((fx / (n + ".json")).read_text(encoding="utf-8"))
    try:
        g1 = gold("01_W_single_colour")
        w = S["per_color"]["W"]
        chk(g1["tiers"]["primary"] == w["primary"]
            and g1["tiers"]["secondary"] == w["secondary"]
            and g1["tiers"]["tertiary"] == w["tertiary"],
            "independent White tier counts agree with golden fixture 01",
            "%s vs %s" % (g1["tiers"], [w["primary"], w["secondary"], w["tertiary"]]))

        # DEFINITIONAL DIVERGENCE, not a data disagreement. selection.py treats
        # shared_access and shared_primary as MUTUALLY EXCLUSIVE buckets; this
        # recon's shared_any_access is INCLUSIVE of the shared-primary subset,
        # because the recon spec asserts
        #     shared_any_access + complementary + unavailable == 216
        # which only holds for the inclusive reading. Verified across all 26
        # multicolour selections: upstream shared_access + shared_primary
        # equals this recon's shared_any_access every time, zero exceptions.
        # The comparison is therefore made like-for-like rather than either
        # number being preferred over the other.
        g2 = gold("02_WB_pair")
        wb = [r for r in S["selections"] if r["key"] == "WB"][0]
        chk(g2["sections"]["shared_primary"] == wb["shared_primary"]
            and g2["sections"]["shared_access"] + g2["sections"]["shared_primary"]
                == wb["shared_any_access"]
            and g2["sections"]["complementary"] == wb["complementary"]
            and g2["sections"]["unavailable"] == wb["unavailable_count"],
            "independent WB section counts agree with golden fixture 02 "
            "(shared_access reconciled: exclusive upstream vs inclusive here)",
            "%s vs %s" % (g2["sections"], wb))

        g5 = gold("05_WUBR_four_colour")
        ab = [r for r in S["four_color_absence"] if r["omitted"] == "G"][0]
        chk(g5["completely_lost"] == ab["lost_completely"]
            and g5["best_access_worse"] == ab["best_access_degraded"]
            and g5["retained_but_lost_owner"] == ab["owner_lost_access_retained"],
            "independent Green-absence counts agree with golden fixture 05",
            "%s vs %s" % (g5, ab))

        g6 = gold("06_WUBRG_all_five")
        chk(g6["reachable"] == wubrg["reachable_count"],
            "independent WUBRG reach agrees with golden fixture 06")
        chk(g6["no_primary_owner_anywhere"] == S["overall"]["mechanics_with_zero_primary_owner"],
            "independent no-primary count agrees with golden fixture 06")
    except FileNotFoundError as e:
        fails.append("golden fixture missing: %s" % e)

    for o in oks:
        print("ok    %s" % o)
    if fails:
        print()
        for f in fails:
            print("FAIL  %s" % f)
        print("\n%d assertion(s) failed. The recon is not trustworthy." % len(fails))
        sys.exit(1)
    print("\nAll %d recon assertions hold, including agreement with the golden fixtures."
          % len(oks))


if __name__ == "__main__":
    main()
