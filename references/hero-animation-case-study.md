# Gallery Ripple + Multi-Focus - Scene Choreography Philosophy

> Distilled from MyClaw Design hero animation v9 (25 seconds, 8 scenes) as a **reusable visual choreography structure**.
> Not an animation production pipeline — it's about **when this choreography is the right choice**.
> Reference: demos/hero-animation-v9.mp4

## One-Liner

> **When you have 20+ homogeneous visual assets and the scene needs to "express scale and depth," reach for Gallery Ripple + Multi-Focus before resorting to layout stacking.**

Generic SaaS feature animations, product launches, skill promotions, portfolio showcases — as long as asset count is sufficient and style is consistent, this structure almost always delivers.

---

## What This Technique Actually Expresses

It's not "showing off assets" — it tells a narrative through **two rhythmic shifts**:

**Beat 1 - Ripple Reveal (~1.5s)**: 48 cards radiate outward from center. The audience is struck by sheer volume — "Oh, this thing produces *that* much."

**Beat 2 - Multi-Focus (~8s, 4 cycles)**: While the camera slowly pans, the background dims + desaturates 4 times, each time enlarging a single card to screen center — the audience shifts from "impact of quantity" to "contemplation of quality," each cycle holding a steady 1.7s rhythm.

**Core narrative structure**: **Scale (Ripple) -> Contemplation (Focus x 4) -> Fade (Walloff)**. This three-beat combo expresses "Breadth x Depth" — not just capable of producing a lot, but each piece is worth pausing to examine.

Compare with anti-patterns:

| Approach | Audience Perception |
|------|---------|
| 48 cards in static layout (no Ripple) | Pretty but no narrative — looks like a grid screenshot |
| Quick-cut one by one (no Gallery context) | Feels like a slideshow, loses "sense of scale" |
| Only Ripple without Focus | Impressive volume but nothing specific sticks |
| **Ripple + Focus x 4 (this recipe)** | **First awed by quantity, then drawn into quality, finally a calm fade — complete emotional arc** |

---

## Prerequisites (All Must Be Met)

This choreography **isn't universal** — all 4 conditions are required:

1. **Asset count >= 20, ideally 30+**
   Fewer than 20 makes Ripple feel "sparse" — density requires every cell in the 48-grid to be active. v9 used 48 cells x 32 images (loop-filled).

2. **Visually consistent assets**
   All 16:9 slide previews / all app screenshots / all cover designs — aspect ratio, color tone, and layout should look like "a set." Mixed styles make the Gallery look like a clipboard.

3. **Assets remain readable when enlarged**
   Focus enlarges a card to 960px wide. If the source image blurs or lacks information at that size, the Focus beat falls flat. Reverse validation: can you pick 4 from the 48 as "most representative"? If not, asset quality is uneven.

4. **Scene is landscape or square, not portrait**
   Gallery's 3D tilt (`rotateX(14deg) rotateY(-10deg)`) needs horizontal extension. Portrait makes the tilt feel "crooked" rather than "expansive."

**Fallback paths when prerequisites aren't met**:

| Missing What | Degrade To |
|-------|-----------|
| Assets < 20 | Switch to "3-5 side-by-side static display + sequential focus" |
| Inconsistent style | Switch to "cover + 3-chapter hero images" keynote-style |
| Information-sparse | Switch to "data-driven dashboard" or "pull quote + large type" |
| Portrait scene | Switch to "vertical scroll + sticky cards" |

---

## Technical Recipe (v9 Production Parameters)

### 4-Layer Structure

```
viewport (1920x1080, perspective: 2400px)
  └─ canvas (4320x2520, oversized overflow) -> 3D tilt + pan
      └─ 8x6 grid = 48 cards (gap 40px, padding 60px)
          └─ img (16:9, border-radius 9px)
      └─ focus-overlay (absolute center, z-index 40)
          └─ img (matches selected slide)
```

**Key**: canvas is 2.25x larger than viewport — this is what creates the "peering into a larger world" feeling during pan.

### Ripple Reveal (Distance-Delay Algorithm)

