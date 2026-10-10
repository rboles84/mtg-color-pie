# Active handoff

This is the single current-task ledger for `robdev`, `robqa`, and the
coordinating agent. Keep the headings and replace the field values for each
task. When Status is `idle`, the task fields are intentionally blank.

**Closing a task:** move the full ledger to `docs/handoff-archive/<gate>.md`,
reset this file to `idle`, and carry only open follow-ups forward, one line
each. Keep this file under ~200 lines.

## Control

- Status: `review` — **Story 7: classic printings for 24 examples.**
  Candidate committed 2026-10-10; awaiting Owner review.
- Last accepted: **Story 6** (stored example card on every entry),
  `c3b33d1`, accepted by the Owner 2026-10-10. Ledger:
  `docs/handoff-archive/story-6.md`. Earlier: `story-5.md`, `story-4.md`,
  `story-3.md`, `story-2.md`, `story-1.md`, `gate-e.md`, `gate-d.md`,
  `gate-c.md`; Gates A and B are in git at `5252333` and `b62131b`.
- Next: Owner review of the Story 7 candidate.
- Owner: Vox Mana.
- Allowed files: `vox-color/mechanical-examples.json`, `HANDOFF.md`
  (ledger and Follow-ups only).
- Allowed surfaces: none in code; the page reads the stored file as is.
- Prohibited: `vox-color/mechanical-explorer.html` and every other file;
  `data/`, the taxonomy; `docs/card-examples-printings.json` (read only);
  Rosewater's own cards (the 5 autocard entries and `NAMED_CARD`); every
  entry not listed below.
- Base commit: `ea6484c`.
- Candidate commit: `7f28e12`.
- robqa class (see `.claude/skills/robqa/SKILL.md`): QA-1 (data file for
  presentation only), same agent.

## Owner decisions

- Printing swaps only: same card, older English paper printing. No card
  changes. Normal frame, readable text; no Japanese or specialty frames.
- **Rosewater's own cards are excluded** (stay true to the article):
  Demonic Tutor, Time Walk, Man-o'-War, Gravedigger.
