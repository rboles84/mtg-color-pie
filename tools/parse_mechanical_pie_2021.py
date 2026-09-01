#!/usr/bin/env python3
"""
Two-pass parser and reconciler for Rosewater's "Mechanical Color Pie 2021".

    python tools/parse_mechanical_pie_2021.py mcp2021.html --out data/

WHY TWO PASSES
--------------
The article states the same facts twice, in two different shapes:

  SECTION A  the colour lists      "Black--Secondary" -> [Flash, Haste, ...]
  SECTION B  the ability catalog   "Flash" -> Primary: Blue,
                                              Secondary: White, black, green,
                                              Tertiary: Red   (+ explanation)

Section B is the better canonical namespace, because Rosewater has already made
the conceptual distinctions there himself -- "Destroy target tapped creature"
is its own entry, not something we have to carve out of a list. Section B also
carries the restrictions, which is where the real information lives: knowing
red is secondary in flying is far less useful than knowing it is secondary
*on Dragons and Phoenixes*.

Parsing both and comparing them turns single-source scraping into something
auditable. Where they agree, confidence is high. Where they disagree, that is
recorded as a SOURCE CONFLICT rather than silently resolved -- the article
genuinely contradicts itself in at least one place, and that fact is data.

NOTHING IS INVENTED. Assignments come only from an explicit "Primary:" /
"Secondary:" / "Tertiary:" line or an explicit colour-list heading. Where the
article omits a tier, the output says omitted; it never says "none".

OUTPUTS
    mcp2021.lists.json        Section A, verbatim
    mcp2021.abilities.json    Section B, verbatim, with explanations
    mcp2021.reconciled.json   canonical assignments + basis for each
    mcp2021.audit.md          conflicts, anomalies, unmatched labels
"""

import argparse
import html as htmllib
import json
import pathlib
import re
import sys
from collections import defaultdict

COLOR_WORDS = {"white": "W", "blue": "U", "black": "B", "red": "R", "green": "G"}
TIERS = ("primary", "secondary", "tertiary")

# The article contains "Seconary" (Sacrifice a permanent) and at least one
# tier line with no colon ("Tertiary white"). Both are matched here rather
# than corrected in place, and both are reported in the audit.
#
# ANCHORED AT THE START OF A LINE, and that anchoring is load-bearing. An
# unanchored version matches inside explanation prose -- "This ability was
# primary in both black and green for a while" parses as a tier line and
# silently produces a second, wrong record for the same ability. Every
# genuine tier line begins its own line.
TIER_LINE = re.compile(
    r"^[ \t]*(Primary|Second?ary|Seconary|Tertiary)\b[ \t]*:?[ \t]*([^<\n]*)",
    re.I | re.M)

# A label at the head of a paragraph. Sub-abilities such as
# "+N/+N (on creatures)" share their paragraph with their tier lines, so the
# label cannot be found by looking only at strong-only paragraphs -- doing
# that attributes all nineteen creature-pumping variants to the group header
# "Creature pumping" and destroys the distinctions the article draws.
LEAD_STRONG = re.compile(r"^\s*<strong>(.*?)</strong>", re.S | re.I)

COLOR_LIST_HEAD = re.compile(
    r"(White|Blue|Black|Red|Green)\s*[—–-]+\s*(Primary|Secondary|Tertiary)", re.I)


def text_of(fragment):
    """HTML fragment -> plain text, entities decoded, whitespace collapsed."""
    t = re.sub(r"<br\s*/?>", "\n", fragment, flags=re.I)
    t = re.sub(r"<[^>]+>", "", t)
    t = htmllib.unescape(t)
    t = t.replace(" ", " ")
    return re.sub(r"[ \t]+", " ", t).strip()


def norm_label(label):
    """
    Key for matching a colour-list entry to an ability-catalog entry.

    Drops the parenthetical gloss, quotes and case; collapses whitespace.
    Deliberately does NOT merge near-synonyms: the article lists "Cast spells
    from your graveyard" and "Cast spells out of graveyard" as separate
    entries with separate explanations, and collapsing them would destroy a
    distinction Rosewater drew on purpose.
    """
    # Strip only LONG parentheticals. A short one is a disambiguator that the
    # article depends on -- "+N/+N (on creatures)", "(on spells)" and
    # "(on Auras)" are three different entries with three different colour
    # assignments, and dropping the bracket collapses them into one and
    # manufactures conflicts that do not exist. A long one is a rules gloss,
    # and those vary slightly between the two halves of the article ("power
    # and toughness are equal" vs "is equal"), so they must go.
    s = re.sub(r"\(([^)]{40,})\)", " ", label)
    s = s.replace("“", "").replace("”", "").replace('"', "")
    s = s.replace("’", "'")
    s = re.sub(r"[.,;:]+$", "", s.strip())
    s = re.sub(r"\s+", " ", s).strip().lower()
    # The article misspells this in the Red and Green lists. Recorded as an
    # alias so the canonical label is spelled correctly while the source
    # spelling is still provable from the raw output.
    s = s.replace("distruction", "destruction")
    return s