```js
// Each card's entry time = distance from center x 0.8s delay
const col = i % 8, row = Math.floor(i / 8);
const dc = col - 3.5, dr = row - 2.5;       // offset from center
const dist = Math.hypot(dc, dr);
const maxDist = Math.hypot(3.5, 2.5);
const delay = (dist / maxDist) * 0.8;       // 0 -> 0.8s
const localT = Math.max(0, (t - rippleStart - delay) / 0.7);
const opacity = expoOut(Math.min(1, localT));
```

**Core parameters**:
- Total duration 1.7s (`T.s3_ripple: [8.3, 10.0]`)
- Max delay 0.8s (center appears first, corners last)
- Per-card entry duration 0.7s
- Easing: `expoOut` (explosive, not smooth)

**Simultaneous action**: canvas scale from 1.25 -> 0.94 (zoom out to reveal) — synchronized pull-back feeling as cards appear.

### Multi-Focus (4-Beat Rhythm)

```js
T.focuses = [
  { start: 11.0, end: 12.7, idx: 2  },  // 1.7s
  { start: 13.3, end: 15.0, idx: 3  },  // 1.7s
  { start: 15.6, end: 17.3, idx: 10 },  // 1.7s
  { start: 17.9, end: 19.6, idx: 16 },  // 1.7s
];
```

**Rhythm pattern**: each focus 1.7s, 0.6s breathing gap between. Total 8s (11.0-19.6s).

**Inside each focus**:
- In ramp: 0.4s (`expoOut`)
- Hold: middle 0.9s (`focusIntensity = 1`)
- Out ramp: 0.4s (`easeOut`)

**Background changes (this is the key)**:

```js
if (focusIntensity > 0) {
  const dimOp = entryOp * (1 - 0.6 * focusIntensity);  // dim to 40%
  const brt = 1 - 0.32 * focusIntensity;                // brightness 68%
  const sat = 1 - 0.35 * focusIntensity;                // saturate 65%
  card.style.filter = `brightness(${brt}) saturate(${sat})`;
}
```

**Not just opacity — simultaneous desaturate + darken**. This makes the foreground overlay's colors "pop," rather than just "getting slightly brighter."

**Focus overlay size animation**:
- From 400x225 (entry) -> 960x540 (hold state)
- Outer ring has 3-layer shadow + 3px accent-colored outline ring, creating a "framed" feeling

### Pan (Continuous Motion Prevents Static Boredom)

```js
const panT = Math.max(0, t - 8.6);
const panX = Math.sin(panT * 0.12) * 220 - panT * 8;
const panY = Math.cos(panT * 0.09) * 120 - panT * 5;
```

- Sine wave + linear drift dual-layer motion — not pure cycling, every moment has a unique position
- X/Y frequencies differ (0.12 vs 0.09) to prevent visually detectable "regular cycling"
- Clamped to +/-900/500px to prevent drifting out of bounds

**Why not pure linear pan**: with pure linear, the audience "predicts" where the next second will be; sine + drift makes every second novel. Under 3D tilt this produces a "mild seasickness" (the good kind) that holds attention.

---

## 5 Reusable Patterns (Distilled from v6->v9 Iterations)

### 1. **expoOut as Primary Easing, Not cubicOut**

`easeOut = 1 - (1-t)³` (smooth) vs `expoOut = 1 - 2^(-10t)` (explosive then rapid convergence).

**Rationale**: expoOut reaches 90% within the first 30%, more like physical damping — matches the intuition of "a heavy object landing." Especially suited for:
- Card entry (weight)
- Ripple spread (shockwave)
- Brand rise (settling)

**When to still use cubicOut**: focus out ramp, symmetrical micro-animations.

### 2. **Paper-Tone Base + Terracotta Orange Accent (Anthropic Lineage)**

```css
--bg: #F7F4EE;        /* warm paper */
--ink: #1D1D1F;       /* near-black */
--accent: #D97757;    /* terracotta orange */
--hairline: #E4DED2;  /* warm hairline */
```

**Why**: warm base colors retain "breathing room" even after GIF compression, unlike pure white which feels "screen-like." Terracotta orange as the sole accent threads through terminal prompt, dir-card selection, cursor, brand hyphen, focus ring — all visual anchors unified by one color.

**v5 lesson**: added noise overlay to simulate "paper texture," but GIF frame compression broke completely (every frame differs). v6 switched to "base color + warm shadow only" — retained 90% of paper feel, reduced GIF size by 60%.

