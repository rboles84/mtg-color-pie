# Story 13 ledger (parked)

> **PARKED on the backlog (Owner, 2026-10-16). Not started.** Decisions D1–D4
> were never answered. To resume, copy the ledger below back into
> `HANDOFF.md`, check the base commit, and set Status to `ready`.

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `ready` — **Story 13: "Common needs" panel for the selected colours.**
  Set up 2026-10-11; not started. Decisions D1–D4 below need the Owner's
  pick first; recommendations are marked.
- Last accepted: **Story 12** (cost glyphs centred by their outline),
  `1b2a1d2`, accepted by the Owner 2026-10-11. Ledger:
  `docs/handoff-archive/story-12.md`. Earlier: `story-11.md`, `story-10.md`,
  `story-9.md`, `story-8.md`, `story-7.md`, `story-6.md`, `story-5.md`,
  `story-4.md`, `story-3.md`, `story-2.md`, `story-1.md`, `gate-e.md`,
  `gate-d.md`, `gate-c.md`; Gates A and B are in git at `5252333` and
  `b62131b`.
- Next: Owner answers D1–D4; then robdev starts Step 1 in a fresh session.
- Owner: Vox Mana.
- Allowed files: `vox-color/mechanical-explorer.html` — `PLAYER_TERMS`
  (new terms only; existing 17 unchanged), the compass section's render code
  and CSS for a new panel under `#ident`, the one-colour step labels
  (`renderCompass` steps), and **additive** checks in `runSelfTest` (no
  existing check changed or removed); `HANDOFF.md`.
- Allowed surfaces: a new "Common needs" panel in Plate II under the
  identity panel; combination names on the one-colour steps.
- Prohibited: `data/`, the taxonomy and `vox.families.json` (families stay
  removed; the existing "no family wording" checks must keep passing),
  fixtures, recon truth; every `tools/` file; `vox-color/index.html`,
  `vox-color/color-wheel.html`, `vox-color/mechanical-examples.json`;
  `PRODUCT-DEFINITION.md`; the compass tiles' visible content (letters only;
  names stay in aria-label and title); the arrival and bridge code. If a
  change would alter an existing self-test expectation, stop and ask.
- Base commit: `1f49259`.
- Candidate commit:
- robqa class (see `.claude/skills/robqa/SKILL.md`): expected QA-4 (new
  navigation vocabulary over mechanics data, read-only), separate robqa for
  Step 1's mappings; panel visuals are Owner checks.

## Owner decisions