def colors_in(phrase):
    """'White, blue, and green' -> ['W','U','G'], in article order."""
    out = []
    for word in re.findall(r"[A-Za-z]+", phrase.lower()):
        c = COLOR_WORDS.get(word)
        if c and c not in out:
            out.append(c)
    return out


# --------------------------------------------------------------------------
# PASS 1 -- the colour lists
# --------------------------------------------------------------------------
def parse_lists(doc, audit):
    """-> {(color, tier): [source label, ...]}"""
    lists = {}
    deferred = []
    for m in COLOR_LIST_HEAD.finditer(doc):
        color = COLOR_WORDS[m.group(1).lower()]
        tier = m.group(2).lower()
        # take the next <ul>...</ul> after the heading
        ul = re.search(r"<ul\b.*?</ul>", doc[m.end():m.end() + 20000],
                       flags=re.S | re.I)
        if not ul:
            # Each heading occurs twice: once as the collapsed dropdown's own
            # label, once as the real heading above the list. Only the second
            # has items, so a miss here is normal. Deferred, and reported at
            # the end only if the section never turned up at all -- otherwise
            # the audit fills with fifteen false alarms and buries the real
            # anomalies underneath them.
            deferred.append((color, tier))
            continue
        items = [text_of(li) for li in
                 re.findall(r"<li\b[^>]*>(.*?)</li>", ul.group(0), flags=re.S | re.I)]
        items = [i for i in items if i]
        key = (color, tier)
        if key in lists and lists[key] != items:
            audit.append(("list-duplicate-heading",
                          "%s %s appears more than once with different items" % (color, tier)))
            continue
        lists[key] = items
    for color, tier in deferred:
        if (color, tier) not in lists:
            audit.append(("list-no-items",
                          "%s %s: heading found but no list items anywhere" % (color, tier)))
    return lists


# --------------------------------------------------------------------------
# PASS 2 -- the ability catalog
# --------------------------------------------------------------------------
def parse_abilities(doc, audit):
    """-> [{label, assignments:{tier:[colors]}, tier_source:{}, explanation}]"""
    start = doc.find("All Abilities with Explanations")
    if start < 0:
        sys.exit("could not find the 'All Abilities with Explanations' section")
    region = doc[start:]

    # Element stream over <p> AND <li>, IN DOCUMENT ORDER. Both are required.
    # A group header is a paragraph -- <p><strong>Creature pumping</strong></p>
    # -- but each of its nineteen variants is a list item:
    #     <ul><li><strong>+N/+N (on creatures)</strong></li></ul>
    #     <p>Primary: Black<br />Secondary: Green</p>
    # Scanning paragraphs alone never sees the variants, so all nineteen get
    # filed under "Creature pumping" and the article's own distinctions --
    # exactly the resolution this dataset exists to preserve -- are lost.
    els = [(m.group(1).lower(), m.group(2))
           for m in re.finditer(r"<(p|li)\b[^>]*>(.*?)</\1>", region, flags=re.S | re.I)]

    # The article reuses a sub-label under different group headers:
    # "-N/-N to their team" appears under both the one-shot and the ongoing
    # groups. The label alone is therefore not a key; the group qualifies it.
    out, label, group = [], None, None
    for tag, raw in els:
        txt = text_of(raw)
        if not txt:
            continue
        lead = LEAD_STRONG.match(raw.strip())
        if lead:
            lead_label = text_of(lead.group(1))
            if lead_label:
                label = lead_label
        if tag == "li":
            continue        # a list item only ever names a label
        if lead and not TIER_LINE.search(txt):
            group = label   # a strong-only paragraph is a group header
        tiers_here = {}
        tier_src = {}
        for tm in TIER_LINE.finditer(txt):
            word, rest = tm.group(1), tm.group(2)
            cols = colors_in(rest)
            if not cols:
                continue
            canon = "secondary" if word.lower().startswith("sec") else word.lower()
            tiers_here[canon] = cols
            tier_src[canon] = word
            if word.lower() not in TIERS:
                audit.append(("source-typo",
                              "tier spelled '%s' (read as %s) under '%s'"
                              % (word, canon, label or "?")))
            if ":" not in tm.group(0):
                audit.append(("source-missing-colon",
                              "tier line '%s' has no colon under '%s'"
                              % (tm.group(0).strip(), label or "?")))

        if tiers_here:
            if label is None:
                audit.append(("orphan-tiers", "tier line with no preceding label: %s" % txt[:60]))
                continue
            out.append({"label": label,
                        "group": group if group != label else None,
                        "assignments": tiers_here,
                        "tier_source_words": tier_src,
                        "explanation": ""})
            continue

        # Prose. Attach it to the entry just emitted, which is where the
        # restrictions live -- "Red's flying is mostly restricted to Dragons
        # and Phoenixes" is worth more than the tier alone.
        if out and not lead and not out[-1]["explanation"]:
            out[-1]["explanation"] = txt

    return out


