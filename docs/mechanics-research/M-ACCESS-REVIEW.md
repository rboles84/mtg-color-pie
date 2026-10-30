# M supplemental Color Access review

Protocol 2.0 covers all 25 unmapped M entries. Menace and Mill remain mapped to the frozen 2021 catalog. `m-protocol.json` owns the authored assessments; `tools/build_mechanics_assessments.py` alone writes their runtime projection. Coverage is 235 A–M rows and 21 canonical bindings.

One selected example establishes each independent color, colorless bucket or observed exact combination. There are 183 selected bucket witnesses using 182 distinct full card objects. These are selected examples, not a complete census of designs or printings. Counts do not rank or strengthen access. The page explains each mechanic once, followed by a short card fact and one link per bucket. Ordinary player limitation lists contain no research-process commentary.

| Entry | Independent access | Exact combinations | Colorless example |
|---|---|---|---|
| Madness | W U B R G | BR | Emrakul, the World Anew |
| Magecraft | W U B R G | BG, UG, UR, WB, WR | Spell Satchel |
| Manifest | W U B R G | UG, UR | Scroll of Fate |
| Manifest Dread | W U B R G | BR, UG | Conductive Machete |
| Mark of Chaos Ascendant | None found | UBR | No example found |
| Max Speed | W U B R G | BR, WB, WBR, WU | Amonkhet Raceway |
| Mayhem | U B R | BR, UBR, UR | Oscorp Industries |
| Megamorph | W U B R G | None found | No example found |
| Meld | W B G | BR, WU | Hanweir Battlements |
| Melee | W R G | RG, WR, WRG | No example found |
| Mentor | W U R G | WB, WR | No example found |
| Metalcraft | W U B R G | WR | Chrome Steed |
| Miracle | W U B R G | WB, WR, WUB | Molecule Man |
| Mobilize | W B R | WBR | No example found |
| Modular | W B R | RG, WR | Arcbound Bruiser |
| Mold Earth | W | None found | No example found |
| Monstrosity | W U B R G | BG, RG, UG, WG | Clay Golem |
| Morbid | W B R G | BG | Séance Board |
| More Than Meets the Eye | W U B R | BR, RG, UB, WBR, WR, WRG, WU, WUB, WUR | No example found |
| Morph | W U B R G | UBG, UG, URG, WBG, WBR, WUR | Proteus Machine |
| Mountaincycling | R | BR, RG | No example found |
| Mountainwalk | W U R G | None found | No example found |
| Multikicker | W U B R G | WU | Everflowing Chalice |
| Mutate | W U B R G | BG, UBG, UG, UR, URG, WB, WBG, WBR, WR, WUR | No example found |
| Myriad | W U B R G | BR, UR, WG, WR, WUBRG | Chittering Dispatcher |

## Scope and factual decisions

All M evidence is ordinary released-paper material through October 29, 2026. Each selected object was checked for release, paper availability, actual mechanic-bearing face, color indicator or characteristic-defining color, type and relevant text. Tokens, schemes, planes, stickers, playtest, acorn, silver-border, digital-only and future material do not enter the maps. No access is inferred from commander color identity, a mana cost on another face, or the recipient’s colors. Negative entries mean no qualifying example found in the reviewed scope.

