# Emits a single static HTML file: the 32 color-identity directory.
# Tiles are generated here only so the 32 entries stay consistent — the OUTPUT
# is plain literal HTML with no build step and no JS-rendered content.

PH = "PLACEHOLDER — Codex dossier line goes here."

# name, letter code, colors, sublabel (or None)
COLORLESS = [("Colorless", "C", [], None)]

MONO = [
    ("White", "W", ["w"], None),
    ("Blue",  "U", ["u"], None),
    ("Black", "B", ["b"], None),
    ("Red",   "R", ["r"], None),
    ("Green", "G", ["g"], None),
]

ALLIED = [
    ("Azorius",  "WU", ["w", "u"], "Allied"),
    ("Dimir",    "UB", ["u", "b"], "Allied"),
    ("Rakdos",   "BR", ["b", "r"], "Allied"),
    ("Gruul",    "RG", ["r", "g"], "Allied"),
    ("Selesnya", "GW", ["g", "w"], "Allied"),
]

ENEMY = [
    ("Orzhov",  "WB", ["w", "b"], "Enemy"),
    ("Izzet",   "UR", ["u", "r"], "Enemy"),
    ("Golgari", "BG", ["b", "g"], "Enemy"),
    ("Boros",   "RW", ["r", "w"], "Enemy"),
    ("Simic",   "GU", ["g", "u"], "Enemy"),
]

# The five Strixhaven colleges map one-to-one onto the enemy pairs — same five
# colour identities, different faction names. Ordered to match the ENEMY row
# above so the two grids' columns line up (this is not the order Rob listed
# them in; say the word and it reverts).
# The sub-label names the guild sharing each identity so these don't read as
# five additional identities.
COLLEGES = [
    ("Silverquill", "WB", ["w", "b"], "Enemy pair · Orzhov"),
    ("Prismari",    "UR", ["u", "r"], "Enemy pair · Izzet"),
    ("Witherbloom", "BG", ["b", "g"], "Enemy pair · Golgari"),
    ("Lorehold",    "RW", ["r", "w"], "Enemy pair · Boros"),
    ("Quandrix",    "GU", ["g", "u"], "Enemy pair · Simic"),
]

SHARDS = [
    ("Bant",   "GWU", ["g", "w", "u"], "Shard"),
    ("Esper",  "WUB", ["w", "u", "b"], "Shard"),
    ("Grixis", "UBR", ["u", "b", "r"], "Shard"),
    ("Jund",   "BRG", ["b", "r", "g"], "Shard"),
    ("Naya",   "RGW", ["r", "g", "w"], "Shard"),
]

WEDGES = [
    ("Abzan",  "WBG", ["w", "b", "g"], "Wedge"),
    ("Jeskai", "URW", ["u", "r", "w"], "Wedge"),
    ("Sultai", "BGU", ["b", "g", "u"], "Wedge"),
    ("Mardu",  "RWB", ["r", "w", "b"], "Wedge"),
    ("Temur",  "GUR", ["g", "u", "r"], "Wedge"),
]

# Verified against the MTG Wiki Commander 2016 four-color commander cycle table
# (mtg.fandom.com/wiki/Commander_2016) — deck name + commander + colour identity.
FOUR = [
    ("Non-White", "UBRG", ["u", "b", "r", "g"], "Yidris, Maelstrom Wielder · Entropic Uprising"),
    ("Non-Blue",  "WBRG", ["w", "b", "r", "g"], "Saskia the Unyielding · Open Hostility"),
    ("Non-Black", "WURG", ["w", "u", "r", "g"], "Kynaios and Tiro of Meletis · Stalwart Unity"),
    ("Non-Red",   "WUBG", ["w", "u", "b", "g"], "Atraxa, Praetors' Voice · Breed Lethality"),
    ("Non-Green", "WUBR", ["w", "u", "b", "r"], "Breya, Etherium Shaper · Invent Superiority"),
]

FIVE = [("Five-Color", "WUBRG", ["w", "u", "b", "r", "g"], None)]


def ring_style(colors):
    """Static conic-gradient ring: one hard-stopped arc per colour in the identity.

    Static by design — see the head comment. A colourless identity gets a single
    neutral arc rather than an empty gradient."""
    keys = colors if colors else ["c"]
    n = len(keys)
    stops = []
    for i, k in enumerate(keys):
        start = round(i * 100 / n, 4)
        end = round((i + 1) * 100 / n, 4)
        stops.append(f"var(--{k}) {start}% {end}%")
    return "conic-gradient(from -90deg, " + ", ".join(stops) + ")"


