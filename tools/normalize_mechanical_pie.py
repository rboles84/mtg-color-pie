#!/usr/bin/env python3
"""
Normalise the Mechanical Color Pie 2021 source digest into a dataset.

    python tools/normalize_mechanical_pie.py \
        ../voxmana.io/docs/research/mono_upgrade/20_mechanical_color_pie_2021.md \
        --out data/

WHAT THIS DOES AND DOES NOT DO
------------------------------
Parsing the digest is mechanical and safe: the file is `### <Colour>` headings
followed by `**Primary:** a; b; c.` lines, semicolon-separated.

Splitting the entries is NOT safe, and this script deliberately refuses to do
it silently. A slash means at least three different things in this file:

    +N/+N, +N/+0, -N/-0, P/T        power/toughness notation. ONE token.
                                    Splitting it invents two mechanics that
                                    do not exist.
    friendly to creatures/lands     a real bundle. Two sections of the pie.
    card draw (..., usually         a qualifier inside parentheses. Whether
    life/sacrifice)                 that is one mechanic or several is a
                                    judgement call, not a parse.

So: every entry is emitted whole and unmodified. Entries whose slashes look
like a genuine bundle are additionally written to a REVIEW file with a
PROPOSED expansion for a human to accept, reject or correct. Nothing in the
dataset is ever silently derived from a guess.

The script also reports defects it can prove -- chiefly the same label
appearing at two different tiers for one colour, which cannot both be true.

OUTPUTS
    mechanical_pie_2021.json   colour -> tier -> [entries], verbatim
    mechanical_pie_review.md   the split queue and the defect report
"""

import argparse
import json
import pathlib
import re
import sys
from collections import defaultdict

TIERS = ("Primary", "Secondary", "Tertiary")
COLORS = ("White", "Blue", "Black", "Red", "Green")

# Power/toughness notation: +N/+N, -N/-0, +0/+N, +2/+2 ... and the bare P/T.
# These are single tokens. Masked before any bundle detection so that the
# bundle detector can never see their slash.
PT = re.compile(r"[+-](?:N|\d+)/[+-](?:N|\d+)|(?<![A-Za-z])P/T(?![A-Za-z])")

# A slashed run of words, e.g. "artifacts/enchantments/legendaries" or
# "attacking/blocking". Allows hyphens and apostrophes inside a word so
# "can't-lose/opponents-can't-win" and "low-MV" survive intact.
RUN = re.compile(r"[A-Za-z][A-Za-z'’-]*(?:/[A-Za-z][A-Za-z'’-]*)+")

HEADING = re.compile(r"^###\s+(.+?)\s*$")
TIERLINE = re.compile(r"^\*\*(" + "|".join(TIERS) + r"):\*\*\s*(.+?)\s*$")


def mask(text, pattern, store, tag):
    """
    Replace each match with a placeholder, remembering it for restore().

    `tag` namespaces the placeholder. Both stores number from zero, so without
    it the paren restore happily consumes a P/T placeholder's index and either
    corrupts the entry or runs off the end of the list.
    """
    def sub(m):
        store.append(m.group(0))
        return "\x00%s%d\x00" % (tag, len(store) - 1)
    return pattern.sub(sub, text)


def restore(text, store, tag):
    return re.sub(r"\x00" + tag + r"(\d+)\x00",
                  lambda m: store[int(m.group(1))], text)


def parse(md_text):
    """-> {colour: {tier: [raw entry, ...]}}. Entries are verbatim."""
    data = {}
    color = None
    for line in md_text.splitlines():
        h = HEADING.match(line)
        if h:
            color = h.group(1) if h.group(1) in COLORS else None
            if color:
                data.setdefault(color, {})
            continue
        if not color:
            continue
        t = TIERLINE.match(line)
        if not t:
            continue
        tier, body = t.group(1), t.group(2).rstrip(".")
        entries = [e.strip() for e in body.split(";")]
        data[color][tier] = [e for e in entries if e]
    return data


def classify(entry):
    """
    -> (kind, proposal)

    kind is one of:
      atomic       no slash outside P/T notation. Nothing to decide.
      pt-only      slashes are all power/toughness notation. Do NOT split.
      paren-only   slashes appear only inside parentheses. Judgement call.
      bundle       a slashed run in the body. Proposed expansion supplied.
    """
    pt_store = []
    masked = mask(entry, PT, pt_store, "T")

    paren_store = []
    outside = mask(masked, re.compile(r"\([^()]*\)"), paren_store, "P")

    runs = RUN.findall(outside)
    if runs:
        # Expand the FIRST slashed run only. Entries with two independent runs
        # are rare and genuinely need a human; the review file flags them.
        run = max(runs, key=len)
        parts = run.split("/")
        proposal = [
            restore(restore(outside.replace(run, p, 1), paren_store, "P"), pt_store, "T")
            for p in parts]
        multi = len(runs) > 1
        return ("bundle", {"run": run, "parts": parts,
                           "proposed": proposal, "multiple_runs": multi})

    if any("/" in p for p in paren_store):
        return ("paren-only", None)
    if pt_store:
        return ("pt-only", None)
    return ("atomic", None)


