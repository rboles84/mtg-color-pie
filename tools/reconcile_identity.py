#!/usr/bin/env python3
"""
Step 2.5 -- Identity Reconciliation Audit.

    python tools/reconcile_identity.py --data data/

THE PROBLEM
-----------
Tier reconciliation asked "when both halves of the article name the same
mechanic, do they agree about its colours?" It never asked the prior question:
"are these two labels the same mechanic at all?"

So a mechanic named slightly differently in the colour list and in the ability
catalog is currently counted TWICE and reconciled against nothing. The 236
figure is therefore an upper bound, not a count.

WHAT THIS DOES
--------------
Takes every list-only and every catalog-only record and looks for a
counterpart across the other representation using CONSERVATIVE normalisation
only -- never semantic similarity:

    L1  unicode / invisible characters   zero-width space, NFKC, dashes, quotes
    L2  terminal punctuation             "Switch power/toughness."
    L3  grammatical number               opponent / opponents, effect / effects
    L4  trivial morphology               switch / switching

L1 and L2 are artefacts of typesetting, not of meaning, so they are merged
automatically. L3 and L4 change words, so they are PROPOSED and wait for a
ruling. Nothing merges on meaning: "Cast spells from your graveyard" and
"Cast spells out of graveyard" must stay apart, and no amount of similarity
scoring is allowed to join them.

Two structural relationships are detected as well:

    group-header   the list item names a heading the catalog then breaks into
                   variants. "Putting cards from hand onto the battlefield" is
                   a real list item AND the catalog's header for the artifact,
                   creature, enchantment, land and planeswalker variants. It is
                   preserved as source, but must not become a peer mechanic in
                   the runtime model.
    variant-split  the list encodes a qualifier in the label
                   ("+N/+N to your team, one-shot") that the catalog encodes in
                   the group header instead.

OUTPUTS
    mcp2021.identity_review.md      the review table
    mcp2021.identity_rulings.json   scaffold; UNRULED entries BLOCK the build
"""

import argparse
import importlib.util
import json
import pathlib
import re
import sys
import unicodedata

HERE = pathlib.Path(__file__).resolve().parent


def load_norm():
    """Reuse the parser's own normalisation so the two can never diverge."""
    spec = importlib.util.spec_from_file_location(
        "mcp", HERE / "parse_mechanical_pie_2021.py")
    mod = importlib.util.module_from_spec(spec)
    sys.argv = [sys.argv[0]]          # the parser parses argv at import time
    spec.loader.exec_module(mod)
    return mod.norm_label


def unify(s):
    """
    L1 applied at CANDIDATE-GENERATION time, not only inside norm_label.

    Without this, fold() tokenised "Priest–like" (en dash) as two words and
    "Priest-like" (hyphen) as one, so a pair identical apart from typesetting
    was reported `distinct` at 0.99 similarity. The unicode step has to happen
    before tokenisation or it may as well not exist.
    """
    s = unicodedata.normalize("NFKC", s)
    for zw in ("​", "‌", "‍", "﻿"):
        s = s.replace(zw, "")
    for dash in ("–", "—", "−"):
        s = s.replace(dash, "-")
    return s.replace("’", "'").replace("“", "").replace("”", "")


def tokens(s):
    return re.findall(r"[a-z0-9+/'\-]+", unify(s).lower())


def singular(t):
    if len(t) > 3 and t.endswith("s") and not t.endswith(("ss", "us")):
        return t[:-1]
    return t


def stem(t):
    if len(t) > 4 and t.endswith("ing"):
        return t[:-3]
    if len(t) > 3 and t.endswith("e"):
        return t[:-1]
    return t


