# Selected supplemental card examples

This optional presentation transport adds locally selected card examples to
supplemental mechanic records only. It does not change the frozen 2021 catalog,
its placements, its examples, or any supplemental source/scope record.

`tools/build_supplement_examples.mjs --check` binds the runtime transport to
the retained minimal source snapshot and to the current supplemental payload and
scope records. The importer performs no live lookup: its only import inputs are
the authorized local selection JSON and Scryfall cache.

The retained source snapshot has 373 review rows. The runtime has 358 selected
supplemental examples: Rules-backed 265, Official ability words 57,
Card-specific labels 15, Digital / Alchemy 8, Special-format and Un-set 10,
Official previews 2, and Playtest 1. Designer-only has no added card.

Thirteen supplemental records already display named-card evidence and remain
without a new Example: Actualize, Affinitycycling, Covercast, Eminence,
Hellbent, Join forces, Jump, Kinfall, Landship, Parade!, Tempting offer,
Threshold, and Underdog. The lone selected 2021 record (Pemmin's Aura) is also
excluded, preserving the entire 2021 presentation.

For a double-faced selected card, an exact mechanic-name match in face Oracle
text chooses the first qualifying cached face. The source snapshot records the
chosen face, card identity, Oracle text, selection query, timestamp, and review
disposition. No fuzzy face or card-name matching occurs.

At runtime the transport is optional. If it is missing, malformed, or bound to
a different supplement, all supplemental browse/search/scope/evidence behavior
remains available; only these card plates are withheld and the header says so.