def pips(colors):
    keys = colors if colors else ["c"]
    return "\n".join(
        f'            <i class="ms ms-{k} ms-cost" aria-hidden="true"></i>' for k in keys
    )


def tile(name, code, colors, sublabel, idx):
    sub = (
        f'\n          <p class="tile-sub">{sublabel}</p>' if sublabel else ""
    )
    spaced = " ".join(code)
    return f"""        <article class="tile" tabindex="0" style="--ring:{ring_style(colors)};">
          <span class="tile-ring" aria-hidden="true"></span>
          <span class="tile-pips" aria-hidden="true">
{pips(colors)}
          </span>
          <h3 class="tile-name">{name}</h3>
          <p class="tile-code">{spaced}</p>{sub}
          <!-- TODO(codex): replace with the real dossier one-liner for this identity. -->
          <p class="tile-note" data-placeholder="true">{PH}</p>
        </article>"""


def grid(entries, start=0):
    return "\n".join(tile(*e, i) for i, e in enumerate(entries, start))


def tier(num, title, count, body):
    return f"""    <section class="tier" aria-labelledby="tier-{num}-h">
      <header class="tier-head">
        <p class="tier-index">Tier {num}</p>
        <h2 class="tier-title" id="tier-{num}-h">{title}</h2>
        <p class="tier-count">{count}</p>
      </header>
{body}
    </section>"""


def subgroup(label, entries):
    return f"""      <div class="subgroup">
        <h4 class="subgroup-label">{label}</h4>
        <div class="grid">
{grid(entries)}
        </div>
      </div>"""


def plain(entries, mod=""):
    cls = f"grid {mod}".strip()
    return f"""      <div class="{cls}">
{grid(entries)}
      </div>"""


