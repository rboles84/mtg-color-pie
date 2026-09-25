#!/usr/bin/env python3
"""
Reproduces the overview object shown in
docs/research/mechanics-visualization-architecture-reset.md section 3.5.

    python tools/research_board.py --data data/

READ-ONLY, and research-only. It renders the ALREADY-FROZEN family x colour
matrix from data/recon/matrices.json so the architecture argument in the reset
document can be re-derived rather than taken on trust. It computes nothing new,
writes nothing, and is not part of any gate chain.
"""

import argparse
import io
import json
import pathlib

ORDER = "WUBRG"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    a = ap.parse_args()
    m = json.load(io.open(a.data / "recon" / "matrices.json", encoding="utf-8"))
    fb, fs = m["family_by_color"], m["family_by_selection"]

    rows = sorted(fb.items(),
                  key=lambda t: -sum(v["total_reachable"] for v in t[1].values()))
    print("FAMILY x COLOUR   cell = mechanics reachable; '.' = colour cannot reach it")
    print("%-24s %5s %5s %5s %5s %5s   %s"
          % ("family", *ORDER, "size"))
    for name, cols in rows:
        size = max(fs[name][c]["reachable"] + fs[name][c]["unavailable"] for c in ORDER)
        cells = "".join("%5s " % (cols[c]["total_reachable"] or ".") for c in ORDER)
        print("%-24s %s  %3d" % (name.replace("_", " "), cells, size))

    # The behaviour no node-link layout can produce: absence in a fixed slot.
    print("\nWUBRG -> WUBR   families whose reach drops when Green is absent")
    for name in fb:
        hi, lo = fs[name]["WUBRG"]["reachable"], fs[name]["WUBR"]["reachable"]
        if hi != lo:
            print("  %-24s %2d -> %2d   (-%d)" % (name.replace("_", " "), hi, lo, hi - lo))


if __name__ == "__main__":
    main()