def norm(label):
    """Loose key for duplicate detection: case, spacing and trailing stop."""
    return re.sub(r"\s+", " ", label.strip().rstrip(".")).lower()


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source", type=pathlib.Path,
                    help="path to 20_mechanical_color_pie_2021.md")
    ap.add_argument("--out", type=pathlib.Path, default=pathlib.Path("data"),
                    help="output directory (default: data/)")
    args = ap.parse_args()

    if not args.source.is_file():
        sys.exit("source not found: %s\n"
                 "The corpus lives in the sibling voxmana.io repo. If it is not\n"
                 "available, this task is BLOCKED, not passed." % args.source)

    data = parse(args.source.read_text(encoding="utf-8"))

    missing = [c for c in COLORS if c not in data]
    if missing:
        sys.exit("no entries parsed for: %s" % ", ".join(missing))

    # ---- inventory ---------------------------------------------------------
    total = sum(len(v) for tiers in data.values() for v in tiers.values())
    kinds = defaultdict(list)
    for color in COLORS:
        for tier in TIERS:
            for entry in data[color].get(tier, []):
                kind, proposal = classify(entry)
                kinds[kind].append((color, tier, entry, proposal))

    distinct = {norm(e) for tiers in data.values()
                for v in tiers.values() for e in v}

    # ---- provable defect: one label at two tiers of the same colour --------
    conflicts = []
    for color in COLORS:
        seen = defaultdict(list)
        for tier in TIERS:
            for entry in data[color].get(tier, []):
                seen[norm(entry)].append(tier)
        for label, tiers in sorted(seen.items()):
            if len(tiers) > 1:
                conflicts.append((color, label, tiers))

    args.out.mkdir(parents=True, exist_ok=True)

    payload = {
        "source": "Mark Rosewater, \"Mechanical Color Pie 2021,\" "
                  "Making Magic, October 18, 2021",
        "url": "https://magic.wizards.com/en/news/making-magic/mechanical-color-pie-2021",
        "snapshot_date": "2021-10-18",
        "caution": "Rosewater describes this as a snapshot that will continue to "
                   "evolve. Bind every claim to the date; later sets can override.",
        "entries_are": "verbatim from the digest, never split by this script",
        "colors": {c: {t: data[c].get(t, []) for t in TIERS} for c in COLORS},
    }
    (args.out / "mechanical_pie_2021.json").write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # ---- review file -------------------------------------------------------
    L = []
    L.append("# Mechanical Color Pie 2021 — normalisation review\n")
    L.append("Generated by `tools/normalize_mechanical_pie.py`. "
             "Nothing here has been applied.\n")
    L.append("## Inventory\n")
    L.append("| | count |")
    L.append("|---|---|")
    L.append("| entries parsed | %d |" % total)
    L.append("| distinct labels | %d |" % len(distinct))
    for k in ("atomic", "pt-only", "paren-only", "bundle"):
        L.append("| %s | %d |" % (k, len(kinds[k])))
    L.append("")

    L.append("## Provable defects\n")
    if conflicts:
        L.append("A label cannot be at two tiers for one colour. Each of these "
                 "must be resolved against the article, not by choosing.\n")
        for color, label, tiers in conflicts:
            L.append("- **%s** — `%s` listed at %s" %
                     (color, label, " AND ".join(tiers)))
    else:
        L.append("None found.")
    L.append("")

    L.append("## Do NOT split — power/toughness notation\n")
    L.append("The slash is part of the token. Listed so a later pass does not "
             "re-open them.\n")
    for color, tier, entry, _ in kinds["pt-only"]:
        L.append("- %s / %s — `%s`" % (color, tier, entry))
    L.append("")

    L.append("## Split queue — needs a ruling\n")
    L.append("Proposed expansion shown. Accept, reject, or correct each one.\n")
    for color, tier, entry, p in kinds["bundle"]:
        flag = "  **(more than one slashed run — check carefully)**" if p["multiple_runs"] else ""
        L.append("- %s / %s — `%s`%s" % (color, tier, entry, flag))
        L.append("  - splits `%s` into %d:" % (p["run"], len(p["parts"])))
        for prop in p["proposed"]:
            L.append("    - `%s`" % prop)
    L.append("")

    L.append("## Qualifier inside parentheses — judgement call\n")
    L.append("The slash is inside `(...)`. Usually a scope note rather than "
             "several mechanics, but decide per entry.\n")
    for color, tier, entry, _ in kinds["paren-only"]:
        L.append("- %s / %s — `%s`" % (color, tier, entry))
    L.append("")

    (args.out / "mechanical_pie_review.md").write_text("\n".join(L) + "\n",
                                                       encoding="utf-8")

    print("parsed        %d entries, %d distinct labels" % (total, len(distinct)))
    for k in ("atomic", "pt-only", "paren-only", "bundle"):
        print("  %-11s %d" % (k, len(kinds[k])))
    print("defects       %d label(s) at two tiers of one colour" % len(conflicts))
    for color, label, tiers in conflicts:
        print("                %s: %s at %s" % (color, label, " AND ".join(tiers)))
    print("wrote         %s" % (args.out / "mechanical_pie_2021.json"))
    print("wrote         %s" % (args.out / "mechanical_pie_review.md"))
    print("\nNothing was split. The split queue needs a human ruling.")


if __name__ == "__main__":
    main()
