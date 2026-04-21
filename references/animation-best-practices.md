# Animation Best Practices — Positive Animation Design Grammar

> Based on deep deconstruction of Anthropic's three official product animations
> (Claude Design / Claude Code Desktop / Claude for Word),
> distilled into "Anthropic-level" animation design rules.
>
> Use alongside `animation-pitfalls.md` (pitfall checklist) — this file is "**do it this way**",
> pitfalls is "**don't do it this way**", the two are orthogonal, read both.
>
> **Constraint declaration**: This file only covers **motion logic and expression style**,
> **no specific brand color values are introduced**.
> Color decisions go through §1.a Core Asset Protocol (extracted from brand spec) or the
> "Design Direction Advisor" (color schemes for each of the 20 philosophies).
> This reference discusses "**how to move**", not "**what color**".

---

## §0 — Who You Are — Identity & Taste

> Before reading any technical rules below, read this section first. Rules **emerge from identity** —
> not the other way around.

### §0.1 Identity Anchor

**You are a motion designer who has studied the motion archives of Anthropic / Apple / Pentagram / Field.io.**

When making animations, you're not tweaking CSS transitions — you're using digital elements to
**simulate a physical world**, making the viewer's subconscious believe "this has weight, inertia,
and can overflow."

You don't make PowerPoint-style animations. You don't make "fade in fade out" animations.
The animations you make **convince people the screen is a space they can reach into**.

### §0.2 Core Beliefs (3 Principles)

1. **Animation is physics, not animation curves**
   `linear` is digital, `expoOut` is an object. You believe pixels on screen deserve to be treated
   as "objects." Every easing choice answers the physics question: "How heavy is this element?
   What's its friction coefficient?"

2. **Time allocation matters more than curve shape**
   Slow-Fast-Boom-Stop is your breathing rhythm. **Evenly-paced animation is a tech demo;
   rhythmic animation is narrative.** Slowing down at the right moment matters more than using
   the right easing at the wrong moment.

3. **Yielding to the viewer is harder than showing off**
   Pausing 0.5s before a key result is **technique**, not compromise. **Giving the human brain
   reaction time is the highest discipline of an animator.** AI defaults to making animations
   with no pauses and maximum information density — that's a beginner move. What you need to do
   is exercise restraint.

### §0.3 Taste Standards — What Is Beautiful

Your criteria for judging "good" vs "great" are as follows. Each has an **identification method** —
when you see a candidate animation, use these questions to judge whether it meets the bar,
rather than mechanically checking against 14 rules.

| Dimension of Beauty | Identification Method (Viewer Reaction) |
|---|---|
| **Physical weight** | When the animation ends, the element "**lands**" solidly — not just "**stops**" there. The viewer subconsciously feels "this has weight" |
| **Yielding to the viewer** | There's a perceptible pause (≥300ms) before key information appears — the viewer has time to "**see**" before continuing |
| **Negative space** | The ending is an abrupt stop + hold, not fade to black. The last frame is clear, decisive, with a sense of finality |
| **Restraint** | Only one spot in the entire piece is "120% exquisite", the remaining 80% is just right — **showing off everywhere is a cheap signal** |
| **Feel** | Arcs (not straight lines), irregularity (not the mechanical rhythm of setInterval), a breathing quality |
| **Respect** | Showing the tweaking process, showing bug fixes — **not hiding the work, not presenting "magic"**. AI is a collaborator, not a magician |

### §0.4 Self-Check — Viewer First Reaction Method

After finishing an animation, **what is the viewer's first reaction after watching?** — this is the
only metric you need to optimize.

| Viewer Reaction | Rating | Diagnosis |
|---|---|---|
| "Looks pretty smooth" | good | Passing but unremarkable, you're making PowerPoint |
| "This animation is really fluid" | good+ | Technically correct, but not stunning |
| "This thing really looks like it **floated up from the desktop**" | great | You've achieved physical weight |
| "This doesn't look like AI made it" | great+ | You've reached Anthropic's threshold |
| "I want to **screenshot** this and share it" | great++ | You've made the viewer actively want to share |

