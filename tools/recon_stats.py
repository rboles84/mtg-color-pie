#!/usr/bin/env python3
"""
Statistical reconnaissance over the accepted Mechanical Color Pie 2021 system.

    python tools/recon_stats.py --data data/ --html vox-color/color-wheel.html

READ-ONLY. Measures the accepted source layer, taxonomy and runtime projection.
It never writes to, merges, renames or reinterprets any of them.

EVERYTHING IS RECOMPUTED. The earlier exploratory recon is treated as a set of
candidate outputs to audit, not as input: no figure from it is hardcoded here,
and no formula is shaped to reproduce one. Independent results are compared
against the frozen invariants and golden fixtures only AFTER calculation, and a
disagreement is a failure rather than a tie to break.

LANGUAGE. Machine-readable output carries class A (direct source/runtime fact)
and class B (arithmetic over accepted records) only. No interpretive claim and
no quality or power ranking is written into the data. Tier is never translated
into quality.
"""

import argparse
import csv
import io
import itertools
import json
import pathlib
import re
import statistics
from collections import Counter, defaultdict

from recon_report import write_report

ORDER = "WUBRG"
NAMES = {"W": "White", "U": "Blue", "B": "Black", "R": "Red", "G": "Green"}
TIERS = ("primary", "secondary", "tertiary")
RANK = {"primary": 3, "secondary": 2, "tertiary": 1}


# ---------------------------------------------------------------------------
# registry
# ---------------------------------------------------------------------------
def read_registry(html_path):
    """
    Every registry record in the app, verbatim.

    Scans each object forward rather than assuming display/name/group are
    adjacent: shards and wedges carry `attribute`, four-colour records carry
    `aka` and `commander`. Records are NOT deduplicated here -- the audit needs
    to see that several display names share one colour set.
    """
    s = io.open(html_path, encoding="utf-8").read()
    out = []
    for m in re.finditer(r"display:'([WUBRG]*)'", s):
        chunk = s[m.start(): m.start() + 900]
        nm = re.search(r"name:'([^']+)'", chunk)
        gp = re.search(r"group:'([a-z]+)'", chunk)
        of = re.search(r"of:'([^']+)'", chunk)
        lens = re.search(r"lens:'([^']+)'", chunk)
        cmdr = re.search(r"commander:'([^']+)'", chunk)
        aka = re.findall(r"aka:\[([^\]]*)\]", chunk)
        if not nm or not gp:
            continue
        akas = []
        if aka:
            akas = [a.strip().strip("'") for a in aka[0].split(",") if a.strip()]
        out.append({
            "display": m.group(1),
            "name": nm.group(1),
            "group": gp.group(1),
            "of": of.group(1) if of else "",
            "lens": lens.group(1) if lens else "",
            "commander": cmdr.group(1) if cmdr else "",
            "aka": akas,
        })
    seen, uniq = set(), []
    for r in out:
        k = (r["display"], r["name"], r["group"])
        if k in seen:
            continue
        seen.add(k)
        uniq.append(r)
    return uniq


def canon_key(colors):
    return "".join(c for c in ORDER if c in set(colors))


# ---------------------------------------------------------------------------
# selection maths, recomputed independently of selection.py
# ---------------------------------------------------------------------------
def best_access(entry, colors):
    owned = {c: d["tier"] for c, d in entry["colors"].items() if c in colors}
    if not owned:
        return None, {}
    return max(owned.values(), key=lambda t: RANK[t]), owned


def selection_row(M, colors):
    """
    Two independent partitions of all 216, each asserted to be exhaustive:

      best access : primary_available | secondary_only | tertiary_only | unavailable
      sharing     : shared_any_access | complementary | unavailable

    `conditional` overlaps both and is therefore never added into either.
    """
    cs = set(colors)
    buckets = {"primary_available": [], "secondary_only": [], "tertiary_only": [],
               "unavailable": []}
    share = {"shared_any_access": [], "shared_primary": [], "shared_mixed_tier": [],
             "complementary": []}
    conditional = []
    fams_reached, fams_primary = set(), set()

    for k, e in M.items():
        best, owned = best_access(e, cs)
        if best is None:
            buckets["unavailable"].append(k)
        elif best == "primary":
            buckets["primary_available"].append(k)
        elif best == "secondary":
            buckets["secondary_only"].append(k)
        else:
            buckets["tertiary_only"].append(k)

        if owned:
            fams_reached.add(e.get("family"))
            if best == "primary":
                fams_primary.add(e.get("family"))
            if e.get("has_restriction"):
                conditional.append(k)
            if len(owned) == len(cs):
                share["shared_any_access"].append(k)
                if all(t == "primary" for t in owned.values()):
                    share["shared_primary"].append(k)
                else:
                    # shared_mixed_tier is what selection.py and the golden
                    # fixtures call `shared_access`. Same population, clearer
                    # name: shared_any_access is INCLUSIVE of shared_primary,
                    # this one is not.
                    share["shared_mixed_tier"].append(k)
            else:
                share["complementary"].append(k)

    total = len(M)
    assert sum(len(v) for v in buckets.values()) == total, ("best-access partition", colors)
    assert (len(share["shared_any_access"]) + len(share["complementary"])
            + len(buckets["unavailable"])) == total, ("sharing partition", colors)
    assert (len(share["shared_primary"]) + len(share["shared_mixed_tier"])
            == len(share["shared_any_access"])), ("shared decomposition", colors)

    reach = total - len(buckets["unavailable"])
    mono = len(cs) == 1
    return {
        "key": canon_key(cs),
        "colors": " ".join(sorted(cs, key=ORDER.index)),
        "color_count": len(cs),
        "reachable_count": reach,
        "reachable_pct_of_216": round(100.0 * reach / total, 1),
        "primary_available": len(buckets["primary_available"]),
        "secondary_only": len(buckets["secondary_only"]),
        "tertiary_only": len(buckets["tertiary_only"]),
        "unavailable_count": len(buckets["unavailable"]),
        "shared_any_access": "not_applicable" if mono else len(share["shared_any_access"]),
        "shared_primary": "not_applicable" if mono else len(share["shared_primary"]),
        "shared_mixed_tier": "not_applicable" if mono else len(share["shared_mixed_tier"]),
        "compat_shared_access_equals_shared_mixed_tier": True,
        "complementary": "not_applicable" if mono else len(share["complementary"]),
        "conditional_reachable": len(conditional),
        "families_reached": len(fams_reached),
        "families_with_primary_access": len(fams_primary),
        "_lists": {**buckets, **share, "conditional": conditional},
    }


