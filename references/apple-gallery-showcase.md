# Apple Gallery Showcase - Gallery Display Wall Animation Style

> Inspiration: Claude Design official site hero video + Apple product page "gallery wall" display
> Real-world origin: MyClaw Design launch hero v5
> Applicable scenarios: **Product launch hero animations, skill capability demos, portfolio showcases** — any scene that needs to display "multiple high-quality outputs" simultaneously while guiding audience attention

---

## Trigger Assessment: When to Use This Style

**Good fit**:
- 10+ real outputs to display on-screen simultaneously (PPTs, Apps, web pages, infographics)
- Audience is professional (developers, designers, product managers) — sensitive to "quality feel"
- Desired vibe is "restrained, exhibition-style, premium, spatial"
- Need both focus and overview simultaneously (see details without losing the whole)

**Not a fit**:
- Single product focus (use the frontend-design product hero template)
- Emotion-driven/narrative-heavy animation (use timeline narrative template)
- Small screen / portrait orientation (tilted perspective gets blurry on small canvases)

---

## Core Visual Tokens

```css
:root {
  /* Light gallery palette */
  --bg:         #F5F5F7;   /* Main canvas base — Apple site gray */
  --bg-warm:    #FAF9F5;   /* Warm cream variant */
  --ink:        #1D1D1F;   /* Primary text color */
  --ink-80:     #3A3A3D;
  --ink-60:     #545458;
  --muted:      #86868B;   /* Secondary text */
  --dim:        #C7C7CC;
  --hairline:   #E5E5EA;   /* Card 1px border */
  --accent:     #D97757;   /* Terracotta orange — Claude brand */
  --accent-deep:#B85D3D;

  --serif-cn: "Noto Serif SC", "Songti SC", Georgia, serif;
  --serif-en: "Source Serif 4", "Tiempos Headline", Georgia, serif;
  --sans:     "Inter", -apple-system, "PingFang SC", system-ui;
  --mono:     "JetBrains Mono", "SF Mono", ui-monospace;
}
```

**Key principles**:
1. **Never use pure black background**. Black backgrounds make work look like cinema, not "adoptable work output"
2. **Terracotta orange is the only chromatic accent** — everything else is grayscale + white
3. **Three font stacks** (serif EN + serif CN + sans + mono) create a "publication" feel rather than "internet product"

---

## Core Layout Patterns

### 1. Floating Card (The Fundamental Unit of This Style)

```css
.gallery-card {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 6px;                          /* Inner padding is the "mat board" */
  border: 1px solid var(--hairline);
  box-shadow:
    0 20px 60px -20px rgba(29, 29, 31, 0.12),   /* Primary shadow, soft and long */
    0 6px 18px -6px rgba(29, 29, 31, 0.06);     /* Secondary near-light, creates float */
  aspect-ratio: 16 / 9;                  /* Uniform slide ratio */
  overflow: hidden;
}
.gallery-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 9px;                    /* Slightly smaller than card radius, visual nesting */
}
```

**Anti-pattern**: don't use edge-to-edge tiles (no padding, no border, no shadow) — that's information-density expression, not exhibition.

### 2. 3D Tilted Gallery Wall

```css
.gallery-viewport {
  position: absolute; inset: 0;
  overflow: hidden;
  perspective: 2400px;                   /* Deeper perspective, tilt isn't exaggerated */
  perspective-origin: 50% 45%;
}
.gallery-canvas {
  width: 4320px;                         /* Canvas = 2.25x viewport */
  height: 2520px;                        /* Room for pan */
  transform-origin: center center;
  transform: perspective(2400px)
             rotateX(14deg)              /* Tilt backward */
             rotateY(-10deg)             /* Turn left */
             rotateZ(-2deg);             /* Slight tilt, break rigidity */
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 40px;
  padding: 60px;
}
```

**Parameter sweet spot**:
- rotateX: 10-15deg (more looks like a cocktail party VIP backdrop)
- rotateY: +/-8-12deg (left-right symmetry feel)
- rotateZ: +/-2-3deg (the "this wasn't placed by a machine" human touch)
- perspective: 2000-2800px (below 2000 gets fisheye, above 3000 approaches orthographic)

