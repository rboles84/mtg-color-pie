# Vox Mana — Colour Pie Components: Context

Handoff notes. Read before editing.

---

## The file

**`vox-color/color-wheel.html`** — one static file, two views.

It used to be two files. `color-identity-directory.html` was absorbed into it
(commit `603dd0b`); git history has the original if you need it. They duplicated
tokens, type stack, glass treatment and ambient mesh, and the atlas owned the 32
identity records the wheel needed. Merging removed both duplications at once and
did the shared-stylesheet extraction that had been queued as its own job.

**The wheel** — the primary instrument. Two modes:

- **Explore** — click one thing, read about that thing.
  1. Vertices: each colour's goal, method, and what it costs.
  2. Each colour's two faces — one arc per alliance, in the ally's colour.
  3. Edges: allied pairs (pentagon) and enemy chords (star).
  4. Crossings: the five interior intersections.
  5. Mechanics overlay — *not built.* Button exists and is disabled.
- **Combine** — click colours to build a set; it resolves to one of the 32.
  The layer toggles are Explore's lenses and are hidden here; Combine owns its
  own geometry, and Explore's lens state is remembered and handed back.

**The atlas** — all 37 tiles, below the wheel, rendered from the same registry.

Deep links are in the hash (`#combine=WUR`, `#color=W`, `#ally=WU`,
`#enemy=WB`, `#four=W`). Hash rather than query string because the file is
opened off disk and `pushState` to a new path is refused on `file://`.

---

## Why the crossings matter

A pentagram has exactly five interior crossings. Two chords intersect only when
their endpoints alternate around the circle, so each crossing touches four
colours and excludes exactly one — a bijection with the five four-colour
identities.

This is a proof, not an observation, and it means **the crossing coordinates
cannot be moved.** If they feel crowded, shrink the markers; don't reposition
them.

Note the trap: "every chord not containing the excluded colour" returns *three*
chords, not two, because each colour sits in only two of the five. The extra one
is always the chord joining the excluded colour's two neighbours. That bug was
live for a while and is fixed; there's a numeric check in the commit history.

---

## The identity registry

32 identities in `IDENTITIES`, 5 alternate names in `ALIASES`, 37 tiles. The
Strixhaven colleges are alternate names for identities that already exist —
Silverquill *is* Orzhov — so they never inflate the count.

`display` is the authoritative field: the colours in the order the faction is
conventionally written. Jeskai is URW, not WUR. The canonical WUBRG key is
**derived** from it, so membership and ordering cannot disagree. 11 of the 37
have a display order that differs from canonical, which is why this is stored
and not an afterthought.

Everything else a tile shows is derived — ring, pips, code, tier, dossier line.

**The 37 dossier lines are composed from strings already in `D`**, not written
fresh. That was a deliberate instruction: fresh paraphrase is 37 chances to get
the philosophy subtly wrong, and it puts a second account of each identity on the
page that nothing keeps in step with the wheel. If you add real Codex copy, add
it as data and let the renderer surface it; don't hand-write tiles.

Deliberately not modelled: promise, game feel, actions, tensions, mechanical
signals. No copy exists for any of them. Empty fields for absent content are only
future confusion.

---

## Sources and provenance

All copy is **paraphrase or derivation** by default. Deliberate on two counts:
the articles are Wizards' copyright, and the Codex should speak in its own voice.

**Direct quotation is permitted, but it is exceptional and has rules.** There is
exactly one quotation in the build — Rosewater's "barefoot is not a type of
shoe" on colorless — and it earned the exception because it states the entry's
whole point better than any paraphrase could, and paraphrasing it would have
destroyed the thing that makes it land.

If you add another, it must be: verified against the article itself rather than a
search summary or a secondhand brief; reproduced exactly, with no tidying of
contractions, punctuation or nested quotation marks; attributed in full as
Author, "Title," Publication, Month Day, Year; and visually distinct from the
surrounding paraphrase so a reader can tell whose words they are. The stored
string carries a comment saying not to edit it, and `.panel-quote` is the styling
hook. If a paraphrase would do the job, use the paraphrase.

Primary sources now live in `voxmana.io/docs/research/canon/`. The wheel draws on:

- **Philosophies and the five conflicts** — "Pie Fights," Nov 2016.
- **The five alliances** — "Thank You for Being a Friend," Mar 2017. Verified:
  all five shared values and all five "the key to X is Y" closers match what the
  file had.
- **Per-colour downsides** — the 2015 "revisited" series.
- **Shards** — the 2008 interviews, one per shard, each with its centre colour.
- **Wedges** — the 2014–15 interviews. Their clan attributes are in the
  registry: Abzan endurance, Jeskai cunning, Mardu speed, Sultai ruthlessness,
  Temur savagery.
- **Four-colour commanders** — Commander 2016, verified against the decklists.

### Source cautions

- **Rosewater contradicts himself inside "Pie Fights."** The philosophy section
  says green wants *acceptance*; the summary says *growth*. The file uses
  acceptance, matching the 2015 revisited series, which states it outright.
- **The classic colour-wheel poster is not a fan coinage.** An earlier version of
  this document implied its vocabulary wasn't Wizards'. That was wrong.
  "Hate Is Enough" (Feb 2002) names three sub-conflicts per enemy pair —
  Morality vs. Amorality, Symbiosis vs. Parasitism, Natural vs. Artificial
  Growth — which is where Parasitism, Amorality, Interdependence and Technology
  come from. Its split-vertex structure is the source of the halves.
- **Duncan Sabien's pentagram is downstream.** "Growth Mindset," "Authenticity,"
  "Profanity," "Heroism," "Tribalism" are his coinages, and he states his
  understanding comes from Rosewater's blog. The build uses MaRo canon instead.
  The "goal through method" formula is his, not MaRo's.
- **"More Maro on Maro" is misfiled in the research packet.** It's listed under
  Downsides but concerns the downsides of the colour pie *as a system*; it has no
  per-colour weaknesses. Those are in the colour essays.
- **Mechanical Color Pie 2017 is superseded** by the 2021 version plus a
  same-day changes companion. Layer 4 needs the 2021 data — roughly 150
  abilities. Wiring 2017 would ship known-stale tiering.
- **Four colours have no philosophy article.** Verified, not assumed. The five
  names — Artifice, Chaos, Aggression, Altruism, Growth — come from Ethan
  Fleischer's "Designing Commander (2016 Edition)" (24 Oct 2016), NOT from
  Rosewater, and he describes them as **decks in gameplay terms**: Artifice
  plays "artifacts matter" cards, Chaos flips coins and plays off the top,
  Growth is a +1/+1 counters theme. The Ravnica-guild framing came from
  developer Ben Hayes as a challenge to the team, not as an achieved result.
  Calling any of them "the philosophy of WUBR" overstates the source badly.
- **Rosewater on four colours, verified verbatim** — "Absence," 10 May 2013:
  "It's nearly impossible to design four-color cards that actually feel like
  four-color cards... The biggest thing about four-color cards is the missing
  color, but you can't design about what's missing." And, importantly, the
  other half people drop: "I do think there is a way to design four-color
  cards, but it requires some context (such as two guilds working together)."
  His position is that four colours need external context, not that they are
  meaningless.
- **A claim that did NOT verify.** A review passed to this project stated that
  in 2023 Rosewater said the four-colour restriction is "more related to
  mechanics than flavor." Two Blogatog posts were checked. Dec 2022: "I agree
  that there's a demand and we should figure out a product where they make
  sense." Jul 2026: "We will make more, but we do them infrequently." Neither
  says it. It is not used anywhere and should not be added without a source.