def fold(s, level):
    ts = tokens(s)
    if level >= 3:
        ts = [singular(t) for t in ts]
    if level >= 4:
        ts = [stem(singular(t)) for t in ts]
    return " ".join(ts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    args = ap.parse_args()
    norm_label = load_norm()

    # The UNMERGED baseline, deliberately. Reading the merged file would be
    # circular: previous merges hide the pairs this audit exists to find.
    raw = args.data / "mcp2021.reconciled.raw.json"
    rec = json.loads((raw if raw.is_file() else
                      args.data / "mcp2021.reconciled.json").read_text(encoding="utf-8"))
    abil = json.loads((args.data / "mcp2021.abilities.json").read_text(encoding="utf-8"))

    mech = rec["mechanics"]
    list_only = {k: v for k, v in mech.items() if v["in_lists"] and not v["in_catalog"]}
    cat_only = {k: v for k, v in mech.items() if v["in_catalog"] and not v["in_lists"]}

    # catalog group headers, for the group-header relationship
    groups = {}
    for a in abil["abilities"]:
        g = a.get("group")
        if g:
            groups.setdefault(fold(g, 4), set()).add(g)

    def tiers_of(v):
        return ", ".join("%s=%s" % (c, d["tier"]) for c, d in sorted(v["colors"].items()))

    rows = []
    used_cat = set()

    for lk, lv in sorted(list_only.items()):
        llabel = lv["label"]
        best = None

        # structural: a qualifier the list puts in the label and the catalog
        # puts in the group header
        m = re.search(r",\s*(one-shot|ongoing)\s*$", llabel, re.I)
        if m:
            qual = m.group(1).lower()
            base = fold(llabel[:m.start()], 4)
            # Build the target key FROM THE MATCHED ABILITY, never from a
            # separate loop over catalog keys. Pairing an outer candidate key
            # with an inner ability record decoupled the two: the group test
            # passed against one entry while the key came from another, so the
            # "ongoing" summary entry merged into the ONE-SHOT mechanic. That
            # silently corrupts both mechanics' tiers AND permanently hides the
            # contradiction the merge exists to expose.
            for a_ in abil["abilities"]:
                if not a_.get("group") or qual not in a_["group"].lower():
                    continue
                if fold(a_["label"], 4) != base:
                    continue
                ck = norm_label(a_["group"]) + " :: " + norm_label(a_["label"])
                if ck not in mech:
                    ck = norm_label(a_["label"])
                if ck not in mech:
                    continue
                best = (ck, mech[ck], "variant-split",
                        "list puts '%s' in the label; the catalog puts it in the "
                        "group header '%s'" % (qual, a_["group"]))
                break

        # group-header: the list item names a catalog heading
        if not best and fold(llabel, 4) in groups:
            best = (None, None, "group-header",
                    "the catalog uses this as a heading over its variants; keep as "
                    "source, do NOT make it a peer mechanic in the runtime model")

        # L3 / L4 wording
        if not best:
            for level, why in ((3, "grammatical number only"),
                               (4, "trivial morphology only")):
                f = fold(llabel, level)
                hits = [(ck, cv) for ck, cv in cat_only.items()
                        if ck not in used_cat and fold(cv["label"], level) == f]
                if len(hits) == 1:
                    ck, cv = hits[0]
                    same_text = cv["label"].strip() == llabel.strip()
                    best = (ck, cv, "same-mechanic",
                            ("identical label; split only because the catalog "
                             "qualifies it by its group header") if same_text else why)
                    break
                if len(hits) > 1:
                    best = (None, None, "uncertain",
                            "matches %d catalog labels at %s" % (len(hits), why))
                    break

        if best:
            ck, cv, rel, why = best
            if ck:
                used_cat.add(ck)
            rows.append({"list_label": llabel, "list_tiers": tiers_of(lv),
                         "catalog_label": cv["label"] if cv else "",
                         "catalog_tiers": tiers_of(cv) if cv else "",
                         "relationship": rel, "reason": why,
                         "list_key": lk, "catalog_key": ck})
        else:
            rows.append({"list_label": llabel, "list_tiers": tiers_of(lv),
                         "catalog_label": "", "catalog_tiers": "",
                         "relationship": "distinct",
                         "reason": "no conservative counterpart in the catalog; the "
                                   "list asserts tiers the catalog never discusses",
                         "list_key": lk, "catalog_key": None})

    for ck, cv in sorted(cat_only.items()):
        if ck in used_cat:
            continue
        rows.append({"list_label": "", "list_tiers": "",
                     "catalog_label": cv["label"], "catalog_tiers": tiers_of(cv),
                     "relationship": "distinct",
                     "reason": "no conservative counterpart in the colour lists",
                     "list_key": None, "catalog_key": ck})

    # ---- rulings scaffold --------------------------------------------------
    path = args.data / "mcp2021.identity_rulings.json"
    existing = {}
    if path.is_file():
        existing = json.loads(path.read_text(encoding="utf-8")).get("rulings", {})

    rulings = {}
    for r in rows:
        rid = "%s || %s" % (r["list_label"] or "-", r["catalog_label"] or "-")
        prior = existing.get(rid, {})
        needs = r["relationship"] in ("same-mechanic", "variant-split", "uncertain")
        rulings[rid] = {
            "proposed": r["relationship"],
            "reason": r["reason"],
            "ruling": prior.get("ruling", "UNRULED" if needs else r["relationship"]),
            "list_key": r["list_key"],
            "catalog_key": r["catalog_key"],
            # canonical_key lets a reviewer aim a merge at a specific catalog
            # entry the matcher could not choose between. The bare
            # "+N/+0 to your team" matches both the one-shot and the ongoing
            # group, and only a human can say which the summary list meant.
            "canonical_key": prior.get("canonical_key", r["catalog_key"]),
            "aliases": [x for x in (r["list_label"], r["catalog_label"]) if x],
        }
    path.write_text(json.dumps(
        {"note": "Set `ruling` to same-mechanic | distinct | group-header | "
                 "variant-split. For an `uncertain` row, also set `canonical_key` "
                 "to the catalog key the merge should target. "
                 "Any UNRULED entry blocks the runtime build. Both labels are kept "
                 "as aliases under whichever mechanic the ruling produces.",
         "rulings": rulings}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    unruled = [k for k, v in rulings.items() if v["ruling"] == "UNRULED"]

    # ---- recomputed counts -------------------------------------------------
    merges = sum(1 for v in rulings.values()
                 if v["ruling"] in ("same-mechanic", "variant-split"))
    headers = sum(1 for v in rulings.values() if v["ruling"] == "group-header")
    proposed = sum(1 for v in rulings.values()
                   if v["proposed"] in ("same-mechanic", "variant-split"))
    upper = len(mech)
    lower = upper - merges - headers
    if_all = upper - proposed - headers

    L = ["# Identity reconciliation audit (Step 2.5)\n",
         "Generated by `tools/reconcile_identity.py`. Candidates come from "
         "conservative normalisation only -- never semantic similarity.\n",
         "## Counts\n",
         "| | |", "|---|---|",
         "| reconciled mechanics, upper bound | %d |" % upper,
         "| in both representations | %d |" %
         sum(1 for v in mech.values() if v["in_lists"] and v["in_catalog"]),
         "| colour-list only | %d |" % len(list_only),
         "| ability-catalog only | %d |" % len(cat_only),
         "| proposed merges | %d |" % merges,
         "| proposed group headers | %d |" % headers,
         "| count after rulings so far | %d |" % lower,
         "| **count if every proposal is accepted** | **%d** |" % if_all,
         "| UNRULED, blocking | %d |" % len(unruled),
         "",
         "The count is provisional until every UNRULED entry is decided.\n",
         "## Review table\n",
         "| list label | catalog label | list tiers | catalog tiers | proposed | reason |",
         "|---|---|---|---|---|---|"]
    for r in sorted(rows, key=lambda r: (r["relationship"], r["list_label"] or r["catalog_label"])):
        L.append("| %s | %s | %s | %s | `%s` | %s |" % (
            r["list_label"] or "—", r["catalog_label"] or "—",
            r["list_tiers"] or "—", r["catalog_tiers"] or "—",
            r["relationship"], r["reason"]))
    L.append("")
    L.append("## Hard audit condition\n")
    if unruled:
        L.append("**BLOCKING.** %d pair(s) await a ruling. No obvious same-mechanic "
                 "pair may remain split merely because its wording differs, and no "
                 "runtime artefact may be built while any of these is UNRULED:\n"
                 % len(unruled))
        for k in unruled:
            L.append("- %s" % k)
    else:
        L.append("PASS. Every candidate pair has been ruled on.")
    (args.data / "mcp2021.identity_review.md").write_text("\n".join(L) + "\n",
                                                          encoding="utf-8")

    print("upper bound      : %d" % upper)
    print("list-only        : %d" % len(list_only))
    print("catalog-only     : %d" % len(cat_only))
    print("proposed merges  : %d" % merges)
    print("group headers    : %d" % headers)
    print("count after rulings so far     : %d" % lower)
    print("count if all proposals accepted: %d" % if_all)
    print("UNRULED, BLOCKING: %d" % len(unruled))
    print("wrote %s and %s" % (path.name, "mcp2021.identity_review.md"))
    if unruled:
        print("\nBLOCKED: the runtime build cannot proceed until these are ruled on.")


if __name__ == "__main__":
    main()
