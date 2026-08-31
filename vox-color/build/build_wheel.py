import math, json

cx = cy = 400.0
R = 260.0
ORDER = ["W", "U", "B", "R", "G"]

pts = {}
for i, c in enumerate(ORDER):
    a = math.radians(-90 + 72 * i)
    pts[c] = (round(cx + R * math.cos(a), 2), round(cy + R * math.sin(a), 2))

# label anchors pushed outward from each vertex
lab = {}
for i, c in enumerate(ORDER):
    a = math.radians(-90 + 72 * i)
    lab[c] = (round(cx + (R + 62) * math.cos(a), 2), round(cy + (R + 62) * math.sin(a), 2))


def inter(p1, p2, p3, p4):
    x1, y1 = p1; x2, y2 = p2; x3, y3 = p3; x4, y4 = p4
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d
    py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d
    return round(px, 2), round(py, 2)


ALLY_PAIRS = [("W", "U"), ("U", "B"), ("B", "R"), ("R", "G"), ("G", "W")]
ENEMY_PAIRS = [("W", "B"), ("U", "R"), ("B", "G"), ("R", "W"), ("G", "U")]

# ---------------------------------------------------------------- content
# All copy below is PARAPHRASE of the cited MaRo articles, deliberately not
# quotation — see the note in the HTML head comment.

COLORS = {
    "W": dict(name="White", goal="Peace",
              key="Obligation, met through self-discipline",
              blurb="Sees avoidable suffering everywhere and enough resources to end it. The obstacle is that the plan only works if everyone commits to it."),
    "U": dict(name="Blue", goal="Perfection",
              key="Method, held open to adaptation",
              blurb="Treats every person as a blank slate with unbounded potential. Improvement never finishes, so haste is the enemy and time is the resource."),
    "B": dict(name="Black", goal="Power",
              key="Flexibility, and self-interest without apology",
              blurb="Claims to be the only color seeing the world as it actually is rather than as it should be. Didn't make the world greedy — just declines to pretend otherwise."),
    "R": dict(name="Red", goal="Freedom",
              key="Trusting what you feel",
              blurb="Holds that the answer already arrives as feeling, and the other four colors just talk over it. Measures a life by regret, not by outcome."),
    "G": dict(name="Green", goal="Acceptance",
              key="Embracing the role you were born into",
              blurb="Alone among the five in not wanting to change the world, on the grounds that the natural order already resolved every question worth asking."),
}

ALLIES = {
    "WU": dict(value="Restraint", enemy="R",
               blurb="Both are undone by impulse. White needs the group to think several moves ahead; blue needs the individual to. Together: plan backwards from the ending.",
               split="Free will versus destiny — blue grants people agency, white assigns them a role."),
    "UB": dict(value="Choice", enemy="G",
               blurb="Both refuse a life assigned at birth. Blue wants options in order to improve; black wants them in order to advance. Together: stay unreadable and keep every door open.",
               split="Freedom versus security — black wants no limits, blue wants a floor under the chaos."),
    "BR": dict(value="Individualism", enemy="W",
               blurb="Neither accepts being told to choose against itself. Black wants merit rewarded; red wants impulse followed. Together: strip the restrictions and move.",
               split="Nature versus nurture — black says you build yourself, red says you were already built."),
    "RG": dict(value="Intuition", enemy="U",
               blurb="Both are insulted by the instruction to ignore what's inside them. Red calls it emotion, green calls it instinct. Together: act faster than deliberation allows.",
               split="Group versus individual — green sees a web of obligation, red sees its own path."),
    "GW": dict(value="Responsibility", enemy="B",
               blurb="Both object to advancement bought at someone else's cost. Green protects the web; white protects the group. Together: many small things become one large thing.",
               split="Head versus heart — white overrides instinct, green follows it."),
}

# Each conflict, three ways: how each side frames it, plus MaRo's neutral summary.
ENEMIES = {
    "WB": dict(title="The Good of the Group vs. the Good of the Individual",
               core="At bottom: how a person ranks the claims on them.",
               views={"W": "Good against evil. A society is judged by how it treats the person with the least.",
                      "B": "Encouragement against coddling. Reward the effort or watch effort stop."}),
    "UR": dict(title="Head vs. Heart",
               core="At bottom: how a life should be conducted.",
               views={"U": "Carefulness against recklessness. Errors come from moving before you understand.",
                      "R": "Passion against indifference. Errors come from overriding what you already felt."}),
    "BG": dict(title="Free Will vs. Destiny",
               core="At bottom: how much of your life is yours to decide.",
               views={"B": "Opportunity against superstition. Nothing was written; go take it.",
                      "G": "Truth against skepticism. The pattern is real whether or not you flatter yourself."}),
    "RW": dict(title="Freedom vs. Security",
               core="At bottom: what a society owes the people inside it.",
               views={"R": "Democracy against fascism. Nobody appointed you to run my life.",
                      "W": "Order against chaos. Your appetites are not worth someone else's safety."}),
    "GU": dict(title="Nature vs. Nurture",
               core="At bottom: what makes a person who they are.",
               views={"G": "Acceptance against denial. You already are something; stop refusing it.",
                      "U": "Opportunity against stagnation. You are not finished; stop pretending you are."}),
}