HTML = f"""<!DOCTYPE html>
<!--
============================================================================
 COLOR IDENTITY DIRECTORY — all 32 WUBRG identities
============================================================================
 Single static file. No build step, no framework, no dependencies beyond two
 CDN stylesheets (Google Fonts + mana-font). Drop it in, or lift the <style>
 and markup into the site.

 Search this file for "TODO(codex)" for every spot needing real data, and
 "PROPOSED" for the two token values invented here that need Rob's sign-off.

 WHAT'S PLACEHOLDER
 ------------------
 - Every .tile-note carries data-placeholder="true" and the same visible
   PLACEHOLDER string. Nothing ships until those are replaced with real
   Codex dossier copy. The attribute makes them greppable and gives the
   dashed underline you see in the browser — drop both when wiring real text.
 - Mono-colour tiles are named plainly ("White", "Blue"). If the Codex has
   proper names for the mono identities the way it does for guilds/shards,
   swap them in.

 DELIBERATE CONSTRAINTS CARRIED OVER FROM CURRENT WEAVE + THE DESIGN DOC
 ------------------------------------------------------------------------
 - Identity rings are STATIC conic-gradients. No rotation, ever. 32 rotating
   gradients reads as gaming RGB, not Magic. Motion here is a hover reward
   only.
 - No rAF loops and no particle systems. The annotated Current Weave file
   warns that its own rAF pattern assumes a singleton component; at 32 tiles
   that warning is the whole design. The only JS is one delegated pointer
   handler writing two CSS custom properties.
 - No carved/embossed ornamental borders — wrong texture against glass. The
   knotwork border-image from Current Weave is deliberately NOT reused.
 - prefers-reduced-motion is honoured by skipping the JS entirely (the
   listener is never attached) and by killing transitions in CSS. Nothing is
   merely slowed down.

 TOKENS
 ------
 --obsidian/--panel/--bone/--gold and --w/--u/--r are taken verbatim from the
 Current Weave build so this matches the rest of voxmana.io. That file only
 ever needed Jeskai, so --b, --g and --c did not exist. --b is now taken
 exactly from mana-font 1.18.0's own $ms-base-black (#aca29a) so the ring arc
 matches the pip sitting inside it. --g and --c are still PROPOSED guesses at
 the house palette and need confirming against the real design tokens.
 For reference, mana-font's full base set is: white #f0f2c0, blue #b5cde3,
 black #aca29a, red #db8664, green #93b483, colorless #beb9b2.

 TYPOGRAPHY
 ----------
 Per the Vox Mana stack:
   Cormorant SC — brand        → faction names
   Almendra     — expression   → tier titles, page hero
   Lora         — reading      → dossier prose
   Outfit       — interface    → tier index, counts, codes, sub-labels
 Note this supersedes the Cinzel/Fraunces pairing in the Current Weave file;
 that file predates the stack and will need the same swap eventually.
============================================================================
-->
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Color Identity Directory — Vox Mana</title>

<!-- DEPENDENCY: Vox Mana type stack. Fold into the site's existing font loading
     rather than adding a second load if these are already on the page. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Almendra:wght@400;700&family=Cormorant+SC:wght@400;500;600;700&family=Lora:wght@400;500&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">

<!-- DEPENDENCY: mana-font, pinned to the same version Current Weave uses. -->
<link href="https://cdn.jsdelivr.net/npm/mana-font@1.18.0/css/mana.min.css" rel="stylesheet">

<style>
  /* ====================================================================
     1. TOKENS
     ==================================================================== */
  :root {{
    /* Inherited verbatim from the Current Weave build. */
    --obsidian:   #0b0c11;
    --panel:      #14151d;
    --panel-edge: rgba(237,230,211,.09);
    --bone:       #ede6d3;
    --bone-dim:   rgba(237,230,211,.56);
    --bone-faint: rgba(237,230,211,.30);
    --gold:       #d4af37;

    /* Mana colours. --w/--u/--r are inherited; the rest are new. */
    --w: #f5efc7;
    --u: #77b9e8;
    /* Exact pip fill: $ms-base-black from mana-font 1.18.0 (sass/_variables.scss).
       The black pip is a warm grey, not a colour — this is correct, not washed out. */
    --b: #aca29a;
    --r: #d97858;
    --g: #7fb283; /* PROPOSED — not in Current Weave, needs sign-off */
    /* TODO(codex): --c now sits very close to --b above (mana-font's own colourless
       base is #beb9b2, closer still). Rob is re-tuning this one to restore
       separation on multi-arc rings — Esper and Grixis are the tiles to check. */
    --c: #b6b2a6; /* PROPOSED — neutral for the colourless identity */

    /* Glass surface. Two layers: a translucent fill and a hairline edge.
       Kept low-alpha on purpose — the ambient mesh behind is what gives the
       blur something to catch. */
    --glass:       rgba(237,230,211,.045);
    --glass-hover: rgba(237,230,211,.075);
    --hairline:    rgba(237,230,211,.12);

    --radius: 14px;
    --ease: cubic-bezier(.2,.8,.2,1);
  }}

  /* ====================================================================
     2. RESET + PAGE SHELL
     ==================================================================== */
  * {{ box-sizing: border-box; }}
  html, body {{ margin:0; padding:0; }}

  body {{
    min-height: 100vh;
    background: var(--obsidian);
    color: var(--bone);
    font-family: 'Lora', Georgia, serif;
    /* isolation keeps the fixed mesh from being blurred by anything above it */
    isolation: isolate;
  }}

  /* --- ambient gradient mesh -----------------------------------------
     Fixed, static, non-interactive. This exists so backdrop-filter has
     colour to pick up — flat black behind glass just reads as empty. Five
     soft lobes roughly following the colour wheel's own arrangement, plus a
     warm centre. Deliberately NOT animated. */
  .mesh {{
    position: fixed;
    inset: -10vmax; /* overscan so the blurred lobe edges never show a seam */
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(38vmax 30vmax at 18% 12%, rgba(245,239,199,.10), transparent 62%),
      radial-gradient(40vmax 32vmax at 84% 16%, rgba(119,185,232,.13), transparent 64%),
      radial-gradient(42vmax 34vmax at 90% 74%, rgba(157,139,191,.13), transparent 64%),
      radial-gradient(38vmax 30vmax at 52% 96%, rgba(217,120,88,.11), transparent 62%),
      radial-gradient(40vmax 32vmax at 10% 70%, rgba(127,178,131,.11), transparent 64%),
      radial-gradient(60vmax 46vmax at 50% 42%, rgba(212,175,55,.045), transparent 70%),
      var(--obsidian);
    filter: blur(28px) saturate(1.05);
  }}

  .page {{
    max-width: 1180px;
    margin: 0 auto;
    padding: clamp(40px, 7vw, 88px) clamp(16px, 4vw, 40px) 96px;
  }}

  /* ====================================================================
     3. PAGE HEADER
     ==================================================================== */
  .hero {{ text-align: center; margin-bottom: clamp(44px, 7vw, 76px); }}

  .hero-kicker {{
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 11px; font-weight: 400;
    letter-spacing: .26em; text-transform: uppercase;
    color: var(--bone-faint);
    margin: 0 0 14px;
  }}
  .hero-title {{
    font-family: 'Almendra', Georgia, serif;
    font-weight: 700;
    font-size: clamp(30px, 5.2vw, 50px);
    line-height: 1.1;
    margin: 0 0 16px;
    color: var(--bone);
  }}
  .hero-lede {{
    max-width: 56ch; margin: 0 auto;
    font-size: 15px; line-height: 1.65;
    color: var(--bone-dim);
  }}
  /* Five-colour hairline under the hero — the only place the full wheel
     appears as a single continuous object. */
  .hero-rule {{
    width: 148px; height: 2px; margin: 24px auto 0; border-radius: 2px;
    background: linear-gradient(90deg, var(--w), var(--u), var(--b), var(--r), var(--g));
    opacity: .75;
  }}

  /* ====================================================================
     4. TIERS
     ==================================================================== */
  .tier {{ margin-bottom: clamp(44px, 6vw, 72px); }}

  .tier-head {{
    display: flex; align-items: baseline; gap: 14px;
    padding-bottom: 12px; margin-bottom: 22px;
    border-bottom: 1px solid var(--hairline);
  }}
  .tier-index {{
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 10.5px; font-weight: 500;
    letter-spacing: .2em; text-transform: uppercase;
    color: var(--gold); opacity: .85;
    margin: 0; flex: none;
  }}
  .tier-title {{
    font-family: 'Almendra', Georgia, serif;
    font-weight: 700; font-size: clamp(19px, 2.6vw, 25px);
    margin: 0; flex: 1 1 auto; color: var(--bone);
  }}
  .tier-count {{
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 11.5px; font-weight: 300;
    color: var(--bone-faint); margin: 0; flex: none;
  }}

  /* Sub-groups (allied/enemy, shards/wedges) sit inside a tier and are
     visually subordinate to it — a label, not a second heading rule. */
  .subgroup + .subgroup {{ margin-top: 26px; }}
  .subgroup-label {{
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 10.5px; font-weight: 500;
    letter-spacing: .2em; text-transform: uppercase;
    color: var(--bone-faint);
    margin: 0 0 12px;
    display: flex; align-items: center; gap: 12px;
  }}
  /* trailing hairline so the label reads as a divider, not a heading */
  .subgroup-label::after {{
    content: ""; flex: 1 1 auto; height: 1px;
    background: var(--hairline);
  }}

  /* ====================================================================
     5. GRID
     ==================================================================== */
  .grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(206px, 1fr));
    gap: 14px;
  }}
  /* Single-tile tiers (colourless, five-colour) shouldn't stretch one tile
     across the full width — cap them and centre. */
  .grid.solo {{
    grid-template-columns: minmax(206px, 268px);
    justify-content: center;
  }}

  /* ====================================================================
     6. TILE — the glass surface
     ==================================================================== */
  .tile {{
    position: relative;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
    padding: 22px 16px 18px;
    border-radius: var(--radius);
    background: var(--glass);
    border: 1px solid var(--hairline);
    -webkit-backdrop-filter: blur(14px) saturate(1.3);
    backdrop-filter: blur(14px) saturate(1.3);
    /* inner top highlight — reads as a light catching the top edge of glass */
    box-shadow:
      inset 0 1px 0 rgba(237,230,211,.06),
      0 1px 2px rgba(0,0,0,.3);
    transition:
      background .3s var(--ease),
      border-color .3s var(--ease),
      box-shadow .3s var(--ease),
      transform .25s var(--ease);
    /* set by JS on hover; harmless defaults so the CSS is valid without it */
    --rx: 0deg;
    --ry: 0deg;
    transform-style: preserve-3d;
    cursor: default;
  }}

  .tile:hover,
  .tile:focus-visible {{
    background: var(--glass-hover);
    border-color: rgba(237,230,211,.24);
    box-shadow:
      inset 0 1px 0 rgba(237,230,211,.1),
      0 8px 24px rgba(0,0,0,.4);
  }}
  .tile:focus-visible {{
    outline: 2px solid var(--gold);
    outline-offset: 3px;
  }}

  /* Pointer tilt. The transform is applied on the .tile itself and driven by
     two custom properties JS writes; the brief's plain scale() is folded in
     here so hover still reads as "lift" even when the tilt is 0 (touch,
     keyboard focus, reduced motion). Kept to 3° — see head comment. */
  .tile:hover {{
    transform: perspective(760px) rotateX(var(--rx)) rotateY(var(--ry)) scale(1.035);
  }}
  .tile:focus-visible {{ transform: scale(1.035); }}

  /* --- identity ring -------------------------------------------------
     Static conic-gradient, masked to an annulus. One hard-stopped arc per
     colour, generated per-tile into the inline --ring property. */
  .tile-ring {{
    width: 46px; height: 46px; border-radius: 50%;
    background: var(--ring);
    /* mask carves the centre out, leaving a 3px band */
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
    mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
    opacity: .58;
    transition: opacity .3s var(--ease), filter .3s var(--ease);
  }}
  /* the hover reward: the ring comes up to full, nothing moves */
  .tile:hover .tile-ring,
  .tile:focus-visible .tile-ring {{
    opacity: 1;
    filter: drop-shadow(0 0 6px rgba(237,230,211,.22));
  }}

  /* --- pips ----------------------------------------------------------
     One mana icon per colour in the identity, sitting inside the ring. */
  .tile-pips {{
    position: absolute;
    top: 22px; height: 46px;
    display: flex; align-items: center; justify-content: center;
    gap: 3px;
  }}
  .tile-pips .ms {{
    font-size: 11px;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,.55));
  }}
  /* Four- and five-colour identities need smaller pips to stay inside the
     ring. :has() on the container so the whole row shrinks together — note
     gap belongs on the container, not the icons. */
  .tile-pips:has(.ms:nth-child(4)) {{ gap: 2px; }}
  .tile-pips:has(.ms:nth-child(4)) .ms {{ font-size: 9px; }}
  .tile-pips:has(.ms:nth-child(5)) {{ gap: 1.5px; }}
  .tile-pips:has(.ms:nth-child(5)) .ms {{ font-size: 8px; }}

  /* --- text ----------------------------------------------------------- */
  .tile-name {{
    font-family: 'Cormorant SC', Georgia, serif;
    font-weight: 600;
    font-size: 19px;
    letter-spacing: .04em;
    margin: 14px 0 0;
    color: var(--bone);
  }}
  .tile-code {{
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 10.5px; font-weight: 400;
    letter-spacing: .28em;
    color: var(--bone-faint);
    margin: 5px 0 0;
  }}
  .tile-sub {{
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 11px; font-weight: 300;
    line-height: 1.45;
    color: var(--bone-dim);
    margin: 8px 0 0;
  }}
  .tile-note {{
    font-family: 'Lora', Georgia, serif;
    font-size: 12px; line-height: 1.55;
    color: var(--bone-faint);
    margin: 10px 0 0;
  }}
  /* Placeholder copy is marked in the markup AND visibly flagged here, so it
     can't quietly ship. Remove the attribute and this rule together. */
  .tile-note[data-placeholder="true"] {{
    font-style: italic;
    text-decoration: underline dashed rgba(212,175,55,.35);
    text-underline-offset: 3px;
  }}

  /* ====================================================================
     7. RESPONSIVE
     ==================================================================== */
  @media (max-width: 560px) {{
    .grid {{ grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }}
    .tile {{ padding: 18px 12px 15px; }}
    .tile-name {{ font-size: 16px; }}
    .tier-head {{ flex-wrap: wrap; gap: 8px 12px; }}
  }}

  /* ====================================================================
     8. REDUCED MOTION
     Transitions off entirely. The JS tilt is not slowed — it is never
     attached (see script). Hover still changes background/opacity, which is
     a state change, not motion.
     ==================================================================== */
  @media (prefers-reduced-motion: reduce) {{
    *, *::before, *::after {{
      animation: none !important;
      transition: none !important;
    }}
    .tile:hover, .tile:focus-visible {{ transform: none; }}
  }}

  /* Graceful degradation: without backdrop-filter the tiles would be nearly
     invisible over the mesh, so fall back to an opaque panel fill. */
  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {{
    .tile {{ background: rgba(20,21,29,.82); }}
    .tile:hover, .tile:focus-visible {{ background: rgba(20,21,29,.92); }}
  }}
</style>
</head>
<body>

<!-- Ambient mesh. Decorative, fixed, static. -->
<div class="mesh" aria-hidden="true"></div>

<main class="page">

  <header class="hero">
    <p class="hero-kicker">Vox Mana · Codex</p>
    <h1 class="hero-title">The Thirty-Two Identities</h1>
    <!-- TODO(codex): replace with real lede copy. -->
    <p class="hero-lede">
      Every combination of the five colors, from none of them to all of them.
      Six tiers, thirty-two identities.
    </p>
    <div class="hero-rule" aria-hidden="true"></div>
  </header>

{tier(1, "Colorless", "1 identity", plain(COLORLESS, "solo"))}

{tier(2, "Mono-Color", "5 identities", plain(MONO))}

{tier(3, "Two-Color", "10 identities · 15 factions", subgroup("Guilds — Allied", ALLIED) + "\n" + subgroup("Guilds — Enemy", ENEMY) + "\n" + subgroup("Strixhaven Colleges", COLLEGES))}

{tier(4, "Three-Color", "10 identities", subgroup("Shards", SHARDS) + "\n" + subgroup("Wedges", WEDGES))}

{tier(5, "Four-Color", "5 identities", plain(FOUR))}

{tier(6, "Five-Color", "1 identity", plain(FIVE, "solo"))}

</main>

<script>
/* ======================================================================
   Pointer tilt — the only JavaScript on the page.

   Design notes, since the restraint here is deliberate:
   - ONE delegated listener on <main>, not 32 listeners.
   - No requestAnimationFrame loop and no per-tile timers. The annotated
     Current Weave reference warns that its rAF pattern assumes a singleton
     component; 32 copies of that would be 32 independent loops. This writes
     two custom properties on pointermove and lets CSS do the rest.
   - getBoundingClientRect() is read once per tile on enter and cached, so
     moving the pointer never forces layout.
   - Max 3° on each axis.
   - Under prefers-reduced-motion the listeners are never attached at all.
     Hover still works; it just doesn't tilt.
   ====================================================================== */
(function () {{
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Skip on touch/coarse pointers — tilt on tap is jitter, not polish.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var MAX_DEG = 3;
  var root = document.querySelector('.page');
  var active = null;   // the tile currently under the pointer
  var rect = null;     // its cached bounding box

  root.addEventListener('pointerover', function (e) {{
    var tile = e.target.closest('.tile');
    if (!tile || tile === active) return;
    if (active) reset(active);
    active = tile;
    rect = tile.getBoundingClientRect();
  }});

  root.addEventListener('pointermove', function (e) {{
    if (!active || !rect) return;
    // normalise cursor position within the tile to -0.5 … 0.5
    var px = (e.clientX - rect.left) / rect.width - 0.5;
    var py = (e.clientY - rect.top) / rect.height - 0.5;
    // rotateX is inverted: pointer high on the tile should tip the top away
    active.style.setProperty('--rx', (-py * 2 * MAX_DEG).toFixed(2) + 'deg');
    active.style.setProperty('--ry', ( px * 2 * MAX_DEG).toFixed(2) + 'deg');
  }});

  root.addEventListener('pointerout', function (e) {{
    if (!active) return;
    // ignore moves between the tile's own children
    if (e.relatedTarget && active.contains(e.relatedTarget)) return;
    reset(active);
    active = null;
    rect = null;
  }});

  // Recompute on scroll/resize rather than trusting a stale rect.
  window.addEventListener('scroll', invalidate, {{ passive: true }});
  window.addEventListener('resize', invalidate);

  function invalidate() {{
    if (active) rect = active.getBoundingClientRect();
  }}

  function reset(tile) {{
    tile.style.setProperty('--rx', '0deg');
    tile.style.setProperty('--ry', '0deg');
  }}
}})();
</script>

</body>
</html>
"""

with open("/mnt/user-data/outputs/color-identity-directory.html", "w") as f:
    f.write(HTML)

print("written", len(HTML), "bytes")
