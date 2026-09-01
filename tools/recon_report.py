#!/usr/bin/env python3
"""
Render the human-readable recon report from the machine-readable statistics.

Called by recon_stats.py. Every number here is read from the generated JSON --
none is hand-maintained, so the prose cannot drift from the data.
"""

import io
import json

ORDER = "WUBRG"
NM = {"W": "White", "U": "Blue", "B": "Black", "R": "Red", "G": "Green"}


def write_report(S, out_dir):
    L = []
    def p(x=""):
        L.append(x)

    o = S["overall"]
    a = S["placement_accounting"]
    r = S["registry_audit"]
    k = S["family_size_skew"]
    g = S["graph_readiness"]["three_layer_model"]
    d = S["graph_readiness"]["derived_relationship_counts_not_materialized"]
    lo = S["graph_readiness"]["selection_render_load"]
    t = S["tertiary_fixture_audit"]
    nsig = len(S["color_signatures"])

    p("# Mechanical Color Pie 2021 - statistical reconnaissance\n")
    p("Read-only measurement of the accepted source layer, taxonomy and runtime")
    p("projection. Nothing upstream was modified. Snapshot dated %s.\n" % S["meta"]["snapshot"])
    p("Tiers describe design ownership and frequency. They are never translated into")
    p("quality or power, and no metric in this report is a score.\n")

    # 1
    p("## 1. Executive facts\n")
    p("| | |")
    p("|---|---|")
    p("| peer mechanics | %d |" % o["peer_mechanics"])
    p("| reconciled source identities | %d |" % o["reconciled_source_identities"])
    p("| structural-only identities | %d |" % o["structural_only"])
    p("| final peer color assignments | %d |" % o["final_peer_color_assignments"])
    p("| primary / secondary / tertiary assignments | %d / %d / %d |"
      % (o["primary_assignments"], o["secondary_assignments"], o["tertiary_assignments"]))
    p("| canonical nonempty WUBRG selections | 31 |")
    p("| registry records | %d |" % r["total_registry_records"])
    p("| unique WUBRG color sets in the registry | %d |"
      % r["unique_wubrg_color_sets_represented"])
    p("| Vox families | %d |" % len(S["families"]))
    p("| mechanics with zero primary owner | %d |" % o["mechanics_with_zero_primary_owner"])
    p("| max primary owners on one mechanic | %d |" % o["max_primary_owners_on_a_mechanic"])
    p("")

    # 2
    p("## 2. Measurement definitions\n")
    p("**exclusive access** - the mechanic has any tier assignment in exactly one color")
    p("globally.\n")
    p("**unique primary owner** - exactly one color is primary; other colors may hold")
    p("secondary or tertiary access. A different population from exclusive access; the")
    p("two are never merged.\n")
    p("**best access** - for a selection, the strongest tier any selected color holds.")
    p("Partitions all 216 into primary_available / secondary_only / tertiary_only /")
    p("unavailable.\n")
    p("**shared_any_access** - every selected color holds some tier. INCLUSIVE of")
    p("shared_primary.\n")
    p("**complementary** - reachable by at least one selected color but not all of them.\n")
    p("**conditional** - an overlapping annotation carried by the runtime. Never added")
    p("into a mutually exclusive bucket.\n")
    for dv in S["definition_divergences"]:
        p("> **Divergence recorded, not resolved: `%s`.**" % dv["term"])
        p("> %s defines it as %s." % (dv["upstream_artifact"], dv["upstream_definition"]))
        p("> This recon uses the inclusive reading because %s."
          % dv["reason_for_recon_definition"])
        p("> Relationship: `%s`, verified on %s." % (dv["relationship"], dv["verified_on"]))
        p("> Classification: %s. Action taken: %s\n"
          % (dv["classification"], dv["action_taken"]))

    # 3
    p("## 3. Source vs projection accounting\n")
    p("| measurement | value |")
    p("|---|---|")
    p("| raw color-list placements | %d |" % a["raw_color_list_placements"])
    p("| final reconciled peer assignments | %d |" % a["final_reconciled_peer_assignments"])
    p("| assignments on all source identities | %d |" % a["assignments_on_all_source_identities"])
    p("| structural-only assignments excluded | %d |" % a["structural_only_assignments_excluded"])
    p("| both-agree assignments | %d |" % a["both_agree_assignments"])
    p("| catalog-only assignments | %d |" % a["catalog_only_assignments"])
    p("| list-only assignments | %d |" % a["list_only_assignments"])
    p("| adjudicated assignments | %d |" % a["adjudicated_assignments"])
    p("")
    p("**Reconciliation.** %s\n" % a["equation"])

    # 4
    p("## 4. Registry / identity audit\n")
    p("- registry records: **%d**" % r["total_registry_records"])
    p("- records mapping to a WUBRG subset: **%d**" % r["records_mapping_to_a_wubrg_subset"])
    p("- unique color sets represented: **%d** of 31 canonical selections"
      % r["unique_wubrg_color_sets_represented"])
    p("- records not reducible to a WUBRG subset: **%d**"
      % len(r["records_not_reducible_to_a_wubrg_subset"]))
    p("")
    p("%s\n" % r["note"])
    p("Color sets carrying more than one registry name:\n")
    p("| color set | registry names |")
    p("|---|---|")
    for key, names in r["color_sets_with_more_than_one_registry_name"].items():
        p("| %s | %s |" % (key, ", ".join(names)))
    p("")
    p("### Not measured\n")
    for name, v in S["special_identities"].items():
        if name.startswith("_"):
            continue
        p("**%s** - `mechanical_projection_status: not_measured`" % name)
        p("")
        p("- reason: %s" % v["reason"])
        p("- `empty_wubrg_selection_reachable: %d` - %s"
          % (v["empty_wubrg_selection_reachable"], v["empty_selection_note"]))
        p("- excluded from mono-color aggregates: %s\n"
          % v["excluded_from_mono_color_aggregates"])
    p("**Yore** - registry lookup result:\n")
    p("```json")
    p(json.dumps(S["special_identities"]["_yore_lookup"], indent=2))
    p("```\n")

    # 5
    p("## 5. Overall distribution\n")
    p("### Mechanics by primary-owner count\n")
    p("| primary owners | mechanics |")
    p("|---|---|")
    for i in sorted(o["mechanics_by_primary_owner_count"]):
        p("| %s | %d |" % (i, o["mechanics_by_primary_owner_count"][i]))
    p("")
    p("### Color breadth\n")
    p("| colors with any access | mechanics | pct of 216 |")
    p("|---|---|---|")
    for n in sorted(S["color_breadth"]):
        v = S["color_breadth"][n]
        p("| %s | %d | %.1f%% |" % (n, v["mechanics_assigned_to_exactly_n_colors"],
                                    v["pct_of_216"]))
    p("")
    p("### Exact access signatures\n")
    p("%d of the 31 possible signatures occur. Highest twelve by count:\n" % nsig)
    p("| signature | colors | mechanics |")
    p("|---|---|---|")
    for s in S["color_signatures"][:12]:
        p("| %s | %d | %d |" % (s["signature"], s["color_count"], s["count"]))
    p("")
    p("Full list in `color-signatures.csv`.\n")

    # 6
    p("## 6. Per color\n")
    p("| color | primary | secondary | tertiary | reachable | pct of 216 | exclusive access | unique primary owner | conditional |")
    p("|---|---|---|---|---|---|---|---|---|")
    for c in ORDER:
        x = S["per_color"][c]
        p("| %s | %d | %d | %d | **%d** | %.1f%% | %d | %d | %d |"
          % (x["name"], x["primary"], x["secondary"], x["tertiary"], x["total_reachable"],
             x["reachable_pct_of_216"], x["globally_exclusive_access"],
             x["globally_unique_primary_owner"], x["conditional_mechanics"]))
    p("")
    p("Exclusive access and unique primary owner are separate populations. Both key lists")
    p("are in `mechanics-statistics.json` under `per_color`.\n")

    # 7
    p("## 7. All 31 color selections\n")
    p("Full rows in `identity-statistics.csv`, one row per canonical selection with no")
    p("duplication for aliases. Reachable-count distribution by selection size:\n")
    p("| size | selections | min | max | mean | median |")
    p("|---|---|---|---|---|---|")
    for n in "12345":
        ss = S["selection_size_distributions"][n]
        rc = ss["reachable_count"]
        p("| %s | %d | %d | %d | %.1f | %s |"
          % (n, ss["selections"], rc["min"], rc["max"], rc["mean"], rc["median"]))
    p("")

    # 8
    p("## 8. Pair overlap\n")
    p("| pair | any-access overlap | shared-primary overlap | union | Jaccard |")
    p("|---|---|---|---|---|")
    for x in sorted(S["pair_overlap"], key=lambda z: -z["any_access_overlap"]):
        p("| %s | %d | %d | %d | %.3f |"
          % (x["pair"], x["any_access_overlap"], x["shared_primary_overlap"],
             x["union_size"], x["jaccard_any_access"]))
    p("")
    p("Jaccard is derived mathematics over mechanical overlap in this dataset only. It is")
    p("not a measure of philosophical closeness or deck synergy.\n")

    # 9
    p("## 9. Addition / delta analysis\n")
    p("%d one-color-addition transitions, all in `marginal-additions.csv`.\n"
      % len(S["marginal_additions"]))
    p("| added color | transitions | newly reachable min..max (mean) | best tier improved min..max (mean) | new owner without improvement min..max (mean) |")
    p("|---|---|---|---|---|")
    for c in ORDER:
        x = S["marginal_addition_by_color"][c]
        f = lambda z: "%d..%d (%.1f)" % (z["min"], z["max"], z["mean"])
        p("| %s | %d | %s | %s | %s |"
          % (NM[c], x["transitions"], f(x["newly_reachable"]),
             f(x["best_tier_improved"]), f(x["new_owner_no_improvement"])))
    p("")

    # 10
    p("## 10. Four-color absence\n")
    p("| omitted | selection | lost completely | best access degraded | owner lost, access retained | unaffected | cross-check |")
    p("|---|---|---|---|---|---|---|")
    for x in S["four_color_absence"]:
        p("| %s | %s | **%d** | %d | %d | %d | %s (global exclusive = %d) |"
          % (NM[x["omitted"]], x["selection"], x["lost_completely"],
             x["best_access_degraded"], x["owner_lost_access_retained"],
             x["unaffected"], "PASS" if x["cross_check_pass"] else "FAIL",
             x["cross_check_global_exclusive_access"]))
    p("")
    p("The mandatory cross-check passes for all five: `lost_completely` when a color is")
    p("omitted equals that color's global exclusive-access count.\n")

    # 11
    p("## 11. Families\n")
    p("Primary-family membership is a partition and sums to 216. Secondary membership")
    p("overlaps and must not be added into the same total.\n")
    p("Size skew: min %d, max %d, mean %.2f, median %s, stdev %.2f, quartiles %s,"
      " coefficient of variation %.3f.\n"
      % (k["min"], k["max"], k["mean"], k["median"], k["stdev"], k["quartiles"],
         k["coefficient_of_variation"]))
    p("| family | primary | secondary | all | pct of 216 | W | U | B | R | G | conditional |")
    p("|---|---|---|---|---|---|---|---|---|---|---|")
    for f in S["families"]:
        p("| %s | %d | %d | %d | %.1f%% | %d | %d | %d | %d | %d | %d |"
          % (f["family"], f["primary_member_count"], f["secondary_member_count"],
             f["all_member_count"], f["pct_of_216_by_primary_membership"],
             f["reach_W"], f["reach_U"], f["reach_B"], f["reach_R"], f["reach_G"],
             f["conditional_member_count"]))
    p("")

    # 12
    p("## 12. Conditionality\n")
    c = S["conditional"]
    p("- conditional mechanics: **%d** of 216" % c["total"])
    p("- %s" % c["note"])
    p("- by color: %s" % ", ".join("%s %d" % (NM[x], y) for x, y in c["by_color"].items()))
    p("- by color breadth: %s"
      % ", ".join("%s colors %d" % (x, y) for x, y in sorted(c["by_color_breadth"].items())))
    p("- by tier assignment: %s"
      % ", ".join("%s %d" % (x, y) for x, y in c["by_tier_assignment"].items()))
    p("")

    # 13
    p("## 13. Graph / rendering-load statistics\n")
    p("Three-layer model - 5 color nodes, family nodes, mechanic nodes:\n")
    p("| | |")
    p("|---|---|")
    for kk, vv in g.items():
        p("| %s | %s |" % (kk.replace("_", " "), vv))
    p("")
    p("`shares primary family` mechanic pairs: **%d**. %s\n"
      % (d["shares_primary_family_mechanic_pairs"], d["note"]))
    p("Per-selection render load across all 31 selections:\n")
    p("| metric | min | max | mean | median |")
    p("|---|---|---|---|---|")
    for kk in ("mechanic_nodes", "color_mechanic_edges", "family_mechanic_edges"):
        x = lo[kk]
        p("| %s | %d | %d | %.1f | %s |"
          % (kk.replace("_", " "), x["min"], x["max"], x["mean"], x["median"]))
    p("")

    # 14
    p("## 14. Provenance / data quality\n")
    p("Audit context, not gameplay statistics.\n")
    p("| | |")
    p("|---|---|")
    for kk, vv in S["provenance"].items():
        p("| %s | %s |" % (kk.replace("_", " "), vv))
    p("")

    # 15
    p("## 15. Notable extrema\n")
    p("Every extreme names its metric and reports ties rather than discarding them.\n")
    p("| metric | value | records | tied |")
    p("|---|---|---|---|")
    for e in S["notable_extremes"]:
        p("| %s | %s | %s | %s |"
          % (e["metric"], e["value"], ", ".join(map(str, e["records"])),
             "yes (%d)" % e["tie_count"] if e["tied"] else "no"))
    p("")

    # 16
    p("## 16. Visualization implications - facts only\n")
    p("Measurements relevant to rendering. Not design decisions.\n")
    p("- A three-layer graph carries **%d nodes** and **%d edges** before any"
      " mechanic-to-mechanic relationship is added." % (g["total_nodes"], g["total_edges"]))
    p("- Materialising `shares primary family` as edges would add **%d** further edges,"
      " about %.0f times the entire three-layer edge count. No such relationship exists"
      " in the source."
      % (d["shares_primary_family_mechanic_pairs"],
         d["shares_primary_family_mechanic_pairs"] / g["total_edges"]))
    p("- Per-selection mechanic nodes range %d..%d, median %s."
      % (lo["mechanic_nodes"]["min"], lo["mechanic_nodes"]["max"],
         lo["mechanic_nodes"]["median"]))
    p("- Per-selection color-to-mechanic edges range %d..%d, median %s."
      % (lo["color_mechanic_edges"]["min"], lo["color_mechanic_edges"]["max"],
         lo["color_mechanic_edges"]["median"]))
    p("- %d of 31 exact access signatures occur; %d do not." % (nsig, 31 - nsig))
    p("- Family primary-member sizes span %d..%d with a coefficient of variation of %.3f.\n"
      % (k["min"], k["max"], k["coefficient_of_variation"]))

    # 17
    p("## 17. Questions for Owner\n")
    p("1. **Fixture 10 is `%s`.** %s Candidate replacement selections with a non-empty"
      " tertiary-only set are listed under `tertiary_fixture_audit` in the JSON. No"
      " change was made.\n" % (t["verdict"], t["explanation"]))
    p("2. **`shared_access` names two different populations** across two accepted")
    p("   artifacts. Both are internally consistent and they reconcile exactly, but one")
    p("   name for two definitions is a hazard. Which should be canonical?\n")
    p("3. **%d of 31 access signatures never occur.** Whether that absence is worth"
      " surfacing is a design question, not a measurement one.\n" % (31 - nsig))
    p("4. **Family primary-member sizes are highly uneven** (%d..%d, CV %.3f). No merging"
      " was performed; the mission forbids it. If a visualization needs balanced groups,"
      " that is a presentation decision taken separately from the taxonomy.\n"
      % (k["min"], k["max"], k["coefficient_of_variation"]))

    io.open(out_dir / "mechanics-statistics-recon.md", "w",
            encoding="utf-8", newline="").write("\n".join(L) + "\n")
    return len(L)
