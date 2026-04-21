# Editable PPTX Export: HTML Hard Constraints + Sizing Decisions + Common Errors

This document covers **using `scripts/html2pptx.js` + `pptxgenjs` to translate HTML elements one-by-one into real, editable PowerPoint text boxes**. This is different from `export_deck_pptx.mjs --mode image` (screenshot-based backgrounds, text becomes images, not editable).

> **Core premise**: To take this path, the HTML must follow the 4 constraints below from the very first line. **This is not a "write first, convert later" approach** — retrofitting triggers 2-3 hours of rework (verified in the 2026-04-20 options advisory board project).

---

## Canvas Size: Use 960×540pt (LAYOUT_WIDE)

PPTX units are **inches** (physical dimensions), not px. Decision principle: the body's computedStyle dimensions must **match the presentation layout's inch dimensions** (±0.1", enforced by `html2pptx.js`'s `validateDimensions` check).

### 3 Candidate Sizes Compared

| HTML body | Physical size | Corresponding PPT layout | When to use |
|---|---|---|---|
| **`960pt × 540pt`** | **13.333″ × 7.5″** | **pptxgenjs `LAYOUT_WIDE`** | ✅ **Default recommendation** (modern PowerPoint 16:9 standard) |
| `720pt × 405pt` | 10″ × 5.625″ | Custom | Only when user specifies "legacy PowerPoint Widescreen" template |
| `1920px × 1080px` | 20″ × 11.25″ | Custom | ❌ Non-standard size; fonts appear abnormally small when projected |

**Don't think of HTML dimensions as resolution.** PPTX is a vector document; body dimensions determine **physical size**, not clarity. An oversized body (20″×11.25″) won't make text sharper — it just makes font pt sizes relatively smaller against the canvas, looking worse when projected/printed.

### Three equivalent body declarations

```css
body { width: 960pt;  height: 540pt; }    /* Clearest, recommended */
body { width: 1280px; height: 720px; }    /* Equivalent, px convention */
body { width: 13.333in; height: 7.5in; }  /* Equivalent, inch intuition */
```

Corresponding pptxgenjs code:

```js
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inch, no custom definition needed
```

---

## 4 Hard Constraints (violations will cause errors)

`html2pptx.js` translates HTML DOM elements one-by-one into PowerPoint objects. PowerPoint's format constraints projected onto HTML = the 4 rules below.

### Rule 1: DIVs cannot contain text directly — must wrap in `<p>` or `<h1>`-`<h6>`

```html
<!-- ❌ Wrong: text directly in div -->
<div class="title">Q3 Revenue Up 23%</div>

<!-- ✅ Correct: text in <p> or <h1>-<h6> -->
<div class="title"><h1>Q3 Revenue Up 23%</h1></div>
<div class="body"><p>New users are the primary driver</p></div>
```

**Why**: PowerPoint text must exist inside a text frame, which corresponds to HTML paragraph-level elements (p/h*/li). A bare `<div>` has no corresponding text container in PPTX.

**`<span>` cannot carry main text either** — span is an inline element and can't independently align as a text box. Span should only be **nested inside p/h\*** for local styling (bold, color change).

### Rule 2: CSS gradients are not supported — solid colors only

```css
/* ❌ Wrong */
background: linear-gradient(to right, #FF6B6B, #4ECDC4);

/* ✅ Correct: solid color */
background: #FF6B6B;

/* ✅ If you must have multi-color stripes, use flex children with individual solid colors */
.stripe-bar { display: flex; }
.stripe-bar div { flex: 1; }
.red   { background: #FF6B6B; }
.teal  { background: #4ECDC4; }
```

**Why**: PowerPoint shape fill only supports solid/gradient-fill, but pptxgenjs's `fill: { color: ... }` only maps to solid. Gradients via PowerPoint's native gradient fill require a different structure that the current toolchain doesn't support.

### Rule 3: Background/border/shadow only on DIVs, not on text tags

```html
<!-- ❌ Wrong: <p> has background color -->
<p style="background: #FFD700; border-radius: 4px;">Key content</p>

<!-- ✅ Correct: outer div carries background/border, <p> only handles text -->
<div style="background: #FFD700; border-radius: 4px; padding: 8pt 12pt;">
  <p>Key content</p>
</div>
```

**Why**: In PowerPoint, shape (rectangle/rounded rectangle) and text frame are two separate objects. HTML's `<p>` only translates to a text frame; background/border/shadow belong to the shape — they must be on the **div wrapping the text**.

### Rule 4: DIVs cannot use `background-image` — use `<img>` tags

```html
<!-- ❌ Wrong -->
<div style="background-image: url('chart.png')"></div>

<!-- ✅ Correct -->
<img src="chart.png" style="position: absolute; left: 50%; top: 20%; width: 300pt; height: 200pt;" />
```

**Why**: `html2pptx.js` only extracts image paths from `<img>` elements; it doesn't parse CSS `background-image` URLs.

---

## Path A HTML Template Skeleton

Each slide is a separate HTML file, with isolated scope (avoiding CSS pollution from single-file decks).

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 960pt; height: 540pt;           /* ⚠️ Matches LAYOUT_WIDE */
    font-family: system-ui, -apple-system, "PingFang SC", sans-serif;
    background: #FEFEF9;                    /* Solid color, no gradients */
    overflow: hidden;
  }
  /* DIVs handle layout/background/border */
  .card {
    position: absolute;
    background: #1A4A8A;                    /* Background on DIV */
    border-radius: 4pt;
    padding: 12pt 16pt;
  }
  /* Text tags only handle font styling, no background/border */
  .card h2 { font-size: 24pt; color: #FFFFFF; font-weight: 700; }
  .card p  { font-size: 14pt; color: rgba(255,255,255,0.85); }
</style>
</head>
<body>

  <!-- Title area: outer div for positioning, inner text tags -->
  <div style="position: absolute; top: 40pt; left: 60pt; right: 60pt;">
    <h1 style="font-size: 36pt; color: #1A1A1A; font-weight: 700;">Use assertion sentences for titles, not topic words</h1>
    <p style="font-size: 16pt; color: #555555; margin-top: 10pt;">Subtitle with supplementary explanation</p>
  </div>

  <!-- Content card: div handles background, h2/p handle text -->
  <div class="card" style="top: 130pt; left: 60pt; width: 240pt; height: 160pt;">
    <h2>Point One</h2>
    <p>Brief explanatory text</p>
  </div>

  <!-- List: use ul/li, not manual bullet symbols -->
  <div style="position: absolute; top: 320pt; left: 60pt; width: 540pt;">
    <ul style="font-size: 16pt; color: #1A1A1A; padding-left: 24pt; list-style: disc;">
      <li>First key point</li>
      <li>Second key point</li>
      <li>Third key point</li>
    </ul>
  </div>

  <!-- Illustration: use <img> tag, not background-image -->
  <img src="illustration.png" style="position: absolute; right: 60pt; top: 110pt; width: 320pt; height: 240pt;" />

</body>
</html>
```

---

## Common Error Quick Reference

| Error Message | Cause | Fix |
|--------------|-------|-----|
| `DIV element contains unwrapped text "XXX"` | div has bare text | Wrap text in `<p>` or `<h1>`-`<h6>` |
| `CSS gradients are not supported` | Used linear/radial-gradient | Change to solid color, or use flex children for segments |
| `Text element <p> has background` | `<p>` tag has background color | Wrap in outer `<div>` for background; `<p>` only for text |
| `Background images on DIV elements are not supported` | div uses background-image | Change to `<img>` tag |
| `HTML content overflows body by Xpt vertically` | Content exceeds 540pt | Reduce content or shrink font size, or `overflow: hidden` to clip |
| `HTML dimensions don't match presentation layout` | body size doesn't match pres layout | Use `960pt × 540pt` body with `LAYOUT_WIDE`; or defineLayout for custom size |
| `Text box "XXX" ends too close to bottom edge` | Large font `<p>` is < 0.5 inch from body bottom | Move up, leave sufficient bottom margin; PPT bottom edge is partially obscured anyway |

---

## Basic Workflow (3 Steps to PPTX)

### Step 1: Write each page as a standalone HTML following the constraints

```
my-deck/
├── slides/
│   ├── 01-cover.html    # Each file is a complete 960×540pt HTML
│   ├── 02-agenda.html
│   └── ...
└── illustration/        # All images referenced by <img>
    ├── chart1.png
    └── ...
```

### Step 2: Write build.js calling `html2pptx.js`

```js
const pptxgen = require('pptxgenjs');
const html2pptx = require('../scripts/html2pptx.js');  // This skill's script

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inch, matches HTML's 960×540pt

  const slides = ['01-cover.html', '02-agenda.html', '03-content.html'];
  for (const file of slides) {
    await html2pptx(`./slides/${file}`, pres);
  }

  await pres.writeFile({ fileName: 'deck.pptx' });
})();
```

### Step 3: Open and verify

- Open the exported PPTX in PowerPoint/Keynote
- Double-click any text — it should be directly editable (if it's an image, Rule 1 was violated)
- Verify overflow: each page should fit within the body bounds, nothing clipped

---

## This Path vs Other Options (When to Choose What)

| Need | Choose |
|------|--------|
| Colleagues will edit text in the PPTX / sending to non-technical people for further editing | **This path** (editable, requires writing HTML with 4 constraints from the start) |
| Presentation use only / archival, no further editing | `export_deck_pdf.mjs` (multi-file) or `export_deck_stage_pdf.mjs` (single-file deck-stage), outputs vector PDF |
| Visual freedom is priority (animations, web components, CSS gradients, complex SVG), accepting non-editable output | `export_deck_pptx.mjs --mode image` (image-based PPTX) |

**Never force html2pptx on visually-driven HTML** — real-world testing shows visual-driven HTML has a pass rate < 30%, and retrofitting the rest is slower than rewriting from scratch.

---

## Why the 4 Constraints Are Not Bugs but Physical Constraints

These 4 rules aren't because the `html2pptx.js` author was lazy — they are **PowerPoint file format (OOXML) constraints** projected onto HTML:

- PPTX text must be in a text frame (`<a:txBody>`), corresponding to paragraph-level HTML elements
- PPTX shape and text frame are two separate objects; you can't draw a background and write text on the same element
- PPTX shape fill has limited gradient support (only certain preset gradients, not arbitrary CSS angle gradients)
- PPTX picture objects must reference actual image files, not CSS properties

Understanding this, **don't expect the tool to get smarter** — the HTML writing style must adapt to the PPTX format, not the other way around.