- Manifest and Manifest Dread are separate entries. Abhorrent Oculus and Conductive Machete only manifest dread, so Manifest instead uses Cloudform and Scroll of Fate. Disturbing Mirth does not establish BR Manifest. Cryptic Pursuit and Ethereal Ambush establish UR and UG Manifest. Native Morph uses are selected separately from Megamorph; the retained rules explain their relationship.
- Goblin Coward Parade is a Stickers object, so it does not establish ordinary colorless Mentor. A fresh full-Oracle colorless search returned that object alone; the exclusion is bounded to this reviewed evidence.
- Full-Oracle discovery, beyond keyword indexes, supplies River Merfolk’s blue self-granted Mountainwalk. Red grants and Goblin Scouts’ token creation are also qualifying red operations, already independently represented. Crevasse removes an evasion restriction and does not grant Mountainwalk.
- Miracle includes WUB Aminatou, Veil Piercer’s enchantment-card grant, WR Lorehold, the Historian’s instant/sorcery grant and colorless Molecule Man’s nonland-card grant. Their recipient cards do not establish the recipients’ colors. Molecule Man is a released black-border paper card, not special material.
- Green Goblin’s back face supplies the UBR Mayhem grant; Norman Osborn’s blue front face is not substituted. Oscorp Industries has native Mayhem without a cost, which allows playing that land from the graveyard subject to ordinary timing and land-play limits.
- Blaster, Combat DJ’s RG front face explicitly grants modular 1 to other nontoken artifact creatures and Vehicles. It does not natively have Modular on that face. Its More Than Meets the Eye example uses that front face’s alternative casting permission. All Transformers use the actual relevant face colors.
- Myriad retains WG and BR native combinations and adds WR Duke Ulder Ravengard, UR Corporeal Projection and WUBRG Mass of Mysteries through explicit grants. Chittering Dispatcher is colorless through Devoid despite its green mana cost. Grant/token-source colors govern; temporary copies are not separate color witnesses.
- Meld attributes the action to the face carrying its instruction, following rule 701.42a. Hanweir Battlements stays colorless despite red activation costs. The paired partner’s color is not a separate claim. Max Speed uses the ability functioning at speed 4; source colors govern its grants and token-related effects. Mountaincycling is the exact typecycling variant, not generic cycling or basic landcycling.
- Mark of Chaos Ascendant and Mold Earth retain their exact card-specific flavor labels and card-specific effects. Neither is promoted to a general ability definition. Metalcraft, Magecraft and Morbid retain their ability-word meanings. The selected Séance Board object and authored note retain the correct UTF-8 name.
- Anje Falkenrath and Pollywog Symbiote are support-only references, not grants of Madness or Mutate. General copy effects, recipients and name-only matches do not establish new buckets. Fresh grant-query results include incidental text matches; only the selected qualifying objects and the exclusions described here are claimed individually screened.

## Retrieval integrity

The three `selected-fresh-*.json` collection response bodies are current selected-card authority. Each has an accurately recorded POST URL, UTC start/end times, status 200 and SHA-256. Each exact request body is preserved as `selected-fresh-*-request.json`, with its own SHA-256 and its exact printing identifiers. Every selected `card_facts` object equals the full object in its bound response. Raw bodies are immutable. The selection manifest is derived navigation only.

The fresh `grant-discovery-1.json`, `mountainwalk-full-1.json` and `mentor-colorless-1.json` are raw GET responses with their actual query URLs and receipts. All three fit on one returned page. Their unselected hits are not represented as a full individual review.

Inherited `m-discovery.json` is an aggregate containing `retrievedAtUtc` and `queries`; it is not an HTTP response. Its embedded request metadata does not establish a trustworthy original request URL, status or retrieval receipt. The inherited per-mechanic discovery files also lack trustworthy exact receipt metadata. The receipt ledger explicitly labels all of these separately with unknown URL/times/status; none supplies current selected-card bindings. The first three `selected-cards-*.json` POST responses retain their original timestamps/status/body hashes, but their original request bodies were not preserved. They are audit-only and superseded for current selected facts by the complete fresh request/response pairs. No metadata is invented, reconstructed as historical fact or backdated.

## Developer validation contract

The dedicated actual `--m-only` path covers all 25 M details and their 183 whole-detail selected links, exact independent/combination maps through list/search/detail, card/raw/request receipt integrity, actual face colors and ordinary-paper scope. It exercises every actual mana token and numeric/color/colorless/X/hybrid/snow/tap fixtures across assessment/rules/reference, safe escaped markup and links, real accessible symbols and blocked-font fallback. Malformed data, date and binding fail softly; keyboard search, 360px containment and the frozen 84-check math baseline are included. Static parity hashes protect all 210 prior A–L rows and 20 prior source bindings. Protected `--l-only` exercises the preceding batch without altering its content or rendering. The known unrelated Friends forever 14px/18px broad-harness mismatch remains recorded and outside this batch.

Independent QA reviews the committed material candidate separately. Developer checks are not an independent QA or Owner verdict; Owner review judges naturalness, readability and visual balance.