# --------------------------------------------------------------------------
# PASS 3 -- reconcile
# --------------------------------------------------------------------------
def reconcile(lists, abilities, audit):
    list_claims = defaultdict(dict)      # key -> {color: tier}
    list_label = {}
    for (color, tier), items in lists.items():
        for item in items:
            k = norm_label(item)
            list_label.setdefault(k, item)
            if color in list_claims[k] and list_claims[k][color] != tier:
                audit.append(("SOURCE-CONFLICT-within-lists",
                              "'%s' is listed for %s at BOTH %s and %s in the colour lists"
                              % (list_label[k], color, list_claims[k][color], tier)))
                # keep both; resolution comes from the ability catalog
                list_claims[k].setdefault("_dupes", []).append((color, tier))
            list_claims[k][color] = tier

    from collections import Counter
    label_counts = Counter(norm_label(a["label"]) for a in abilities)

    detail_claims = {}
    detail_label = {}
    for ab in abilities:
        k = norm_label(ab["label"])
        if label_counts[k] > 1 and ab.get("group"):
            k = norm_label(ab["group"]) + " :: " + k
            audit.append(("label-qualified-by-group",
                          "'%s' appears %d times; qualified as '%s'"
                          % (ab["label"], label_counts[norm_label(ab["label"])], k)))
        detail_label.setdefault(k, ab["label"])
        d = detail_claims.setdefault(k, {})
        for tier, cols in ab["assignments"].items():
            for c in cols:
                d[c] = tier

    reconciled, rows = {}, []
    for k in sorted(set(list_claims) | set(detail_claims)):
        lc = {c: t for c, t in list_claims.get(k, {}).items() if c in COLOR_WORDS.values()}
        dc = detail_claims.get(k, {})
        label = detail_label.get(k) or list_label.get(k)
        assignments = {}
        for c in "WUBRG":
            lt, dt = lc.get(c), dc.get(c)
            if lt and dt and lt == dt:
                assignments[c] = {"tier": dt, "basis": "both-agree"}
            elif lt and dt:
                assignments[c] = {"tier": dt, "basis": "ability-catalog",
                                  "conflict": {"colour_list_says": lt,
                                               "ability_catalog_says": dt}}
                rows.append(("TIER-CONFLICT", label, c, lt, dt))
            elif dt:
                assignments[c] = {"tier": dt, "basis": "ability-catalog-only"}
            elif lt:
                assignments[c] = {"tier": lt, "basis": "colour-list-only"}
        if assignments:
            reconciled[k] = {"label": label, "colors": assignments,
                             "in_lists": k in list_claims,
                             "in_catalog": k in detail_claims}
    return reconciled, rows, list_claims, detail_claims, list_label, detail_label


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source", type=pathlib.Path, help="saved article HTML")
    ap.add_argument("--out", type=pathlib.Path, default=pathlib.Path("data"))
    args = ap.parse_args()

    if not args.source.is_file():
        sys.exit("source not found: %s" % args.source)
    doc = args.source.read_text(encoding="utf-8", errors="replace")

    audit = []
    lists = parse_lists(doc, audit)
    abilities = parse_abilities(doc, audit)
    reconciled, conflicts, list_claims, detail_claims, list_label, detail_label = \
        reconcile(lists, abilities, audit)

    missing = [(c, t) for c in "WUBRG" for t in TIERS if (c, t) not in lists]
    for c, t in missing:
        audit.append(("SECTION-NOT-CAPTURED",
                      "%s %s was not found. Treat as NOT CAPTURED, never as empty." % (c, t)))

    args.out.mkdir(parents=True, exist_ok=True)
    prov = {
        "document": "Mechanical Color Pie 2021",
        "author": "Mark Rosewater (with the Council of Colors)",
        "published": "2021-10-18",
        "url": "https://magic.wizards.com/en/news/making-magic/mechanical-color-pie-2021",
        "snapshot": True,
        "caution": "Rosewater states this is a snapshot for 2021-10-18 that will "
                   "continue to evolve, that per-set needs bend the default, and "
                   "that some entries are experiments that may not stick.",
        "definitions": {
            "spells": "instants and sorceries, per the article's own terminology",
            "N": "a natural number of 1 or greater; repeated N need not be equal",
        },
    }

    (args.out / "mcp2021.lists.json").write_text(json.dumps(
        {"source": prov,
         "coverage": {"%s-%s" % (c, t): ("captured" if (c, t) in lists else "not_captured")
                      for c in "WUBRG" for t in TIERS},
         "lists": {"%s-%s" % (c, t): v for (c, t), v in sorted(lists.items())}},
        indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    (args.out / "mcp2021.abilities.json").write_text(json.dumps(
        {"source": prov, "abilities": abilities}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8")

    (args.out / "mcp2021.reconciled.json").write_text(json.dumps(
        {"source": prov,
         "basis_meanings": {
             "both-agree": "colour list and ability catalog state the same tier",
             "ability-catalog": "the two disagree; the catalog is preferred because it "
                                "is where Rosewater discusses the classification",
             "ability-catalog-only": "stated only in the ability catalog",
             "colour-list-only": "stated only in a colour list"},
         "mechanics": reconciled}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    L = ["# Mechanical Color Pie 2021 — parse and reconciliation audit\n",
         "Generated by `tools/parse_mechanical_pie_2021.py` from the article HTML.",
         "Nothing here has been corrected in the source.\n",
         "## Coverage\n"]
    for c in "WUBRG":
        L.append("- **%s** — %s" % (c, ", ".join(
            "%s: %s" % (t, len(lists[(c, t)]) if (c, t) in lists else "NOT CAPTURED")
            for t in TIERS)))
    L.append("")
    L.append("## Inventory\n")
    L.append("- colour-list placements: %d" % sum(len(v) for v in lists.values()))
    L.append("- ability-catalog entries: %d" % len(abilities))
    L.append("- reconciled mechanics: %d" % len(reconciled))
    L.append("- in both representations: %d" %
             sum(1 for v in reconciled.values() if v["in_lists"] and v["in_catalog"]))
    L.append("- colour-list only: %d" %
             sum(1 for v in reconciled.values() if v["in_lists"] and not v["in_catalog"]))
    L.append("- catalog only: %d" %
             sum(1 for v in reconciled.values() if v["in_catalog"] and not v["in_lists"]))
    L.append("")
    L.append("## Tier conflicts between the two representations\n")
    if conflicts:
        L.append("| mechanic | colour | colour list says | ability catalog says |")
        L.append("|---|---|---|---|")
        for _, label, c, lt, dt in sorted(conflicts, key=lambda r: (r[1], r[2])):
            L.append("| %s | %s | %s | %s |" % (label, c, lt, dt))
    else:
        L.append("None.")
    L.append("")
    L.append("## Anomalies in the source\n")
    if audit:
        for kind, msg in audit:
            L.append("- `%s` — %s" % (kind, msg))
    else:
        L.append("None.")
    (args.out / "mcp2021.audit.md").write_text("\n".join(L) + "\n", encoding="utf-8")

    print("colour-list placements : %d" % sum(len(v) for v in lists.values()))
    print("ability-catalog entries: %d" % len(abilities))
    print("reconciled mechanics   : %d" % len(reconciled))
    print("tier conflicts         : %d" % len(conflicts))
    for _, label, c, lt, dt in conflicts:
        print("   %-46s %s  list=%s  catalog=%s" % (label[:46], c, lt, dt))
    print("audit notes            : %d" % len(audit))
    print("wrote 4 files to %s" % args.out)


if __name__ == "__main__":
    main()