# Verified earlier against the MTG Wiki Commander 2016 cycle table.
FOUR = {
    "W": dict(colors="UBRG", commander="Yidris, Maelstrom Wielder", deck="Entropic Uprising"),
    "U": dict(colors="WBRG", commander="Saskia the Unyielding", deck="Open Hostility"),
    "B": dict(colors="WURG", commander="Kynaios and Tiro of Meletis", deck="Stalwart Unity"),
    "R": dict(colors="WUBG", commander="Atraxa, Praetors' Voice", deck="Breed Lethality"),
    "G": dict(colors="WUBR", commander="Breya, Etherium Shaper", deck="Invent Superiority"),
}

# ---------------------------------------------------------------- geometry
crossings = {}
for i in range(len(ENEMY_PAIRS)):
    for j in range(i + 1, len(ENEMY_PAIRS)):
        a, b = ENEMY_PAIRS[i]
        c, d = ENEMY_PAIRS[j]
        s = {a, b, c, d}
        if len(s) < 4:
            continue
        excl = (set(ORDER) - s).pop()
        crossings[excl] = inter(pts[a], pts[b], pts[c], pts[d])
assert len(crossings) == 5, "expected exactly five interior crossings"

DATA = dict(colors=COLORS, allies=ALLIES, enemies=ENEMIES, four=FOUR,
            order=ORDER, names={k: v["name"] for k, v in COLORS.items()})


def edge(a, b, cls, key):
    x1, y1 = pts[a]; x2, y2 = pts[b]
    return f'''      <g class="edge {cls}" data-kind="{cls}" data-key="{key}" tabindex="0" role="button"
         aria-label="{COLORS[a]['name']} and {COLORS[b]['name']}">
        <line class="edge-hit" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"></line>
        <line class="edge-line" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"
              style="stroke:url(#grad-{key})"></line>
      </g>'''


def grad(a, b, key):
    x1, y1 = pts[a]; x2, y2 = pts[b]
    return (f'    <linearGradient id="grad-{key}" gradientUnits="userSpaceOnUse" '
            f'x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">'
            f'<stop offset="0%" stop-color="var(--{a.lower()})"/>'
            f'<stop offset="100%" stop-color="var(--{b.lower()})"/></linearGradient>')


vertex_nodes = []
for c in ORDER:
    x, y = pts[c]
    lx, ly = lab[c]
    anchor = "middle"
    dy = "0.35em"
    if lx > cx + 20: anchor = "start"
    elif lx < cx - 20: anchor = "end"
    if c == "W": dy = "0em"
    vertex_nodes.append(f'''      <g class="vertex v-{c.lower()}" data-kind="color" data-key="{c}" tabindex="0" role="button"
         aria-label="{COLORS[c]['name']}">
        <circle class="vertex-halo" cx="{x}" cy="{y}" r="34"></circle>
        <circle class="vertex-dot" cx="{x}" cy="{y}" r="17" style="fill:var(--{c.lower()})"></circle>
        <text class="vertex-label" x="{lx}" y="{ly}" text-anchor="{anchor}" dy="{dy}">{COLORS[c]['name']}</text>
        <text class="vertex-goal" x="{lx}" y="{ly + 21}" text-anchor="{anchor}">{COLORS[c]['goal']}</text>
      </g>''')

cross_nodes = []
quad_nodes = []
CR = 11.0  # crossing marker radius


def arc(x, y, r, a1, a2):
    """SVG path for a circular arc from a1 to a2 (degrees) about (x,y)."""
    r1, r2 = math.radians(a1), math.radians(a2)
    sx, sy = x + r * math.cos(r1), y + r * math.sin(r1)
    ex, ey = x + r * math.cos(r2), y + r * math.sin(r2)
    large = 1 if (a2 - a1) % 360 > 180 else 0
    return f"M {sx:.2f} {sy:.2f} A {r} {r} 0 {large} 1 {ex:.2f} {ey:.2f}"


