# Vox Mana — Colour Pie Components: Context

Handoff notes. Read before editing.

---

## The two files

**`color-wheel.html`** — interactive WUBRG pentagram. Three layers built, a
fourth stubbed:

1. **Vertices** — each colour's goal and the method it reaches it by.
2. **Edges** — allied pairs (the pentagon) and enemy pairs (the star).
3. **Crossings** — the five interior intersections of the star.
4. **Mechanics overlay** — *not built.* Button exists and is disabled. See below.

**`color-identity-directory.html`** — 37 tiles across six tiers: colourless,
mono, two-colour (allied guilds / enemy guilds / Strixhaven colleges),
three-colour (shards / wedges), four-colour, five-colour. 32 identities; the five
colleges are alternate names for the five enemy pairs, which is why the tile
count exceeds the identity count.

---

## Why the crossings matter

A pentagram has exactly five interior crossings. Two chords intersect only when
their endpoints alternate around the circle, so each crossing touches four
colours and excludes exactly one. Five crossings, five exclusions, one per
four-colour identity — a bijection.

This is a proof, not an observation, and it means **the crossing coordinates
cannot be moved.** If they feel crowded, shrink the markers; don't reposition
them. They were solved numerically in `build/build_wheel.py` with an assertion
that there are exactly five distinct exclusions.

The usual pentagram diagrams never label these points. That's the component's
one original contribution.

---

## Sources and provenance

All wheel copy is **paraphrase**, written fresh — not quotation. Deliberate on
two counts: the articles are Wizards' copyright, and the Codex should speak in
its own voice. Nothing in the panels is precious; rewrite freely.

- **Philosophies and the five conflicts** — Rosewater, "Pie Fights," Nov 2016.
- **The five alliances** — Rosewater, "Thank You for Being a Friend," Mar 2017.
  Its "the key to X is Y" closers are the source of the vertex method lines.
- **Four-colour commanders** — verified against the MTG Wiki Commander 2016
  cycle table. Yidris/Entropic Uprising (non-white), Saskia/Open Hostility
  (non-blue), Kynaios and Tiro/Stalwart Unity (non-black), Atraxa/Breed
  Lethality (non-red), Breya/Invent Superiority (non-green).

### Source cautions

- **Rosewater contradicts himself inside "Pie Fights."** The philosophy section
  says green wants *acceptance*; the summary section says green wants *growth*.
  The file uses acceptance, matching the 2015 revisited series.
- **The reference pentagram PNG uses Duncan Sabien's vocabulary**, not Wizards'.
  "Growth Mindset," "Authenticity," "Profanity," "Heroism," "Tribalism" are his
  coinages. The current build deliberately uses MaRo canon instead. Also note
  Sabien states his understanding comes from Rosewater's blog — he's downstream,
  not independent corroboration.
- **The "goal through method" formula is Sabien's**, not MaRo's. The vertex
  labels here are built from MaRo's own wording instead.
- **Mechanical Color Pie 2017 is superseded.** The current version is Mechanical
  Color Pie 2021 (18 Oct 2021), with a same-day companion "Mechanical Color Pie
  2021 Changes" itemising every diff. As of Jan 2025 Rosewater confirmed no
  newer version exists but intends one eventually. **Layer 4 needs the 2021
  data — roughly 150 abilities across primary/secondary/tertiary. Wiring 2017
  would ship known-stale tiering.**
- **A 2025 "My Words" series exists** (White 19 May, Blue 23 Jun, a third
  17 Sep), first-person philosophy per colour, newer than the 2015 revisited
  articles most people cite. Not needed for the build — it's swappable content —
  but worth knowing if the Codex dossiers predate it. It was never confirmed
  whether all five published.

---

## Design constraints (carried from prior work on this site)

- Single static HTML. No build step, no framework, no npm.
- **Static at rest.** No ambient animation, no rAF loops, no particle systems.
  A real design-reference doc for this project warns explicitly against running
  many simultaneous animated gradients — it reads as "gaming RGB," not Magic.
- `reference/current-weave-annotated.html` warns that its own rAF pattern
  assumes a singleton component. At 32+ elements that warning is the whole
  design. The wheel uses zero rAF loops; the directory uses one delegated
  pointer handler writing two custom properties.
- `prefers-reduced-motion` is honoured by **skipping** JS effects, never slowing
  them.
- No carved/embossed ornamental borders — wrong texture against glass.
- Glass needs colour behind it. The static ambient gradient mesh exists so
  `backdrop-filter` has something to catch; flat black reads as empty, not
  frosted.

## Type stack

| Font | Role | Used for |
|---|---|---|
| Cormorant SC | Brand | wordmark, faction names |
| Almendra | Expression | hero copy, major headings |
| Lora | Reading | prose, educational content |
| Outfit | Interface | nav, buttons, filters, metadata, codes |

Supersedes the Cinzel/Fraunces pairing still present in
`reference/current-weave-annotated.html` — that file needs the same swap
eventually.

## Colour tokens

Inherited verbatim from Current Weave: `--obsidian #0b0c11`, `--panel #14151d`,
`--bone #ede6d3`, `--gold #d4af37`, `--w #f5efc7`, `--u #77b9e8`, `--r #d97858`.

`--b #aca29a` is `$ms-base-black` pulled from mana-font 1.18.0's own sass
variables, so the ring arc matches the pip inside it. For reference the full
mana-font base set is white `#f0f2c0`, blue `#b5cde3`, black `#aca29a`, red
`#db8664`, green `#93b483`, colourless `#beb9b2`.

**Unverified, needs Rob's sign-off:** `--g #7fb283` and `--c #b6b2a6` were both
invented — Current Weave only ever needed Jeskai. `--c` in particular now sits
close to `--b`; Rob is re-tuning it.

---

## Open items

**Wheel**
- [ ] Emphasis model rebuild (job 1 in PROMPT.md)
- [ ] Per-colour draw-on animation (job 2)
- [ ] Layer 4: mechanical overlay, needs Mechanical Color Pie 2021
- [ ] Crossing markers may crowd at hover scale — shrink, never move

**Directory**
- [ ] 37 placeholder dossier lines, all marked `data-placeholder="true"`
- [ ] Mono-colour tiles named plainly ("White", "Blue") — swap in Codex names if
      they exist
- [ ] Ambient mesh still has a purple lobe standing in for black, left over from
      the old token. Options: leave as a saturated stand-in, desaturate and
      accept a flatter corner, or drop it and rebalance the other four
- [ ] `--g` and `--c` confirmation
- [ ] Hero says "The Thirty-Two Identities"; if the Codex counts 37, that copy
      may want to change

**Both**
- [ ] Extract shared tokens/type/glass/mesh to one stylesheet before a third
      file exists
- [ ] Decide whether the two components link to each other — the wheel's
      crossings and the directory's four-colour tier are the same five things
      rendered twice

## Not in this folder

The Rosewater article PDFs. Drop them in `reference/` if you want the panel copy
rewritten against the primary text — the paraphrase in the wheel was written
from them.
