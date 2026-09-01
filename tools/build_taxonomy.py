#!/usr/bin/env python3
"""
Build the Vox family taxonomy over all peer mechanics.

    python tools/build_taxonomy.py --data data/

The RULES are the reviewable artefact, not 216 individual opinions. Each rule
states a pattern, the family it assigns, and why. Reading the rule list tells
you the whole classification; reading 216 hand-written rows would not.

HARD CONSTRAINT: there is no miscellaneous family and none may be added. If
mechanics do not fit, the tool reports them and exits non-zero so the TAXONOMY
gets reviewed -- never the source layer, and never by inventing a junk drawer
to reach 100%.

Primary family: first matching rule wins, so order is meaningful.
Secondary families: every matching secondary rule applies.
"""

import argparse
import json
import pathlib
import re
import sys

from gate import require_source_gate

FAMILIES = {
    "removal": "answering a permanent already on the battlefield",
    "card_flow": "drawing, filtering, looting, scrying - moving cards through hand and library",
    "tutoring": "searching the library for a named or typed card",
    "mana": "producing, fixing, ramping or untapping mana sources",
    "graveyard": "using the graveyard as a resource, or denying it",
    "tokens": "creating creatures or artifacts from nothing",
    "counters": "placing, growing or removing counters",
    "combat": "how creatures fight once they are on the battlefield",
    "evasion": "making a creature hard or impossible to block",
    "protection": "keeping your own things alive, untargetable or uncounterable",
    "disruption": "attacking the opponent's hand, library or resources",
    "control": "stopping things before or as they happen",
    "copying": "duplicating a permanent or a spell",
    "theft": "taking control of something the opponent owns",
    "sacrifice": "converting your own resources - permanents, cards, life - into another",
    "life": "life total as a resource - gaining, draining, paying",
    "tempo": "buying or stealing time - bouncing, untapping, extra turns",
    "rules_alteration": "changing how the game itself works",
    "card_type_affinity": "caring that a particular card type is present",
    "stat_modification": "changing a creature's printed power or toughness",
    "cheat_into_play": "putting cards onto the battlefield without paying their cost",
    "characteristic_change": "changing what something IS - its colour, its types, or "
                             "the words printed on it, as distinct from its size",
    "win_condition": "altering how the game is won or lost",
}

# (regex, family, why). ORDER MATTERS: first match wins the primary slot.
PRIMARY = [
    (r"can't (win|lose) the game|you don't lose|opponents can't (win|lose)",
     "win_condition", "directly rewrites winning or losing"),
    (r"^rules setting|preventing actions|meddling",
     "rules_alteration", "changes how the game itself works"),
    (r"color changing|changing lands|word changing|transformation|animating",
     "characteristic_change", "changes what something is rather than how big it is"),
    (r"^counterspell|counter target activated|^lobotomy",
     "control", "stops a spell or ability as it happens"),
    (r"taxing", "control", "makes the opponent pay to act"),
    (r"^stealing permanents|gain control of target player's turn",
     "theft", "takes something the opponent owns"),
    (r"^cop(y|ying)|spell copying", "copying", "duplicates a permanent or spell"),
    (r"^tutor|tutoring", "tutoring", "searches the library"),
    (r"reanimat|restocking|from graveyard to hand|cast spells (from|out of)|"
     r"exiling cards from graveyard|lhurgoyf|bring back",
     "graveyard", "uses the graveyard as a resource"),
    (r"^milling|discard as effect|specter|lobotomy|looking at opponent's hand|"
     r"punisher|torment|wheeling|rummaging",
     "disruption", "attacks the opponent's hand, library or choices"),
    (r"destroy|banisher priest|pacifism|planeswalker destruction|land destruction|"
     r"^polymorph|random destruction",
     "removal", "answers something already on the battlefield"),
    (r"destruction$|^artifact destruction|^enchantment destruction",
     "removal", "destroys a permanent type"),
    (r"forced sacrifice|sacrifice a[n]? \w+\. \(target",
     "removal", "forces the opponent to sacrifice, which answers a threat"),
    (r"creature sacrifice, forced, repeatable",
     "removal", "repeatedly forces the opponent to sacrifice"),
    (r"^sacrifice|devil's deal|discard as a cost",
     "sacrifice", "converts your own resources into another"),
    (r"^card draw|card filtering|looting|impulsive draw|^scry|playing cards off the top|"
     r"curiosity|enchantress|maro",
     "card_flow", "moves cards through hand and library"),
    (r"mana production|untapping lands|basic land counting|treasure creation|"
     r"play extra lands|putting lands from hand",
     "mana", "produces, counts or untaps mana sources"),
    (r"putting .* from hand onto the battlefield",
     "cheat_into_play", "puts a card onto the battlefield without paying its cost"),
    (r"token generation", "tokens", "creates permanents from nothing"),
    (r"counter \(creation and caring\)|removing counters|increasing counters|"
     r"moving enchantments|variable creature",
     "counters", "places, grows, moves or removes counters"),
    (r"^[+-][0-9n]+/[+-]|^creature pumping|switch power|super trample|"
     r"warlord|daunt|gaseous form",
     "stat_modification", "changes printed power or toughness"),
    (r"flying|menace|can't be blocked|stalking|trample|reach|lure|forced block|"
     r"panic|can't block|must attack|forced attack",
     "evasion", "governs whether a creature can be blocked, or must attack or block"),
    (r"protection|hexproof|indestructible|ward|can't be countered|illusion ability|"
     r"can't be attacked|fog|damage prevention|damage redirection",
     "protection", "keeps your own things alive or untargetable"),
    (r"life gain|lifelink|drain life|life loss|sengir",
     "life", "uses the life total as a resource"),
    (r"^flash|^flicker", "tempo",
     "acts at a moment the opponent cannot answer, or resets a permanent"),
    (r"return to hand|return to library|^twiddle|freeze|lockdown|tapping creatures|"
     r"untapping creatures|untaps itself|time walk|manipulate time|extra attack",
     "tempo", "buys or steals time"),
    (r"deal|damage|fight|bite|first strike|double strike|deathtouch|haste|vigilance|"
     r"defender|rewards for death|spell redirection",
     "combat", "how creatures and burn interact in and around combat"),
    (r"friendly to|instant and/or sorcery triggers|prowess",
     "card_type_affinity", "cares that a card type is present"),
]