### 3. 2x2 Four-Corner Convergence (Selection Scene)

```css
.grid22 {
  display: grid;
  grid-template-columns: repeat(2, 800px);
  gap: 56px 64px;
  align-items: start;
}
```

Each card slides in from its corresponding corner (tl/tr/bl/br) toward center + fade in. Corresponding `cornerEntry` vectors:

```js
const cornerEntry = {
  tl: { dx: -700, dy: -500 },
  tr: { dx:  700, dy: -500 },
  bl: { dx: -700, dy:  500 },
  br: { dx:  700, dy:  500 },
};
```

---

## Five Core Animation Patterns

### Pattern A - Four-Corner Convergence (0.8-1.2s)

4 elements slide in from viewport corners, simultaneously scaling 0.85->1.0, with ease-out. Suited for "showing multi-directional choices" as an opener.

```js
const inP = easeOut(clampLerp(t, start, end));
card.style.transform = `translate3d(${(1-inP)*ce.dx}px, ${(1-inP)*ce.dy}px, 0) scale(${0.85 + 0.15*inP})`;
card.style.opacity = inP;
```

### Pattern B - Selected Enlarge + Others Slide Out (0.8s)

Selected card scales 1.0->1.28, other cards fade out + blur + drift back toward corners:

```js
// Selected
card.style.transform = `translate3d(${cellDx*outP}px, ${cellDy*outP}px, 0) scale(${1 + 0.28*easeOut(zoomP)})`;
// Unselected
card.style.opacity = 1 - outP;
card.style.filter = `blur(${outP * 1.5}px)`;
```

**Key**: unselected cards must blur, not just fade. Blur simulates depth of field, visually "pushing" the selected card forward.

### Pattern C - Ripple Reveal (1.7s)

From center outward, delayed by distance, each card fades in + scales from 1.25x down to 0.94x ("camera pulling back"):

```js
const col = i % COLS, row = Math.floor(i / COLS);
const dc = col - (COLS-1)/2, dr = row - (ROWS-1)/2;
const dist = Math.sqrt(dc*dc + dr*dr);
const delay = (dist / maxDist) * 0.8;
const localT = Math.max(0, (t - rippleStart - delay) / 0.7);
card.style.opacity = easeOut(Math.min(1, localT));

// Simultaneously overall scale 1.25->0.94
const galleryScale = 1.25 - 0.31 * easeOut(rippleProgress);
```

### Pattern D - Sinusoidal Pan (Continuous Drift)

Combines sine wave + linear drift to avoid the marquee-style "has a start and end" loop feel:

```js
const panX = Math.sin(panT * 0.12) * 220 - panT * 8;    // Horizontal left drift
const panY = Math.cos(panT * 0.09) * 120 - panT * 5;    // Vertical upward drift
const clampedX = Math.max(-900, Math.min(900, panX));   // Prevent edge exposure
```

**Parameters**:
- Sine period `0.09-0.15 rad/s` (slow, ~30-50 seconds per oscillation)
- Linear drift `5-8 px/s` (slower than an audience blink)
- Amplitude `120-220 px` (large enough to feel, small enough not to cause dizziness)

### Pattern E - Focus Overlay (Focus Switch)

**Key design**: the focus overlay is a **flat element** (not tilted), floating above the tilted canvas. The selected slide scales from tile position (~400x225) to screen center (960x540), while the background canvas doesn't change tilt but **dims to 45%**:

```js
// Focus overlay (flat, centered)
focusOverlay.style.width = (startW + (endW - startW) * focusIntensity) + 'px';
focusOverlay.style.height = (startH + (endH - startH) * focusIntensity) + 'px';
focusOverlay.style.opacity = focusIntensity;

// Background cards dim but remain visible (critical! don't use 100% mask)
card.style.opacity = entryOp * (1 - 0.55 * focusIntensity);   // 1 -> 0.45
card.style.filter = `brightness(${1 - 0.3 * focusIntensity})`;
```

