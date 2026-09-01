#!/usr/bin/env python3
"""
Validate the Vox family taxonomy against the frozen source layer.

    python tools/check_taxonomy.py --data data/

The taxonomy is a SECOND INDEX. It must never alter the mechanics. This
asserts that:

  - every assignment key resolves to a real PROJECTION mechanic;
  - no key points at a structural_only record (headings are not peers);
  - every mechanic has exactly one primary family;
  - no mechanic is assigned twice;
  - every family used is declared;
  - the file is labelled vox_mana_derived;
  - no assignment carries tier, colour or label data, which would be the
    taxonomy starting to shadow the source.

It also reports the miscellaneous rate, which is the pilot's actual test: if
mechanics will not fit without a junk drawer, the taxonomy is wrong and
scaling it to 221 would only multiply the problem.
"""
import argparse, json, pathlib, sys
from collections import Counter

SOURCE_FIELDS = {"tier", "tiers", "colors", "colours", "label", "assignments", "explanation"}

ap = argparse.ArgumentParser()
ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
ap.add_argument("--taxonomy", default="vox.families.pilot.json")
a = ap.parse_args()

rec = json.loads((a.data / "mcp2021.reconciled.json").read_text(encoding="utf-8"))
tax = json.loads((a.data / a.taxonomy).read_text(encoding="utf-8"))
M = rec["mechanics"]
peers = {k for k, v in M.items() if not v.get("structural_only")}
fails = []

if tax.get("source_class") != "vox_mana_derived":
    fails.append("taxonomy is not labelled source_class: vox_mana_derived")

declared = set(tax.get("families", {}))
seen = Counter()
misc = []
for row in tax["assignments"]:
    k = row["key"]
    seen[k] += 1
    if k not in M:
        fails.append("key not in the source layer: %s" % k[:70])
    elif k not in peers:
        fails.append("key points at a structural_only record: %s" % k[:70])
    if not row.get("primary"):
        fails.append("no primary family: %s" % k[:70])
    for f in [row.get("primary")] + list(row.get("secondary", [])):
        if f and f not in declared:
            fails.append("undeclared family '%s' on %s" % (f, k[:50]))
    if row.get("primary") in ("misc", "miscellaneous", "other"):
        misc.append(k)
    leaked = SOURCE_FIELDS & set(row)
    if leaked:
        fails.append("assignment carries source fields %s: %s" % (sorted(leaked), k[:50]))

for k, n in seen.items():
    if n > 1:
        fails.append("assigned %d times: %s" % (n, k[:70]))

unused = declared - {r.get("primary") for r in tax["assignments"]} \
                  - {f for r in tax["assignments"] for f in r.get("secondary", [])}

print("assignments        : %d" % len(tax["assignments"]))
print("families declared  : %d" % len(declared))
print("families unused    : %d %s" % (len(unused), sorted(unused) if unused else ""))
print("miscellaneous      : %d  (the pilot's real test)" % len(misc))
print("coverage of peers  : %d of %d" % (len(seen), len(peers)))

if fails:
    print()
    for f in fails:
        print("FAIL  %s" % f)
    print("\n%d violation(s). The taxonomy must not be scaled until these clear." % len(fails))
    sys.exit(1)
print("\nTaxonomy is a clean second index: it alters nothing in the source layer.")