# (regex, family, why). ALL matching secondary rules apply.
SECONDARY = [
    (r"milling", "graveyard", "mill also fuels a graveyard"),
    (r"^stealing permanents", "removal", "taking a threat also answers it"),
    (r"^sacrifice a creature and deal damage", "removal", "a sacrifice outlet that also kills"),
    (r"land destruction", "disruption", "denies the opponent resources"),
    (r"^polymorph", "card_flow", "digs the library for the replacement"),
    (r"lifelink|drain life", "combat", "life gain tied to dealing damage"),
    (r"haste|first strike|double strike|deathtouch|trample", "combat", "combat-relevant"),
    (r"flying|menace|reach", "combat", "shapes how combat resolves"),
    (r"untapping lands", "tempo", "untapping is also a tempo effect"),
    (r"counter \(creation and caring\)", "combat", "counters usually grow attackers"),
    (r"treasure creation", "tokens", "Treasure is an artifact token"),
    (r"cast spells (from|out of)", "card_flow", "recursion is card advantage"),
    (r"tutoring|^tutor", "card_flow", "selection feeds the hand"),
    (r"^flicker", "protection", "blinking also saves a creature from removal"),
    (r"^creature pumping", "combat", "team pumps are fought with in combat"),
    (r"discard as a cost", "disruption", "self-discard can also fuel graveyard plans"),
]


def classify(label, rules):
    for pat, fam, why in rules:
        if re.search(pat, label, re.I):
            return fam, why
    return None, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    ap.add_argument("--out", default="vox.families.json")
    args = ap.parse_args()

    require_source_gate(args.data)

    rec = json.loads((args.data / "mcp2021.reconciled.json").read_text(encoding="utf-8"))
    peers = {k: v for k, v in rec["mechanics"].items() if not v.get("structural_only")}

    rows, unmatched = [], []
    for k in sorted(peers):
        fam, why = classify(k, PRIMARY)
        if not fam:
            unmatched.append(k)
            continue
        sec = []
        for pat, f, _ in SECONDARY:
            if f != fam and f not in sec and re.search(pat, k, re.I):
                sec.append(f)
        rows.append({"key": k, "primary": fam, "secondary": sec, "rule": why})

    used = {r["primary"] for r in rows} | {f for r in rows for f in r["secondary"]}
    payload = {
        "source_class": "vox_mana_derived",
        "status": "generated by tools/build_taxonomy.py from explicit rules",
        "note": "A SECOND INDEX over the mechanics. Nothing here alters, renames or "
                "reinterprets Rosewater's mechanic, tier or explanation. Families are "
                "Vox Mana navigation vocabulary and must be labelled as such wherever "
                "shown. There is deliberately no miscellaneous family.",
        "rules": {
            "primary_family": "exactly one; first matching rule wins",
            "secondary_families": "zero or more; all matching rules apply",
            "never": "a family may not become a mechanic's canonical identity, and may "
                     "not feed backward into tier, colour or label",
        },
        "families": {k: v for k, v in FAMILIES.items() if k in used},
        "assignments": rows,
    }
    (args.data / args.out).write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    from collections import Counter
    dist = Counter(r["primary"] for r in rows)
    print("peer mechanics      : %d" % len(peers))
    print("classified          : %d" % len(rows))
    print("families used       : %d of %d declared" % (len(used), len(FAMILIES)))
    print("unclassified        : %d" % len(unmatched))
    print()
    for f, n in dist.most_common():
        print("  %-20s %3d" % (f, n))
    if unmatched:
        print("\nUNCLASSIFIED -- review the TAXONOMY, not the source layer:")
        for u in unmatched:
            print("  %s" % u[:88])
        print("\nDo NOT add a miscellaneous family to clear these.")
        sys.exit(1)
    print("\nwrote %s" % (args.data / args.out))


if __name__ == "__main__":
    main()
