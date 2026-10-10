# Mechanical Color Pie: curated card examples (editorial)

Draft for later website integration. Compiled 2026-10-09.

**What this is.** Up to three real Magic cards per mechanical entry, chosen to show visitors what the effect looks like on a card. The picks are **editorial examples**. They are not Rosewater citations, a card-classification system or a ranking. Where Rosewater's own text names a card, the row says so.

**Source of definitions and placements.** `data/mechanical-color-pie.runtime.json`, which carries the Mechanical Color Pie 2021 snapshot (Rosewater, 2021-10-18). Entry order follows the article; the four list-only entries (213-216) come last. Each card's name, colours and Oracle text were checked against the local Scryfall Oracle data (the 2026-08-20 bulk plus a few newer cards fetched earlier). Card images, printings and artwork were deliberately not examined.

**Reading the table.**
- *Placement*: P primary, S secondary, T tertiary. W white, U blue, B black, R red, G green. Copied from the official data, not reinterpreted.
- Card labels: (C) Classic, meaning iconic or recognisable and not necessarily oldest; (S) Simple, the plain version; (V) Variant, a different take on the same effect; (Cond) Conditional, narrower than the definition. Labels are used only where they fit.
- *Key*: the exact `byMechanic` key in the runtime data, for matching rows to the explorer.
- Rows marked **Existing** were already in the explorer before this curation and are preserved unchanged. "Owner example" means the Owner chose the card (`EXAMPLE_CARD`). "Rosewater-named" means Rosewater's own explanation names the card.

## Summary

- **Entries with at least one card: 214 of 216.** Two entries are unresolved: 213 and 214.
- **Cards selected: 589** (570 curated in this project plus the 19 existing explorer examples).
- **Entries with fewer than three cards (curated):** 15, 24, 36, 38, 55, 60, 64, 97, 107, 149 (two cards each, except 15 with one) and 151, 153 (one card each).
- **Unresolved:** 213 "-N/+N (on Auras)" and 214 "-N/+N (on spells)". Both are list-only entries with white as the only (primary) placement and no official explanation. No mono-white card with that effect exists in the local data. The only -N/+N Aura found is Defensive Stance, which is blue, so it does not match the official placement.

## Collection

