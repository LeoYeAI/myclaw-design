# Slide Decks: HTML Slide Production Spec

Slides are a high-frequency design scenario. This document explains how to do HTML slide decks properly — from architecture selection and single-slide design to complete PDF/PPTX export paths.

**This skill covers**:
- HTML playback / PDF export → this document + `scripts/export_deck_pdf.mjs` / `scripts/export_deck_stage_pdf.mjs`
- Editable PPTX export → `references/editable-pptx.md` + `scripts/html2pptx.js` + `scripts/export_deck_pptx.mjs --mode editable`
- Image-based PPTX (not editable, but visually faithful) → `scripts/export_deck_pptx.mjs --mode image`

---

## 🛑 Confirm the delivery format before you start (the hardest checkpoint)

**This decision comes before "single file or multi-file."** Real project evidence from the 2026-04-20 options advisory board deck: **not confirming the delivery format before starting = 2-3 hours of rework.**

### Decision Tree

```
│ Question: what is the final deliverable?
├── Browser fullscreen presentation / local HTML only → maximum visual freedom, build however you want
├── PDF (print / group sharing / archive)            → maximum visual freedom, any architecture can export
└── Editable PPTX (colleagues will edit text)        → 🛑 write from line 1 under the 4 hard constraints in `references/editable-pptx.md`
```

### Why "if you need PPTX, you must take Path A from the start"

Editable PPTX depends on `html2pptx.js` being able to translate the DOM into PowerPoint objects element by element. That requires **4 hard constraints**:

1. fixed body size 720pt × 405pt (not 1920×1080px)
2. all text wrapped in `<p>`/`<h1>`-`<h6>` (no direct text inside divs, no `<span>` as primary text container)
3. `<p>`/`<h*>` cannot carry background/border/shadow themselves (put those on an outer div)
4. `<div>` cannot use `background-image` (use `<img>` instead)
5. no CSS gradients, no web components, no complex SVG decoration

**This skill's default HTML style has high visual freedom** — lots of span usage, nested flex, complex SVG, web components (such as `<deck-stage>`), CSS gradients — **almost none of that naturally passes html2pptx constraints** (real pass rate for visually-driven HTML sent straight to html2pptx is < 30%).

### Real cost comparison between the two paths (actual 2026-04-20 failure case)

| Path | Method | Result | Cost |
|------|--------|--------|------|
| ❌ **Write freeform HTML first, patch PPTX later** | Single-file deck-stage + lots of SVG/span decoration | If you need editable PPTX, only two options remain:<br>A. hand-write hundreds of lines of pptxgenjs coordinates<br>B. rewrite all 17 HTML pages into Path A format | 2-3 hours of rework, and the handwritten version becomes **permanent maintenance debt** (change one word in HTML, resync PPTX manually) |
| ✅ **Write under Path A constraints from step 1** | One HTML file per slide + 4 hard constraints + 720×405pt | One command exports a 100% editable PPTX, and it still plays fullscreen in the browser (Path A HTML is already standard browser-playable HTML) | Spend 5 extra minutes thinking "how should this text be wrapped in `<p>`" while writing HTML, zero rework |

### Startup wording (copy this directly)

> Before I start, confirm the delivery format:
> - **Browser presentation / PDF** → I'll build with maximum visual freedom (animations, web components, complex SVG, CSS gradients are all allowed)
> - **Editable PPTX required** (colleagues will edit text) → I must write the HTML from the start under the 4 hard constraints in `references/editable-pptx.md`. Visual capability is more limited (no gradients, no web components, no complex SVG), but export becomes a one-command operation
>
> Which path do you want?

### What about mixed delivery?

User says: "I want HTML presentation **and** editable PPTX" — **this is not mixed delivery**. The PPTX requirement overrides the HTML requirement. HTML written under Path A can already play fullscreen in the browser (just add a `deck_index.html` assembler). **No extra cost.**

User says: "I want PPTX **and** animation / web components" — **this is a real conflict**. Tell the user: editable PPTX requires sacrificing those visual capabilities. Make them choose. Do not quietly start a hand-written pptxgenjs path (that turns into permanent maintenance debt).

### What if you only find out later that PPTX is needed? (emergency recovery)

Rare case: the HTML is already done when you find out PPTX is required. At that point, both options are imperfect:

