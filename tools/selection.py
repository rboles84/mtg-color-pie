#!/usr/bin/env python3
"""
Selection maths over the runtime projection. Executable, not prose.

Two rules do the heavy lifting, and both exist to stop the projection lying.

BEST ACCESS DOES NOT REPLACE OWNERSHIP. For a selection, a mechanic's best
available tier is the strongest tier any selected colour has. That answers
"can this deck do it, and how centrally". It is NOT a summary of who does it,
so per-colour ownership is carried alongside, always. White tertiary plus Blue
primary is "best access primary via Blue, and White also has tertiary access"
-- never just "primary".

GAINING AN OWNER IS NOT NOTHING. Adding a colour to a selection that already
has primary access cannot improve the best tier, but it can add a second
colour that legitimately performs the mechanic. That is real information about
the combination and it must not vanish because a maximum did not move.

NO SCORE. Nothing here sums, ranks or weights tiers. Counts are counts.
"""

TIERS = ("primary", "secondary", "tertiary")
RANK = {"primary": 3, "secondary": 2, "tertiary": 1}


def access(entry, colors):
    """-> (best_tier or None, {colour: tier} for the selected colours only)"""
    owned = {c: d["tier"] for c, d in entry["colors"].items() if c in colors}
    if not owned:
        return None, {}
    best = max(owned.values(), key=lambda t: RANK[t])
    return best, owned


def sections(runtime, colors):
    """
    Membership is mutually exclusive across the first four. `conditional` is
    deliberately an OVERLAPPING flag rather than a fifth bucket: a mechanic can
    be shared-primary AND carry a restriction worth surfacing, and forcing a
    choice between those two facts would hide one of them.
    """
    out = {"shared_primary": [], "shared_access": [], "complementary": [],
           "unavailable": [], "conditional": []}
    for k, e in runtime["byMechanic"].items():
        best, owned = access(e, colors)
        if best is None:
            out["unavailable"].append(k)
            continue
        if len(owned) == len(colors):
            if all(t == "primary" for t in owned.values()):
                out["shared_primary"].append(k)
            else:
                out["shared_access"].append(k)
        else:
            out["complementary"].append(k)
        if e.get("has_restriction"):
            out["conditional"].append(k)
    return {k: sorted(v) for k, v in out.items()}


def delta_add(runtime, colors, added):
    """S -> S + added."""
    before, after = set(colors), set(colors) | {added}
    out = {"newly_reachable": [], "best_tier_improved": [],
           "new_owner_no_improvement": [], "unchanged": [], "still_unavailable": []}
    for k, e in runtime["byMechanic"].items():
        b0, o0 = access(e, before)
        b1, o1 = access(e, after)
        if b1 is None:
            out["still_unavailable"].append(k)
        elif b0 is None:
            out["newly_reachable"].append(k)
        elif RANK[b1] > RANK[b0]:
            out["best_tier_improved"].append(k)
        elif len(o1) > len(o0):
            # the maximum did not move, but the combination gained a colour
            # that can genuinely do this. Not nothing.
            out["new_owner_no_improvement"].append(k)
        else:
            out["unchanged"].append(k)
    return {k: sorted(v) for k, v in out.items()}


def delta_remove(runtime, colors, removed):
    """S -> S - removed."""
    before, after = set(colors), set(colors) - {removed}
    out = {"lost_completely": [], "tier_degraded": [],
           "lost_owner_retained_access": [], "unchanged": []}
    for k, e in runtime["byMechanic"].items():
        b0, o0 = access(e, before)
        b1, o1 = access(e, after)
        if b0 is None:
            continue
        if b1 is None:
            out["lost_completely"].append(k)
        elif RANK[b1] < RANK[b0]:
            out["tier_degraded"].append(k)
        elif len(o1) < len(o0):
            out["lost_owner_retained_access"].append(k)
        else:
            out["unchanged"].append(k)
    return {k: sorted(v) for k, v in out.items()}


def four_color_view(runtime, colors):
    """
    Framed as what the EXCLUDED colour costs, measured against all five --
    arithmetic instead of inventing a philosophy for the absence.
    """
    excluded = sorted(set("WUBRG") - set(colors))
    assert len(excluded) == 1, "four_color_view expects exactly one excluded colour"
    ex = excluded[0]
    d = delta_remove(runtime, "WUBRG", ex)
    fam = {}
    for k in d["lost_completely"] + d["tier_degraded"]:
        f = runtime["byMechanic"][k].get("family")
        if f:
            fam[f] = fam.get(f, 0) + 1
    return {
        "excluded": ex,
        "completely_lost": d["lost_completely"],
        "best_access_worse": d["tier_degraded"],
        "retained_but_lost_owner": d["lost_owner_retained_access"],
        "families_most_affected": sorted(fam.items(), key=lambda kv: (-kv[1], kv[0])),
    }


def wubrg_summary(runtime):
    """
    NOT "all 216". Access is not ownership, and Fixture 9 exists because the
    article contains a mechanic with no primary colour anywhere.
    """
    total = with_primary = only_below = 0
    no_primary = []
    for k, e in runtime["byMechanic"].items():
        tiers = {d["tier"] for d in e["colors"].values()}
        if not tiers:
            continue
        total += 1
        if "primary" in tiers:
            with_primary += 1
        else:
            only_below += 1
            no_primary.append(k)
    return {
        "statement": "All %d coloured mechanical identities are reachable, but "
                     "ownership remains uneven." % total,
        "reachable": total,
        "with_primary_owner": with_primary,
        "no_primary_owner_anywhere": only_below,
        "no_primary_examples": sorted(no_primary),
    }
