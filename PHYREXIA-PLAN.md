# Phyrexia as an overlay — plan and research checklist

Written 31 Aug 2026. Status: **not started, and not recommended as the next
thing.** See "The honest comparison" at the end before committing to it.

---

## The idea, and why it is a good one

Give all five colours the same premise — *the world is imperfect and must be
remade* — and they answer differently:

| | answer |
|---|---|
| White | make everyone one |
| Blue | improve everything |
| Black | become the one on top |
| Red | you don't get to choose for me |
| Green | let the strongest form survive |

That is a **colour-pie stress test**, and it proves the thing this whole build
exists to teach: the colour pie describes values and methods, not morality. New
Phyrexia fractured along colour lines *because* each colour interpreted the same
project through its own values.

**Red is the payoff.** Red is officially the colour most resistant to
compleation, because forced transformation contradicts self-determination. A
wheel that shows four strong connections and one broken one teaches something
real at a glance.

---

## Scope: five colours, not thirty-two

The proposal that prompted this suggested a toggle that rewrites every panel —
mono, pairs, trios, four-colour, WUBRG, colourless — in a Phyrexian voice.

**Don't.** That implies Phyrexia has a coherent reading of Azorius and
Non-Green. It doesn't. It has five faction philosophies and a story. Inventing a
Phyrexian reading of the other 27 is exactly the fan-extrapolation pattern this
project has spent its whole life rejecting.

The honest version is **five entries on the five colours**, plus the Red
asymmetry. That delivers the entire insight and claims nothing unsupported. It
is roughly a tenth of the proposed build.

---

## Blockers, in order of severity

### 1. Zero primary sources in the corpus

Checked `docs/research/canon/`. There is **no** Planeswalker's Guide to New
Phyrexia, no praetor profiles, no Phyrexian design article. The only mentions of
Elesh Norn, Jin-Gitaxias, Sheoldred, Urabrask and Vorinclex are inside Vox Mana
synthesis files — the tier this project already ruled out for canon claims.

Everything has to be fetched before a line of copy is written.

### 2. The font does not have the symbols

mana-font 1.18.0 ships **one** generic Phyrexian glyph at `U+E618`. Tested
`ms-p`, `ms-wp`, `ms-up`, `ms-bp`, `ms-rp`, `ms-gp` — all five colour variants
return that identical codepoint. There are no distinct per-colour Phyrexian
symbols in the pinned version.

The visual centrepiece therefore needs either a mana-font upgrade (which
re-tests every existing symbol) or five hand-made SVGs. Cost this before
promising the look.

### 3. It is setting lore, and it is about characters

"Compulsory unity", "domination", "accelerated selection" describe **Norn,
Sheoldred and Vorinclex** — not White, Black and Green. This is the same
distinction already enforced for Tarkir (a set-specific lens), Alara (one
colour's account) and the Ravnica guilds (names used as shorthand), and it needs
the same scope note, more firmly.

---

## Research checklist

Each item needs: fetched, quoted exactly, dated, and classified DIRECT /
PARAPHRASE / SYNTHESIS before it informs any copy.

**Core framing**
- [ ] Planeswalker's Guide to New Phyrexia — the claim that the five factions
      are "Phyrexia viewed through the lenses of the five colors of mana"
- [ ] The same guide on the five suns fracturing Phyrexia into colour-aligned
      visions
- [ ] Confirm the guide says each faction has "its own vision, methods, and
      terms for perfection" — this is the load-bearing sentence for the whole
      taxonomy

**Per praetor** — one pass each, looking for the faction's own stated aim
- [ ] Elesh Norn / Machine Orthodoxy (White)
- [ ] Jin-Gitaxias / Progress Engine (Blue)
- [ ] Sheoldred / Seven Steel Thanes (Black)
- [ ] Urabrask / Quiet Furnace (Red)
- [ ] Vorinclex / Vicious Swarm (Green)

**The Red asymmetry — the highest-value item**
- [ ] Find the official statement that Red resisted Phyrexian corruption, and
      the stated reason. If this is only community reading, the visual
      asymmetry has no basis and the feature loses its best idea.

**Mechanics, kept strictly separate**
- [ ] Rosewater on Phyrexian mana — the flesh-and-metal intent, the artifact
      colour-bleed comparison, and his later acknowledgement of colour-pie
      breaks

**Verification traps already identified**
- [ ] Do NOT infer philosophy from `{W/P}` etc. Phyrexian mana is a cost
      symbol.
- [ ] Phyrexian mana ≠ Phyrexian faction ≠ Phyrexian creature type. Three
      separate pieces of metadata that get conflated constantly. This guard
      belongs in CONTEXT whether or not the feature is built.
- [ ] Phyrexia does not "corrupt the colour pie". It *uses* it correctly as
      philosophy. The colour-pie problems were in the mana mechanic's
      execution, which Rosewater treats as an execution issue.

**Labels to red-team before use** — each already fails as a universal:
Phyrexia = unity (that's White only, and Urabrask rejects it) · = progress (too
Blue) · = evolution (too Green/Blue) · = authoritarianism (Norn-era only) · =
assimilation (behaviour, not philosophy).

---

## Build shape, if it goes ahead

1. A third mode alongside Explore and Combine, or a lens within Explore.
2. Five colour panels gain a Phyrexian reading: base philosophy, the
   distortion, how it spreads, what it costs, which faction embodies it.
3. Red renders visibly differently — broken ring or dashed halo — with the
   reason in the panel.
4. A scope note in the same family as the Tarkir and Alara ones.
5. Symbols only once the font question is settled.

Do **not** start with the toggle chrome. Start with the research; if the Red
asymmetry does not verify, the feature is worth much less and should be
reconsidered before any code.

---

## The honest comparison

Two alternatives were raised alongside this, and one of them is clearly better
positioned right now.

| | Phyrexia | **Strixhaven** | New Capenna |
|---|---|---|---|
| Primary sources in corpus | **none** | **enumerated already** | one Vox Mana `.rtf` |
| Slots exist in the build | no | **yes — 5 alias tiles** | names only, added |
| New architecture needed | yes (mode/overlay) | **no** | no |
| Font/asset blockers | yes | no | no |
| Claim type | character lore | faction lore | faction lore |

**Strixhaven is the better next move**, and the reason is concrete rather than a
preference. `canon/strixhaven/*/SOURCES.md` already names the primary Wizards
material: the Planeswalker's Guides to Strixhaven and Secrets of Strixhaven, the
Secrets of Strixhaven Vision Design Handoff, Strixhaven: School of Mages
Mechanics, and The Legends of Strixhaven. The research step is largely *done* —
what remains is fetching and verifying what those ledgers point at.

And the five colleges **already exist in the build** as alias tiles. Right now
Silverquill shows Orzhov's conflict title and nothing else. Giving the five
colleges real content is five entries into slots that are already there, with
sources already identified, and no new architecture.

Note the shape of the claim is the same problem as everywhere else: a college is
a *faction at a school on one plane*, not a definition of an enemy pair. It gets
the same scope-note treatment.

New Capenna sits between the two. The five families are already in as alternate
names, but the only corpus material is a Vox Mana dossier, so its content would
need the same from-scratch fetching as Phyrexia — with less payoff, since the
families map to shards that already have Rosewater's own 2008 interviews.

**Recommendation: Strixhaven next, Phyrexia later and scoped to five colours.**