for excl in ORDER:
    x, y = crossings[excl]
    inc = [c for c in ORDER if c != excl]           # included, in wheel order
    # four quadrant arcs, one per included colour, with a hairline gap between
    arcs = "\n".join(
        f'          <path class="cross-arc" d="{arc(x, y, CR, -90 + 90*i + 3, -90 + 90*(i+1) - 3)}" '
        f'style="stroke:var(--{c.lower()})"></path>'
        for i, c in enumerate(inc))
    cross_nodes.append(f'''      <g class="cross" data-kind="four" data-key="{excl}" tabindex="0" role="button"
         aria-label="Four-color identity excluding {COLORS[excl]['name']}">
        <circle class="cross-hit" cx="{x}" cy="{y}" r="26"></circle>
        <g class="cross-g">
          <circle class="cross-core" cx="{x}" cy="{y}" r="{CR}"></circle>
{arcs}
        </g>
      </g>''')
    # the region this identity occupies: polygon of the four included vertices
    poly = " ".join(f"{pts[c][0]},{pts[c][1]}" for c in inc)
    quad_nodes.append(f'      <polygon class="quad" data-quad="{excl}" points="{poly}"></polygon>')

ally_edges = "\n".join(edge(a, b, "ally", a + b) for a, b in ALLY_PAIRS)
enemy_edges = "\n".join(edge(a, b, "enemy", a + b) for a, b in ENEMY_PAIRS)
grads = "\n".join(grad(a, b, a + b) for a, b in ALLY_PAIRS + ENEMY_PAIRS)