**Clarity iron rule**:
- Focus overlay's `<img>` must `src` directly to the original image, **don't reuse the compressed gallery thumbnail**
- Preload all original images into a `new Image()[]` array
- Overlay's own `width/height` is calculated per frame — browser resamples the original image each frame

---

## Timeline Architecture (Reusable Skeleton)

```js
const T = {
  DURATION: 25.0,
  s1_in: [0.0, 0.8],    s1_type: [1.0, 3.2],  s1_out: [3.5, 4.0],
  s2_in: [3.9, 5.1],    s2_hold: [5.1, 7.0],  s2_out: [7.0, 7.8],
  s3_hold: [7.8, 8.3],  s3_ripple: [8.3, 10.0],
  panStart: 8.6,
  focuses: [
    { start: 11.0, end: 12.7, idx: 2  },
    { start: 13.3, end: 15.0, idx: 3  },
    { start: 15.6, end: 17.3, idx: 10 },
    { start: 17.9, end: 19.6, idx: 16 },
  ],
  s4_walloff: [21.1, 21.8], s4_in: [21.8, 22.7], s4_hold: [23.7, 25.0],
};

// Core easing
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function lerp(time, start, end, fromV, toV, easing) {
  if (time <= start) return fromV;
  if (time >= end) return toV;
  let p = (time - start) / (end - start);
  if (easing) p = easing(p);
  return fromV + (toV - fromV) * p;
}

// Single render(t) function reads timestamp, writes all elements
function render(t) { /* ... */ }
requestAnimationFrame(function tick(now) {
  const t = ((now - startMs) / 1000) % T.DURATION;
  render(t);
  requestAnimationFrame(tick);
});
```

**Architecture essence**: **All state is derived from timestamp t** — no state machines, no setTimeout. This means:
- Seek to any moment via `window.__setTime(12.3)` for instant jump (convenient for Playwright frame-by-frame capture)
- Looping is naturally seamless (t mod DURATION)
- Any frame can be frozen during debugging

---

## Texture Details (Easy to Overlook but Critical)

### 1. SVG Noise Texture

Light backgrounds suffer from being "too flat." Overlay an extremely subtle fractalNoise:

```html
<style>
.stage::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.078  0 0 0 0 0.078  0 0 0 0 0.074  0 0 0 0.035 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  opacity: 0.5;
  pointer-events: none;
  z-index: 30;
}
</style>
```

Looks like no difference — remove it and you'll notice.

### 2. Corner Brand Label

```html
<div class="corner-brand">
  <div class="mark"></div>
  <div>HUASHU · DESIGN</div>
</div>
```

```css
.corner-brand {
  position: absolute; top: 48px; left: 72px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
```

Only visible during the gallery wall scene, fades in and out. Like a museum exhibition label.

### 3. Brand Closure Wordmark

```css
.brand-wordmark {
  font-family: var(--sans);
  font-size: 148px;
  font-weight: 700;
  letter-spacing: -0.045em;   /* Negative tracking is key — makes letters compact into a logo */
}
.brand-wordmark .accent {
  color: var(--accent);
  font-weight: 500;           /* Accent character is actually thinner — visual contrast */
}
```

`letter-spacing: -0.045em` is the standard approach for Apple product page large type.

---

## Common Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| Looks like a PPT template | Cards missing shadow / hairline | Add two-layer box-shadow + 1px border |
| Tilt feels cheap | Only used rotateY without rotateZ | Add +/-2-3deg rotateZ to break rigidity |
| Pan feels "stuttery" | Used setTimeout or CSS keyframes loop | Use rAF + sin/cos continuous functions |
| Text unreadable during Focus | Reused gallery tile's low-res image | Separate overlay + original image src direct |
| Background too empty | Solid `#F5F5F7` | Overlay SVG fractalNoise at 0.5 opacity |
| Typography too "internet-y" | Only Inter | Add Serif (one CN, one EN) + mono for three stacks |

---

## References

- Full implementation sample: see hero-animation-v5.html
- Original inspiration: claude.ai/design hero video
- Aesthetic reference: Apple product pages, Dribbble shot collection pages

When you encounter an animation need for "displaying multiple high-quality outputs," copy the skeleton directly from this file — swap content + adjust timing.