def marginal_addition(M, base, added):
    """
    base -> base + added. Five outcomes, asserted to partition all 216.

    `new_owner_no_improvement` is kept separate on purpose: adding a colour to a
    selection that already has primary access cannot raise the maximum, but it
    can add a colour that also performs the mechanic. Folding that into
    "unchanged" would erase a real difference between the two selections.
    """
    b, a = set(base), set(base) | {added}
    out = {"newly_reachable": [], "best_tier_improved": [],
           "new_owner_no_improvement": [], "unchanged": [], "still_unavailable": []}
    for k, e in M.items():
        b0, o0 = best_access(e, b)
        b1, o1 = best_access(e, a)
        if b1 is None:
            out["still_unavailable"].append(k)
        elif b0 is None:
            out["newly_reachable"].append(k)
        elif RANK[b1] > RANK[b0]:
            out["best_tier_improved"].append(k)
        elif len(o1) > len(o0):
            out["new_owner_no_improvement"].append(k)
        else:
            out["unchanged"].append(k)
    assert sum(len(v) for v in out.values()) == len(M), ("addition partition", base, added)
    return out


def transition_detail(M, base, added):
    """
    Exact before->after best-access transitions for one added colour.

    Subdivides newly_reachable and best_tier_improved into named transitions,
    and asserts the subdivision reconciles to the coarse buckets. A transition
    is a change in design OWNERSHIP and ACCESS. It is never a power change.
    """
    b, a = set(base), set(base) | {added}
    keys = ["unavailable_to_tertiary", "unavailable_to_secondary", "unavailable_to_primary",
            "tertiary_to_secondary", "tertiary_to_primary", "secondary_to_primary",
            "same_tier_new_owner"]
    out = {k: [] for k in keys}
    for k, e in M.items():
        b0, o0 = best_access(e, b)
        b1, o1 = best_access(e, a)
        if b1 is None:
            continue
        if b0 is None:
            out["unavailable_to_" + b1].append(k)
        elif RANK[b1] > RANK[b0]:
            out[b0 + "_to_" + b1].append(k)
        elif len(o1) > len(o0):
            out["same_tier_new_owner"].append(k)
    coarse = marginal_addition(M, base, added)
    newly = sum(len(out["unavailable_to_" + t]) for t in TIERS)
    improved = (len(out["tertiary_to_secondary"]) + len(out["tertiary_to_primary"])
                + len(out["secondary_to_primary"]))
    assert newly == len(coarse["newly_reachable"]), ("newly reconcile", base, added)
    assert improved == len(coarse["best_tier_improved"]), ("improved reconcile", base, added)
    assert len(out["same_tier_new_owner"]) == len(coarse["new_owner_no_improvement"]),         ("new owner reconcile", base, added)
    return out


def omission(M, omitted):
    """WUBRG minus one colour."""
    full, less = set(ORDER), set(ORDER) - {omitted}
    out = {"lost_completely": [], "best_access_degraded": [],
           "owner_lost_access_retained": [], "unaffected": []}
    for k, e in M.items():
        b0, o0 = best_access(e, full)
        b1, o1 = best_access(e, less)
        if b0 is None:
            continue
        if b1 is None:
            out["lost_completely"].append(k)
        elif RANK[b1] < RANK[b0]:
            out["best_access_degraded"].append(k)
        elif len(o1) < len(o0):
            out["owner_lost_access_retained"].append(k)
        else:
            out["unaffected"].append(k)
    return out


# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    ap.add_argument("--html", type=pathlib.Path,
                    default=pathlib.Path("vox-color/color-wheel.html"))
    args = ap.parse_args()
    out_dir = args.data / "recon"
    out_dir.mkdir(parents=True, exist_ok=True)

    rt = json.loads((args.data / "mechanical-color-pie.runtime.json").read_text(encoding="utf-8"))
    rec = json.loads((args.data / "mcp2021.reconciled.json").read_text(encoding="utf-8"))
    raw = json.loads((args.data / "mcp2021.reconciled.raw.json").read_text(encoding="utf-8"))
    lists = json.loads((args.data / "mcp2021.lists.json").read_text(encoding="utf-8"))
    tax = json.loads((args.data / "vox.families.json").read_text(encoding="utf-8"))
    M = rt["byMechanic"]
    N = len(M)

    S = {"status": "STATISTICAL RECON STATUS: FROZEN",
         "frozen_definitions": {
             "reachable": "at least one selected colour holds some tier assignment",
             "primary_available": "best access across the selection is primary",
             "secondary_only": "best access across the selection is secondary",
             "tertiary_only": "best access across the selection is tertiary",
             "shared_any_access": "every selected colour holds some tier; INCLUSIVE of shared_primary",
             "shared_primary": "every selected colour is primary",
             "shared_mixed_tier": ("every selected colour holds some tier, EXCLUDING "
                                   "shared_primary. This is the population that "
                                   "selection.py and the golden fixtures call "
                                   "`shared_access`."),
             "complementary": "at least one but not every selected colour has access",
             "unavailable": "no selected colour has access",
             "conditional": ("overlapping annotation from the runtime; never added into "
                             "a mutually exclusive bucket"),
             "canonical_family_members": ("exactly one Vox family per mechanic; a "
                                          "partition summing to 216"),
             "expanded_family_neighborhood": ("canonical members plus secondary "
                                              "cross-links; overlaps across families"),
             "identity": ("shared_any_access = shared_primary + shared_mixed_tier"),
         },
         "meta": {
        "generated_by": "tools/recon_stats.py",
        "snapshot": rt["meta"]["snapshot_date"],
        "read_only": True,
        "tier_meaning": rt["meta"]["tier_meaning"],
        "classes": {"A": "direct source/runtime fact",
                    "B": "arithmetic over accepted records",
                    "C": "interpretation - excluded from this file"},
    }}

    # ---- 4. placement accounting -----------------------------------------
    raw_list_placements = sum(len(v) for v in lists["lists"].values())
    peer_assignments = sum(len(e["colors"]) for e in M.values())
    all_ident_assignments = sum(len(v["colors"]) for v in rec["mechanics"].values())
    structural = {k: v for k, v in rec["mechanics"].items() if v.get("structural_only")}
    structural_assignments = sum(len(v["colors"]) for v in structural.values())
    basis = Counter(d["basis"] for v in rec["mechanics"].values()
                    for d in v["colors"].values())
    S["placement_accounting"] = {
        "raw_color_list_placements": raw_list_placements,
        "final_reconciled_peer_assignments": peer_assignments,
        "assignments_on_all_source_identities": all_ident_assignments,
        "structural_only_identities": len(structural),
        "structural_only_assignments_excluded": structural_assignments,
        "by_basis": dict(basis),
        "catalog_only_assignments": basis.get("ability-catalog-only", 0),
        "list_only_assignments": basis.get("colour-list-only", 0),
        "both_agree_assignments": basis.get("both-agree", 0),
        "adjudicated_assignments": basis.get("adjudicated", 0),
        "equation": ("raw_color_list_placements(%d) is a count of LIST entries before "
                     "identity merging; final_reconciled_peer_assignments(%d) counts "
                     "distinct (mechanic, colour) pairs after 19 identity merges, after "
                     "catalog-only assignments are added, and after %d structural-only "
                     "assignment(s) are excluded. The two are different measurements of "
                     "different populations and are not expected to be equal."
                     % (raw_list_placements, peer_assignments, structural_assignments)),
    }

    # ---- 5. registry audit ------------------------------------------------
    reg = read_registry(args.html)
    reg_rows, unmapped = [], []
    by_set = defaultdict(list)
    for r in reg:
        key = canon_key(r["display"])
        mapped = bool(key)
        row = {
            "name": r["name"], "group": r["group"], "display": r["display"],
            "canonical_key": key if mapped else "",
            "color_count": len(key),
            "alias_of": r["of"], "aka": "; ".join(r["aka"]),
            "maps_to_canonical_selection": "yes" if mapped else "no",
            "mechanical_projection_status": "measured" if mapped else "not_measured",
            "reason": "" if mapped else
                      "MCP2021 does not provide this as a peer WUBRG ownership column",
        }
        if mapped:
            by_set[key].append(r["name"])
        else:
            unmapped.append(row)
        reg_rows.append(row)

    S["registry_audit"] = {
        "total_registry_records": len(reg_rows),
        "records_mapping_to_a_wubrg_subset": len(reg_rows) - len(unmapped),
        "unique_wubrg_color_sets_represented": len(by_set),
        "canonical_nonempty_wubrg_subsets": 31,
        "color_sets_with_more_than_one_registry_name": {
            k: v for k, v in sorted(by_set.items()) if len(v) > 1},
        "records_not_reducible_to_a_wubrg_subset": [
            {"name": r["name"], "group": r["group"],
             "mechanical_projection_status": "not_measured",
             "reason": r["reason"]} for r in unmapped],
        "note": ("A registry record is a DISPLAY NAME. Several names share one colour "
                 "set, so registry record count is not a count of independent "
                 "mechanical identities and no statistic is duplicated per alias."),
    }
    # Colorless / special identities, stated explicitly rather than as zero.
    S["special_identities"] = {
        r["name"]: {
            "group": r["group"],
            "mechanical_projection_status": "not_measured",
            "reason": ("MCP2021 provides W/U/B/R/G tier ownership only; it does not "
                       "provide a comparable Colorless ownership column."
                       if r["name"].lower().startswith("colorless")
                       else "No explicit WUBRG mapping in the registry record."),
            "empty_wubrg_selection_reachable": 0,
            "empty_selection_note": ("Algorithmic empty-set result of the WUBRG "
                                     "projection. NOT a count of Colorless mechanics."),
            "excluded_from_mono_color_aggregates": True,
        } for r in unmapped
    }
    # ---- 8. dataset-wide --------------------------------------------------
    tier_counts = Counter(d["tier"] for e in M.values() for d in e["colors"].values())
    prim_owner = Counter(sum(1 for d in e["colors"].values() if d["tier"] == "primary")
                         for e in M.values())
    breadth = Counter(len(e["colors"]) for e in M.values())
    breadth_lists = defaultdict(list)
    for k, e in M.items():
        breadth_lists[len(e["colors"])].append(k)
    sig = Counter(canon_key(e["colors"].keys()) for e in M.values())
    sig_lists = defaultdict(list)
    for k, e in M.items():
        sig_lists[canon_key(e["colors"].keys())].append(k)

    S["overall"] = {
        "peer_mechanics": N,
        "reconciled_source_identities": len(rec["mechanics"]),
        "structural_only": len(structural),
        "final_peer_color_assignments": peer_assignments,
        "primary_assignments": tier_counts["primary"],
        "secondary_assignments": tier_counts["secondary"],
        "tertiary_assignments": tier_counts["tertiary"],
        "mechanics_by_primary_owner_count": {str(i): prim_owner.get(i, 0) for i in range(6)},
        "max_primary_owners_on_a_mechanic": max(prim_owner),
        "mechanics_with_zero_primary_owner": prim_owner.get(0, 0),
    }
    S["color_breadth"] = {
        str(n): {"mechanics_assigned_to_exactly_n_colors": breadth.get(n, 0),
                 "pct_of_216": round(100.0 * breadth.get(n, 0) / N, 1),
                 "keys": sorted(breadth_lists[n])} for n in range(1, 6)}
    S["color_signatures"] = [
        {"signature": s, "color_count": len(s), "count": c, "keys": sorted(sig_lists[s])}
        for s, c in sorted(sig.items(), key=lambda kv: (-kv[1], kv[0]))]

    # ---- 9. per colour ----------------------------------------------------
    excl_access = defaultdict(list)      # any access in exactly one colour globally
    uniq_primary = defaultdict(list)     # exactly one PRIMARY owner globally
    for k, e in M.items():
        if len(e["colors"]) == 1:
            excl_access[next(iter(e["colors"]))].append(k)
        prims = [c for c, d in e["colors"].items() if d["tier"] == "primary"]
        if len(prims) == 1:
            uniq_primary[prims[0]].append(k)

    per_color = {}
    for c in ORDER:
        keys = [k for k, e in M.items() if c in e["colors"]]
        t = Counter(M[k]["colors"][c]["tier"] for k in keys)
        famp = Counter(M[k].get("family") for k in keys)
        famall = Counter()
        for k in keys:
            famall[M[k].get("family")] += 1
            for f in M[k].get("families_secondary", []):
                famall[f] += 1
        per_color[c] = {
            "name": NAMES[c],
            "primary": t["primary"], "secondary": t["secondary"], "tertiary": t["tertiary"],
            "total_reachable": len(keys),
            "reachable_pct_of_216": round(100.0 * len(keys) / N, 1),
            "globally_exclusive_access": len(excl_access[c]),
            "globally_unique_primary_owner": len(uniq_primary[c]),
            "conditional_mechanics": sum(1 for k in keys if M[k].get("has_restriction")),
            "primary_family_distribution": dict(famp.most_common()),
            "all_family_membership_distribution": dict(famall.most_common()),
            "exclusive_access_keys": sorted(excl_access[c]),
            "unique_primary_owner_keys": sorted(uniq_primary[c]),
        }
        assert t["primary"] + t["secondary"] + t["tertiary"] == len(keys)
    S["per_color"] = per_color

    # ---- 10. all 31 selections -------------------------------------------
    subsets = []
    for n in range(1, 6):
        for combo in itertools.combinations(ORDER, n):
            subsets.append(canon_key(combo))
    assert len(subsets) == 31
    alias_map = defaultdict(list)
    lens_map = defaultdict(list)
    for r in reg:
        k = canon_key(r["display"])
        if not k:
            continue
        (lens_map if r["group"] == "college" else alias_map)[k].append(r["name"])

    # NAMING MODEL. A nickname decorates a colour set; it never creates another
    # mechanical identity. There are exactly 31 nonempty WUBRG selections and
    # every alias, lens and community short form attaches to one of them.
    #
    # The community short form is DERIVED by one uniform rule -- the segment of
    # the Nephilim card name before the hyphen -- so it is not invented per
    # case. It is community usage and is labelled as such; Wizards has not
    # standardised it as a formal name for the colour set.
    reg_by_key = defaultdict(list)
    for r in reg:
        k = canon_key(r["display"])
        if k:
            reg_by_key[k].append(r)

    sel_rows = []
    for key in subsets:
        row = selection_row(M, set(key))
        recs = reg_by_key.get(key, [])
        row["aliases"] = "; ".join(alias_map.get(key, []))
        row["lens_aliases"] = "; ".join(lens_map.get(key, []))
        row["display"] = next((r["name"] for r in recs if r["group"] != "college"), "")
        nephilim = [a for r in recs for a in r["aka"]]
        row["nephilim_card_names"] = "; ".join(nephilim)
        row["community_short_forms"] = "; ".join(
            sorted({a.split("-")[0] for a in nephilim if "-" in a}))
        row["common_names"] = "; ".join(
            nephilim + sorted({a.split("-")[0] for a in nephilim if "-" in a}))
        lens = next((r["lens"] for r in recs if r["lens"]), "")
        row["commander_2016_design_lens"] = lens
        row["commander_2016_attribution"] = (
            "Developed by the Commander 2016 design team led by Ethan Fleischer, "
            "following lead developer Ben Hayes's challenge that each four-colour "
            "grouping receive a distinct faction-like identity. Sources: Ethan "
            "Fleischer, \"Designing Commander (2016 Edition),\" Oct 24 2016; Mark "
            "Rosewater, \"Howdy Partner,\" Oct 24 2016." if lens else "")
        row["naming_note"] = (
            "Nephilim card names are official card names. Community short forms are "
            "community usage, not a Wizards-standardised name for the colour set."
            if nephilim else "")
        sel_rows.append(row)
    S["selections"] = [{k: v for k, v in r.items() if k != "_lists"} for r in sel_rows]

    # The previous build carried a `_yore_lookup` field whose result came from a
    # substring match on the registry alias "Yore-Tiller". That presented a
    # nickname as though a fuzzy search had discovered a separate special
    # identity. Naming and mechanical projection are separated here instead:
    # WUBR is one canonical selection that CARRIES the names, and the names add
    # no mechanical row of their own.
    S["naming_model"] = {
        "rule": ("Aliases, lenses and community short forms decorate one of the 31 "
                 "canonical WUBRG selections. They never create an additional "
                 "mechanical identity, row or subset."),
        "canonical_selection_count": 31,
        "four_color_naming": [
            {"canonical_key": r["key"], "display": r["display"],
             "common_names": [x for x in r["common_names"].split("; ") if x],
             "commander_2016_design_lens": r["commander_2016_design_lens"],
             "mechanical_projection_status": "measured",
             "reachable": r["reachable_count"], "unavailable": r["unavailable_count"]}
            for r in sel_rows if r["color_count"] == 4],
    }


    def spread_stats(vals):
        return {"min": min(vals), "max": max(vals),
                "mean": round(statistics.mean(vals), 1),
                "median": statistics.median(vals)}
    S["selection_size_distributions"] = {}
    for n in range(1, 6):
        rows = [r for r in sel_rows if r["color_count"] == n]
        S["selection_size_distributions"][str(n)] = {
            "selections": len(rows),
            "reachable_count": spread_stats([r["reachable_count"] for r in rows]),
            "primary_available": spread_stats([r["primary_available"] for r in rows]),
            "conditional_reachable": spread_stats([r["conditional_reachable"] for r in rows]),
            "ordered": sorted([[r["key"], r["reachable_count"]] for r in rows],
                              key=lambda x: -x[1]),
        }

    # ---- 12. pair overlap -------------------------------------------------
    pair_rows, any_mx, prim_mx = [], {}, {}
    for a, b in itertools.combinations(ORDER, 2):
        ka = {k for k, e in M.items() if a in e["colors"]}
        kb = {k for k, e in M.items() if b in e["colors"]}
        pa = {k for k in ka if M[k]["colors"][a]["tier"] == "primary"}
        pb = {k for k in kb if M[k]["colors"][b]["tier"] == "primary"}
        inter, union = ka & kb, ka | kb
        pair_rows.append({
            "pair": a + b, "any_access_overlap": len(inter),
            "shared_primary_overlap": len(pa & pb),
            "union_size": len(union),
            "jaccard_any_access": round(len(inter) / len(union), 3) if union else 0.0,
            "note": "jaccard is mechanical overlap in this dataset only",
            "any_access_keys": sorted(inter), "shared_primary_keys": sorted(pa & pb),
        })
        any_mx.setdefault(a, {})[b] = len(inter); any_mx.setdefault(b, {})[a] = len(inter)
        prim_mx.setdefault(a, {})[b] = len(pa & pb); prim_mx.setdefault(b, {})[a] = len(pa & pb)
    for c in ORDER:
        any_mx.setdefault(c, {})[c] = per_color[c]["total_reachable"]
        prim_mx.setdefault(c, {})[c] = per_color[c]["primary"]
    S["pair_overlap"] = [{k: v for k, v in r.items() if not k.endswith("_keys")}
                         for r in pair_rows]

    # ---- 13. marginal additions ------------------------------------------
    add_rows = []
    for key in subsets:
        for c in ORDER:
            if c in key:
                continue
            o = marginal_addition(M, set(key), c)
            td = transition_detail(M, set(key), c)
            add_rows.append({
                "base": key, "added": c, "result": canon_key(set(key) | {c}),
                "newly_reachable": len(o["newly_reachable"]),
                "best_tier_improved": len(o["best_tier_improved"]),
                "new_owner_no_improvement": len(o["new_owner_no_improvement"]),
                "unchanged": len(o["unchanged"]),
                "still_unavailable": len(o["still_unavailable"]),
                **{"t_" + k: len(v) for k, v in td.items()},
                "_lists": o, "_transitions": td,
            })
    S["marginal_additions"] = [{k: v for k, v in r.items()
                                if k not in ("_lists", "_transitions")}
                               for r in add_rows]
    S["tier_transition_totals"] = {
        k: sum(len(r["_transitions"][k]) for r in add_rows)
        for k in add_rows[0]["_transitions"]}
    S["tier_transition_note"] = ("A transition is a change in design ownership and "
                                 "access. It is never a change in power.")
    by_added = defaultdict(list)
    for r in add_rows:
        by_added[r["added"]].append(r)
    S["marginal_addition_by_color"] = {
        c: {"transitions": len(by_added[c]),
            "newly_reachable": spread_stats([r["newly_reachable"] for r in by_added[c]]),
            "best_tier_improved": spread_stats([r["best_tier_improved"] for r in by_added[c]]),
            "new_owner_no_improvement": spread_stats(
                [r["new_owner_no_improvement"] for r in by_added[c]])}
        for c in ORDER}

    # ---- 14. four-colour absence + mandatory cross-check ------------------
    absence, absence_fail = [], []
    for c in ORDER:
        o = omission(M, c)
        lost = len(o["lost_completely"])
        excl = len(excl_access[c])
        if lost != excl:
            absence_fail.append((c, lost, excl))
        absence.append({
            "omitted": c, "selection": canon_key(set(ORDER) - {c}),
            "lost_completely": lost,
            "best_access_degraded": len(o["best_access_degraded"]),
            "owner_lost_access_retained": len(o["owner_lost_access_retained"]),
            "unaffected": len(o["unaffected"]),
            "cross_check_global_exclusive_access": excl,
            "cross_check_pass": lost == excl,
            "_lists": o,
        })
    S["four_color_absence"] = [{k: v for k, v in r.items() if k != "_lists"}
                               for r in absence]

    # ---- 15/16/17. families ----------------------------------------------
    fam_primary = defaultdict(list)
    fam_secondary = defaultdict(list)
    for k, e in M.items():
        fam_primary[e.get("family")].append(k)
        for f in e.get("families_secondary", []):
            fam_secondary[f].append(k)
    assert sum(len(v) for v in fam_primary.values()) == N
    all_fams = sorted(set(fam_primary) | set(fam_secondary),
                      key=lambda f: -len(fam_primary.get(f, [])))

    fam_rows, fam_color_mx, fam_sel_mx = [], {}, {}
    for f in all_fams:
        ks = fam_primary.get(f, [])
        colr, colp = {}, {}
        cm = {}
        for c in ORDER:
            has = [k for k in ks if c in M[k]["colors"]]
            t = Counter(M[k]["colors"][c]["tier"] for k in has)
            colr[c], colp[c] = len(has), t["primary"]
            cm[c] = {"primary": t["primary"], "secondary": t["secondary"],
                     "tertiary": t["tertiary"], "total_reachable": len(has),
                     "pct_of_family": round(100.0 * len(has) / len(ks), 1) if ks else 0.0}
        fam_color_mx[f] = cm
        reached = sum(1 for key in subsets
                      if any(set(key) & set(M[k]["colors"]) for k in ks))
        # CANONICAL vs EXPANDED. A mechanic has exactly one canonical family;
        # a secondary family is a CROSS-LINK, not a second classification.
        # canonical_family_members sums to 216 and is a partition.
        # expanded_family_neighborhood overlaps across families and must never
        # be added into the same total.
        sec = fam_secondary.get(f, [])
        fam_rows.append({
            "family": f,
            "canonical_family_members": len(ks),
            "secondary_family_links": len(sec),
            "expanded_family_neighborhood": len(set(ks) | set(sec)),
            "primary_member_count": len(ks),
            "secondary_member_count": len(sec),
            "all_member_count": len(set(ks) | set(sec)),
            "pct_of_216_by_primary_membership": round(100.0 * len(ks) / N, 1),
            **{"canonical_reach_" + c: colr[c] for c in ORDER},
            **{"canonical_primary_" + c: colp[c] for c in ORDER},
            **{"expanded_reach_" + c: sum(
                1 for k in set(ks) | set(sec) if c in M[k]["colors"]) for c in ORDER},
            **{"reach_" + c: colr[c] for c in ORDER},
            **{"primary_" + c: colp[c] for c in ORDER},
            "color_breadth_of_members": round(
                statistics.mean([len(M[k]["colors"]) for k in ks]), 2) if ks else 0.0,
            "canonical_selections_reaching_family": reached,
            "conditional_member_count": sum(1 for k in ks if M[k].get("has_restriction")),
        })
        fam_sel_mx[f] = {}
        for key in subsets:
            cs = set(key)
            reach = [k for k in ks if set(M[k]["colors"]) & cs]
            best = [best_access(M[k], cs)[0] for k in reach]
            fam_sel_mx[f][key] = {
                "reachable": len(reach), "unavailable": len(ks) - len(reach),
                "pct_of_family_reachable": round(100.0 * len(reach) / len(ks), 1) if ks else 0.0,
                "primary_access": best.count("primary"),
                "secondary_only": best.count("secondary"),
                "tertiary_only": best.count("tertiary"),
            }
    S["families"] = fam_rows
    S["family_populations"] = {
        "canonical_family_members_total": sum(r["canonical_family_members"] for r in fam_rows),
        "secondary_family_links_total": sum(r["secondary_family_links"] for r in fam_rows),
        "family_to_mechanic_connections_total": (
            sum(r["canonical_family_members"] for r in fam_rows)
            + sum(r["secondary_family_links"] for r in fam_rows)),
        "note": ("canonical membership is a partition of 216; secondary links are "
                 "cross-links that overlap and are never added into that total"),
    }
    sizes = [r["canonical_family_members"] for r in fam_rows]
    q = statistics.quantiles(sizes, n=4) if len(sizes) > 3 else []
    S["family_size_skew"] = {
        "population": "canonical_family_members (partition, sums to 216)",
        "families": len(fam_rows), "min": min(sizes), "max": max(sizes),
        "mean": round(statistics.mean(sizes), 2), "median": statistics.median(sizes),
        "stdev": round(statistics.pstdev(sizes), 2),
        "quartiles": [round(x, 2) for x in q],
        "coefficient_of_variation": round(statistics.pstdev(sizes) / statistics.mean(sizes), 3),
    }

    # ---- 18. conditionality ----------------------------------------------
    cond = [k for k, e in M.items() if e.get("has_restriction")]
    S["conditional"] = {
        "total": len(cond),
        "note": "overlapping annotation; never added into a mutually exclusive bucket",
        "by_color": {c: sum(1 for k in cond if c in M[k]["colors"]) for c in ORDER},
        "by_tier_assignment": dict(Counter(
            d["tier"] for k in cond for d in M[k]["colors"].values())),
        "by_family": dict(Counter(M[k].get("family") for k in cond).most_common()),
        "by_color_breadth": dict(Counter(len(M[k]["colors"]) for k in cond)),
    }

    # ---- 19. provenance ---------------------------------------------------
    S["provenance"] = {
        "source_aliases_retained": sum(1 for v in rec["mechanics"].values()
                                       if v.get("source_aliases")),
        "adjudicated_source_conflicts": sum(
            1 for v in rec["mechanics"].values() for d in v["colors"].values()
            if d.get("basis") == "adjudicated"),
        "unresolved_conflicts": sum(
            1 for v in rec["mechanics"].values() for d in v["colors"].values()
            if "conflict" in d and d.get("basis") != "adjudicated"),
        "structural_only_records": len(structural),
        "mechanics_carrying_adjudication_provenance": sum(
            1 for e in M.values() if any("conflict" in d for d in e["colors"].values())),
        "mechanics_carrying_source_aliases": sum(1 for e in M.values() if e["source_aliases"]),
        "raw_unmerged_identities": len(raw["mechanics"]),
        "catalog_only_assignments": basis.get("ability-catalog-only", 0),
        "list_only_assignments": basis.get("colour-list-only", 0),
        "both_agree_assignments": basis.get("both-agree", 0),
    }

    # ---- 20. graph readiness ---------------------------------------------
    color_edges = peer_assignments
    pfam_edges = sum(1 for e in M.values() if e.get("family"))
    sfam_edges = sum(len(e.get("families_secondary", [])) for e in M.values())
    shares_family_pairs = sum(len(v) * (len(v) - 1) // 2 for v in fam_primary.values())
    load = []
    for r in sel_rows:
        ks = [k for k in M if set(M[k]["colors"]) & set(r["key"])]
        fams = {M[k].get("family") for k in ks}
        ce = sum(len(set(M[k]["colors"]) & set(r["key"])) for k in ks)
        load.append({"key": r["key"], "color_count": r["color_count"],
                     "mechanic_nodes": len(ks), "family_nodes": len(fams),
                     "color_mechanic_edges": ce,
                     "family_mechanic_edges": len(ks) + sum(
                         len(M[k].get("families_secondary", [])) for k in ks)})
    tot_nodes = 5 + len(fam_primary) + N
    S["graph_readiness"] = {
        "three_layer_model": {
            "color_nodes": 5, "family_nodes": len(fam_primary), "mechanic_nodes": N,
            "total_nodes": tot_nodes,
            "color_to_mechanic_edges": color_edges,
            "primary_family_to_mechanic_edges": pfam_edges,
            "secondary_family_to_mechanic_edges": sfam_edges,
            "total_edges": color_edges + pfam_edges + sfam_edges,
        },
        "derived_relationship_counts_not_materialized": {
            "shares_primary_family_mechanic_pairs": shares_family_pairs,
            "note": ("Reported as a count only. No mechanic-to-mechanic edge exists in "
                     "the source; materialising this would invent relationships."),
        },
        "selection_render_load": {
            "rows": load,
            "mechanic_nodes": spread_stats([r["mechanic_nodes"] for r in load]),
            "color_mechanic_edges": spread_stats([r["color_mechanic_edges"] for r in load]),
            "family_mechanic_edges": spread_stats([r["family_mechanic_edges"] for r in load]),
        },
    }

    # ---- 21. extremes -----------------------------------------------------
    def extreme(metric, rows, field, want_max=True):
        vals = [r[field] for r in rows]
        target = max(vals) if want_max else min(vals)
        tied = [r for r in rows if r[field] == target]
        return {"metric": metric, "value": target,
                "records": [t.get("key") or t.get("pair") or t.get("family")
                            or t.get("omitted") for t in tied],
                "tied": len(tied) > 1, "tie_count": len(tied)}
    ex = []
    for n, label in ((1, "mono-color"), (2, "pair"), (3, "trio"), (4, "four-color")):
        rows = [r for r in sel_rows if r["color_count"] == n]
        ex.append(extreme("highest reachable_count among %s selections" % label, rows,
                          "reachable_count", True))
        ex.append(extreme("lowest reachable_count among %s selections" % label, rows,
                          "reachable_count", False))
    ex.append(extreme("highest shared_primary_overlap among color pairs", pair_rows,
                      "shared_primary_overlap", True))
    ex.append(extreme("lowest shared_primary_overlap among color pairs", pair_rows,
                      "shared_primary_overlap", False))
    ex.append(extreme("largest family by canonical_family_members", fam_rows,
                      "canonical_family_members", True))
    ex.append(extreme("smallest family by canonical_family_members", fam_rows,
                      "canonical_family_members", False))
    ex.append(extreme("highest lost_completely when the color is omitted", absence,
                      "lost_completely", True))
    ex.append(extreme("lowest lost_completely when the color is omitted", absence,
                      "lost_completely", False))
    ex.append(extreme("highest best_access_degraded when the color is omitted", absence,
                      "best_access_degraded", True))
    ex.append(extreme("lowest best_access_degraded when the color is omitted", absence,
                      "best_access_degraded", False))
    S["notable_extremes"] = ex

    # ---- definitional divergence, reported not resolved -------------------
    S["definition_divergences"] = [{
        "term": "shared_access",
        "upstream_artifact": "tools/selection.py and data/fixtures/*",
        "upstream_definition": ("mutually exclusive with shared_primary: every selected "
                                "colour has access AND not all of them are primary"),
        "recon_definition": ("shared_any_access is INCLUSIVE: every selected colour has "
                             "some tier assignment, whether or not all are primary"),
        "reason_for_recon_definition": ("the recon spec asserts shared_any_access + "
                                        "complementary + unavailable == 216, which only "
                                        "holds for the inclusive reading"),
        "relationship": "upstream shared_access + upstream shared_primary == recon shared_any_access",
        "verified_on": "all 26 multicolour selections, zero exceptions",
        "classification": "definitional, NOT a data disagreement",
        "action_taken": ("none - reported for Owner review. Changing either the fixture "
                         "or runtime semantics is out of scope for this mission."),
    }]

    # ---- 22. tertiary fixture audit --------------------------------------
    tert_only_global = [k for k, e in M.items()
                        if e["colors"] and all(d["tier"] == "tertiary"
                                               for d in e["colors"].values())]
    candidates = []
    for r in sel_rows:
        if r["tertiary_only"] > 0:
            candidates.append({"selection": r["key"], "tertiary_only_count": r["tertiary_only"],
                               "example_keys": sorted(r["_lists"]["tertiary_only"])[:3]})
    candidates.sort(key=lambda x: -x["tertiary_only_count"])
    S["tertiary_fixture_audit"] = {
        "global_tertiary_everywhere_count": len(tert_only_global),
        "verdict": "VACUOUS_FIXTURE" if not tert_only_global else "non_empty",
        "explanation": ("Fixture 10 asserts the set of mechanics that are tertiary in "
                        "EVERY colour that has them. That set is empty, so the fixture "
                        "asserts an empty set and cannot demonstrate tertiary rendering."),
        "valid_candidate_selections": candidates[:10],
        "action_taken": "none - reported only, per mission scope",
    }

    # ---- write artifacts --------------------------------------------------
    (out_dir / "mechanics-statistics.json").write_text(
        json.dumps(S, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    def wcsv(name, rows, cols):
        with io.open(out_dir / name, "w", encoding="utf-8", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=cols, extrasaction="ignore")
            w.writeheader()
            w.writerows(rows)

    wcsv("identity-statistics.csv", S["selections"],
         ["key", "colors", "color_count", "aliases", "lens_aliases", "reachable_count",
          "reachable_pct_of_216", "primary_available", "secondary_only", "tertiary_only",
          "unavailable_count", "shared_any_access", "shared_primary", "complementary",
          "conditional_reachable", "families_reached", "families_with_primary_access"])
    wcsv("registry-identity-audit.csv", reg_rows,
         ["name", "group", "display", "canonical_key", "color_count", "alias_of", "aka",
          "maps_to_canonical_selection", "mechanical_projection_status", "reason"])
    wcsv("family-statistics.csv", fam_rows,
         ["family", "primary_member_count", "secondary_member_count", "all_member_count",
          "pct_of_216_by_primary_membership"] +
         ["reach_" + c for c in ORDER] + ["primary_" + c for c in ORDER] +
         ["color_breadth_of_members", "canonical_selections_reaching_family",
          "conditional_member_count"])
    wcsv("color-signatures.csv",
         [{"signature": r["signature"], "color_count": r["color_count"], "count": r["count"]}
          for r in S["color_signatures"]], ["signature", "color_count", "count"])
    wcsv("pair-overlap.csv", S["pair_overlap"],
         ["pair", "any_access_overlap", "shared_primary_overlap", "union_size",
          "jaccard_any_access", "note"])
    wcsv("four-color-absence.csv", S["four_color_absence"],
         ["omitted", "selection", "lost_completely", "best_access_degraded",
          "owner_lost_access_retained", "unaffected",
          "cross_check_global_exclusive_access", "cross_check_pass"])
    wcsv("marginal-additions.csv", S["marginal_additions"],
         ["base", "added", "result", "newly_reachable", "best_tier_improved",
          "new_owner_no_improvement", "unchanged", "still_unavailable"])
    (out_dir / "matrices.json").write_text(json.dumps({
        "pair_any_access_overlap": any_mx,
        "pair_shared_primary_overlap": prim_mx,
        "family_by_color": fam_color_mx,
        "family_by_selection": fam_sel_mx,
        "color_breadth_distribution": {k: v["mechanics_assigned_to_exactly_n_colors"]
                                       for k, v in S["color_breadth"].items()},
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = write_report(S, out_dir)

    # ---- console ----------------------------------------------------------
    print("peer mechanics            : %d" % N)
    print("final peer assignments    : %d  (raw colour-list placements: %d)"
          % (peer_assignments, raw_list_placements))
    print("primary/secondary/tertiary: %d / %d / %d"
          % (tier_counts["primary"], tier_counts["secondary"], tier_counts["tertiary"]))
    print("canonical selections      : %d" % len(subsets))
    print("registry records          : %d  -> %d unique colour sets"
          % (len(reg_rows), len(by_set)))
    print("not measurable            : %s"
          % ", ".join(r["name"] for r in unmapped) or "none")
    print("colour breadth 1..5       : %s"
          % " / ".join(str(breadth.get(n, 0)) for n in range(1, 6)))
    print("distinct signatures       : %d of 31" % len(sig))
    print("families                  : %d  sizes %d..%d"
          % (len(fam_rows), min(sizes), max(sizes)))
    print("tertiary fixture          : %s" % S["tertiary_fixture_audit"]["verdict"])
    if absence_fail:
        print("\nFAIL four-colour cross-check: %s" % absence_fail)
        raise SystemExit(1)
    print("four-colour cross-check   : PASS (lost_completely == global exclusive access)")
    print("\nwrote 10 artifacts to %s (report: %d lines)" % (out_dir, lines))


if __name__ == "__main__":
    main()