HTML = f"""<!DOCTYPE html>
<!--
==============================================================================
 THE COLOR WHEEL — interactive, layers 1-3
==============================================================================
 Single static file. No build step, no framework. Companion to the 32-identity
 directory and sharing its tokens and type stack.

 WHAT THIS IS
 ------------
 The pentagram diagram, decomposed. The reference PNG fails by firing four
 datasets at once; this shows one at a time. Three layers ship here:

   1. Vertices ...... each color's goal and the method it reaches it by
   2. Edges ......... allied pairs (pentagon) and enemy pairs (star)
   3. Crossings ..... the five interior intersections of the star

 LAYER 4 IS DELIBERATELY ABSENT
 ------------------------------
 The mechanical overlay (primary/secondary/tertiary ability access) is stubbed,
 not built. It needs the Mechanical Color Pie 2021 dataset — roughly 150
 abilities with tier assignments. The 2017 list is confirmed superseded and
 wiring it would ship known-stale tiering. Search "LAYER 4" for the hook.

 THE CROSSINGS ARE NOT DECORATION
 --------------------------------
 A pentagram has exactly five interior crossings. Two chords intersect only
 when their endpoints interleave around the circle, which means each crossing
 touches four colors and excludes exactly one — so the five crossings are in
 bijection with the five four-color identities. The coordinates here were
 solved numerically, not eyeballed, and asserted to be five distinct
 exclusions at generation time. Nobody labels these on the usual diagram.

 SOURCES AND WORDING
 -------------------
 Content is MaRo canon, drawn from "Pie Fights" (Nov 2016) for the conflicts
 and philosophies, and "Thank You for Being a Friend" (Mar 2017) for the
 alliances. Each panel cites which.

 All copy is PARAPHRASE, written fresh — not quotation. That is deliberate on
 two counts: the articles are Wizards' copyright, and the Codex should speak in
 its own voice anyway. Swap freely; nothing here is precious.

 Two things worth knowing about the sources:
 - MaRo contradicts himself inside "Pie Fights": the philosophy section says
   green wants acceptance, the summary section says green wants growth.
   Acceptance is used here, matching the 2015 revisited series.
 - The "goal through method" vertex format is Sabien's formula, not MaRo's.
   The method lines here are instead built from MaRo's own "the key to X is Y"
   closers in "Thank You for Being a Friend", so the structure stays canon.

 MOTION
 ------
 Static at rest. No ambient animation, no rAF loop, no particles — same rules
 as the directory. Hover and selection are the only things that move, and
 prefers-reduced-motion removes them rather than slowing them.
==============================================================================
-->
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Color Wheel — Vox Mana</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Almendra:wght@400;700&family=Cormorant+SC:wght@400;500;600;700&family=Lora:wght@400;500&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">

<style>
  /* ===================================================================
     TOKENS — shared with the identity directory
     =================================================================== */
  :root {{
    --obsidian:#0b0c11; --panel:#14151d;
    --bone:#ede6d3; --bone-dim:rgba(237,230,211,.56); --bone-faint:rgba(237,230,211,.30);
    --gold:#d4af37;
    --w:#f5efc7; --u:#77b9e8; --b:#aca29a; --r:#d97858; --g:#7fb283;
    --glass:rgba(237,230,211,.045); --hairline:rgba(237,230,211,.12);
    --ease:cubic-bezier(.2,.8,.2,1);
  }}
  * {{ box-sizing:border-box; }}
  html,body {{ margin:0; padding:0; }}
  body {{
    min-height:100vh; background:var(--obsidian); color:var(--bone);
    font-family:'Lora',Georgia,serif; isolation:isolate;
  }}

  /* static ambient mesh, same approach as the directory */
  .mesh {{
    position:fixed; inset:-10vmax; z-index:-1; pointer-events:none;
    background:
      radial-gradient(38vmax 30vmax at 20% 14%, rgba(245,239,199,.09), transparent 62%),
      radial-gradient(40vmax 32vmax at 82% 18%, rgba(119,185,232,.12), transparent 64%),
      radial-gradient(40vmax 32vmax at 88% 76%, rgba(172,162,154,.10), transparent 64%),
      radial-gradient(38vmax 30vmax at 50% 96%, rgba(217,120,88,.10), transparent 62%),
      radial-gradient(40vmax 32vmax at 12% 72%, rgba(127,178,131,.10), transparent 64%),
      var(--obsidian);
    filter:blur(30px);
  }}

  .page {{ max-width:1280px; margin:0 auto; padding:clamp(28px,5vw,64px) clamp(16px,4vw,40px) 80px; }}

  /* ===================================================================
     HEADER + LAYER CONTROLS
     =================================================================== */
  .hero {{ text-align:center; margin-bottom:28px; }}
  .hero-kicker {{
    font-family:'Outfit',system-ui,sans-serif; font-size:11px; letter-spacing:.26em;
    text-transform:uppercase; color:var(--bone-faint); margin:0 0 12px;
  }}
  .hero-title {{
    font-family:'Almendra',Georgia,serif; font-weight:700;
    font-size:clamp(28px,4.6vw,44px); margin:0 0 10px;
  }}
  .hero-lede {{ max-width:54ch; margin:0 auto; font-size:14.5px; line-height:1.6; color:var(--bone-dim); }}

  .layers {{
    display:flex; flex-wrap:wrap; justify-content:center; gap:8px;
    margin:26px 0 6px;
  }}
  .layer-btn {{
    font-family:'Outfit',system-ui,sans-serif; font-size:11.5px; font-weight:400;
    letter-spacing:.1em; text-transform:uppercase;
    padding:8px 15px; border-radius:999px; cursor:pointer;
    background:var(--glass); color:var(--bone-dim);
    border:1px solid var(--hairline);
    -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px);
    transition:background .25s var(--ease), color .25s var(--ease), border-color .25s var(--ease);
  }}
  .layer-btn:hover {{ color:var(--bone); border-color:rgba(237,230,211,.26); }}
  .layer-btn[aria-pressed="true"] {{
    color:var(--obsidian); background:var(--gold); border-color:var(--gold); font-weight:500;
  }}
  .layer-btn:focus-visible {{ outline:2px solid var(--gold); outline-offset:3px; }}
  .layer-btn[disabled] {{ opacity:.34; cursor:not-allowed; }}

  .layer-note {{
    text-align:center; font-family:'Outfit',system-ui,sans-serif;
    font-size:11px; color:var(--bone-faint); margin:0 0 4px; min-height:1.2em;
  }}

  /* ===================================================================
     LAYOUT — wheel beside panel on wide, stacked on narrow
     =================================================================== */
  .stage {{ display:grid; grid-template-columns:minmax(0,1.15fr) minmax(300px,.85fr); gap:clamp(16px,3vw,40px); align-items:center; }}
  @media (max-width:900px) {{ .stage {{ grid-template-columns:1fr; }} }}

  .wheel-wrap {{ position:relative; }}
  svg.wheel {{ width:100%; height:auto; display:block; overflow:visible; }}

  /* ===================================================================
     WHEEL ELEMENTS
     All static at rest. Only opacity/stroke/scale change, and only on
     hover, focus or selection.
     =================================================================== */
  .edge-hit {{ stroke:transparent; stroke-width:26; fill:none; pointer-events:stroke; }}
  /* Base opacity is deliberately high: these lines carry the structure, and at
     .5 the mid-value colours (black especially) sank into the background. */
  .edge-line {{ stroke-width:2.4; fill:none; pointer-events:none; opacity:.75;
                transition:opacity .25s var(--ease), stroke-width .25s var(--ease); }}
  .edge.enemy .edge-line {{ stroke-dasharray:7 6; }}
  .edge {{ cursor:pointer; outline:none; }}
  .edge:hover .edge-line, .edge:focus-visible .edge-line {{ opacity:1; stroke-width:3.5; }}
  .edge:focus-visible .edge-hit {{ stroke:rgba(212,175,55,.3); }}

  .vertex {{ cursor:pointer; outline:none; }}
  .vertex-halo {{ fill:rgba(237,230,211,.05); stroke:var(--hairline); stroke-width:1;
                  transition:fill .25s var(--ease), stroke .25s var(--ease); }}
  .vertex-dot {{ transition:transform .25s var(--ease); transform-origin:center; transform-box:fill-box; }}
  .vertex:hover .vertex-dot, .vertex:focus-visible .vertex-dot {{ transform:scale(1.14); }}
  .vertex:hover .vertex-halo, .vertex:focus-visible .vertex-halo {{
    fill:rgba(237,230,211,.09); stroke:rgba(237,230,211,.3);
  }}
  .vertex-label {{
    font-family:'Cormorant SC',Georgia,serif; font-size:23px; font-weight:600;
    letter-spacing:.04em; fill:var(--bone); pointer-events:none;
  }}
  .vertex-goal {{
    font-family:'Outfit',system-ui,sans-serif; font-size:11.5px; font-weight:300;
    letter-spacing:.16em; text-transform:uppercase; fill:var(--bone-faint); pointer-events:none;
  }}

  .cross {{ cursor:pointer; outline:none; }}
  .cross-hit {{ fill:transparent; }}
  /* Each crossing wears its own identity: four arcs, one per included colour,
     so you can read WUBG off the marker without clicking it. */
  .cross-core {{ fill:var(--obsidian); opacity:.9; }}
  .cross-arc {{ fill:none; stroke-width:3.4; stroke-linecap:butt; opacity:.9; }}
  .cross-g {{ transition:transform .25s var(--ease); transform-origin:center; transform-box:fill-box; }}
  .cross:hover .cross-g, .cross:focus-visible .cross-g {{ transform:scale(1.28); }}
  .cross:focus-visible .cross-core {{ stroke:var(--gold); stroke-width:1.5; }}

  /* layer visibility */
  .layer-off {{ display:none; }}

  /* Dimming: unrelated elements should RECEDE, not vanish. Earlier values
     (.13 edge, .24 dot) erased the far side of the wheel — selecting White
     made the blue/green structure unreadable. These keep it present. */
  .wheel.has-selection .edge:not(.is-rel) .edge-line {{ opacity:.34; }}
  .wheel.has-selection .vertex:not(.is-rel) .vertex-dot {{ opacity:.5; }}
  .wheel.has-selection .vertex:not(.is-rel) .vertex-label,
  .wheel.has-selection .vertex:not(.is-rel) .vertex-goal {{ opacity:.52; }}
  .wheel.has-selection .cross:not(.is-rel) .cross-arc {{ opacity:.35; }}
  .edge-line, .vertex-dot, .vertex-label, .vertex-goal, .cross-arc {{ transition:opacity .3s var(--ease); }}
  /* the excluded colour on a four-colour selection is pushed further back */
  .vertex.is-excluded .vertex-dot {{ opacity:.14; }}

  /* --- four-colour region ------------------------------------------
     A crossing on its own is an anonymous dot. Selecting one fills the
     quadrilateral of the four INCLUDED vertices, so the identity reads as
     an area of the wheel rather than a point on it. Hidden until selected. */
  .quad {{ fill:rgba(212,175,55,.07); stroke:rgba(212,175,55,.4); stroke-width:1.5;
           stroke-dasharray:5 5; opacity:0; pointer-events:none;
           transition:opacity .3s var(--ease); }}
  .quad.is-shown {{ opacity:1; }}

  /* ===================================================================
     PANEL
     =================================================================== */
  .panel {{
    padding:26px 24px; border-radius:16px; min-height:330px;
    background:var(--glass); border:1px solid var(--hairline);
    -webkit-backdrop-filter:blur(16px) saturate(1.3); backdrop-filter:blur(16px) saturate(1.3);
    box-shadow:inset 0 1px 0 rgba(237,230,211,.06);
  }}
  .panel-kicker {{
    font-family:'Outfit',system-ui,sans-serif; font-size:10.5px; font-weight:500;
    letter-spacing:.2em; text-transform:uppercase; color:var(--gold); margin:0 0 10px;
  }}
  .panel-title {{
    font-family:'Cormorant SC',Georgia,serif; font-weight:600; font-size:27px;
    letter-spacing:.03em; margin:0 0 4px; line-height:1.2;
  }}
  .panel-sub {{
    font-family:'Outfit',system-ui,sans-serif; font-size:12px; font-weight:300;
    letter-spacing:.05em; color:var(--bone-dim); margin:0 0 16px;
  }}
  .panel-body {{ font-size:14.5px; line-height:1.68; color:var(--bone-dim); margin:0 0 16px; }}
  .panel-body strong {{ color:var(--bone); font-weight:500; }}
  .panel-src {{
    font-family:'Outfit',system-ui,sans-serif; font-size:10.5px; font-weight:300;
    color:var(--bone-faint); margin:18px 0 0; padding-top:12px;
    border-top:1px solid var(--hairline);
  }}
  .panel-empty {{ color:var(--bone-faint); font-style:italic; }}

  /* three-way perspective switch on conflict panels */
  .views {{ display:flex; gap:6px; margin:0 0 14px; flex-wrap:wrap; }}
  .view-btn {{
    font-family:'Outfit',system-ui,sans-serif; font-size:11px; letter-spacing:.08em;
    padding:6px 12px; border-radius:999px; cursor:pointer;
    background:transparent; color:var(--bone-dim);
    border:1px solid var(--hairline);
    transition:background .2s var(--ease), color .2s var(--ease), border-color .2s var(--ease);
  }}
  .view-btn:hover {{ color:var(--bone); }}
  .view-btn[aria-pressed="true"] {{ color:var(--bone); border-color:currentColor; background:rgba(237,230,211,.07); }}
  .view-btn:focus-visible {{ outline:2px solid var(--gold); outline-offset:2px; }}

  .swatch {{ display:inline-block; width:9px; height:9px; border-radius:50%; margin-right:7px; vertical-align:middle; }}

  @media (prefers-reduced-motion: reduce) {{
    *, *::before, *::after {{ animation:none !important; transition:none !important; }}
  }}
  @supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))) {{
    .panel, .layer-btn {{ background:rgba(20,21,29,.85); }}
  }}
</style>
</head>
<body>
<div class="mesh" aria-hidden="true"></div>

<main class="page">
  <header class="hero">
    <p class="hero-kicker">Vox Mana · Codex</p>
    <h1 class="hero-title">The Color Wheel</h1>
    <p class="hero-lede">
      Five goals, five alliances, five conflicts, and the five identities hiding
      where the conflicts cross. One layer at a time.
    </p>
  </header>

  <!-- Layer toggles. Enemies default OFF: the whole point is that the layers
       don't fire simultaneously. LAYER 4 button is present but disabled. -->
  <div class="layers" role="group" aria-label="Diagram layers">
    <button class="layer-btn" id="lay-ally"   aria-pressed="true">Alliances</button>
    <button class="layer-btn" id="lay-enemy"  aria-pressed="false">Conflicts</button>
    <button class="layer-btn" id="lay-cross"  aria-pressed="false">Four-Color</button>
    <!-- LAYER 4: enable once the Mechanical Color Pie 2021 dataset is wired. -->
    <button class="layer-btn" id="lay-mech" aria-pressed="false" disabled
            title="Needs the Mechanical Color Pie 2021 dataset">Mechanics — not wired</button>
  </div>
  <p class="layer-note" id="layerNote"></p>

  <div class="stage">
    <div class="wheel-wrap">
      <svg class="wheel" id="wheel" viewBox="-30 60 860 700" role="group"
           aria-label="Interactive color wheel">
        <defs>
{grads}
        </defs>

        <!-- FOUR-COLOR REGIONS — behind everything, revealed on selection -->
        <g id="g-quad">
{chr(10).join(quad_nodes)}
        </g>

        <!-- ALLY EDGES — the pentagon -->
        <g id="g-ally">
{ally_edges}
        </g>

        <!-- ENEMY CHORDS — the star -->
        <g id="g-enemy" class="layer-off">
{enemy_edges}
        </g>

        <!-- CROSSINGS — coordinates solved numerically, see head comment -->
        <g id="g-cross" class="layer-off">
{chr(10).join(cross_nodes)}
        </g>

        <!-- VERTICES last so they sit above the lines -->
        <g id="g-vertex">
{chr(10).join(vertex_nodes)}
        </g>
      </svg>
    </div>

    <aside class="panel" id="panel" aria-live="polite">
      <p class="panel-kicker">Start anywhere</p>
      <h2 class="panel-title">Pick a point</h2>
      <p class="panel-body panel-empty">
        Choose a color for its philosophy, an edge for what two colors share or
        dispute, or — with the four-color layer on — one of the five points where
        the conflicts intersect.
      </p>
    </aside>
  </div>
</main>

<script>
/* =====================================================================
   DATA — generated from the source articles, see head comment.
   ===================================================================== */
const D = {json.dumps(DATA, indent=1)};

const SRC_PIE   = 'Rosewater, "Pie Fights," Nov 2016 — paraphrased';
const SRC_FRIEND= 'Rosewater, "Thank You for Being a Friend," Mar 2017 — paraphrased';
const SRC_C16   = 'Commander 2016 signature commanders';

const wheel = document.getElementById('wheel');
const panel = document.getElementById('panel');
const note  = document.getElementById('layerNote');

/* ---------------------------------------------------------------- layers */
const layers = {{
  ally:  {{ btn:document.getElementById('lay-ally'),  grp:document.getElementById('g-ally'),  on:true  }},
  enemy: {{ btn:document.getElementById('lay-enemy'), grp:document.getElementById('g-enemy'), on:false }},
  cross: {{ btn:document.getElementById('lay-cross'), grp:document.getElementById('g-cross'), on:false }}
}};

Object.entries(layers).forEach(([k, L]) => {{
  L.btn.addEventListener('click', () => {{
    L.on = !L.on;
    L.btn.setAttribute('aria-pressed', String(L.on));
    L.grp.classList.toggle('layer-off', !L.on);
    // Turning a layer off should drop a selection that lives on it.
    if (!L.on && sel && sel.layer === k) clearSelection();
    updateNote();
  }});
}});

function updateNote() {{
  // The crossings are meaningless without the chords that produce them,
  // so say so rather than silently showing floating dots.
  if (layers.cross.on && !layers.enemy.on) {{
    note.textContent = 'The crossings are intersections of the conflict chords — turn Conflicts on to see why they sit there.';
  }} else if (!layers.ally.on && !layers.enemy.on && !layers.cross.on) {{
    note.textContent = 'All layers hidden.';
  }} else {{
    note.textContent = '';
  }}
}}

/* ---------------------------------------------------------------- helpers */
const esc = s => String(s).replace(/[&<>"]/g, c => ({{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}})[c]);
const dot = c => `<span class="swatch" style="background:var(--${{c.toLowerCase()}})"></span>`;
const nm  = c => D.names[c];

function keyFor(a, b) {{
  // edge keys are stored in wheel order, so try both
  return D.allies[a+b] ? a+b : (D.allies[b+a] ? b+a : (D.enemies[a+b] ? a+b : b+a));
}}

/* ---------------------------------------------------------------- selection */
let sel = null;

function clearSelection() {{
  sel = null;
  wheel.classList.remove('has-selection');
  wheel.querySelectorAll('.is-rel,.is-excluded').forEach(n => n.classList.remove('is-rel','is-excluded'));
  wheel.querySelectorAll('.quad.is-shown').forEach(n => n.classList.remove('is-shown'));
  panel.innerHTML = `
    <p class="panel-kicker">Start anywhere</p>
    <h2 class="panel-title">Pick a point</h2>
    <p class="panel-body panel-empty">Choose a color, an edge, or a crossing.</p>`;
}}

function highlight(nodes, excluded) {{
  wheel.querySelectorAll('.is-rel,.is-excluded').forEach(n => n.classList.remove('is-rel','is-excluded'));
  wheel.querySelectorAll('.quad.is-shown').forEach(n => n.classList.remove('is-shown'));
  wheel.classList.add('has-selection');
  nodes.forEach(n => n && n.classList.add('is-rel'));
  if (excluded) {{
    const v = wheel.querySelector(`.vertex[data-key="${{excluded}}"]`);
    if (v) v.classList.add('is-excluded');
    // reveal the region the four included colours enclose
    const q = wheel.querySelector(`.quad[data-quad="${{excluded}}"]`);
    if (q) q.classList.add('is-shown');
  }}
}}

const vtx  = c => wheel.querySelector(`.vertex[data-key="${{c}}"]`);
const edgeEl = k => wheel.querySelector(`.edge[data-key="${{k}}"]`);

/* ---------------------------------------------------------------- renderers */
function showColor(c) {{
  const o = D.colors[c];
  // a color's two allies are its neighbours; its two enemies are the rest
  const i = D.order.indexOf(c);
  const allies  = [D.order[(i+1)%5], D.order[(i+4)%5]];
  const enemies = D.order.filter(x => x !== c && !allies.includes(x));

  const allyRows = allies.map(a => {{
    const k = keyFor(c, a);
    return `<li>${{dot(a)}}<strong>${{esc(nm(a))}}</strong> — ${{esc(D.allies[k].value)}}</li>`;
  }}).join('');
  const enemyRows = enemies.map(e => {{
    const k = keyFor(c, e);
    return `<li>${{dot(e)}}<strong>${{esc(nm(e))}}</strong> — ${{esc(D.enemies[k].title)}}</li>`;
  }}).join('');

  panel.innerHTML = `
    <p class="panel-kicker">Color</p>
    <h2 class="panel-title">${{dot(c)}}${{esc(o.name)}} wants ${{esc(o.goal.toLowerCase())}}</h2>
    <p class="panel-sub">${{esc(o.key)}}</p>
    <p class="panel-body">${{esc(o.blurb)}}</p>
    <p class="panel-body"><strong>Allied with</strong></p>
    <ul class="panel-body" style="margin-top:-8px;padding-left:0;list-style:none">${{allyRows}}</ul>
    <p class="panel-body"><strong>In conflict with</strong></p>
    <ul class="panel-body" style="margin-top:-8px;padding-left:0;list-style:none">${{enemyRows}}</ul>
    <p class="panel-src">${{esc(SRC_PIE)}}</p>`;

  highlight([vtx(c), ...allies.map(a => edgeEl(keyFor(c,a))), ...allies.map(vtx),
             ...enemies.map(e => edgeEl(keyFor(c,e))), ...enemies.map(vtx)]);
}}

function showAlly(k) {{
  const o = D.allies[k];
  const [a, b] = [k[0], k[1]];
  panel.innerHTML = `
    <p class="panel-kicker">Alliance</p>
    <h2 class="panel-title">${{dot(a)}}${{dot(b)}}${{esc(nm(a))}} &amp; ${{esc(nm(b))}}</h2>
    <p class="panel-sub">Shared value: ${{esc(o.value)}}</p>
    <p class="panel-body">${{esc(o.blurb)}}</p>
    <p class="panel-body"><strong>Derived from their shared enemy.</strong>
      Both oppose ${{dot(o.enemy)}}${{esc(nm(o.enemy))}} — and what they agree on is
      what that opposition has in common.</p>
    <p class="panel-body"><strong>Where they split:</strong> ${{esc(o.split)}}</p>
    <p class="panel-src">${{esc(SRC_FRIEND)}}</p>`;
  // the shared enemy is highlighted too — that's the whole derivation
  highlight([edgeEl(k), vtx(a), vtx(b), vtx(o.enemy),
             edgeEl(keyFor(a, o.enemy)), edgeEl(keyFor(b, o.enemy))]);
}}

function showEnemy(k, view) {{
  const o = D.enemies[k];
  const [a, b] = [k[0], k[1]];
  view = view || 'neutral';
  const body = view === 'neutral' ? o.core : o.views[view];
  const btn = (v, label) =>
    `<button class="view-btn" data-view="${{v}}" aria-pressed="${{String(view===v)}}">${{label}}</button>`;

  panel.innerHTML = `
    <p class="panel-kicker">Conflict</p>
    <h2 class="panel-title">${{dot(a)}}${{dot(b)}}${{esc(o.title)}}</h2>
    <div class="views">
      ${{btn(a, nm(a) + "'s view")}}${{btn('neutral','Neutral')}}${{btn(b, nm(b) + "'s view")}}
    </div>
    <p class="panel-body">${{esc(body)}}</p>
    <p class="panel-src">${{esc(SRC_PIE)}} · Each conflict reads differently depending on
      which side states it — the neutral summary is a third framing, not the true one.</p>`;

  panel.querySelectorAll('.view-btn').forEach(el =>
    el.addEventListener('click', () => showEnemy(k, el.dataset.view)));

  highlight([edgeEl(k), vtx(a), vtx(b)]);
  sel = {{ kind:'enemy', key:k, layer:'enemy' }};
}}

function showFour(excl) {{
  const o = D.four[excl];
  const inc = o.colors.split('');
  panel.innerHTML = `
    <p class="panel-kicker">Four-Color · Crossing</p>
    <h2 class="panel-title">${{inc.map(dot).join('')}}Non-${{esc(nm(excl))}}</h2>
    <p class="panel-sub">${{esc(o.commander)}} · ${{esc(o.deck)}}</p>
    <p class="panel-body">This point is where two conflict chords cross. A chord pair
      intersects only when their endpoints alternate around the wheel, so every crossing
      touches four colors and leaves exactly one out — here, ${{dot(excl)}}<strong>${{esc(nm(excl))}}</strong>.</p>
    <p class="panel-body">Five crossings, five excluded colors, five four-color identities.
      The pentagram contains the whole tier and never labels it.</p>
    <p class="panel-src">${{esc(SRC_C16)}} · geometry solved at build time</p>`;

  const chords = [];
  wheel.querySelectorAll('#g-enemy .edge').forEach(e => {{
    const k = e.dataset.key;
    if (!k.includes(excl)) chords.push(e);   // the two chords through this point
  }});
  highlight([...chords, ...inc.map(vtx)], excl);
}}

/* ---------------------------------------------------------------- events */
function activate(g) {{
  const kind = g.dataset.kind, key = g.dataset.key;
  if (kind === 'color') {{ sel = {{kind, key, layer:null}};    showColor(key); }}
  else if (kind === 'ally')  {{ sel = {{kind, key, layer:'ally'}};  showAlly(key); }}
  else if (kind === 'enemy') {{ showEnemy(key); }}
  else if (kind === 'four')  {{ sel = {{kind, key, layer:'cross'}}; showFour(key); }}
}}

wheel.addEventListener('click', e => {{
  const g = e.target.closest('.vertex,.edge,.cross');
  if (g) activate(g); else clearSelection();
}});

// Keyboard parity: every target is focusable and Enter/Space activates it.
wheel.addEventListener('keydown', e => {{
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const g = e.target.closest('.vertex,.edge,.cross');
  if (!g) return;
  e.preventDefault();
  activate(g);
}});

document.addEventListener('keydown', e => {{ if (e.key === 'Escape') clearSelection(); }});

updateNote();
</script>
</body>
</html>
"""

with open("/mnt/user-data/outputs/color-wheel.html", "w") as f:
    f.write(HTML)
print("written", len(HTML), "bytes")
