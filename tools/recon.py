#!/usr/bin/env python3
"""
Data recon over the frozen runtime. Reports only; changes nothing.

    python tools/recon.py --data data/ --html vox-color/color-wheel.html

Answers "what is actually in here, and what is worth putting on screen".
Identity names are READ FROM THE REGISTRY in the app, not retyped here, so
this cannot drift from what the atlas shows.
"""

import argparse
import io
import json
import pathlib
import re
from collections import Counter, defaultdict

import selection as S

ORDER = "WUBRG"
NAMES = {"W": "White", "U": "Blue", "B": "Black", "R": "Red", "G": "Green"}


def registry(html_path):
    """
    [(display, name, group)] straight out of the app's IDENTITIES/ALIASES.

    Scans each object forward rather than assuming the three fields are
    adjacent: shards and wedges carry `attribute`, four-colour entries carry
    `aka` and `commander`, and an adjacent-only pattern silently dropped all
    fifteen trios and all five four-colour identities -- the exact records this
    recon exists to report.
    """
    s = io.open(html_path, encoding="utf-8").read()
    out, seen = [], set()
    for m in re.finditer(r"display:'([WUBRG]*)'", s):
        chunk = s[m.start(): m.start() + 700]
        nm = re.search(r"name:'([^']+)'", chunk)
        gp = re.search(r"group:'([a-z]+)'", chunk)
        if not nm or not gp:
            continue
        key = (m.group(1), nm.group(1))
        if key in seen:
            continue
        seen.add(key)
        out.append((m.group(1), nm.group(1), gp.group(1)))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    ap.add_argument("--html", type=pathlib.Path,
                    default=pathlib.Path("vox-color/color-wheel.html"))
    args = ap.parse_args()

    rt = json.loads((args.data / "mechanical-color-pie.runtime.json")
                    .read_text(encoding="utf-8"))
    M = rt["byMechanic"]
    ids = registry(args.html)

    L = []
    def p(s=""):
        L.append(s)
        print(s)

    # ---------------- totals ------------------------------------------------
    placements = sum(len(e["colors"]) for e in M.values())
    tier_total = Counter(d["tier"] for e in M.values() for d in e["colors"].values())
    p("# Mechanical Color Pie 2021 — data recon\n")
    p("Snapshot dated October 18, 2021. Counts are descriptive, never scores.\n")
    p("## Totals\n")
    p("| | |")
    p("|---|---|")
    p("| peer mechanics | %d |" % len(M))
    p("| colour placements (mechanic x colour) | %d |" % placements)
    p("| primary placements | %d |" % tier_total["primary"])
    p("| secondary placements | %d |" % tier_total["secondary"])
    p("| tertiary placements | %d |" % tier_total["tertiary"])
    p("| Vox families | %d |" % len(rt["byFamily"]))
    p("| mechanics carrying a restriction | %d |" % sum(1 for e in M.values() if e["has_restriction"]))
    p("| mechanics carrying an adjudicated conflict | %d |" %
      sum(1 for e in M.values() if any("conflict" in c for c in e["colors"].values())))
    p("| mechanics carrying source aliases | %d |" % sum(1 for e in M.values() if e["source_aliases"]))
    p("")

    # ---------------- how many colours per mechanic -------------------------
    spread = Counter(len(e["colors"]) for e in M.values())
    p("## How widely shared is a mechanic\n")
    p("| colours with access | mechanics | share |")
    p("|---|---|---|")
    for n in range(1, 6):
        p("| %d | %d | %.0f%% |" % (n, spread[n], 100.0 * spread[n] / len(M)))
    p("")
    p("Mono-colour mechanics (%d) are the sharpest identity signal in the whole "
      "dataset: only one colour may do them at all.\n" % spread[1])

    # ---------------- per colour -------------------------------------------
    p("## Per colour\n")
    p("| colour | primary | secondary | tertiary | total | exclusive |")
    p("|---|---|---|---|---|---|")
    excl = defaultdict(list)
    for k, e in M.items():
        if len(e["colors"]) == 1:
            excl[list(e["colors"])[0]].append(k)
    for c in ORDER:
        bc = rt["byColor"][c]
        tot = len(bc["primary"]) + len(bc["secondary"]) + len(bc["tertiary"])
        p("| %s | %d | %d | %d | **%d** | %d |" %
          (NAMES[c], len(bc["primary"]), len(bc["secondary"]), len(bc["tertiary"]),
           tot, len(excl[c])))
    p("")
    for c in ORDER:
        if excl[c]:
            p("**%s only (%d):** %s" %
              (NAMES[c], len(excl[c]), ", ".join(M[k]["label"] for k in sorted(excl[c])[:8])
               + (" …" if len(excl[c]) > 8 else "")))
    p("")

    # ---------------- every identity ---------------------------------------
    p("## Every identity\n")
    p("Reach = mechanics at least one selected colour can do. Shared core = every "
      "selected colour is primary.\n")
    p("| identity | colours | reach | of 216 | shared core | shared access | complementary | unavailable |")
    p("|---|---|---|---|---|---|---|---|")
    rows = []
    for disp, name, grp in ids:
        if not disp:
            rows.append((name, "—", 0, 0, 0, 0, 0, len(M), grp))
            continue
        sec = S.sections(rt, set(disp))
        reach = len(M) - len(sec["unavailable"])
        rows.append((name, disp, reach, 100.0 * reach / len(M),
                     len(sec["shared_primary"]), len(sec["shared_access"]),
                     len(sec["complementary"]), len(sec["unavailable"]), grp))
    for r in sorted(rows, key=lambda r: (len(r[1]) if r[1] != "—" else 0, -r[2])):
        p("| %s | %s | **%d** | %.0f%% | %d | %d | %d | %d |" %
          (r[0], " ".join(r[1]) if r[1] != "—" else "—", r[2], r[3], r[4], r[5], r[6], r[7]))
    p("")

    # ---------------- families ---------------------------------------------
    p("## Families, and which colour owns each\n")
    p("| family | mechanics | W | U | B | R | G | most primary |")
    p("|---|---|---|---|---|---|---|---|")
    for f, keys in sorted(rt["byFamily"].items(), key=lambda kv: -len(kv[1])):
        prim = Counter()
        any_c = Counter()
        for k in keys:
            for c, d in M[k]["colors"].items():
                any_c[c] += 1
                if d["tier"] == "primary":
                    prim[c] += 1
        top = prim.most_common(1)
        p("| %s | %d | %d | %d | %d | %d | %d | %s |" %
          (f, len(keys), any_c["W"], any_c["U"], any_c["B"], any_c["R"], any_c["G"],
           ("%s (%d)" % (NAMES[top[0][0]], top[0][1])) if top else "—"))
    p("")

    # ---------------- what each absence costs -------------------------------
    p("## What each colour's absence costs (four-colour view)\n")
    p("| excluded | lost completely | best access degraded | retained, lost an owner | family hit hardest |")
    p("|---|---|---|---|---|")
    for c in ORDER:
        v = S.four_color_view(rt, "".join(x for x in ORDER if x != c))
        fam = v["families_most_affected"]
        p("| %s | **%d** | %d | %d | %s |" %
          (NAMES[c], len(v["completely_lost"]), len(v["best_access_worse"]),
           len(v["retained_but_lost_owner"]),
           ("%s (%d)" % (fam[0][0], fam[0][1])) if fam else "—"))
    p("")

    # ---------------- extremes ---------------------------------------------
    p("## Notable\n")
    w = S.wubrg_summary(rt)
    p("- **%d of %d** mechanics have at least one primary colour; **%d does not** "
      "— `%s`, secondary in all five." %
      (w["with_primary_owner"], w["reachable"], w["no_primary_owner_anywhere"],
       M[w["no_primary_examples"][0]]["label"]))
    allfive = [k for k, e in M.items() if len(e["colors"]) == 5]
    p("- **%d mechanics are available to all five colours** — the shared floor of "
      "the pie." % len(allfive))
    tert = [k for k, e in M.items() if e["colors"] and
            all(d["tier"] == "tertiary" for d in e["colors"].values())]
    p("- **%d mechanics are tertiary everywhere they appear.** Occasional, not weak."
      % len(tert))
    p("- Colorless has **no entries at all**: the Mechanical Color Pie is a "
      "*colour* document, so the colorless identity is empty here by definition, "
      "not by omission.")
    p("")

    (args.data / "recon.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    print("\nwrote %s" % (args.data / "recon.md"))


if __name__ == "__main__":
    main()