**The difference between great and good is not technical correctness, but taste judgment**.
Technically correct + good taste = great. Technically correct + no taste = good.
Technically wrong = hasn't even started.

### §0.5 Relationship Between Identity and Rules

The technical rules in §1-§8 below are the **execution methods** of this identity in specific
scenarios — not an independent checklist.

- When encountering a scenario not covered by rules → return to §0, judge using **identity**,
  don't guess
- When rules conflict with each other → return to §0, use **taste standards** to judge which
  is more important
- When wanting to break a rule → first answer: "Which criterion in §0.3 does this satisfy?"
  If you can answer, break it; if not, don't

Good. Continue reading.

---

## Overview — Animation as Physics in Three Layers

The root cause of most AI-generated animations feeling cheap is — **they behave like "numbers"
not "objects"**. Real-world objects have mass, inertia, elasticity, and can overflow.
The "premium feel" of Anthropic's three videos comes from giving digital elements a set of
**physical world motion rules**.

These rules have 3 layers:

1. **Narrative rhythm layer**: Slow-Fast-Boom-Stop time allocation
2. **Motion curve layer**: Expo Out / Overshoot / Spring, reject linear
3. **Expression language layer**: Show the process, mouse arcs, Logo morph convergence

---

## 1. Narrative Rhythm — Slow-Fast-Boom-Stop 5-Part Structure

All three Anthropic videos follow this structure without exception:

| Part | Proportion | Tempo | Purpose |
|---|---|---|---|
| **S1 Trigger** | ~15% | Slow | Give humans reaction time, establish realism |
| **S2 Generation** | ~15% | Medium | Visual wow moment appears |
| **S3 Process** | ~40% | Fast | Show controllability/density/detail |
| **S4 Burst** | ~20% | Boom | Camera pulls back/3D pop-out/multi-panel surge |
| **S5 Landing** | ~10% | Still | Brand Logo + abrupt stop |

**Specific duration mapping** (for a 15-second animation):
S1 Trigger 2s — S2 Generation 2s — S3 Process 6s — S4 Burst 3s — S5 Landing 2s

**Things you must not do**:
- ❌ Even pacing (same information density every second) — viewer fatigue
- ❌ Sustained high density — no peak, no memorable moment
- ❌ Fade-out ending (fade out to transparent) — should **stop abruptly**

**Self-check**: Draw 5 thumbnails on paper, each representing the climax frame of each part.
If the 5 images don't differ much, the rhythm isn't working.

---

## 2. Easing Philosophy — Reject linear, Embrace Physics

All motion effects in Anthropic's three videos use bezier curves with "damping feel."
The default cubic easeOut (`1-(1-t)³`) **isn't sharp enough** — the start isn't fast enough,
the stop isn't stable enough.

### Three Core Easings (built into animations.jsx)

```js
// 1. Expo Out — rapid start, slow brake (most common, default main easing)
// CSS equivalent: cubic-bezier(0.16, 1, 0.3, 1)
Easing.expoOut(t) // = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

// 2. Overshoot — elastic toggle/button pop
// CSS equivalent: cubic-bezier(0.34, 1.56, 0.64, 1)
Easing.overshoot(t)

// 3. Spring physics — geometry settling, natural landing
Easing.spring(t)
```

### Usage Mapping

| Scenario | Which Easing |
|---|---|
| Card rise-in / panel entrance / Terminal fade / focus overlay | **`expoOut`** (main easing, most common) |
| Toggle switch / button pop / interaction emphasis | `overshoot` |
| Preview geometry settling / physical landing / UI element bounce | `spring` |
| Continuous motion (e.g., mouse trajectory interpolation) | `easeInOut` (preserve symmetry) |

### Counter-Intuitive Insight

Most product promo animations are **too fast and too hard**. `linear` makes digital elements
feel like machines, `easeOut` is baseline, `expoOut` is the technical root of "premium feel" —
it gives digital elements a **physical world weight sensation**.