- Origin: research of 2026-10-11 (corpus, web, 8 r/EDH threads). Players
  choose colours first, then look for weaknesses ("find the colors you
  want… then a commander that can… solve a weakness"); the gaps they name
  are enchantment removal, card draw, ramp and the like. No current tool
  answers "where are my colours weak, by Rosewater, and which colour fixes
  it". Players use guild and shard names as playstyle shorthand ("as Gruul
  as Gruul gets"). Owner: no quiz, ever (2026-10-11).
- Shape agreed in conversation: no new button. When colours are selected
  (pips, compass tile, or colour words in search), a "Common needs" panel
  appears open under the identity panel, updates live, and disappears when
  the selection is cleared. Selecting a row spots exactly its entries in
  the list below (the existing spot mechanism). Plate II's existing Hide
  fold covers it.

### To decide (recommendations marked)

- **D1. Removal-style row labels.** `PLAYER_TERMS` records that category
  words ("removal", "card advantage") are deliberately absent. (a)
  *Recommended:* allow need labels such as "Enchantment removal" only where
  each maps to **exact named Rosewater entries** ("Enchantment
  destruction"), with partial effects as `related` and a `relWhy`, under the
  existing rules; no catch-all "Removal" row. (b) Keep the rule; rows use
  only the existing 17 terms (no enchantment/artifact/creature removal, no
  card draw).
- **D2. Rows.** (a) *Recommended:* about 12, fixed order. Proposed:
  creature removal, board wipe, enchantment removal, artifact removal,
  counterspell, card draw, ramp, tutor, graveyard hate, recursion, edict,
  bounce. Each must be a term players use (corpus count recorded in `seen`)
  and map to exact entries. Step 1 brings the table for Owner sign-off.
  (b) Owner edits the list.
- **D3. When to suggest a fix.** (a) *Recommended:* a row whose best
  placement in the selection is Secondary, Tertiary or none shows the
  single added colour(s) that have it as Primary, with the resulting
  combination's name ("Primary in Blue → Esper WUB"). (b) Only rows with no
  placement get a suggestion.
- **D4. Names on the one-colour steps.** (a) *Recommended:* steps read
  "WB → WUB Esper" where a verified name exists (pairs and triples only;
  colour words otherwise). Compass tiles stay letters-only. (b) No change
  to the steps.

## Acceptance criteria

Step 1 — vocabulary (separate robqa, Owner signs off the table):
1. New `PLAYER_TERMS` entries per D1/D2, each with `seen` (corpus count,
   corpus path and date), `example` record ID, `exact` and, where needed,
   `related` + `relWhy`. Existing 17 terms unchanged. The comment block is
   updated to state the D1 rule exactly.
2. A table in Implementation: need → exact entries → related entries →
   each colour's tier, for Owner sign-off before Step 2.
3. Existing term checks pass for the new terms (real entries, exact vs
   related never mixed, related rank after exact).

Step 2 — panel:
4. Selecting colours by any route shows the panel; clearing hides it. It is
   headed by the combination name (if verified) and colour words, like the
   identity panel.
5. Each row: need label, best placement among the selected colours as a
   **category** (existing tier markers and words; no bar, meter, size or
   number for tier), and which selected colour gives it. Fixed order.
6. Fix suggestions per D3 name the added colour and the resulting
   combination (name when verified, else colour words), with its code.
7. A row with no placement repeats the page's rule: absence in the 2021
   placements is not evidence that no card of those colours does it. The
   panel never says a colour "can't".
8. No total, score, percentage or "N of 12" anywhere in the panel. No
   explanation text (one owner of detail: the entry). Need labels are
   marked as Vox Mana's terms, placements as Rosewater's.
9. Selecting a row (mouse and keyboard) spots exactly its exact entries;
   related entries are not included and are not counted.
10. Steps per D4.
11. Self-check: all existing checks pass at 1440×900; new additive checks
    cover 4–9. Console clean. Works at 390px width with no horizontal
    scroll.

## Implementation

## QA

## Decisions needed

D1–D4 above.

## Follow-ups

Open items carried forward. Detail lives in the archived ledgers.

### From Story 6

- **`sfGet` pacing.** It waits 110 ms between calls, while Scryfall's
  `/cards/named` allows 2 per second. Not fixed (out of scope).
- **Browser pane at 0×0.** In a hidden pane the self-check reports 83 of 84
  (the plates fold-control geometry check); at 1440×900 it is 84 of 84,
  before and after Story 6. Environmental, not a regression.

### Accepted minors

- **F4 (B13, D-O2).** Leaving the Mechanical Color Pie during its first load
  lets its self-test take focus in the off frame for about 8–12 ms. A fix
  would touch the protected self-test.
- **B12 (E-D1 A).** A bridge from the explorer into an already-loaded wheel
  costs two history entries; Back passes once through the prior wheel route.
  Step 0 of Gate E measured that it cannot be fixed within `src` and hash.

### When ready to host (Owner, 2026-10-08)

Parked until the Owner is ready to deploy; pick up as one story then.
- **Stale frames after an update.** A browser can keep serving
  a cached instrument inside the shell's frame after the file changes; the
  shell's own hard reload does not refresh it (seen in the Owner's E2 QA).
  Before hosting, version the frame URLs or set cache headers.

### Unassigned (each needs its own story)

- **Recon names vs today's wheel (Story 2, D4).** Includes the deferred
  `ALIASES` / `aka` rename (the recon tools parse those names).
  Regenerating recon against the current `color-wheel.html` drops the Nephilim and community
  names from 10 rows, puts the C16 lens "Chaos" on URG and "Orzhov" on
  Non-Red. Recon is pinned to `96ae609`'s wheel until this is resolved.
- **Article input not archived.** Only its sha256 is recorded (copyright);
  a future fetch may differ.
- **Housekeeping.**
  - **Periodic table: keep as-is (Owner, 2026-10-08).**
    `vox-color/mechanical-periodic-table.html` stays in place and unchanged,
    preserved for possible future work on its look and feel. The earlier
    idea to move it to a prototypes folder and restyle it is dropped.
    Record Three.js in `CONTEXT.md` only if it is ever taken into the
    product.
- **Example cards: done in Story 6** (`c3b33d1`); 214 of 216 entries show
  one. Entries 213 and 214 stay without one. A three-card chooser is an
  unscheduled idea.
- **Sourced flavour lines per colour (Owner, 2026-10-08).** Official sources
  only (Rosewater articles, magic.wizards.com); anything unsourced is left
  out. Backlog; needs recon and its own story.
- **"What can my colours do" panel (Owner, 2026-10-08).** Players set their
  colours in the existing Colors bar (no deck import for now). Design note
  still to write: what the panel recommends, how, and why. Category counts
  only, no scores.
- **Paused by the Owner:** the Scryfall query idea.
