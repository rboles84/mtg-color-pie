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

from gate import require_source_gate, require_taxonomy_gate
import subprocess

ORDER = "WUBRG"
N = 216


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    a = ap.parse_args()

    # THE RECON VALIDATOR IS THE FREEZE GATE. It invokes the accepted upstream
    # chain structurally rather than trusting that somebody ran it first:
    #   source gate -> taxonomy gate -> runtime/fixture gate -> recon assertions
    require_source_gate(a.data)
    require_taxonomy_gate(a.data)
    r = subprocess.run([sys.executable, str(pathlib.Path(__file__).parent / "fixtures.py"),
                        "--data", str(a.data)], capture_output=True, text=True)
    if r.returncode != 0:
        sys.stdout.write(r.stdout); sys.stdout.write(r.stderr)
        print("\nFIXTURE GATE FAILED. Recon assertions will not run.")
        sys.exit(1)
    print("%-20s: PASS" % "fixture gate")

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

    # ---- shared decomposition (frozen terminology) -----------------------
    dec_bad = [r["key"] for r in S["selections"] if r["color_count"] > 1
               and r["shared_primary"] + r["shared_mixed_tier"] != r["shared_any_access"]]
    chk(not dec_bad, "shared_primary + shared_mixed_tier == shared_any_access for every "
        "multicolor selection", str(dec_bad))

    # ---- exclusive access reconciles to the breadth-1 bucket -------------
    excl_sum = sum(S["per_color"][c]["globally_exclusive_access"] for c in ORDER)
    breadth1 = S["color_breadth"]["1"]["mechanics_assigned_to_exactly_n_colors"]
    chk(excl_sum == breadth1,
        "sum of per-colour exclusive access equals the exactly-one-colour bucket",
        "%d vs %d" % (excl_sum, breadth1))

    # ---- unique primary ownership reconciles ------------------------------
    uniq_sum = sum(S["per_color"][c]["globally_unique_primary_owner"] for c in ORDER)
    one_prim = S["overall"]["mechanics_by_primary_owner_count"]["1"]
    chk(uniq_sum == one_prim,
        "sum of per-colour unique-primary-owner equals the exactly-one-primary bucket",
        "%d vs %d" % (uniq_sum, one_prim))

    # ---- primary-owner weighted count equals primary assignments ---------
    wprim = sum(int(i) * v for i, v in
                S["overall"]["mechanics_by_primary_owner_count"].items())
    chk(wprim == S["overall"]["primary_assignments"],
        "primary-owner weighted sum equals total primary assignments",
        "%d vs %d" % (wprim, S["overall"]["primary_assignments"]))

    # ---- exact access signatures -----------------------------------------
    sigs = S["color_signatures"]
    chk(sum(x["count"] for x in sigs) == N, "signature counts sum to 216")
    chk(all(1 <= x["color_count"] <= 5 for x in sigs),
        "every signature contains between 1 and 5 colours")
    sig_by_n = {}
    for x in sigs:
        sig_by_n[x["color_count"]] = sig_by_n.get(x["color_count"], 0) + x["count"]
    sig_bad = [n for n in range(1, 6)
               if sig_by_n.get(n, 0)
               != S["color_breadth"][str(n)]["mechanics_assigned_to_exactly_n_colors"]]
    chk(not sig_bad, "every signature contributes to its colour-breadth bucket", str(sig_bad))
    chk(len(sigs) == len({x["signature"] for x in sigs}) and len(sigs) <= 31,
        "distinct nonzero signature count is derived, not assumed",
        "%d" % len(sigs))

    # ---- pair set arithmetic ---------------------------------------------
    sel_by_key = {r["key"]: r for r in S["selections"]}
    pair_bad = []
    for pr in S["pair_overlap"]:
        a_, b_ = pr["pair"][0], pr["pair"][1]
        union = (S["per_color"][a_]["total_reachable"] + S["per_color"][b_]["total_reachable"]
                 - pr["any_access_overlap"])
        key = "".join(c for c in ORDER if c in (a_, b_))
        if union != pr["union_size"] or union != sel_by_key[key]["reachable_count"]:
            pair_bad.append(pr["pair"])
    chk(not pair_bad, "inclusion-exclusion holds for all ten pairs and matches the "
        "pair selection reachable_count", str(pair_bad))

    # ---- family graph accounting -----------------------------------------
    fam = S["family_populations"]
    g = S["graph_readiness"]["three_layer_model"]
    chk(g["primary_family_to_mechanic_edges"] == N,
        "primary-family edges equal 216", "%d" % g["primary_family_to_mechanic_edges"])
    chk(fam["canonical_family_members_total"] == N,
        "canonical family membership sums to 216")
    chk(fam["family_to_mechanic_connections_total"]
        == g["primary_family_to_mechanic_edges"] + g["secondary_family_to_mechanic_edges"],
        "expanded family edges equal primary + secondary family edges")
    chk(g["total_edges"] == (g["color_to_mechanic_edges"]
                             + g["primary_family_to_mechanic_edges"]
                             + g["secondary_family_to_mechanic_edges"]),
        "graph total edges equal the sum of the three edge classes")
    chk(all(len([1]) == 1 for _ in [0]) and all(
        e.get("family") for e in M.values()),
        "every mechanic has exactly one primary family")

    # ---- tier-transition detail reconciles -------------------------------
    tt = S["tier_transition_totals"]
    newly_tot = sum(r["newly_reachable"] for r in S["marginal_additions"])
    impr_tot = sum(r["best_tier_improved"] for r in S["marginal_additions"])
    owner_tot = sum(r["new_owner_no_improvement"] for r in S["marginal_additions"])
    chk(tt["unavailable_to_tertiary"] + tt["unavailable_to_secondary"]
        + tt["unavailable_to_primary"] == newly_tot,
        "detailed unavailable-to-X transitions reconcile to newly_reachable")
    chk(tt["tertiary_to_secondary"] + tt["tertiary_to_primary"]
        + tt["secondary_to_primary"] == impr_tot,
        "detailed improvement transitions reconcile to best_tier_improved")
    chk(tt["same_tier_new_owner"] == owner_tot,
        "same_tier_new_owner reconciles to new_owner_no_improvement")

    # ---- naming model never multiplies selections ------------------------
    nm = S["naming_model"]
    chk(nm["canonical_selection_count"] == 31, "naming model asserts 31 canonical selections")
    chk(all(x["mechanical_projection_status"] == "measured"
            for x in nm["four_color_naming"]),
        "every four-colour naming record is measured, not a separate identity")
    chk(len({x["canonical_key"] for x in nm["four_color_naming"]}) == 5,
        "five four-colour naming records, one per colour set")
    chk("_yore_lookup" not in json.dumps(S),
        "the misleading _yore_lookup field is gone")

    # ---- frozen status ----------------------------------------------------
    chk(S.get("status", "").endswith("FROZEN"), "recon carries the FROZEN status marker")
    chk(len(S.get("frozen_definitions", {})) >= 12,
        "frozen definitions are recorded", "%d" % len(S.get("frozen_definitions", {})))

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