---

## 3. Motion Language — 8 Common Principles

### 3.1 Don't Use Pure Black or Pure White for Background

None of Anthropic's three videos use `#FFFFFF` or `#000000` as the main background.
**Neutral colors with color temperature** (warm or cool) have a "paper / canvas / desktop"
material quality that reduces the machine feel.

**Specific color value decisions** go through §1.a Core Asset Protocol (extracted from brand spec)
or the "Design Direction Advisor" (background color schemes for each of the 20 philosophies).
This reference doesn't provide specific color values — that's a **brand decision**, not a motion rule.

### 3.2 Easing Is Never linear

See §2.

### 3.3 Slow-Fast-Boom-Stop Narrative

See §1.

### 3.4 Show the "Process" Not the "Magic Result"

- Claude Design shows tweak parameters, dragging sliders (not one-click perfect results)
- Claude Code shows code errors + AI fixing them (not first-try success)
- Claude for Word shows Redline red-delete green-add editing process (not jumping to the final draft)

**Shared subtext**: The product is a **collaborator, pair programmer, senior editor** — not a
one-click magician. This precisely targets professional users' pain points around "controllability"
and "authenticity."

**Anti-AI slop**: AI defaults to making "magic one-click success" animations (one click → perfect
result), which is the lowest common denominator. **Do the opposite** — show the process, show
tweaks, show bugs and fixes — this is the source of brand differentiation.

### 3.5 Mouse Trajectories Are Hand-Drawn (Arcs + Perlin Noise)

Real human mouse movement isn't a straight line, it's "accelerate → arc → decelerate to correct →
click." AI's straight-line interpolated mouse trajectories **trigger subconscious rejection**.

```js
// Quadratic bezier curve interpolation (start → control point → end)
function bezierQuadratic(p0, p1, p2, t) {
  const x = (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
  const y = (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];
  return [x, y];
}

// Path: start → offset midpoint → end (creating an arc)
const path = [[100, 100], [targetX - 200, targetY + 80], [targetX, targetY]];

// Then overlay minimal Perlin Noise (±2px) to create "hand tremor"
const jitterX = (simpleNoise(t * 10) - 0.5) * 4;
const jitterY = (simpleNoise(t * 10 + 100) - 0.5) * 4;
```

### 3.6 Logo "Morph Convergence"

The Logo entrance in all three Anthropic videos **is never a simple fade-in**, it's **morphed from
the previous visual element**.

**Common pattern**: In the last 1-2 seconds, do Morph / Rotate / Converge, making the entire
narrative "collapse" onto the brand mark.

**Low-cost implementation** (no real morph needed):
Let the previous visual element "collapse" into a color block (scale → 0.1, translate toward
center), then the color block "expands" into the wordmark. Transition uses 150ms quick cut +
motion blur (`filter: blur(6px)` → `0`).

```js
<Sprite start={13} end={14}>
  {/* Collapse: previous element scale 0.1, opacity maintained, filter blur increases */}
  const scale = interpolate(t, [0, 0.5], [1, 0.1], Easing.expoOut);
  const blur = interpolate(t, [0, 0.5], [0, 6]);
</Sprite>
<Sprite start={13.5} end={15}>
  {/* Expand: Logo from color block center scale 0.1 → 1, blur 6 → 0 */}
  const scale = interpolate(t, [0, 0.6], [0.1, 1], Easing.overshoot);
  const blur = interpolate(t, [0, 0.6], [6, 0]);
</Sprite>
```

### 3.7 Serif + Sans-Serif Dual Typography

- **Brand / narration**: Serif (conveys "academic / publication / taste")
- **UI / code / data**: Sans-serif + monospace

**Using a single typeface is wrong**. Serif provides "taste", sans-serif provides "function."