### 3. **Two-Tier Shadow Simulates Depth Without Real 3D**

```css
.gallery-card.depth-near { box-shadow: 0 32px 80px -22px rgba(60,40,20,0.22), ... }
.gallery-card.depth-far  { box-shadow: 0 14px 40px -16px rgba(60,40,20,0.10), ... }
```

Using `sin(i * 1.7) + cos(i * 0.73)` deterministic algorithm to assign each card near/mid/far shadow tiers — **visually creates "3D stacking" feel, but per-frame transform is completely static, zero GPU cost**.

**Cost of real 3D**: each card with individual `translateZ`, GPU computing 48 transforms + shadow blur every frame. v4 tried this — Playwright recording struggled even at 25fps. v6's two-tier shadow has <5% visual difference but 10x lower cost.

### 4. **Font Weight Variation (font-variation-settings) Feels More Cinematic Than Size Changes**

```js
const wght = 100 + (700 - 100) * morphP;  // 100 -> 700 over 0.9s
wordmark.style.fontVariationSettings = `"wght" ${wght.toFixed(0)}`;
```

Brand wordmark transitions from Thin -> Bold over 0.9s, paired with subtle letter-spacing adjustment (-0.045 -> -0.048em).

**Why this beats scale up/down**:
- Audiences have seen scale up/down too many times — expectations are calcified
- Weight variation is "internal fullness" — like a balloon being inflated, not "being pushed closer"
- Variable fonts only became widespread post-2020 — audiences subconsciously register "modern"

**Limitation**: must use fonts that support variable font (Inter/Roboto Flex/Recursive etc.). Regular static fonts can only approximate (switching between fixed weights creates jumps).

### 5. **Corner Brand as Low-Intensity Persistent Signature**

During the Gallery phase, top-left corner has a `HUASHU · DESIGN` small label, 16% opacity, 12px font size, wide letter-spacing.

**Why add this**:
- After Ripple explosion, audiences easily "lose focus" and forget what they're watching — the subtle top-left label helps anchor
- More sophisticated than a full-screen large logo — branding people know that brand signatures don't need to shout
- When GIF gets screenshot-shared, attribution signal persists

**Rule**: only appears during mid-section (when screen is busy), hidden during opening (don't obscure terminal), hidden during ending (brand reveal is the protagonist).

---

## Anti-Patterns: When NOT to Use This Choreography

**❌ Product demos (showing features)**: Gallery makes every card flash by — audience can't retain any single feature. Switch to "single-screen focus + tooltip annotations."

**❌ Data-driven content**: audience needs to read numbers, Gallery's fast pace doesn't allow reading time. Switch to "data charts + sequential reveal."

**❌ Story narrative**: Gallery is a "parallel" structure; stories need "causality." Switch to keynote chapter transitions.

**❌ Only 3-5 assets**: Ripple density is insufficient — looks like "patches." Switch to "static arrangement + sequential highlight."

**❌ Portrait (9:16)**: 3D tilt needs horizontal extension. Portrait makes the tilt feel "crooked" rather than "expansive."

---

## How to Determine If Your Task Fits This Choreography

Three-step quick check:

**Step 1 - Asset Count**: count your homogeneous visual assets. < 15 -> stop; 15-25 -> stretch; 25+ -> go for it.

**Step 2 - Consistency Test**: place 4 random assets side by side — do they look like "a set"? If not -> unify style first, or change approach.

**Step 3 - Narrative Match**: are you expressing "Breadth x Depth" (quantity x quality)? Or "workflow," "features," "story"? If not the former, don't force-fit.

All three yes? Fork the v6 HTML directly, swap the `SLIDE_FILES` array and timeline to reuse. Change palette via `--bg / --accent / --ink` for a full reskin without structural changes.

---

## Related References

- Full technical workflow: [references/animations.md](animations.md) - [references/animation-best-practices.md](animation-best-practices.md)
- Animation export pipeline: [references/video-export.md](video-export.md)
- Audio configuration (BGM + SFX dual-track): [references/audio-design-rules.md](audio-design-rules.md)
- Apple gallery style lateral reference: [references/apple-gallery-showcase.md](apple-gallery-showcase.md)
- Source HTML (v6 + audio integration): see hero animation source files