1. **Image-based PPTX** (`scripts/export_deck_pptx.mjs` image mode) — 100% visual fidelity, but text is not editable. Suitable for "presentation playback, no content editing" scenarios
2. **Handwritten pptxgenjs rebuild** (manually write addText/addShape per slide + embed graphics as PNG) — text is editable, but positions, fonts, alignment all need manual tuning, with high maintenance cost. **Only take this path if the user explicitly accepts that any source HTML change requires manual PPTX retuning**

Always tell the user the options first and let them decide. **Never make your first move to hand-write pptxgenjs** — that is the last fallback only.

---

## 🛑 Decide the architecture first: single-file or multi-file?

**This is the first decision in slide production. If you get it wrong, you'll keep stepping on rakes. Read this section before building.**

### Compare the two architectures

| Dimension | Single-file + `deck_stage.js` | **Multi-file + `deck_index.html` assembler** |
|-----------|-------------------------------|---------------------------------------------|
| Code structure | One HTML, all slides are `<section>` | One HTML per slide, `index.html` assembles with iframes |
| CSS scope | ❌ Global, one slide's styles can affect all slides | ✅ Naturally isolated, each iframe is its own world |
| Verification granularity | ❌ Need JS goTo to switch to a slide | ✅ Double-click a slide file directly in the browser |
| Parallel development | ❌ One file, multiple agents conflict | ✅ Different agents can build different slides, zero merge conflicts |
| Debug difficulty | ❌ One CSS issue can break the whole deck | ✅ One broken slide affects only itself |
| Embedded interaction | ✅ Cross-slide shared state is easy | 🟡 Cross-iframe requires postMessage |
| PDF printing | ✅ Built in | ✅ Built into the assembler via beforeprint iteration over iframes |
| Keyboard navigation | ✅ Built in | ✅ Built into the assembler |

### Which one should you choose? (decision tree)

```
│ Question: how many slides will the deck have?
├── ≤10 slides, needs in-deck animation or cross-slide interaction, pitch deck → single-file
└── ≥10 slides, academic talk, teaching deck, long deck, multi-agent parallel work → multi-file (recommended)
```

**Default to the multi-file path**. It is not a fallback — it is the **main path for long decks and team collaboration**. Why: every advantage of single-file architecture (keyboard nav, print, scale) exists in multi-file too, while multi-file's scope isolation and verifiability cannot be recovered later in single-file.

### Why this rule is so strict (real incident log)

A single-file architecture once hit four separate failures in an AI psychology lecture deck:

1. **CSS specificity override**: `.emotion-slide { display: grid }` (specificity 10) overrode `deck-stage > section { display: none }` (specificity 2), causing all slides to render stacked together.
2. **Shadow DOM slot rules suppressed by outer CSS**: `::slotted(section) { display: none }` could not resist outer rule overrides, so sections refused to hide.
3. **localStorage + hash navigation race**: after refresh, it did not land on the hash slide, but on the old slide stored in localStorage.
4. **High verification cost**: had to use `page.evaluate(d => d.goTo(n))` to capture a specific slide; slower and more error-prone than direct `goto(file://.../slides/05-X.html)`.

All root causes came from a **single global namespace** — multi-file architecture removes these problems physically.

---

## Path A (default): multi-file architecture

### Directory structure

```
MyDeck/
├── index.html              # copy from assets/deck_index.html, then edit MANIFEST
├── shared/
│   ├── tokens.css          # shared design tokens (palette/type scale/common chrome)
│   └── fonts.html          # <link> for Google Fonts (included in every page)
└── slides/
    ├── 01-cover.html       # each file is a complete 1920×1080 HTML
    ├── 02-agenda.html
    ├── 03-problem.html
    └── ...
```

### Template skeleton for each slide

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>P05 · Chapter Title</title>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="../shared/tokens.css">
<style>
  /* Styles unique to this slide. Any class name here stays isolated. */
  body { padding: 120px; }
  .my-thing { ... }
</style>
</head>
<body>
  <!-- 1920×1080 content (body width/height locked in tokens.css) -->
  <div class="page-header">...</div>
  <div>...</div>
  <div class="page-footer">...</div>