Specific font choices go through brand spec (brand-spec.md's Display / Body / Mono three stacks)
or the Design Direction Advisor's 20 philosophies. This reference doesn't provide specific fonts —
that's a **brand decision**.

### 3.8 Focus Switch = Background Dim + Foreground Sharpen + Flash Guide

A focus switch **isn't just** lowering opacity. The complete recipe is:

```js
// Filter combination for non-focus elements
tile.style.filter = `
  brightness(${1 - 0.5 * focusIntensity})
  saturate(${1 - 0.3 * focusIntensity})
  blur(${focusIntensity * 4}px)        // ← Key: adding blur truly "pushes it back"
`;
tile.style.opacity = 0.4 + 0.6 * (1 - focusIntensity);

// After focus completes, do a 150ms Flash highlight at the focus position to guide gaze return
focusOverlay.animate([
  { background: 'rgba(255,255,255,0.3)' },
  { background: 'rgba(255,255,255,0)' }
], { duration: 150, easing: 'ease-out' });
```

**Why blur is essential**: With only opacity + brightness, non-focus elements remain "sharp",
visually they haven't "receded to the background." blur(4-8px) truly pushes non-focus elements
back a depth layer.

---

## 4. Specific Motion Techniques (Copy-Paste Code Snippets)

### 4.1 FLIP / Shared Element Transition

A button "expands" into an input field — it's **not** the button disappearing + a new panel
appearing. The core is **the same DOM element** transitioning between two states, not two elements
cross-fading.

```jsx
// Using Framer Motion layoutId
<motion.div layoutId="design-button">Design</motion.div>
// ↓ After click, same layoutId
<motion.div layoutId="design-button">
  <input placeholder="Describe your design..." />
</motion.div>
```

Native implementation reference: https://aerotwist.com/blog/flip-your-animations/

### 4.2 "Breathing" Expansion (width→height)

Panel expansion **doesn't pull width and height simultaneously**, instead:
- First 40% of time: only pull width (keep height small)
- Last 60% of time: width holds, height expands

This simulates the physical world feeling of "unfold first, then fill with water."

```js
const widthT = interpolate(t, [0, 0.4], [0, 1], Easing.expoOut);
const heightT = interpolate(t, [0.3, 1], [0, 1], Easing.expoOut);
style.width = `${widthT * targetW}px`;
style.height = `${heightT * targetH}px`;
```

### 4.3 Staggered Fade-up (30ms stagger)

When table rows, card columns, or list items enter, **each element delays by 30ms**,
`translateY` from 10px back to 0.

```js
rows.forEach((row, i) => {
  const localT = Math.max(0, t - i * 0.03);  // 30ms stagger
  row.style.opacity = interpolate(localT, [0, 0.3], [0, 1], Easing.expoOut);
  row.style.transform = `translateY(${
    interpolate(localT, [0, 0.3], [10, 0], Easing.expoOut)
  }px)`;
});
```

### 4.4 Non-Linear Breathing — 0.5s Pause Before Key Results

Machines execute fast and continuously, but **pausing 0.5 seconds before a key result appears**
gives the viewer's brain reaction time.

```jsx
// Typical scenario: AI generation complete → pause 0.5s → result emerges
<Sprite start={8} end={8.5}>
  {/* 0.5s pause — nothing moves, let the viewer stare at the loading state */}
  <LoadingState />
</Sprite>
<Sprite start={8.5} end={10}>
  <ResultAppear />
</Sprite>
```

**Counter-example**: AI generation completes and seamlessly cuts to the result — the viewer has
no reaction time, information is lost.

### 4.5 Chunk Reveal — Simulating Token Streaming

AI-generated text **should not use `setInterval` to pop out single characters** (like old movie
subtitles), use **chunk reveal** — reveal 2-5 characters at a time with irregular intervals,
simulating real token streaming output.

```js
// Split into chunks, not individual characters
const chunks = text.split(/(\s+|,\s*|\.\s*|;\s*)/);  // Split by word + punctuation
let i = 0;
function reveal() {
  if (i >= chunks.length) return;
  element.textContent += chunks[i++];
  const delay = 40 + Math.random() * 80;  // Irregular 40-120ms
  setTimeout(reveal, delay);
}
reveal();
```

### 4.6 Anticipation → Action → Follow-through

Three of Disney's 12 Principles. Anthropic uses them very explicitly:

- **Anticipation** (preparation): A small reverse motion before the action starts (button slightly
  shrinks before popping out)
- **Action**: The main action itself
- **Follow-through** (afterglow): Residual motion after the action ends (card slightly bounces
  after landing)

```js
// Complete three-part card entrance
const anticip = interpolate(t, [0, 0.2], [1, 0.95], Easing.easeIn);     // Anticipation
const action  = interpolate(t, [0.2, 0.7], [0.95, 1.05], Easing.expoOut); // Action
const settle  = interpolate(t, [0.7, 1], [1.05, 1], Easing.spring);       // Settle
// Final scale = product of three parts or applied in segments
```

**Counter-example**: Animation with only Action but no Anticipation + Follow-through looks like
"PowerPoint animation."

### 4.7 3D Perspective + translateZ Layering

For the "tilted 3D + floating cards" aesthetic, add perspective to the container and different
translateZ values to individual elements:

```css
.stage-wrap {
  perspective: 2400px;
  perspective-origin: 50% 30%;  /* Slightly overhead viewpoint */
}
.card-grid {
  transform-style: preserve-3d;
  transform: rotateX(8deg) rotateY(-4deg);  /* Golden ratio */
}
.card:nth-child(3n) { transform: translateZ(30px); }
.card:nth-child(5n) { transform: translateZ(-20px); }
.card:nth-child(7n) { transform: translateZ(60px); }
```

**Why rotateX 8° / rotateY -4° is the golden ratio**:
- Greater than 10° → elements feel too distorted, looks like "falling over"
- Less than 5° → looks like "shearing" rather than "perspective"
- The asymmetric 8° × -4° ratio simulates the natural angle of "camera looking down from the
  upper-left of a desk"

### 4.8 Diagonal Pan — Moving XY Simultaneously

Camera movement isn't purely up-down or left-right, but **moves XY simultaneously** to simulate
diagonal movement:

```js
const panX = Math.sin(flowT * 0.22) * 40;
const panY = Math.sin(flowT * 0.35) * 30;
stage.style.transform = `
  translate(-50%, -50%)
  rotateX(8deg) rotateY(-4deg)
  translate3d(${panX}px, ${panY}px, 0)
`;
```

**Key point**: X and Y have different frequencies (0.22 vs 0.35) to avoid regularized Lissajous
loops.

---

## 5. Scene Recipes (Three Narrative Templates)

The three reference videos correspond to three product personalities. **Pick the one that best
fits your product**, don't mix and match.

### Recipe A — Apple Keynote Dramatic Style (Claude Design type)

**Suited for**: Major version launches, hero animations, visual wow priority
**Rhythm**: Strong Slow-Fast-Boom-Stop arc
**Easing**: `expoOut` throughout + occasional `overshoot`
**SFX density**: High (~0.4/s), SFX pitch tuned to BGM scale
**BGM**: IDM / minimalist tech electronic, calm + precise
**Convergence**: Camera rapid pull-back → drop → Logo morph → ethereal single tone → abrupt stop

### Recipe B — One-Take Tool Style (Claude Code type)

**Suited for**: Developer tools, productivity apps, flow state scenarios
**Rhythm**: Sustained steady flow, no obvious peaks
**Easing**: `spring` physics + `expoOut`
**SFX density**: **0** (purely BGM-driven editing rhythm)
**BGM**: Lo-fi Hip-hop / Boom-bap, 85-90 BPM
**Core technique**: Key UI actions land on BGM kick/snare transients — "**musical groove as
interaction sound effects**"

### Recipe C — Office Efficiency Narrative Style (Claude for Word type)

**Suited for**: Enterprise software, document/spreadsheet/calendar apps, professionalism priority
**Rhythm**: Multi-scene hard cuts + Dolly In/Out
**Easing**: `overshoot` (toggle) + `expoOut` (panels)
**SFX density**: Medium (~0.3/s), UI clicks primarily
**BGM**: Jazzy Instrumental, minor key, BPM 90-95
**Core highlight**: One scene must have the "full-piece showstopper" — 3D pop-out / lifting off
the plane

---

## 6. Counter-Examples — This Is AI Slop

| Anti-pattern | Why It's Wrong | Correct Approach |
|---|---|---|
| `transition: all 0.3s ease` | `ease` is linear's cousin, all elements move at the same speed | Use `expoOut` + per-element stagger |
| All entrances use `opacity 0→1` | No sense of motion direction | Pair with `translateY 10→0` + Anticipation |
| Logo fades in | No narrative convergence | Morph / Converge / collapse-expand |
| Mouse moves in straight lines | Subconscious machine feel | Bezier arcs + Perlin Noise |
| Typing pops out single characters (setInterval) | Looks like old movie subtitles | Chunk Reveal, random intervals |
| No pause before key results | Viewer has no reaction time | 0.5s pause before results |
| Focus switch only changes opacity | Non-focus elements still sharp | opacity + brightness + **blur** |
| Pure black / pure white background | Cyber feel / glare fatigue | Neutral color with temperature (use brand spec) |
| All animations at the same speed | No rhythm | Slow-Fast-Boom-Stop |
| Fade out ending | No sense of finality | Abrupt stop (hold last frame) |

---

## 7. Self-Check Checklist (60 Seconds Before Animation Delivery)

- [ ] Narrative structure is Slow-Fast-Boom-Stop, not even pacing?
- [ ] Default easing is `expoOut`, not `easeOut` or `linear`?
- [ ] Toggle / button pop uses `overshoot`?
- [ ] Card / list entrance has 30ms stagger?
- [ ] 0.5s pause before key results?
- [ ] Typing uses Chunk Reveal, not setInterval single characters?
- [ ] Focus switch includes blur (not just opacity)?
- [ ] Logo uses morph convergence, not fade-in?
- [ ] Background isn't pure black / pure white (has color temperature)?
- [ ] Text has serif + sans-serif hierarchy?
- [ ] Ending is an abrupt stop, not a fade-out?
- [ ] (If mouse is present) Mouse trajectory is an arc, not a straight line?
- [ ] SFX density matches product personality (see Recipe A/B/C)?
- [ ] BGM and SFX have 6-8dB loudness difference? (see `audio-design-rules.md`)

---

## 8. Relationship with Other References

| Reference | Purpose | Relationship |
|---|---|---|
| `animation-pitfalls.md` | Technical pitfalls (16 items) | "**Don't do this**" — the inverse of this file |
| `animations.md` | Stage/Sprite engine usage | The basics of **how to write** animations |
| `audio-design-rules.md` | Dual-track audio rules | Rules for **adding audio** to animations |
| `sfx-library.md` | 37 SFX catalog | Sound effects **asset library** |
| `apple-gallery-showcase.md` | Apple gallery showcase style | A specialized topic on a specific motion style |
| **This file** | Positive motion design grammar | "**Do it this way**" |

**Invocation order**:
1. First check SKILL.md workflow Step 3's four positioning questions (determine narrative role
   and visual temperature)
2. After choosing a direction, read this file to determine **motion language** (Recipe A/B/C)
3. When writing code, reference `animations.md` and `animation-pitfalls.md`
4. When exporting video, follow `audio-design-rules.md` + `sfx-library.md`

---

## Appendix — Source Materials for This File

- Anthropic official animation deconstruction: `BEST-PRACTICES.md` in the reference animation
  directory
- Anthropic audio deconstruction: `AUDIO-BEST-PRACTICES.md` in the same directory
- 3 reference videos: `ref-{1,2,3}.mp4` + corresponding `gemini-ref-*.md` / `audio-ref-*.md`
- **Strict filtering**: This reference does not include any specific brand color values, font
  names, or product names. Color/font decisions go through §1.a Core Asset Protocol or the
  20 design philosophies.