| # | Entry | Placement | Card 1 | Card 2 | Card 3 | Status | Key |
|---|---|---|---|---|---|---|---|
| 1 | Animating artifacts | P:U S:G | Ensoul Artifact (C) | March of the Machines (V) | Animating Faerie // Bring to Life (V) | Done | `animating artifacts` |
| 2 | Animating enchantments | P:W S:U | Opalescence (C) | Starfield of Nyx (V) | Myth Realized (Cond) | Done. Opalescence also animates opponents' enchantments. | `animating enchantments` |
| 3 | Animating lands | P:G S:R T:WUB | Animate Land (S) | Natural Affinity (V) | Destiny Spinner (V) | Done | `animating lands` |
| 4 | Artifact destruction | P:RG S:W | Shatter (C) | Naturalize (C) | Reclamation Sage (V) | Done. Naturalize also hits enchantments. | `artifact destruction` |
| 5 | Banisher Priest-like effect | P:W | Banisher Priest (S) | Fiend Hunter (C) | Oblivion Ring (V) | Done | `banisher priest-like effect` |
| 6 | Basic land counting | P:R S:BG T:WU | Spitting Earth (C) | Spawn of Thraxes (V) | Downhill Charge (V) | Done. Domain cards count basic land types, so they are not used. | `basic land counting` |
| 7 | "Bite" | P:G S:R | Rabid Bite (S) | Ram Through (V) | Bite Down (V) | Done. Bite is one-sided; Fight is entry 88. | `bite` |
| 8 | Return to library | P:U | Griptide (C) | Chronostutter (V) | Gone Missing (V) | Done | `return to library` |
| 9 | Bring back creatures/permanents that went to the graveyard this turn | P:W | Faith's Reward (C) | Second Sunrise (V) | Twilight Shepherd (V) | Done | `bring back creatures/permanents that went to the graveyard this turn` |
| 10 | Can't be attacked | P:W | Blazing Archon (C) | Chronomantic Escape (V) | Reverence (Cond) | Done. Chronomantic Escape lasts until your next turn; Reverence stops only power 2 or less. | `can't be attacked (creatures can't attack you.)` |
| 11 | Can't be blocked | P:U | Slither Blade (S) | Aqueous Form (V) | Enter the Enigma (V) | Done | `can't be blocked` |
| 12 | Can't be countered | P:RG S:U | Volcanic Fallout (S) | Carnage Tyrant (C) | Obliterate (V) | Done | `can't be countered` |
| 13 | Can't block | P:BR | Carrion Feeder (S) | Bloodghast (V) | Phoenix Chick (V) | Done | `can't block` |
| 14 | Can't lose the game and opponent can't win | P:W | Angel's Grace (C) | Herald of Eternal Dawn (S) | Cloudsteel Kirin (V) | Done. Platinum Angel is colourless, so it is not used. | `can't lose the game and opponent can't win` |
| 15 | Can't win the game and opponent can't lose | P:B | Abyssal Persecutor (C) | - | - | 1 card. It is the only good mono-black example. | `can't win the game and opponent can't lose` |
| 16 | Card draw | P:U S:BG T:WR | Ancestral Recall (C) | Divination (S) | Mulldrifter (V) | Done. Ancestral Recall is Vintage-restricted; Concentrate is the everyday alternative. | `card draw` |
| 17 | Card filtering | P:UG | Impulse (C) | Dig Through Time (V) | Commune with Nature (Cond) | Done | `card filtering` |
| 18 | Cast spells from opponent's graveyard/exile | P:UB | Gonti, Lord of Luxury (C) | Chancellor of the Spires (V) | Brainstealer Dragon (V) | Done. Thief of Sanity is gold, so it is not used. | `cast spells from opponent's graveyard/exile` |
| 19 | Cast spells from your graveyard | P:B S:UR T:WG | Yawgmoth's Will (C) | Chainer's Edict (V) | Gravecrawler (Cond) | Done | `cast spells from your graveyard` |
| 20 | Cast spells out of graveyard | P:B S:UR | Dread Return (C) | Sins of the Past (V) | Ebondeath, Dracolich (Cond) | Done. Near-duplicate of entry 19; the picks are distinct. | `cast spells out of graveyard` |
| 21 | Changing lands | P:U | Phantasmal Terrain (S) | Spreading Seas (V) | Reef Shaman (V) | Done | `changing lands` |
| 22 | Color changing | P:U S:G T:WB | Tidal Visionary (S) | Rainbow Crow (V) | Sway of Illusion (V) | Done. Older cards; the article says the effect is rarely used now. | `color changing` |
| 23 | Copying permanents, permanently | P:U | Clone (C) | Clever Impersonator (V) | Cryptoplasm (V) | Done | `copying permanents, permanently` |
| 24 | Copying permanents, temporarily | P:R S:U | Cursed Mirror (V) | Tilonalli's Skinshifter (V) | - | 2 cards. Token-copy effects (for example Kiki-Jiki) were excluded because they do not make a permanent become a copy. | `copying permanents, temporarily` |
| 25 | +1/+1 counter (creation and caring) | P:WG S:B T:UR | Luminarch Aspirant (S) | Scavenging Ooze (C) | Hardened Scales (V) | Done | `+1/+1 counter (creation and caring)` |
| 26 | Counterspell | P:U T:W | Counterspell (C) | Cancel (S) | Negate (Cond) | Done | `counterspell` |
| 27 | Counter target activated/triggered ability | P:U T:G | Stifle (C) | Disallow (V) | Trickbind (V) | Done | `counter target activated/triggered ability` |
| 28 | Destroy target creature | P:B S:W | Murder (S) | Ravenous Chupacabra (C) | Vraska's Contempt (V) | Done | `destroy target creature` |
| 29 | Destroy target creature. Its controller gets compensation | P:W | Swords to Plowshares (C) | Path to Exile (V) | Generous Gift (V) | Done. Generous Gift is broader permanent removal that also works on creatures and gives its controller a 3/3 Elephant. | `destroy target creature. its controller gets compensation` |
| 30 | Destroy target attacking or blocking creature | P:W | Divine Verdict (S) | Rebuke (V) | Vanquish (V) | Done. Rebuke hits attackers only; Vanquish hits blockers only. | `destroy target attacking or blocking creature` |
| 31 | Destroy target creature that damaged you or a creature you control this turn | P:W | Reciprocate (V) | Spear of Heliod (V) | Avenging Arrow (V) | Done, uncertain wording. No card says "or a creature you control": Reciprocate and Spear of Heliod say "you", and Avenging Arrow says any damage. | `destroy target creature that damaged you or a creature you control this turn` |
| 32 | Destroy target tapped creature | P:W S:B | Vengeance (C) | Expel (V) | Steam Catapult (V) | Done. Royal Assassin is black (Secondary), so it is not used. | `destroy target tapped creature` |
| 33 | Destroy target creature with power 3 or greater | P:W | Smite the Monstrous (C) | Stand Up for Yourself (S) | Giant Killer // Chop Down (V) | Done. The article moved the floor from power 4 to 3, so older cards use 4. | `destroy target creature with power 3 or greater` |
| 34 | Destroy target creature with flying | P:G | Plummet (C) | Aerial Predation (V) | Ettercap // Web Shot (V) | Done | `destroy target creature with flying` |
| 35 | Destroy all creatures | P:W S:B | Wrath of God (C) | Day of Judgment (S) | Fumigate (V) | Done | `destroy all creatures` |
| 36 | Destroy all creatures controlled by one player | P:B | Rain of Daggers (V) | Overwhelming Forces (V) | - | 2 cards | `destroy all creatures controlled by one player` |
| 37 | Destroy all creatures with power 3 or greater | P:W | Dusk // Dawn (C) | Retribution of the Meek (S) | Elspeth, Sun's Champion (V) | Done. Older cards use power 4. | `destroy all creatures with power 3 or greater` |
| 38 | +N/+N (on creatures) | P:B S:G | Dread Shade (C) | Inkrise Infiltrator (V) | - | 2 cards. The rest of the black pool is near-identical Shades. | `+n/+n (on creatures)` |
| 39 | +N/+N (on creatures, single use) | P:G | Rootwalla (C) | Plated Rootwalla (V) | Mindful Biomancer (V) | Done | `+n/+n (on creatures, single use)` |
| 40 | +N/+N (on spells) | P:WG S:BR | Giant Growth (C) | Mighty Leap (V) | Righteousness (Cond) | Done | `+n/+n (on spells)` |
| 41 | +N/+N (on Auras) | P:WG S:UBR | Holy Strength (S) | Elephant Guide (C) | Blanchwood Armor (V) | Done. The two Ns may differ; Holy Strength is +1/+2. | `+n/+n (on auras)` |
| 42 | +N/+0 (on creatures) | P:R S:WG | Shivan Dragon (C) | Dragon Whelp (V) | Flamekin Brawler (S) | Done | `+n/+0 (on creatures)` |
| 43 | +N/+0 (on spells) | P:BR S:W | Bull Rush (S) | Howl from Beyond (V) | Hatred (C) | Done | `+n/+0 (on spells)` |
| 44 | +N/+0 (on Auras) | P:R S:WB T:UG | Firebreathing (C) | Madcap Skills (V) | Claws of Valakut (V) | Done | `+n/+0 (on auras)` |
| 45 | +N/-N (on creatures) | P:U S:BR | Watercourser (S) | Mistwalker (V) | Wall of Wonder (V) | Done | `+n/-n (on creatures)` |
| 46 | +N/-N (on spells) | P:B | Lash of Malice (S) | Nameless Inversion (C) | Desperate Measures (V) | Done | `+n/-n (on spells)` |
| 47 | +N/-N (on Auras) | P:B S:R | Twisted Experiment (S) | Maggot Therapy (V) | Boon of Emrakul (V) | Done | `+n/-n (on auras)` |
| 48 | -N/+N (on creatures) | P:U T:W | Water Servant (S) | Morphling (C) | Aetherling (V) | Done | `-n/+n (on creatures)` |
| 49 | -N/-N (on creatures) | P:B | Festering Goblin (C) | Blister Beetle (S) | Grandmother Sengir (V) | Done | `-n/-n (on creatures)` |
| 50 | -N/-N (on spells) | P:B T:WURG | Disfigure (S) | Grasp of Darkness (C) | Death Wind (V) | Done | `-n/-n (on spells)` |
| 51 | -N/-N (on Auras) | P:B | Dead Weight (C) | Mire's Grasp (S) | Cursed Flesh (V) | Done | `-n/-n (on auras)` |
| 52 | -N/-0 (on spells) | P:U S:B | Hydrosurge (S) | Befuddle (C) | Obyra's Attendants // Desperate Parry (V) | Done | `-n/-0 (on spells)` |
| 53 | -N/-0 (on Auras) | P:U S:B | Sensory Deprivation (C) | Pin to the Earth (S) | Agoraphobia (V) | Done | `-n/-0 (on auras)` |
| 54 | +0/+N (on creatures) | P:W S:G | Honor Guard (S) | Town Sentry (V) | Abbey Matron (V) | Done. Older cards; the article says white has backed off this. | `+0/+n (on creatures)` |
| 55 | +0/+N (on spells) | P:W S:G | Iron Will (S) | Great Defender (V) | - | 2 cards | `+0/+n (on spells)` |
| 56 | +0/+N (on Auras) | P:W S:UG | Holy Armor (C) | Gift of Granite (S) | Eland Umbra (V) | Done | `+0/+n (on auras)` |
| 57 | +N/+N to your team (one-shot) | P:W S:G | Charge (S) | Righteous Charge (V) | Rallying Roar (V) | Done | `creature pumping, your team, one-shot :: +n/+n to your team` |
| 58 | +N/+0 to your team (one-shot) | P:R S:W | Trumpet Blast (C) | Banners Raised (S) | Bolt Hound (V) | Done | `creature pumping, your team, one-shot :: +n/+0 to your team` |
| 59 | -N/-N to their team (one-shot) | P:B | Cower in Fear (S) | Massacre Wurm (C) | Toxic Deluge (V) | Done. Toxic Deluge hits all creatures, as the article allows. | `creature pumping, their team, one-shot :: -n/-n to their team` |
| 60 | -N/-0 to their team | P:U | Turn the Tide (S) | Blinding Spray (V) | - | 2 cards. A one-shot effect, per the Owner's reading of the 2021 category. | `-n/-0 to their team` |
| 61 | +N/+N to your team (ongoing) | P:W S:G T:UBR | Glorious Anthem (C) | Benalish Marshal (V) | Dictate of Heliod (V) | Done | `creature pumping, your team, ongoing :: +n/+n to your team` |
| 62 | +N/+0 to your team (ongoing) | P:R T:B | Goblin Oriflamme (S) | Street Riot (V) | Instigator Gang // Wildblood Pack (C) | Done | `creature pumping, your team, ongoing :: +n/+0 to your team` |
| 63 | -N/-N to their team (ongoing) | P:B | Ascendant Evincar (C) | Toxrill, the Corrosive (V) | Night of Souls' Betrayal (V) | Done. Evincar's -1/-1 also hits your own nonblack creatures. | `creature pumping, their team, ongoing :: -n/-n to their team` |
| 64 | Creature sacrifice, forced, repeatable | P:B | Sheoldred, Whispering One (C) | Woebringer Demon (V) | - | 2 cards | `creature sacrifice, forced, repeatable` |
| 65 | "Curiosity" | P:U S:G | Combat Research | - | - | Existing (Owner example) | `curiosity` |
| 66 | Damage prevention | P:W | Mending Hands (S) | Orim, Samite Healer (C) | Hold at Bay (V) | Done | `damage prevention` |
| 67 | Damage redirection | P:W | Divine Deflection (S) | Harm's Way (V) | Phyrexian Vindicator (V) | Done. Phyrexian Vindicator works continuously rather than as a "next N" effect. | `damage redirection` |
| 68 | "Daunt" | P:G | Steel Leaf Champion (C) | Giltgrove Stalker (S) | Verdant Outrider (V) | Done | `daunt` |
| 69 | Deal damage when blocked | P:R S:B T:U | Ashmouth Hound (C) | Somberwald Vigilante (S) | Inferno Elemental (V) | Done | `deal damage when blocked` |
| 70 | Deathtouch | P:B S:G | Typhoid Rats (S) | Vampire Nighthawk (C) | Ruthless Ripper (V) | Done | `deathtouch` |
| 71 | Defender | P:WU S:BRG | Wall of Omens (C) | Wall of Frost (V) | Wall of Air (S) | Done | `defender` |
| 72 | "Devil's Deal" permanents | P:B | Phyrexian Arena (S) | Dark Confidant (C) | Demonic Pact (V) | Done. Dark Confidant reveals the top card and puts it into your hand; it does not draw. | `devil's deal permanents` |
| 73 | Deal N damage to creature, planeswalker, and/or player | P:R S:WB | Lightning Bolt (C) | Shock (S) | Fireball (V) | Done. Fireball divides its damage evenly among its targets. | `deal n damage to creature, planeswalker, and/or player` |
| 74 | Deal N damage to a creature that's been damaged this turn | P:R S:B | Crushing Pain (S) | Opportunist (V) | Unsparing Boltcaster (V) | Done | `deal n damage to a creature that's been damaged this turn` |
| 75 | Sacrifice a creature and deal damage equal to its power/toughness | P:R S:B | Fling (C) | Thud (S) | Bloodshot Cyclops (V) | Done | `sacrifice a creature and deal damage to creature/planeswalker/player equal to the sacrificed creature's power/toughness` |
| 76 | Deal N damage where N is the cards in your/opponent's hand | P:R | Spiraling Embers (S) | Sudden Impact (V) | Fateful Showdown (V) | Done | `deal n damage to a creature/planeswalker/player where n is the number of cards in your hand/your opponent's hand` |
| 77 | Deal N damage to target attacking or blocking creature | P:W | Righteous Blow (S) | Gideon's Reproach (C) | D'Avenant Archer (V) | Done | `deal n damage to target attacking or blocking creature` |
| 78 | Deal N damage to a creature with flying | P:G T:R | Leaf Arrow (S) | Pierce the Sky (V) | Skyway Sniper (V) | Done | `deal n damage to a creature with flying` |
| 79 | Direct damage, multiple targets | P:R S:W | Pyroclasm (S) | Anger of the Gods (C) | Forked Bolt (V) | Done | `direct damage, multiple targets` |
| 80 | Discard as a cost | P:B S:R T:WUG | Zombie Infestation (C) | Hell Mongrel (V) | Notorious Assassin (V) | Done | `discard as a cost` |
| 81 | Discard as effect | P:B | Mind Rot (S) | Hymn to Tourach (C) | Thoughtseize (V) | Done | `discard as effect` |
| 82 | Double strike | P:WR | Fencing Ace (S) | Mirran Crusader (V) | Embercleave (C) | Done | `double strike` |
| 83 | "Drain life" | P:B T:W | Drain Life | - | - | Existing (Owner example) | `drain life` |
| 84 | Enchantment destruction | P:WG S:B | Demystify (S) | Disenchant (C) | Krosan Grip (V) | Done | `enchantment destruction` |
| 85 | "Enchantress" ability | P:WG | Verduran Enchantress (C) | Mesa Enchantress (V) | Eidolon of Blossoms (V) | Done. Mesa Enchantress is a historical white example that predates the once-per-turn limit the 2021 article describes. | `enchantress ability` |
| 86 | Exiling cards from graveyard | P:B S:WG | Cremate (S) | Withered Wretch (C) | Faerie Macabre (V) | Done | `exiling cards from graveyard` |
| 87 | Extra attack | P:R T:W | Relentless Assault (C) | Seize the Day (V) | Combat Celebrant (V) | Done | `extra attack` |
| 88 | Fight | P:G S:R | Prey Upon (C) | Ulvenwald Tracker (V) | Epic Confrontation (V) | Done | `fight` |
| 89 | First strike | P:WR T:B | Youthful Knight (S) | Blood Knight (C) | Fervent Champion (V) | Done | `first strike` |
| 90 | Flash | P:U S:WBG T:R | Vendilion Clique (C) | Pestermite (V) | Spectral Sailor (S) | Done | `flash` |
| 91 | "Flicker" | P:WU | Flicker | - | - | Existing (Owner example) | `flicker` |
| 92 | Flying | P:WU S:BR T:G | Serra Angel (C) | Wind Drake (S) | Kor Skyfisher (V) | Done | `flying` |
| 93 | "Fog" | P:G T:W | Fog | - | - | Existing (Owner example) | `fog` |
| 94 | Forced attack | P:R S:U | Into the Fray (S) | Boiling Blood (V) | Heckling Fiends (V) | Done | `forced attack` |
| 95 | Forced block | P:G S:R | Culling Mark (S) | Provoke (V) | Culvert Ambusher (V) | Done | `forced block (target creature must block this turn.)` |
| 96 | Sacrifice a creature (forced) | P:B | Diabolic Edict (C) | Innocent Blood (V) | Fleshbag Marauder (V) | Done | `forced sacrifice :: sacrifice a creature` |
| 97 | Sacrifice an artifact (forced) | P:R | Visions of Ruin (S) | Structural Collapse (V) | - | 2 cards. These are the only two clean forced matches. Structural Collapse also takes a land. | `forced sacrifice :: sacrifice an artifact` |
| 98 | "Freeze" creature | P:U | Frost Breath (C) | Frost Lynx (S) | Frost Titan (V) | Done | `freeze creature` |
| 99 | Friendly to artifacts | P:WU S:R | Etherium Sculptor (S) | Master of Etherium (C) | Tempered Steel (V) | Done | `friendly to artifacts` |
| 100 | Friendly to creatures | P:G S:W | Beast Whisperer (S) | Guardian Project (V) | Craterhoof Behemoth (C) | Done | `friendly to creatures` |
| 101 | Friendly to enchantments | P:WG T:B | Sigil of the Empty Throne (C) | Auramancer (S) | Setessan Champion (V) | Done | `friendly to enchantments` |
| 102 | Friendly to instants and sorceries | P:U S:R | Baral, Chief of Compliance (S) | Mnemonic Wall (C) | Spellseeker (V) | Done. Shows cost reduction, recursion and tutoring; the cast triggers belong to entry 115. | `friendly to instants and sorceries` |
| 103 | Friendly to lands | P:G S:WUBR | Tireless Tracker (C) | Oracle of Mul Daya (V) | Rampaging Baloths (V) | Done | `friendly to lands` |
| 104 | Friendly to planeswalkers | P:W | Call the Gatewatch (S) | Elspeth Conquers Death (V) | Oath of Gideon (V) | Done | `friendly to planeswalkers` |
| 105 | Friendly to legendary permanents | P:W | Thalia's Lancers (C) | Loyal Retainers (V) | Day of Destiny (V) | Done | `friendly to legendary permanents` |
| 106 | Friendly to low mana value cards | P:W | Helping Hand (S) | Tocasia's Welcome (V) | Bygone Bishop (V) | Done | `friendly to low mana value cards` |
| 107 | Gain control of target player's turn | P:B | Worst Fears (S) | Sorin Markov (V) | - | 2 cards. Mindslaver is colourless; Word of Command controls a player only while it resolves. | `gain control of target player's turn` |
| 108 | "Gaseous Form" | P:W S:U | Heart of Light | - | - | Existing (Owner example) | `gaseous form` |
| 109 | Haste | P:R S:BG | Raging Goblin (S) | Goblin Guide (C) | Thundermaw Hellkite (V) | Done | `haste` |
| 110 | Hexproof | P:U S:G T:W | Aven Fleetwing (S) | Invisible Stalker (C) | Dive Down (V) | Done | `hexproof` |
| 111 | "Illusion ability" | P:U | Phantasmal Bear (S) | Phantasmal Image (C) | Dream Strix (V) | Done. Dream Strix uses the newer "target of a spell" wording; the Phantasmal cards say "spell or ability". | `illusion ability` |
| 112 | "Impulsive draw" | P:R | Act on Impulse (S) | Light Up the Stage (V) | Reckless Impulse (V) | Done | `impulsive draw` |
| 113 | Increasing counters and/or tokens | P:UG S:W | Doubling Season (C) | Parallel Lives (S) | Thrummingbird (V) | Done. Thrummingbird's proliferate adds counters after they exist. | `increasing counters and/or tokens` |
| 114 | Indestructible | P:W S:BG T:UR | Avacyn, Angel of Hope (C) | Heliod, God of the Sun (V) | Archangel Avacyn // Avacyn, the Purifier (V) | Done. Archangel Avacyn grants indestructible temporarily. | `indestructible` |
| 115 | Instant and/or sorcery triggers | P:UR | Young Pyromancer (C) | Murmuring Mystic (V) | Guttersnipe (S) | Done | `instant and/or sorcery triggers` |
| 116 | Land destruction | P:R T:BG | Stone Rain (S) | Molten Rain (V) | Avalanche Riders (V) | Done | `land destruction` |
| 117 | "Lhurgoyf" | P:G S:B T:WUR | Lhurgoyf | - | - | Existing (Owner example) | `lhurgoyf` |
| 118 | Life gain | P:WG S:B | Angel's Mercy (S) | Nourish (S) | Revitalize (V) | Done | `life gain` |
| 119 | Life loss as an effect | P:B | Bump in the Night (S) | Shadow Slice (V) | Gruesome Fate (V) | Done. All three are straight life loss with no life gain. | `life loss as an effect` |
| 120 | Life loss as a cost | P:B T:WURG | Necropotence (C) | Snuff Out (V) | Griselbrand (V) | Done | `life loss as a cost` |
| 121 | Lifelink | P:WB | Child of Night (S) | Knight of Meadowgrain (V) | Baneslayer Angel (C) | Done | `lifelink` |
| 122 | "Lockdown" | P:U | Dehydration (S) | Claustrophobia (C) | Frozen Solid (V) | Done | `lockdown (enchanted creature doesn't untap.)` |
| 123 | "Lobotomy" | P:B | Lobotomy | - | - | Existing (Rosewater-named) | `lobotomy` |
| 124 | Looking at opponent's hand | P:U S:B | Peek (S) | Telepathy (V) | Spy Network (V) | Done | `looking at opponent's hand` |
| 125 | "Looting" | P:U | Merfolk Looter (C) | Looter il-Kor (V) | Careful Study (V) | Done | `looting (draw a card and discard a card.)` |
| 126 | "Lure" | P:G | Lure | - | - | Existing (Owner example) | `lure` |
| 127 | "Lure," limited | P:G S:R | Irresistible Prey | - | - | Existing (Owner example) | `lure, limited` |
| 128 | Mana production, permanent | P:G S:U T:B | Llanowar Elves (C) | Birds of Paradise (V) | Fyndhorn Elder (V) | Done. Fyndhorn Elder taps for two green mana. | `mana production, permanent` |
| 129 | Mana production, temporary | P:R S:B | Pyretic Ritual (S) | Rite of Flame (V) | Orcish Lumberjack (V) | Done | `mana production, temporary` |
| 130 | "Manipulate time" (end the turn) | P:U T:R | Time Stop (C) | Day's Undoing (V) | Discontinuity (V) | Done | `manipulate time (end the turn.)` |
| 131 | "Maro" ability | P:U S:G | Sturmgeist (C) | Body of Knowledge (V) | Soramaro, First to Dream (V) | Done | `maro ability` |
| 132 | "Meddling" | P:W | Nevermore (S) | Voidstone Gargoyle (V) | Gideon's Intervention (V) | Done. Meddling Mage, the namesake, is white-blue gold, so it is not used. Gideon's Intervention stops opponents only and adds damage prevention. | `meddling` |
| 133 | Menace | P:BR | Boggart Brute (S) | Alley Strangler (S) | Flowstone Kavu (V) | Done | `menace` |
| 134 | Milling | P:U S:B | Mind Sculpt (S) | Hedron Crab (C) | Traumatize (V) | Done | `milling` |
| 135 | Moving enchantments/counters | P:U | Enchantment Alteration (S) | Aura Graft (V) | Simic Fluxmage (V) | Done | `moving enchantments/counters` |
| 136 | Must attack | P:R | Crazed Goblin (S) | Riot Piker (V) | Impetuous Sunchaser (V) | Done | `must attack` |
| 137 | Pacifism-like effect | P:W | Pacifism (C) | Arrest (V) | Forced Worship (V) | Done. Forced Worship stops attacking only, which the article allows. | `pacifism-like effect` |
| 138 | "Panic" | P:R | Panic | - | - | Existing (Owner example) | `panic` |
| 139 | Planeswalker destruction | P:B T:G | Hero's Downfall (C) | Ruinous Path (V) | Eliminate (Cond) | Done. Eliminate only hits mana value 3 or less. | `planeswalker destruction` |
| 140 | Playing cards off the top of your library, paying their mana cost | S:WUBRG | Future Sight (C) | Vizier of the Menagerie (V) | Assemble the Players (Cond) | Done. No primary colour, so these are Secondary examples in U, G and W. The point is that each colour plays a subset of cards. | `playing cards off the top of your library, paying their mana cost` |
| 141 | Playing cards off the top of library, for free | P:R | Etali, Primal Storm (C) | Throes of Chaos (S) | Galvanoth (V) | Done. Throes of Chaos is a cascade spell. | `playing cards off the top of library, for free` |
| 142 | Playing cards off the top of opponent's library | P:UB S:R | Gonti, Lord of Luxury (C) | Mind's Dilation (V) | Inside Information (V) | Done | `playing cards off the top of opponent's library` |
| 143 | Play extra lands | P:G | Exploration (S) | Azusa, Lost but Seeking (V) | Summer Bloom (V) | Done | `play extra lands/put a land from hand onto the battlefield` |
| 144 | "Polymorph" | P:R S:U | Transmogrify | - | - | Existing (Owner example) | `polymorph` |
| 145 | Preventing actions | P:W | Silence (C) | Orim's Chant (V) | Mandate of Peace (V) | Done. All three are one-shot "this turn" effects. | `preventing actions` |
| 146 | Protection | P:W T:UBRG | Paladin en-Vec (C) | Death Speakers (S) | Mother of Runes (V) | Done | `protection` |
| 147 | Prowess | P:U S:R T:W | Jeskai Windscout (S) | Jeskai Sage (V) | Jhessian Thief (V) | Done. Monastery Swiftspear is red (Secondary), so it is not used. | `prowess` |
| 148 | "Punisher" effects | P:R S:B | Browbeat (C) | Vexing Devil (V) | Book Burning (V) | Done | `punisher effects` |
| 149 | Putting artifacts from hand onto the battlefield | P:U S:W | Master Transmuter (C) | Stoneforge Mystic (V) | - | 2 cards. Stoneforge Mystic puts Equipment, which is white's slice. | `putting artifacts from hand onto the battlefield` |
| 150 | Putting creatures from hand onto the battlefield | P:G S:UR T:WB | Elvish Piper (C) | Ghalta, Stampede Tyrant (V) | Dramatic Entrance (Cond) | Done. Dramatic Entrance puts a green creature only. | `putting creatures from hand onto the battlefield` |
| 151 | Putting enchantments from hand onto the battlefield | P:W S:G T:U | Holy Avenger (V) | - | - | 1 card. It puts an Aura card from hand. Academy Researchers does the same but is blue (Tertiary). | `putting enchantments from hand onto the battlefield` |
| 152 | Putting lands from hand onto the battlefield | P:G | Burgeoning (C) | Sakura-Tribe Scout (S) | Arboreal Grazer (V) | Done | `putting lands from hand onto the battlefield` |
| 153 | Putting planeswalkers from hand onto the battlefield | P:W | Urza Assembles the Titans (V) | - | - | 1 card. The 2021 article says no card did this yet; this Saga does it (chapter II puts a planeswalker with mana value 6 or less from hand onto the battlefield). | `putting planeswalkers from hand onto the battlefield` |
| 154 | Random destruction effects | P:R | Wild Swing (S) | Capricious Efreet (C) | Haphazard Bombardment (V) | Done | `random destruction effects` |
| 155 | Reach | P:G S:R T:W | Giant Spider (C) | Canopy Spider (S) | Thornweald Archer (V) | Done | `reach` |
| 156 | "Reanimate" permanent | P:W | Sun Titan | - | - | Existing (Owner example) | `reanimate permanent` |
| 157 | "Reanimation" | P:WB S:RG | Reanimate | - | - | Existing (Owner example) | `reanimation` |
| 158 | Removing counters | P:B | Vampire Hexmage (C) | Render Inert (S) | Thrull Parasite (V) | Done. All three act on permanents only, not players. | `removing counters` |
| 159 | "Restocking" | P:UG | Timetwister (C) | Dwell on the Past (S) | Reclaim (V) | Done | `restocking` |
| 160 | Return target card from graveyard to hand | P:G | Regrowth (S) | Eternal Witness (C) | Den Protector (V) | Done. See the integration flag on "Regrowth". | `return target card from graveyard to hand` |
| 161 | Return target artifact from graveyard to hand | P:W | Ritual of Restoration (S) | Sanctum Gargoyle (C) | Argivian Archaeologist (V) | Done | `return target artifact from graveyard to hand` |
| 162 | Return target creature from graveyard to hand | P:B S:W | Gravedigger | - | - | Existing (Rosewater-named) | `return target creature from graveyard to hand` |
| 163 | Return target enchantment from graveyard to hand | P:W | Monk Idealist (S) | Griffin Dreamfinder (V) | Tragic Poet (V) | Done | `return target enchantment from graveyard to hand` |
| 164 | Return target instant from graveyard to hand | P:U S:R | Scrivener (S) | Pull from the Deep (V) | The Mirari Conjecture (V) | Done. The last two also return a sorcery. | `return target instant from graveyard to hand` |
| 165 | Return target land from graveyard to hand | P:G | Life from the Loam (C) | Cartographer (S) | Groundskeeper (Cond) | Done. Groundskeeper returns basic lands only. | `return target land from graveyard to hand` |
| 166 | Return target sorcery from graveyard to hand | P:U S:R | Déjà Vu (C) | Sage's Knowledge (S) | Anarchist (V) | Done. Anarchist is red, the entry's Secondary colour. | `return target sorcery from graveyard to hand` |
| 167 | Return to hand | P:U S:W T:G | Man-o'-War | - | - | Existing (Rosewater-named) | `return to hand` |
| 168 | Rewards for death | P:B S:W T:R | Blood Artist (C) | Gavony Unhallowed (S) | Morbid Opportunist (V) | Done. Blood Artist can target any player. | `rewards for death` |
| 169 | Rules setting | P:W S:UBRG | Rule of Law (S) | Rest in Peace (C) | Archon of Emeria (V) | Done | `rules setting` |
| 170 | "Rummaging" | P:R | Rummaging Goblin (C) | Mad Prophet (V) | Tormenting Voice (V) | Done. Tormenting Voice draws two cards. | `rummaging (discard a card and draw a card.)` |
| 171 | Sacrifice an artifact | P:BR | Atog (C) | Priest of Yawgmoth (V) | Krark-Clan Stoker (V) | Done | `sacrifice a permanent :: sacrifice an artifact` |
| 172 | Sacrifice a creature | P:BR | Viscera Seer (C) | Goblin Bombardment (C) | Bloodthrone Vampire (S) | Done | `sacrifice a permanent :: sacrifice a creature` |
| 173 | Sacrifice an enchantment | P:RG | Simplify (S) | Endless Wurm (C) | Nyxborn Behemoth (V) | Done. No red card found, so all three are green. | `sacrifice an enchantment` |
| 174 | Sacrifice a land | P:R | Shard Volley (S) | Fireblast (Cond) | Seismic Monstrosaur (V) | Done. Fireblast sacrifices Mountains only. | `sacrifice a land` |
| 175 | Sacrifice a permanent | P:R S:B | Misguided Rage (S) | Crack the Earth (V) | Magmaw (Cond) | Done. Magmaw sacrifices a nonland permanent. | `sacrifice a permanent` |
| 176 | Scry | P:U S:WBRG | Opt (S) | Preordain (C) | Thassa, God of the Sea (V) | Done | `scry` |
| 177 | "Sengir" ability | P:B | Sengir Vampire (C) | Sengir Bats (S) | Baron Sengir (V) | Done. Baron Sengir adds +2/+2 counters, one of the variations the article mentions. | `sengir ability` |
| 178 | "Specter" ability | P:B | Hypnotic Specter (C) | Headhunter (S) | Liliana's Reaver (V) | Done. Hypnotic Specter triggers on any damage and discards at random. | `specter ability` |
| 179 | Spell copying | P:UR | Twincast (S) | Reverberate (S) | Dualcaster Mage (V) | Done | `spell copying` |
| 180 | Spell redirection | P:UR | Misdirection (C) | Shunt (S) | Willbender (V) | Done. Willbender can also redirect an ability. | `spell redirection` |
| 181 | "Stalking" | P:G | Stalking Tiger (S) | Charging Rhino (C) | Krosan Vorine (V) | Done | `stalking` |
| 182 | Stealing permanents, permanently | P:U T:B | Control Magic (C) | Treachery (V) | Steal Artifact (V) | Done | `stealing permanents, permanently` |
| 183 | Stealing permanents, temporarily | P:R | Threaten (C) | Act of Treason (S) | Insurrection (V) | Done | `stealing permanents, temporarily` |
| 184 | "Super trample" | P:G | Thorn Elemental (C) | Lone Wolf (S) | Rhox (V) | Done | `super trample` |
| 185 | Switch power/toughness | P:U S:R | Aquamoeba (C) | Twisted Image (S) | Merfolk Thaumaturgist (V) | Done | `switch power/toughness` |
| 186 | Tapping creatures | P:W S:U | Master Decoy (C) | Pressure Point (S) | Blinding Mage (V) | Done | `tapping creatures` |
| 187 | Taxing | P:W S:U | Mana Leak | - | - | Existing (Rosewater-named) | `taxing` |
| 188 | "Time Walk" | P:U T:R | Time Walk | - | - | Existing (Rosewater-named) | `time walk (take an extra turn after this one.)` |
| 189 | Token generation | P:WG S:UBR | Raise the Alarm (S) | Lingering Souls (C) | Garruk Wildspeaker (V) | Done | `token generation` |
| 190 | Trample | P:G S:R T:WUB | Carnage Tyrant (C) | Garruk's Companion (S) | Crash of Rhinos (S) | Done | `trample` |
| 191 | "Transformation" | P:U | Turn to Frog (S) | Deep Freeze (V) | Serpentine Ambush (V) | Done. Polymorph-style replacement is a separate entry (144). | `transformation` |
| 192 | Treasure creation | P:R S:BG T:U | Dockside Extortionist (C) | Goldspan Dragon (V) | Captain Lannery Storm (S) | Done | `treasure creation` |
| 193 | "Torment" ability | P:B | Torment of Hailfire (C) | Torment of Scarabs (V) | Thornplate Intimidator (V) | Done | `torment ability` |
| 194 | "Tutor" for any card | P:B | Demonic Tutor | - | - | Existing (Rosewater-named) | `tutor for any card` |
| 195 | "Tutor" for an artifact | P:U S:W | Fabricate (S) | Trinket Mage (C) | Treasure Mage (Cond) | Done. Treasure Mage finds mana value 6 or greater only. | `tutor for an artifact` |
| 196 | "Tutor" for a creature | P:G S:WUBR | Worldly Tutor (C) | Green Sun's Zenith (V) | Fierce Empath (Cond) | Done. Green Sun's Zenith finds green creatures only; Fierce Empath finds mana value 6 or greater. | `tutor for a creature` |
| 197 | "Tutor" for an enchantment | P:W | Idyllic Tutor (C) | Heliod's Pilgrim (Cond) | Academy Rector (V) | Done. Heliod's Pilgrim finds an Aura only. | `tutor for an enchantment` |
| 198 | "Tutor" for an instant or sorcery | P:U S:R | Mystical Tutor (C) | Solve the Equation (S) | Micromancer (Cond) | Done. Micromancer finds mana value 1 only. | `tutor for an instant or sorcery` |
| 199 | "Tutor" for a land | P:G T:WUBR | Rampant Growth (C) | Sylvan Scrying (V) | Sakura-Tribe Elder (V) | Done | `tutor for a land` |
| 200 | "Tutor" for a planeswalker | P:W | Call the Gatewatch (S) | Loyal Tutor (V) | Arena Rector (V) | Done | `tutor for a planeswalker` |
| 201 | "Twiddle" | P:U | Twiddle | - | - | Existing (Rosewater-named) | `twiddle` |
| 202 | Untapping creatures | P:UG S:W | Vitalize (S) | Seeker of Skybreak (V) | Refocus (V) | Done | `untapping creatures` |
| 203 | Untapping lands | P:G T:U | Ley Druid (S) | Early Harvest (C) | Wilderness Reclamation (V) | Done | `untapping lands` |
| 204 | Untaps itself | P:U S:W | Horseshoe Crab (C) | Vigilant Drake (V) | Glimmerbell (V) | Done | `untaps itself` |
| 205 | Vigilance | P:W S:UG | Maned Serval (S) | Serra Angel (C) | Dawnstrike Paladin (V) | Done | `vigilance` |
| 206 | Variable creature | P:G T:BR | Ivy Elemental (S) | Hooded Hydra (C) | Krakilin (V) | Done | `variable creature` |
| 207 | Ward (for mana) | P:WUG | Leonin Lightbringer (S) | Rimeshield Frost Giant (S) | Tomakul Honor Guard (S) | Done. One card per primary colour: white, blue, green. | `ward (for mana)` |
| 208 | Ward (for life) | P:BR | Sedgemoor Witch (C) | Dwarven Forge-Chanter (S) | Spectral Snatcher (V) | Done. Spectral Snatcher wards by discarding, which the article says black can also do. | `ward (for life)` |
| 209 | "Warlord" | P:W S:G | Crusader of Odric (S) | Geist-Honored Monk (V) | Seraph of the Masses (V) | Done. The namesake Keldon Warlord is red, so it is not used. | `warlord` |
| 210 | "Wheeling" | P:R | Wheel of Fortune (C) | Reforge the Soul (V) | Magus of the Wheel (V) | Done | `wheeling` |
| 211 | Word changing | P:U | Mind Bend (C) | Sleight of Mind (V) | Magical Hack (V) | Done | `word changing` |
| 212 | "You don't lose" | P:B S:W | Lich (C) | Lich's Mastery (V) | Phyrexian Unlife (V) | Done. Phyrexian Unlife is white, the entry's Secondary colour. | `you don't lose` |
| 213 | -N/+N (on Auras) *(list-only)* | P:W | - | - | - | **Unresolved.** No mono-white card with this effect exists in the local data; the only -N/+N Aura is Defensive Stance, which is blue. | `-n/+n (on auras)` |
| 214 | -N/+N (on spells) *(list-only)* | P:W | - | - | - | **Unresolved.** Same reason as 213: no mono-white card found. | `-n/+n (on spells)` |
| 215 | -N/-0 (on creatures) *(list-only)* | P:U | Brinebarrow Intruder (S) | Vedalken Mesmerist (V) | Aquus Steed (V) | Done | `-n/-0 (on creatures)` |
| 216 | Forced sacrifice of a creature *(list-only)* | P:B | Cruel Edict (S) | Liliana's Triumph (V) | Plaguecrafter (V) | Done. Appears to duplicate entry 96; the picks differ. | `forced sacrifice of a creature` |

## Redteam log

**Earlier accepted corrections (carried into the rows above).**
- Entry 24: Kiki-Jiki removed.
- Entry 29: Oust replaced by Generous Gift.
- Entry 36: Plague Wind and Dread Cacodemon removed; Overwhelming Forces added.
- Entry 60: Dampening Pulse removed.
- Entry 67: Eye for an Eye replaced by Harm's Way.
- Entry 72: Dark Confidant's text corrected (it puts the card into your hand and does not draw).
- Entry 73: Fireball's text corrected (damage divided evenly).
- Entry 85: Mesa Enchantress labelled a historical white example.

**Midway checkpoint (entries 136-176, the batch of 34 curated this session).**
- Entry 140: Courser of Kruphix was replaced by Vizier of the Menagerie. Courser only plays lands, which have no mana cost to pay.
- Entry 145: Grand Abolisher was replaced by Mandate of Peace. Grand Abolisher is an ongoing static effect, but the definition is a one-shot "this turn" effect.
- Entry 174: Rathi Dragon was replaced by Seismic Monstrosaur. Rathi Dragon needs Mountains specifically, which is narrower than "a land".
- Entry 141: Wild Evocation was rejected before selection. It reveals a card from hand, not from the top of the library.
- Narrower or broader cards are now flagged rather than presented as exact: entries 151, 153, 164, 165, 174 and 175.

**Final checkpoint (all 216 entries).**
- A one-off lookup of every card name against the local data found one failure, "Deja Vu" (entry 166), which lacked its accents. It is now "Déjà Vu".
- The same lookup confirmed, for all 570 curated cards: the exact name exists, the card passes the project's eligibility proxy (not a token or art card; legal, banned or restricted in a paper format), it is mono-coloured, and its colour appears in the entry's official placement. It also confirmed every row's key and placement string against the runtime data, no entry above three cards, and no repeated card within an entry.
- Three curated cards sit outside their entry's primary colour, each on purpose and each flagged in its row: Stoneforge Mystic (149, white's Equipment slice), Anarchist (166, the entry's red Secondary) and Phyrexian Unlife (212, the entry's white Secondary).
- Entry 153's note was reworded so that it no longer implies a printing date that was not checked.
- All 19 existing explorer examples are preserved unchanged, and every Owner decision on earlier batches is applied.

## Integration flags

- Matching rows to the explorer should use the **Key** column, since several labels repeat (for example the one-shot and ongoing team pumps).
- Multi-face cards use their full Scryfall name: Animating Faerie // Bring to Life, Giant Killer // Chop Down, Ettercap // Web Shot, Dusk // Dawn, Obyra's Attendants // Desperate Parry, Instigator Gang // Wildblood Pack, Archangel Avacyn // Avacyn, the Purifier.
- "Regrowth" (entry 160) is also the spell half of a newer "prepare" card, Emeritus of Abundance // Regrowth. Confirm that an exact-name lookup returns the standalone sorcery.
- Entries marked Existing keep the explorer's current cards. "Rosewater-named" cards are named in his own explanation text; the others are Owner examples.