</body>
</html>
```

**Key constraints**:
- `<body>` is the canvas. Lay out directly on it. Do not wrap with `<section>` or another outer wrapper.
- `width: 1920px; height: 1080px` is locked by the `body` rule in `shared/tokens.css`.
- Include `shared/tokens.css` for shared design tokens (palette, type scale, page-header/footer, etc.).
- Write the font `<link>` in every page; separate font imports are cheap and keep each slide independently openable.

### Assembler: `deck_index.html`

**Copy directly from `assets/deck_index.html`**. You only need to edit one thing: the `window.DECK_MANIFEST` array, listing all slide file names in order plus a human-readable label:

```js
window.DECK_MANIFEST = [
  { file: "slides/01-cover.html",    label: "Cover" },
  { file: "slides/02-agenda.html",   label: "Agenda" },
  { file: "slides/03-problem.html",  label: "Problem Statement" },
  // ...
];
```

The assembler already includes keyboard navigation (←/→/Home/End/number keys/P for print), scale + letterbox, bottom-right counter, localStorage memory, hash-based slide jumps, and print mode (iterates iframe pages to output PDF).

### Per-slide verification (the killer feature of multi-file)

Every slide is standalone HTML. **As soon as one slide is done, open it directly in the browser**:

```bash
open slides/05-personas.html
```

Playwright screenshots can also use direct `goto(file://.../slides/05-personas.html)` without JS slide switching and without interference from other slides' CSS. That makes the "change a little, verify a little" workflow nearly free.

### Parallel development

Split slide tasks across different agents and run them in parallel — HTML files are independent, so there are no merge conflicts. For long decks, this can reduce production time to 1/N.

### What should go in `shared/tokens.css`

Only include things that are **truly shared across slides**:

- CSS variables (palette, type scales, spacing scales)
- canvas locking like `body { width: 1920px; height: 1080px; }`
- chrome like `.page-header` / `.page-footer` that is identical on every slide

**Do not** put single-slide layout classes there — that regresses into single-file-style global pollution.

---

## Path B (small decks): single-file + `deck_stage.js`

Suitable for ≤10 slides, decks needing cross-slide shared state (for example, one React Tweaks panel controlling every slide), or tightly compact pitch-deck demos.

### Basic usage

1. Read `assets/deck_stage.js` and embed it into the HTML `<script>` (or use `<script src="deck_stage.js">`)
2. Wrap slides with `<deck-stage>` inside the body
3. 🛑 **The script tag must appear after `</deck-stage>`** (see hard constraint below)

```html
<body>

  <deck-stage>
    <section>
      <h1>Slide 1</h1>
    </section>
    <section>
      <h1>Slide 2</h1>
    </section>
  </deck-stage>

  <!-- ✅ Correct: script comes after deck-stage -->
  <script src="deck_stage.js"></script>

</body>
```

### 🛑 Hard constraint on script placement (real 2026-04-20 failure)

**Do not put `<script src="deck_stage.js">` in `<head>`.** Even if it can define `customElements` in `<head>`, when the parser reaches the opening `<deck-stage>` tag it triggers `connectedCallback` — at that point the child `<section>` elements have not been parsed yet, `_collectSlides()` gets an empty array, the counter shows `1 / 0`, and all slides render stacked together.

**Three compliant patterns** (pick one):

```html
<!-- ✅ Best: script after </deck-stage> -->
</deck-stage>
<script src="deck_stage.js"></script>

<!-- ✅ Also valid: script in head with defer -->
<head><script src="deck_stage.js" defer></script></head>

<!-- ✅ Also valid: module scripts defer naturally -->
<head><script src="deck_stage.js" type="module"></script></head>
```

`deck_stage.js` itself already includes `DOMContentLoaded`-delayed collection as a safeguard, so putting the script in `<head>` won't completely explode — but `defer` or placing it at the end of body is still cleaner and avoids relying on the fallback path.

### ⚠️ CSS traps in single-file architecture (read this)

The most common trap in single-file architecture: **the `display` property gets stolen by slide-specific styles**.

Common bad pattern 1 (writing `display: flex` directly on `section`):

```css
/* ❌ Outer CSS specificity 2, overrides shadow DOM ::slotted(section){display:none} (also specificity 2) */
deck-stage > section {
  display: flex;            /* All slides will render stacked together! */
  flex-direction: column;
  padding: 80px;
  ...
}
```

Common bad pattern 2 (a section class with higher specificity):

```css
.emotion-slide { display: grid; }   /* specificity: 10, even worse */
```

Both patterns cause **all slides to render at once** — the counter may still show `1 / 10` and look normal, but visually slide 1 overlays slide 2 overlays slide 3.

### ✅ Starter CSS (copy this directly to avoid mistakes)

`section` itself only controls visibility. **Write layout (flex/grid etc.) on `.active`**:

```css
/* section only defines common non-display styles */
deck-stage > section {
  background: var(--paper);
  padding: 80px 120px;
  overflow: hidden;
  position: relative;
  /* ⚠️ do not write display here! */
}

/* Lock in "inactive = hidden" with specificity + !important */
deck-stage > section:not(.active) {
  display: none !important;
}

/* Only active slide gets display + layout */
deck-stage > section.active {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Print mode: all slides visible, override :not(.active) */
@media print {
  deck-stage > section { display: flex !important; }
  deck-stage > section:not(.active) { display: flex !important; }
}
```

Alternative: **write flex/grid on an inner wrapper `<div>`**, and let `section` remain only the `display: block/none` switcher. This is the cleanest solution:

```html
<deck-stage>
  <section>
    <div class="slide-content flex-layout">...</div>
  </section>
</deck-stage>
```

### Custom dimensions

```html
<deck-stage width="1080" height="1920">
  <!-- 9:16 portrait -->
</deck-stage>
```

---

## Slide Labels

Both deck_stage and deck_index label each slide (shown in the counter). Give them **meaningful** labels:

**Multi-file**: in `MANIFEST`, write `{ file, label: "04 Problem Statement" }`
**Single-file**: add `<section data-screen-label="04 Problem Statement">`

**Critical: slide numbering starts from 1, never 0**.

When a user says "slide 5," they mean the 5th slide, never array index `[4]`. Humans do not speak in zero-indexed arrays.

---

## Speaker Notes

**Do not add them by default**. Only add them when the user explicitly asks.

With speaker notes, you can reduce slide text to the minimum and focus on impactful visuals — the notes carry the full script.

### Format

**Multi-file**: put this in the `<head>` of `index.html`:

```html
<script type="application/json" id="speaker-notes">
[
  "Script for slide 1...",
  "Script for slide 2...",
  "..."
]
</script>
```

**Single-file**: same placement.

### Notes writing guidelines

- **Complete**: not an outline, but what will actually be said
- **Conversational**: sounds like speaking, not formal prose
- **Aligned**: array item N corresponds to slide N
- **Length**: 200-400 words is ideal
- **Emotional contour**: mark emphasis, pauses, key beats

---

## Slide Design Patterns

### 1. Establish a system (required)

After exploring the design context, **state the system you will use out loud first**:

```markdown
Deck system:
- Background colors: maximum 2 (90% white + 10% dark section divider)
- Typography: Instrument Serif for display, Geist Sans for body
- Rhythm: section dividers use full-bleed color + white text, regular slides use white background
- Imagery: hero slides use full-bleed photos, data slides use charts

I'll build with this system. Tell me if you want to change anything.
```

Only continue after the user confirms.

### 2. Common slide layouts

- **Title slide**: solid background + huge title + subtitle + author/date
- **Section divider**: colored background + section number + section title
- **Content slide**: white background + title + 1-3 bullet points
- **Data slide**: title + large chart/number + brief explanation
- **Image slide**: full-bleed photo + small caption at bottom
- **Quote slide**: whitespace + giant quote + attribution
- **Two-column**: left-right contrast (vs / before-after / problem-solution)

A deck should use no more than 4-5 layouts total.

### 3. Scale (repeating because it matters)

- Body text minimum **24px**, ideally 28-36px
- Titles **60-120px**
- Hero text **180-240px**
- Slides are meant to be read from 10 meters away. The text must be large enough.

### 4. Visual rhythm

A deck needs **intentional variety**:

- Color rhythm: mostly white slides + occasional colored section dividers + occasional dark segments
- Density rhythm: some text-heavy slides + some image-heavy slides + some whitespace quote slides
- Size rhythm: normal titles + occasional oversized hero typography

**Do not make every slide look the same** — that is a PPT template, not design.

### 5. Breathing space (required reading for data-dense slides)

**The easiest novice mistake**: stuffing every possible piece of information into one slide.

Information density ≠ effective information delivery. Academic/talk decks especially need restraint:

- List/matrix slides: don't make all N items the same size. Use **hierarchical emphasis** — the 5 items you discuss today should be enlarged as protagonists, the other 16 reduced as background hints.
- Big-number slides: the number itself is the visual protagonist. Keep surrounding captions under 3 lines, or the audience's eyes will bounce back and forth.
- Quote slides: leave whitespace between the quote and attribution, don't jam them together.

Self-audit with these two questions: "Is the data the protagonist?" and "Is the text crowded?" Keep editing until the whitespace feels slightly uncomfortable.

---

## Print to PDF

**Multi-file**: `deck_index.html` already handles the `beforeprint` event and outputs PDF page by page.

**Single-file**: `deck_stage.js` does the same.

Print styles are already included. You do not need to write additional `@media print` CSS.

---

## Export to PPTX / PDF (self-serve scripts)

HTML is the primary medium. But users often need PPTX/PDF delivery. Two general scripts are provided under `scripts/`, and **any multi-file deck can use them**:

### `export_deck_pdf.mjs` — export vector PDF (multi-file architecture)

```bash
node scripts/export_deck_pdf.mjs --slides <slides-dir> --out deck.pdf
```

**Characteristics**:
- text **remains vector** (copyable, searchable)
- 100% visual fidelity (rendered and printed through Playwright's embedded Chromium)
- **no HTML modifications required**
- each slide gets its own `page.pdf()`, then merged with `pdf-lib`

**Dependencies**: `npm install playwright pdf-lib`

**Limit**: PDF is not editable — changes must go back into HTML.

### `export_deck_stage_pdf.mjs` — single-file deck-stage architecture only ⚠️

**When to use**: the deck is one HTML file with N `<section>` elements wrapped by the `<deck-stage>` web component (Path B architecture). In that case, the `export_deck_pdf.mjs` approach of "one HTML = one `page.pdf()`" does not work. Use this dedicated script.

```bash
node scripts/export_deck_stage_pdf.mjs --html deck.html --out deck.pdf
```

**Why `export_deck_pdf.mjs` cannot be reused here** (real 2026-04-20 failure log):

1. **Shadow DOM beats `!important`**: inside deck-stage shadow CSS there is `::slotted(section) { display: none }` (only the active slide gets `display: block`). Even if the light DOM adds `@media print { deck-stage > section { display: block !important } }`, it still loses — when `page.pdf()` triggers print media, Chromium ends up rendering only the active slide, so the **entire PDF has only 1 page** (repeating the current active slide).

2. **Looping `goto` per slide still outputs only 1 page**: the intuitive solution of "navigate to each `#slide-N`, then `page.pdf({pageRanges:'1'})`" also fails — because the print CSS outside the shadow DOM still has `deck-stage > section { display: block }` overridden, so the final render is always the first section in the list (not the slide you navigated to). Result: 17 iterations, 17 copies of slide P01.

3. **Absolutely positioned children spill onto the next page**: even if you successfully render all sections, if the section itself is `position: static`, absolutely positioned `cover-footer`/`slide-footer` elements are positioned relative to the initial containing block. Once the section is forced to 1080px height during print, those footers can get pushed onto the next page (symptom: the PDF has one more page than the number of sections, and that extra page contains only an orphaned footer).

**Fix strategy** (already implemented in the script):

```js
// After opening the HTML, use page.evaluate to pull sections out of the deck-stage slot,
// mount them into a regular div under body, and inline styles to force position:relative + fixed dimensions
await page.evaluate(() => {
  const stage = document.querySelector('deck-stage');
  const sections = Array.from(stage.querySelectorAll(':scope > section'));
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: `
      @page { size: 1920px 1080px; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; }
      deck-stage { display: none !important; }
    `,
  }));
  const container = document.createElement('div');
  sections.forEach(s => {
    s.style.cssText = 'width:1920px!important;height:1080px!important;display:block!important;position:relative!important;overflow:hidden!important;page-break-after:always!important;break-after:page!important;background:#F7F4EF;margin:0!important;padding:0!important;';
    container.appendChild(s);
  });
  // Disable page break on the last page to avoid a trailing blank page
  sections[sections.length - 1].style.pageBreakAfter = 'auto';
  sections[sections.length - 1].style.breakAfter = 'auto';
  document.body.appendChild(container);
});

await page.pdf({ width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
```

**Why this works**:
- Pulling sections out of the shadow DOM slot into a normal light DOM div completely bypasses the `::slotted(section) { display: none }` rule
- Inline `position: relative` keeps absolutely positioned children relative to the section and prevents overflow
- `page-break-after: always` ensures each section becomes one page when printing
- disabling pagination on `:last-child` avoids a trailing blank page

**When verifying with `mdls -name kMDItemNumberOfPages`**: macOS Spotlight metadata is cached. After rewriting a PDF, run `mdimport file.pdf` to force refresh, otherwise you'll see the old page count. `pdfinfo` or counting output files via `pdftoppm` gives the true number.

---

### `export_deck_pptx.mjs` — export PPTX (two modes)

```bash
# Image-based (100% visual fidelity, text not editable)
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode image

# One text box per text element (editable, but fonts may fall back)
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode editable
```

| Mode | Visual fidelity | Editable text | How it works | Limits |
|------|----------------|---------------|--------------|--------|
| `image` | ✅ 100% | ❌ | Playwright screenshots → pptxgenjs addImage | text becomes images |
| `editable` | 🟡 ~70% | ✅ | html2pptx extracts each text box | see constraints below |

**Hard constraints in editable mode** (user HTML must satisfy them, otherwise the page is skipped):
- all text must be inside `<p>`/`<h1>`-`<h6>`/`<ul>`/`<ol>` (no bare-text divs)
- `<p>`/`<h*>` cannot carry background/border/shadow (use an outer div)
- no decorative text inserted through `::before`/`::after` (pseudo-elements cannot be extracted)
- inline elements (`span`/`em`/`strong`) cannot have margin
- no CSS gradients (not renderable)
- no `background-image` on divs (use `<img>`)

The script already includes an **automatic preprocessor** — it auto-wraps bare text in leaf divs into `<p>` while keeping the class. That handles the most common violation (bare text). Other violations (border on `p`, margin on `span`, etc.) still must be fixed in the HTML source.

**Another editable-mode caveat — font fallback**:
- Playwright measures text boxes using webfonts; PowerPoint/Keynote renders using local fonts
- if they differ, you get **overflow or misalignment** — every page must be reviewed visually
- recommended: install the HTML fonts on the target machine, or fall back to `system-ui`

### Make HTML export-friendly from the start

The most stable deck is one whose HTML is **written from the start under editable-mode constraints**. Then `--mode editable` can pass everything directly. The extra cost is small:

```html
<!-- ❌ Bad -->
<div class="title">Key Finding</div>

<!-- ✅ Good (wrapped in p, class preserved) -->
<p class="title">Key Finding</p>

<!-- ❌ Bad (border on p) -->
<p class="stat" style="border-left: 3px solid red;">41%</p>

<!-- ✅ Good (border on outer div) -->
<div class="stat-wrap" style="border-left: 3px solid red;">
  <p class="stat">41%</p>
</div>
```

### When to choose which

| Scenario | Recommendation |
|----------|----------------|
| Archive / organizer delivery | **PDF** (universal, high-fidelity, searchable text) |
| Send to collaborators for copy edits | **PPTX editable** (accept font fallback risk) |
| Live presentation, no content edits | **PDF** or **PPTX image** |
| HTML is the primary presentation medium | Play in the browser directly; export is only backup |

## Deep path for editable PPTX export (long-term projects only)

If your deck will be maintained long-term, revised repeatedly, and collaborated on — write the HTML **from the start under html2pptx constraints** so `--mode editable` passes reliably. See `references/editable-pptx.md` for details (4 hard constraints + HTML template + common error quick reference).

---

## Common Issues

**Multi-file: page inside iframe won't open / white screen**
→ Check whether the `file` path in `MANIFEST` is correct relative to `index.html`. Use browser DevTools to see whether the iframe src is directly accessible.

**Multi-file: one page's styles conflict with another**
→ Impossible (iframes isolate them). If it feels like a conflict, it's cache — hard refresh with Cmd+Shift+R.

**Single-file: multiple slides render stacked together**
→ CSS specificity issue. See the section above on "CSS traps in single-file architecture."

**Single-file: scaling looks wrong**
→ Check whether all slides are direct child `<section>` elements under `<deck-stage>`. No wrapper `<div>` in between.

**Single-file: want to jump to a specific slide**
→ Add a hash to the URL: `index.html#slide-5` jumps to the 5th slide.

**Applies to both architectures: text position differs across screens**
→ Use fixed dimensions (1920×1080) and `px` units. Do not use `vw`/`vh` or `%`. Handle scaling centrally.

---

## Verification Checklist (must pass before delivery)

1. [ ] Open `index.html` (or the main HTML) directly in the browser, verify no broken images on the first page and fonts are loaded
2. [ ] Press → through every slide, no blank pages and no layout shifts
3. [ ] Press P for print preview, each page should be exactly one A4 (or 1920×1080) page with no clipping
4. [ ] Randomly hard-refresh 3 pages with Cmd+Shift+R, confirm localStorage memory behaves correctly
5. [ ] Batch-capture screenshots in Playwright (multi-file: iterate `slides/*.html`; single-file: switch via goTo), then visually inspect them
6. [ ] Search for leftover `TODO` / `placeholder` text and confirm all are cleaned up