- The five `EXAMPLE_CARD` lookup cards move into the stored file with a
  pinned printing (reverses Story 6's "stays out" rule). `EXAMPLE_CARD` in
  code is left as is; the stored record wins in `hydrateDetail()`.
- Vampire Nighthawk: Shards of Alara (its first set), not Zendikar.
- Scryfall API lookups are allowed for this story only, one per missing
  printing, from a throwaway script outside the repo, paced ≥ 100 ms.
- Unchanged, already that printing: Wheel of Fortune (Alpha), Orcish
  Lumberjack (Ice Age).

## Acceptance criteria

1. These 24 entries show the named printing (set, number, artist, image):
   - **From the stored alternatives** in `card-examples-printings.json`
     (no lookup): Shock — Stronghold; Opt — Invasion; Dark Confidant —
     Ravnica: City of Guilds.
   - **Fetched, replacing an existing stored record** (16): Counterspell,
     Giant Spider, Control Magic, Magical Hack — Alpha; Fyndhorn Elder —
     Ice Age; Worldly Tutor — Mirage; Elvish Piper — Urza's Destiny; Snuff
     Out, Misdirection, Arrest — Mercadian Masques; Eternal Witness — Fifth
     Dawn; Sakura-Tribe Elder — Champions of Kamigawa; Mulldrifter, Garruk
     Wildspeaker, Oblivion Ring — Lorwyn; Vampire Nighthawk — Shards of
     Alara.
   - **Fetched, new stored record** (5; `slot` 1): Fog, Lure, Drain Life —
     Alpha; Lhurgoyf — Ice Age; Reanimate — Tempest.
2. The file then has 200 entries; every other record is byte-identical to
   `c3b33d1`. Same record shape; `n` is the entry number.
3. Those 5 entries no longer call api.scryfall.com; zero API requests when
   opening any of the 24.
4. Self-check 84/84 at 1440×900; console clean; Fog still renders as the
   Example line plus plate (now the Alpha printing).
5. If a named printing does not exist in English paper, stop and ask; do
   not substitute.

## Implementation

- Changed: `vox-color/mechanical-examples.json` (+24 −19 lines: 19 records
  replaced, 5 added in `n` order). `HANDOFF.md` (this ledger).
- Shock, Opt, Dark Confidant: the `swap.oldest` record from
  `card-examples-printings.json`, mapped to the stored shape.
- 21 Scryfall lookups (`/cards/search`, `!"name" set:X lang:en
  game:paper`, 150 ms apart) from a scratchpad script. 20 returned exactly
  one English paper printing (all `highres_scan`, normal frame).
- **Vampire Nighthawk: no Shards of Alara printing** (404). Stopped and
  asked (criterion 5). Owner chose **Zendikar #116** (Jason Chan) and
  pasted its Scryfall JSON; used as given, `?utm_source=api` stripped.
- New records: Drain Life 83, Fog 93, Lhurgoyf 117, Lure 126, Reanimate
  157, all `slot` 1. Entry numbers from `docs/card-examples-mapping.md`.

## QA

QA-1, same agent. Browser at 1440×900, `http://localhost:8000`.
1. All 24 entries opened: each Example plate shows the named set, number
   and artist (Vampire Nighthawk shows Zendikar, as the Owner chose).
2. 200 entries; git counts +24 −19, so every other line is byte-identical
   to `c3b33d1`.
3. Zero `api.scryfall.com` requests while opening the 24.
4. Self-check 84 of 84; console has only the mana-font slow-network info
   message; Fog shows the Example line and the Alpha plate (488×680).
5. Met by stopping at Vampire Nighthawk; no substitute picked by the agent.

Owner checklist: open
`http://localhost:8000/vox-color/mechanical-explorer.html`, pick Fog,
Counterspell and Deathtouch in the list; the plate on the right shows Alpha
#193, Alpha #54 and Zendikar #116.

## Decisions needed

None open. (Vampire Nighthawk → Zendikar, Owner 2026-10-10, replaces the
Shards of Alara decision above.)

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

- **Mana-font fallback.** Without mana-font, the colorless glyph is 0 px
  wide (Gate C F1) and the wheel's mana glyphs render as boxes; the explorer
  shows letters instead.
- **`CLAUDE.md` read-order line counts** for `AGENTS.md`, `CONTEXT.md` and
  `MECHANICS-CONTRACT.md` drift by a few lines after Story 1 (story-1.md).
- **`MECHANICS-CONTRACT.md` "Nothing past step 2.5 has started."** is stale
  (steps 3–5 and 7 are done); not a preview statement, so not Story 1.
- **Stale docs.**
  - `CONTEXT.md` understates the C16 caution and dates "Absence" 10 May
    (Wizards prints May 13, 2013).
  - N3: an unwrapped line in `AGENTS.md`.
- **`tools/gate.py` has no entry point.** It exits 0 having checked
  nothing; the real gates run inside `check_taxonomy.py` and
  `check_recon.py`.
- **Recon names vs today's wheel (Story 2, D4).** Regenerating recon
  against the current `color-wheel.html` drops the Nephilim and community
  names from 10 rows, puts the C16 lens "Chaos" on URG and "Orzhov" on
  Non-Red. Recon is pinned to `96ae609`'s wheel until this is resolved.
- **Article input not archived.** Only its sha256 is recorded (copyright);
  a future fetch may differ.
- **Small UI items.**
  - A doubled period in an entry's accessible name ("…with flying..").
  - The explorer's 1.5 px focus outline renders at 1 px at 1x.
  - The hard-coded `.panel` max-height.
  - Re-add `scrollbar-gutter:stable` to the wheel.
  - A headless-only scroll after the explorer loads; check it in a headed
    browser.
- **Housekeeping.**
  - Rename `ALIASES` and the shard `aka` field.
  - Commit or gitignore `docs/DATA-DOSSIER.html`.
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
- **Share link and PNG card for a colour selection (Owner, 2026-10-08).**
  URL is the existing hash route plus `colors=`; image is a canvas card with
  colour name, count and source line.
- **Ring legibility (Owner, 2026-10-08).** "No placement" rings are now
  dashed in the explorer (`.sc.t-n`, uncommitted). Black stays `#aca29a`
  (mana-font's own black); revisit only if it still blends in. Open: gilt
  selection rings sit near W and R.
- **Paused by the Owner:** the Scryfall query idea.
- **Gate A process notes (R6-N4 to N6).**
  - State what a CRLF sha256 hashes.
  - Classify self-test lines 1924 and 1944.
  - §18.13 also excludes delegating to `tools/selection.py`.
