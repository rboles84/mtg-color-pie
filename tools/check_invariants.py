#!/usr/bin/env python3
"""
Frozen invariants for the Mechanical Color Pie source layer.

    python tools/check_invariants.py --data data/

Exits non-zero if any invariant is violated. Run it after every rebuild and
before anything downstream is generated.

WHY THIS EXISTS
---------------
Every defect found while building this dataset produced PLAUSIBLE OUTPUT
rather than a crash:

  - a zero-width space split one mechanic into two;
  - nested parentheses defeated the gloss stripper, splitting more;
  - tier lines matched inside explanation prose, inventing assignments;
  - sub-abilities in <li> were filed under their group header, collapsing 19
    creature-pumping variants into one;
  - the variant-split matcher merged the ONGOING summary entry into the
    ONE-SHOT mechanic, which would have altered the actual mechanical pie;
  - the identity audit read its own merged output and reported that
    reconciliation was complete when it had not run;
  - fold() skipped the unicode step, so an en dash tokenised differently from
    a hyphen and a pair identical apart from typesetting was reported
    `distinct` at 0.99 similarity.

Not one of those raised an exception. Several produced numbers that looked
entirely reasonable. A count that drifts quietly is the failure mode here, so
the counts are asserted rather than trusted.
"""

import argparse
import json
import pathlib
import sys

EXPECTED = {
    "source_identities": 217,
    "projection_mechanics": 216,
    "structural_only": 1,
    "adjudicated_conflicts": 5,
    "unadjudicated_conflicts": 0,
    "unruled_identities": 0,
    "identity_merges": 19,
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    args = ap.parse_args()

    fails, notes = [], []

    def need(path):
        p = args.data / path
        if not p.is_file():
            fails.append("missing required file: %s" % path)
            return None
        return json.loads(p.read_text(encoding="utf-8"))

    rec = need("mcp2021.reconciled.json")
    raw = need("mcp2021.reconciled.raw.json")
    rulings = need("mcp2021.identity_rulings.json")
    if rec is None or raw is None or rulings is None:
        for f in fails:
            print("FAIL  %s" % f)
        sys.exit(1)

    M = rec["mechanics"]
    got = {
        "source_identities": len(M),
        "projection_mechanics": sum(1 for v in M.values() if not v.get("structural_only")),
        "structural_only": sum(1 for v in M.values() if v.get("structural_only")),
        "adjudicated_conflicts": sum(
            1 for v in M.values() for c in v["colors"].values()
            if c.get("basis") == "adjudicated"),
        "unadjudicated_conflicts": sum(
            1 for v in M.values() for c in v["colors"].values()
            if "conflict" in c and c.get("basis") != "adjudicated"),
        "unruled_identities": sum(
            1 for v in rulings["rulings"].values() if v.get("ruling") == "UNRULED"),
        "identity_merges": sum(
            1 for v in rulings["rulings"].values()
            if v.get("ruling") in ("same-mechanic", "variant-split") and v.get("list_key")),
    }
    for k, want in EXPECTED.items():
        if got[k] != want:
            fails.append("%s: expected %d, got %d" % (k, want, got[k]))
        else:
            notes.append("%-24s %d" % (k, got[k]))

    # Aliases must survive every merge, or a merge stops being provable.
    # Count only rows that actually absorb a list-side record. The canonical
    # side of a semantic pair is a TARGET, not a merge; counting it inflated
    # the figure from 19 to 23 while changing no behaviour, which is exactly
    # the sort of quietly wrong number these invariants exist to catch.
    merges = sum(1 for v in rulings["rulings"].values()
                 if v.get("ruling") in ("same-mechanic", "variant-split")
                 and v.get("list_key"))
    with_alias = sum(1 for v in M.values() if v.get("source_aliases"))
    if merges and not with_alias:
        fails.append("%d merges applied but no record carries source_aliases" % merges)
    else:
        notes.append("%-24s %d merges, %d records carry aliases"
                     % ("source_aliases", merges, with_alias))

    # The raw baseline must be genuinely UNMERGED and reproducible on its own.
    # If it equals the merged output, the identity audit has been reading its
    # own results and its clean bill of health means nothing.
    if len(raw["mechanics"]) == len(M) and merges:
        fails.append("raw baseline has the same count as the merged output (%d); "
                     "the unmerged reconciliation is not independent" % len(M))
    else:
        notes.append("%-24s %d raw vs %d merged"
                     % ("raw baseline independent", len(raw["mechanics"]), len(M)))

    # Identity rulings must be inputs, never derived from reconciled output.
    for rid, r in rulings["rulings"].items():
        if r.get("ruling") in ("same-mechanic", "variant-split"):
            dst = r.get("canonical_key") or r.get("catalog_key")
            if dst and dst not in M:
                fails.append("ruling '%s' targets a key absent from the merged "
                             "output: %s" % (rid[:60], dst))

    # Every adjudication must carry its authority, or the ruling is folklore.
    for k, v in M.items():
        for c, x in v["colors"].items():
            if x.get("basis") == "adjudicated" and not x.get("ruling", {}).get("authority"):
                fails.append("adjudication %s/%s has no recorded authority" % (k, c))

    # Story 2 regressions: two parser defects that produced plausible output.
    # (1) "Return target creature from graveyard to hand." has a top-level
    # shape in the article's markup and once reset the group for the four
    # entries after it. (2) A <b> lead was not read, so "Creature sacrifice,
    # forced, repeatable" was filed as a second "-N/-N to their team".
    abil = need("mcp2021.abilities.json")
    runtime = need("mechanical-color-pie.runtime.json")
    if abil is not None:
        grp = "Returning cards from graveyard to hand."
        ret = sorted(a["label"] for a in abil["abilities"]
                     if a["label"].startswith("Return target ")
                     and a["label"].endswith(" from graveyard to hand."))
        in_grp = sorted(a["label"] for a in abil["abilities"] if a.get("group") == grp)
        if len(ret) != 7 or in_grp != ret:
            fails.append("group '%s': expected the 7 return entries, got %d of %d"
                         % (grp, len(in_grp), len(ret)))
        else:
            notes.append("%-24s 7 entries" % "graveyard-to-hand group")
    if runtime is not None:
        cs = runtime["byMechanic"].get("creature sacrifice, forced, repeatable") or {}
        if cs.get("explanation") != "Sometimes black likes killing things slowly.":
            fails.append("creature sacrifice, forced, repeatable: explanation missing "
                         "or changed (%r)" % cs.get("explanation"))
        else:
            notes.append("%-24s explanation present" % "creature sacrifice")

    for n in notes:
        print("ok    %s" % n)
    if fails:
        print()
        for f in fails:
            print("FAIL  %s" % f)
        print("\n%d invariant(s) violated. STOP: do not build anything downstream."
              % len(fails))
        sys.exit(1)
    print("\nAll invariants hold. Source layer is frozen and safe to build on.")


if __name__ == "__main__":
    main()