- **Guardrails for four-colour copy.** These are editorial rules, not page text.
  Do not write: black = evil, or no-black = good; no-blue = stupid or unable to
  plan; no-white = incapable of cooperation; no-red = incapable of emotion;
  no-green = no life or adaptation. Those are fan extrapolations. The absent
  colour changes the conversation; it does not delete a concept from existence.
  Note that `canon-inventory-four-color-reference-audit.md` in the research repo
  breaks several of these ("completely rejects natural limitations", "self-
  interest absolutely") and is inference without citations — do not treat it as
  a source.
- **The 2025 "My Words" series completed all five** (White May, Blue Jun, Black
  Sep, Red Oct, Green Dec). This document previously recorded that as unknown.
  Not needed for the build — it's swappable content.

---

## Design constraints

- Single static HTML. No build step, no framework, no npm.
- **Static at rest.** No ambient animation, no rAF loops, no particle systems.
- `prefers-reduced-motion` is honoured by **skipping** effects, never slowing.
- No carved/embossed ornamental borders — wrong texture against glass.
- Glass needs colour behind it; the static mesh exists so `backdrop-filter` has
  something to catch.
- **The wheel is the instrument.** Playing with the wheel to see an identity is
  the interaction; clicking a card to see the wheel is backwards. An atlas→wheel
  sync was proposed and rejected on those grounds.

### Known trade

The atlas is now JS-rendered. No JS, no tiles. Keeping static output while having
one registry would need a generator writing the HTML — the build step this
project has ruled out. Worth revisiting if the page is ever crawled or served
scriptless.

## Type stack

| Font | Role | Used for |
|---|---|---|
| Cormorant SC | Brand | wordmark, faction names |
| Almendra | Expression | hero copy, major headings |
| Lora | Reading | prose, educational content |
| Outfit | Interface | nav, buttons, filters, metadata, codes |

## Colour tokens

`--obsidian #0b0c11`, `--panel #14151d`, `--bone #ede6d3`, `--gold #d4af37`,
`--w #f5efc7`, `--u #77b9e8`, `--r #d97858`.

`--b #aca29a` is `$ms-base-black` from mana-font 1.18.0, so the ring arc matches
the pip inside it. Full mana-font base set: white `#f0f2c0`, blue `#b5cde3`,
black `#aca29a`, red `#db8664`, green `#93b483`, colourless `#beb9b2`.

**Still unverified, needs Rob:** `--g #7fb283` and `--c #b6b2a6` were invented.
`--c` sits close to `--b`; check Esper and Grixis rings when it is retuned.

---

## Open items

- [ ] Layer 4: mechanical overlay. **The 2021 data is found**, not missing:
      `voxmana.io/docs/research/mono_upgrade/20_mechanical_color_pie_2021.md`
      (the snapshot) and `21_..._changes.md` (the 2017→2021 change log). The
      superseded 2017 version is at `canon/misc/mechanical-color-pie-2017.md`.
      Both are already paraphrase digests, so they suit the copy policy.
      What is NOT done is turning the snapshot into a dataset. It is prose
      lists: 393 entries, 205 distinct labels once normalised, 53 of which
      bundle several sections behind slashes ("friendly to
      artifacts/enchantments/legendaries/low-MV/planeswalkers" is five
      sections). Splitting and normalising those is where errors would enter,
      and it needs checking against the article, not guessing.
      One real defect found in the digest: Black lists bare "flash" in BOTH
      secondary and tertiary. One of them is wrong. (Black's two "+N/+N"
      entries are NOT a duplicate — "(creatures)" and "(spells/Auras)" are
      different sections.)
- [ ] `--g` and `--c` confirmation (Rob)
- [ ] Crossing markers may crowd at hover scale — shrink, never move
- [ ] Mono-colour tiles named plainly ("White", "Blue") — swap in Codex names if
      they exist
- [ ] Hero says "The Color Wheel"; the atlas heading says "The Thirty-Two
      Identities". If the Codex counts 37, that copy may want to change
- [ ] Colour panels cite three articles each — three lines of small type. A
      source drawer would be better than a wall of citations
- [ ] `setRoute`'s single `location.hash` assignment has never been executed.
      The only preview environment available serves the file as a `data:` URL,
      where hash assignment silently fails. Everything either side of that line
      is tested. **Check it once in a real browser.**
- [ ] "Hate Is Enough" gives three named sub-conflicts per enemy pair. The wheel
      currently shows one title per chord. Those three facets are unused.

### Resolved since the first draft of this document

Emphasis model rebuild · per-colour draw-on (built, then flattened to White's
setting on review) · the mesh's leftover violet lobe · shared tokens/type/glass
extraction · whether the two components link · the `showFour` chord bug · atlas
tiles' false focusability · all 37 placeholder dossier lines.

## Not in this folder

Nothing now — the Rosewater corpus is in `voxmana.io/docs/research/canon/`.
