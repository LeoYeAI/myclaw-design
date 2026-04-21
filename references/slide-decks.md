# Slide Decks: HTML Slide Production Guidelines

Making slide decks is a high-frequency design task. This document explains how to build good HTML slide decks—from architecture choices and single-slide design to the full path for PDF/PPTX export.

**This skill covers**:
- HTML playback / PDF export -> this document + `scripts/export_deck_pdf.mjs` / `scripts/export_deck_stage_pdf.mjs`
- Editable PPTX export -> `references/editable-pptx.md` + `scripts/html2pptx.js` + `scripts/export_deck_pptx.mjs --mode editable`
- Image-backed PPTX (not editable, but visually faithful) -> `scripts/export_deck_pptx.mjs --mode image`

---

## Stop Before You Start: Confirm the Delivery Format First (the hardest checkpoint)

**This decision comes before "single-file or multi-file."** Real-world test from the 2026-04-20 options mastermind project: **starting work without confirming the delivery format = 2-3 hours of rework.**

### Decision Tree

```
| Question: what is the final deliverable?
|-- Browser fullscreen presentation / local HTML    -> maximum visual freedom, build however you want
|-- PDF needed (print / send in chat / archive)     -> maximum visual freedom, any architecture can export
`-- Editable PPTX needed (teammates will change text) -> stop: from the first line of HTML, write under the 4 hard constraints in `references/editable-pptx.md`
```

### Why "if you need PPTX, you must take Path A from the beginning"

Editable PPTX depends on `html2pptx.js` being able to translate the DOM element-by-element into PowerPoint objects. It requires **4 hard constraints**:

1. `body` fixed at 720pt x 405pt (not 1920x1080px)
2. All text must be wrapped in `<p>` / `<h1>`-`<h6>` (no direct text in divs, no primary text carried by `<span>`)
3. `<p>` / `<h*>` cannot have background / border / shadow on themselves (put that on an outer div)
4. `<div>` cannot use `background-image` (use an `<img>` tag)
5. No CSS gradients, no web components, no complex SVG decoration

**This skill's default HTML style prioritizes visual freedom**—lots of spans, nested flex, complex SVG, web components (such as `<deck-stage>`), CSS gradients—**and almost none of that naturally satisfies html2pptx's constraints** (in practice, visually driven HTML passed directly into html2pptx has a pass rate under 30%).

### Cost Comparison Between Two Real Paths (real pitfalls from 2026-04-20)

| Path | Approach | Result | Cost |
|------|------|------|------|
| ❌ **Write freeform HTML first, patch PPTX later** | Single-file deck-stage + lots of SVG/span decoration | For editable PPTX, only two paths remain:<br>A. Hand-write hundreds of lines of pptxgenjs coordinate hardcoding<br>B. Rewrite 17 HTML pages into Path A format | 2-3 hours of rework, and the hand-written version creates **permanent maintenance cost** (change one word in HTML, then manually sync PPTX again) |
| ✅ **Write under Path A constraints from step one** | One HTML file per slide + 4 hard constraints + 720x405pt | One command exports a 100% editable PPTX, and it still works as a browser fullscreen presentation too (Path A HTML is already standard browser-playable HTML) | Spend 5 extra minutes while writing HTML thinking "how should this text be wrapped in `<p>`"; zero rework |

### Kickoff Wording (copy-paste ready)

> Before I start, confirm the delivery format first:
> - **Browser presentation / PDF** -> I will build it in the most visually flexible way (can use animation, web components, complex SVG, CSS gradients)
> - **Editable PPTX required** (teammates will change text) -> I must write the HTML from the beginning under the 4 hard constraints in `references/editable-pptx.md`. Visual expressiveness will be somewhat reduced (no gradients, no web components, no complex SVG), but export becomes a one-command job
>
> Which path do you want?

### What if the delivery is mixed?

The user says "I want HTML presentation **and** editable PPTX"—**this is not mixed**; the PPTX requirement overrides the HTML requirement. HTML written with Path A can already run fullscreen in the browser by itself (just add a `deck_index.html` assembler). **There is no extra cost.**

The user says "I want PPTX **and** animation / web components"—**this is a real conflict**. Tell the user: if they want editable PPTX, they must give up those visual capabilities. Make them choose. Do not quietly switch to a hand-written pptxgenjs solution, because that becomes permanent maintenance debt.

### What if you only find out later that PPTX is needed? (emergency remediation)

In rare cases, the HTML has already been built before anyone realizes a PPTX is needed. At that point neither option is ideal:

1. **Image-backed PPTX** (`scripts/export_deck_pptx.mjs` image mode) -> visuals are 100% faithful, but text is not editable. Suitable for "use the PPT for presenting, not for editing content"
2. **Hand-built pptxgenjs reconstruction** (manually write `addText` / `addShape` per slide + embed graphics as PNG) -> text becomes editable, but positions, fonts, and alignment all require manual tuning, and maintenance cost is high. **Only use this if the user explicitly accepts that any change to the HTML source will require manually retuning the PPTX again**

Always explain the choice to the user and let them decide. **Never make your first instinct to start hand-writing pptxgenjs**—that is the last fallback.

---

## Decide the Architecture First: Single-File or Multi-File?

**This is the first step in making a slide deck. Get it wrong and you will keep stepping on the same rake. Read this section before you start.**

### Comparing the Two Architectures

| Dimension | Single-file + `deck_stage.js` | **Multi-file + `deck_index.html` assembler** |
|------|--------------------------|--------------------------------------|
| Code structure | One HTML file, all slides are `<section>` | One HTML file per slide, `index.html` assembles via iframes |
| CSS scope | ❌ Global, styles from one page can affect all pages | ✅ Naturally isolated, each iframe is its own world |
| Verification granularity | ❌ Must use JS `goTo` to switch to a page | ✅ Double-click a single slide file and view it directly in the browser |
| Parallel development | ❌ One file, multiple agents will conflict | ✅ Multiple agents can build different pages in parallel with zero merge conflicts |
| Debugging difficulty | ❌ One broken CSS rule can wreck the whole deck | ✅ One broken page only breaks itself |
| Embedded interactions | ✅ Shared state across pages is easy | 🟡 Cross-iframe communication needs `postMessage` |
| Print PDF | ✅ Built in | ✅ The assembler iterates iframes on `beforeprint` |
| Keyboard navigation | ✅ Built in | ✅ Built into the assembler |

### Which one should you choose? (decision tree)

```
| Question: how many slides will this deck probably have?
|-- <=10 slides, needs in-deck animation or cross-page interaction, pitch deck -> single-file
`-- >=10 slides, academic talk, teaching deck, long deck, multi-agent parallel work -> multi-file (recommended)
```

**Default to the multi-file path.** It is not a backup option; it is the **primary path for long decks and collaborative work**. Reason: every advantage of the single-file architecture (keyboard nav, printing, scaling) also exists in multi-file, while multi-file's scope isolation and verifiability cannot be recovered later in single-file.

### Why is this rule so strict? (real incident log)

The single-file architecture once hit four separate failures while building an AI psychology lecture deck:

1. **CSS specificity override**: `.emotion-slide { display: grid }` (specificity 10) overrode `deck-stage > section { display: none }` (specificity 2), causing all pages to render stacked at once.
2. **Shadow DOM slot rules were suppressed by outer CSS**: `::slotted(section) { display: none }` could not resist outer rule overrides, so sections refused to hide.
3. **Race condition between localStorage and hash navigation**: after refresh, it did not jump to the hash position, but stayed on the older position stored in localStorage.
4. **High verification cost**: you had to run `page.evaluate(d => d.goTo(n))` just to screenshot one page, which was twice as slow as direct `goto(file://.../slides/05-X.html)` and also failed more often.

The root cause of all of them was the **single shared global namespace**. The multi-file architecture eliminates these problems physically.

---

## Path A (default): Multi-File Architecture

### Directory Structure

```
MyDeck/
├── index.html              # copied from assets/deck_index.html, edit MANIFEST
├── shared/
│   ├── tokens.css          # shared design tokens (palette / typography sizes / reusable chrome)
│   └── fonts.html          # <link> tags for Google Fonts (include on every page)
└── slides/
    ├── 01-cover.html       # each file is a complete 1920x1080 HTML slide
    ├── 02-agenda.html
    ├── 03-problem.html
    └── ...
```

### Template Skeleton for Each Slide

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>P05 · Chapter Title</title>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="../shared/tokens.css">
<style>
  /* Page-specific styles. Any class name here is isolated from other pages. */
  body { padding: 120px; }
  .my-thing { ... }
</style>
</head>
<body>
  <!-- 1920x1080 content (body width/height is locked in tokens.css) -->
  <div class="page-header">...</div>
  <div>...</div>
  <div class="page-footer">...</div>
</body>
</html>
```

**Key constraints**:
- `<body>` is the canvas. Lay out directly on it. Do not wrap it in `<section>` or another wrapper.
- `width: 1920px; height: 1080px` is locked by the `body` rule in `shared/tokens.css`.
- Import `shared/tokens.css` to share design tokens (palette, type scale, `page-header/footer`, etc.).
- Write the font `<link>` separately in each page (fonts are cheap to import separately, and this guarantees every page opens independently).

### Assembler: `deck_index.html`

**Copy it directly from `assets/deck_index.html`.** You only need to change one thing: the `window.DECK_MANIFEST` array. List every slide filename and its human-readable label in order:

```js
window.DECK_MANIFEST = [
  { file: "slides/01-cover.html",    label: "Cover" },
  { file: "slides/02-agenda.html",   label: "Agenda" },
  { file: "slides/03-problem.html",  label: "Problem Statement" },
  // ...
];
```

The assembler already includes: keyboard navigation (`<-` / `->` / `Home` / `End` / number keys / `P` for print), scale + letterboxing, a bottom-right counter, localStorage memory, hash-based slide jumps, and print mode (iterate iframes and output PDF page-by-page).

### Single-Page Verification (this is the killer advantage of the multi-file architecture)

Every slide is an independent HTML file. **As soon as one slide is done, open it directly in the browser and inspect it**:

```bash
open slides/05-personas.html
```

For Playwright screenshots, you can also directly `goto(file://.../slides/05-personas.html)` without JS page jumps and without interference from CSS on other pages. This makes the "change a little, verify a little" workflow almost free.

### Parallel Development

Split slide tasks across different agents and run them simultaneously. The HTML files are independent, so there are no merge conflicts. For a long deck, this parallel workflow can cut production time down to 1/N.

### What should go into `shared/tokens.css`

Only put things there that are **truly shared across pages**:

- CSS variables (palette, type scale, spacing scale)
- Canvas locks such as `body { width: 1920px; height: 1080px; }`
- Reusable chrome like `.page-header` / `.page-footer` that appears identically on every page

**Do not** stuff single-page layout classes into it, or it will degrade back into the global pollution problem of the single-file architecture.

---

## Path B (small decks): Single-File + `deck_stage.js`

Suitable for <=10 slides, cases where shared cross-page state is needed (for example, a React tweaks panel controlling all slides), or highly compact scenarios like pitch deck demos.

### Basic Usage

1. Read `assets/deck_stage.js` and embed it in the HTML with `<script>` (or `<script src="deck_stage.js">`)
2. Wrap slides inside `<deck-stage>` in the body
3. Stop: **the script tag must come after `</deck-stage>`** (see the hard constraint below)

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

### Stop: Hard Constraint on Script Position (real pitfall from 2026-04-20)

**Do not put `<script src="deck_stage.js">` in `<head>`.** Even if it defines `customElements` there, as soon as the parser reaches the opening `<deck-stage>` tag, it triggers `connectedCallback`. At that moment, the child `<section>` elements have not been parsed yet, so `_collectSlides()` gets an empty array, the counter shows `1 / 0`, and all pages render stacked together.

**Three compliant ways to write it** (pick any one):

```html
<!-- ✅ Recommended: script after </deck-stage> -->
</deck-stage>
<script src="deck_stage.js"></script>

<!-- ✅ Also valid: script in head with defer -->
<head><script src="deck_stage.js" defer></script></head>

<!-- ✅ Also valid: module scripts defer naturally -->
<head><script src="deck_stage.js" type="module"></script></head>
```

`deck_stage.js` itself already includes a `DOMContentLoaded` delayed-collection safeguard, so even with the script in the head it will not completely explode. But `defer` or placing the script at the end of the body is still cleaner and avoids relying on the defensive branch.

### Warning: CSS Traps in the Single-File Architecture (must read)

The most common trap in single-file decks is this: **the `display` property gets stolen by per-page styles**.

Common wrong pattern 1 (writing `display: flex` directly on the section):

```css
/* ❌ Outer CSS specificity 2 overrides shadow DOM ::slotted(section){display:none} (also 2) */
deck-stage > section {
  display: flex;            /* all slides render stacked at once! */
  flex-direction: column;
  padding: 80px;
  ...
}
```

Common wrong pattern 2 (the section gets a more specific class):

```css
.emotion-slide { display: grid; }   /* specificity: 10, even worse */
```

Both will cause **all slides to render stacked together at the same time**. The counter may still show `1 / 10` and pretend everything is normal, but visually page one is on top of page two which is on top of page three.

### ✅ Starter CSS (copy directly at kickoff and avoid the trap)

**The section element itself** only controls visible / hidden state; **layout** (`flex`, `grid`, etc.) is written on `.active`:

```css
/* section defines only shared non-display styles */
deck-stage > section {
  background: var(--paper);
  padding: 80px 120px;
  overflow: hidden;
  position: relative;
  /* ⚠️ do not write display here! */
}

/* lock "inactive means hidden" with specificity + !important as double insurance */
deck-stage > section:not(.active) {
  display: none !important;
}

/* only the active slide gets display + layout */
deck-stage > section.active {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* print mode: all slides must be shown, overriding :not(.active) */
@media print {
  deck-stage > section { display: flex !important; }
  deck-stage > section:not(.active) { display: flex !important; }
}
```

Alternative: **put single-page flex/grid on an inner wrapper `<div>`**, and let the section itself remain only a `display: block/none` switch. This is the cleanest approach:

```html
<deck-stage>
  <section>
    <div class="slide-content flex-layout">...</div>
  </section>
</deck-stage>
```

### Custom Sizes

```html
<deck-stage width="1080" height="1920">
  <!-- 9:16 portrait -->
</deck-stage>
```

---

## Slide Labels

Both `deck_stage` and `deck_index` label each page for the counter. Give them **meaningful labels**:

**Multi-file**: write `{ file, label: "04 Problem Statement" }` in `MANIFEST`
**Single-file**: add `<section data-screen-label="04 Problem Statement">` on the section

**Key point: slide numbering starts at 1, never 0.**

When a user says "slide 5," they mean the fifth slide, never array position `[4]`. Humans do not speak in zero-based indexing.

---

## Speaker Notes

**Do not add them by default.** Only add them when the user explicitly asks for them.

Once speaker notes exist, you can reduce on-slide text to the minimum and focus on impactful visuals, because the notes carry the full script.

### Format

**Multi-file**: inside `<head>` of `index.html`, write:

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

### Notes Writing Guidelines

- **Complete**: not an outline, but the actual words to speak
- **Conversational**: sounds like natural speech, not formal prose
- **Aligned**: array item N corresponds to slide N
- **Length**: 200-400 words is ideal
- **Emotional line**: mark emphasis, pauses, and stress points

---

## Slide Design Patterns

### 1. Establish a System (mandatory)

After exploring the design context, **state the system you will use out loud first**:

```markdown
Deck system:
- Background colors: at most 2 kinds (90% white + 10% dark section dividers)
- Typography: display in Instrument Serif, body in Geist Sans
- Rhythm: section dividers use full-bleed color + white text; regular slides use white backgrounds
- Images: hero slides use full-bleed photos; data slides use charts

I will build with this system. Tell me if you want anything changed.
```

Proceed only after the user confirms.

### 2. Common Slide Layouts

- **Title slide**: solid background + huge title + subtitle + author/date
- **Section divider**: colored background + section number + section title
- **Content slide**: white background + title + 1-3 bullet points
- **Data slide**: title + large chart / large number + short explanation
- **Image slide**: full-bleed photo + small caption at the bottom
- **Quote slide**: generous whitespace + oversized quote + attribution
- **Two-column**: left-right contrast (`vs` / before-after / problem-solution)

Use at most 4-5 layout types in a single deck.

### 3. Scale (repeating this on purpose)

- Minimum body text: **24px**, ideally 28-36px
- Titles: **60-120px**
- Hero text: **180-240px**
- Slides are meant to be read from 10 meters away. Text must be big enough.

### 4. Visual Rhythm

A deck needs **intentional variety**:

- Color rhythm: mostly white backgrounds + occasional colored section dividers + occasional dark segments
- Density rhythm: some text-heavy slides + some image-heavy slides + some whitespace-heavy quote slides
- Type rhythm: normal titles + occasional giant hero text

**Do not make every slide look the same**—that is a PPT template, not design.

### 5. Breathing Room (required reading for dense slides)

**The easiest beginner mistake**: cramming every possible piece of information into one page.

Information density does not equal effective communication. This is especially true for academic / presentation decks:

- List / matrix pages: do not draw all N elements at equal size. Use **hierarchy**—make the 5 items discussed today larger as the main characters, and let the other 16 shrink into background hints.
- Big-number pages: the number itself is the visual lead. The caption around it should not exceed 3 lines, or the audience's eyes start bouncing around.
- Quote pages: leave whitespace between the quote and the attribution. Do not stick them together.

Self-check against these two questions: "is the data the main character?" and "is the text crowding itself?" Keep editing until the whitespace makes you slightly uncomfortable.

---

## Print to PDF

**Multi-file**: `deck_index.html` already handles the `beforeprint` event and outputs page-by-page PDF.

**Single-file**: `deck_stage.js` handles it too.

Print styles are already written. No extra `@media print` CSS is needed.

---

## Export to PPTX / PDF (self-service scripts)

HTML is the primary medium. But users often need PPTX/PDF as deliverables. Two generic scripts are provided under `scripts/`, and **any multi-file deck can use them**:

### `export_deck_pdf.mjs` - export vector PDF (multi-file architecture)

```bash
node scripts/export_deck_pdf.mjs --slides <slides-dir> --out deck.pdf
```

**Characteristics**:
- Text remains **vector** (copyable, searchable)
- Visuals are 100% faithful (rendered in embedded Chromium via Playwright, then printed)
- **No need to change a single character of the HTML**
- Each slide is rendered with independent `page.pdf()`, then merged with `pdf-lib`

**Dependencies**: `npm install playwright pdf-lib`

**Limitation**: text is no longer editable inside the PDF; edits must go back to the HTML source.

### `export_deck_stage_pdf.mjs` - dedicated to single-file `deck-stage` architecture ⚠️

**When to use it**: the deck is one HTML file with an N-slide `<deck-stage>` web component wrapping multiple `<section>` elements (Path B architecture). In that case, the `export_deck_pdf.mjs` method of "one `page.pdf()` per HTML file" does not work, so this dedicated script is required.

```bash
node scripts/export_deck_stage_pdf.mjs --html deck.html --out deck.pdf
```

**Why `export_deck_pdf.mjs` cannot be reused** (real pitfalls from 2026-04-20):

1. **Shadow DOM beats `!important`**: the shadow CSS in `deck-stage` contains `::slotted(section) { display: none }` (only the active one is `display: block`). Even if the light DOM contains `@media print { deck-stage > section { display: block !important } }`, it still loses. When `page.pdf()` triggers print media, Chromium ultimately renders only the active slide, so the **entire PDF becomes just 1 page** (a repetition of the current active slide).

2. **Looping `goto` across pages still gives just 1 page**: the intuitive fix—navigate to each `#slide-N` and then run `page.pdf({pageRanges:'1'})`—also fails. Because the print CSS outside the shadow DOM still gets overridden after `deck-stage > section { display: block }`, the final rendered result is always the first section in the list, not the one you navigated to. The outcome is 17 iterations producing 17 copies of cover slide P01.

3. **Absolutely positioned children spill to the next page**: even if you manage to force all sections to render, if a section itself has `position: static`, then absolutely positioned `cover-footer` / `slide-footer` elements are positioned against the initial containing block. Once print forces the section height to 1080px, those absolute footers can be pushed onto the next page. The symptom is a PDF with one more page than there are sections, where the extra page contains only an orphan footer.

**Fix strategy** (already implemented in the script):

```js
// After opening the HTML, use page.evaluate to pull the sections out of the deck-stage slot
// and mount them directly under body inside a normal div, with inline styles to ensure
// position: relative + fixed size
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
  // Disable pagination on the final page to avoid a trailing blank page
  sections[sections.length - 1].style.pageBreakAfter = 'auto';
  sections[sections.length - 1].style.breakAfter = 'auto';
  document.body.appendChild(container);
});

await page.pdf({ width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
```

**Why this works**:
- Pulling sections out of the shadow DOM slot into a normal light DOM div completely bypasses `::slotted(section) { display: none }`
- Inline `position: relative` ensures absolutely positioned children stay positioned relative to the section and do not spill out
- `page-break-after: always` makes the browser print each section as a separate page
- Removing pagination on `:last-child` avoids a trailing blank page

**When validating with `mdls -name kMDItemNumberOfPages`, be careful**: macOS Spotlight metadata is cached. After rewriting a PDF, run `mdimport file.pdf` to force refresh, or you will see stale page counts. `pdfinfo` or counting files from `pdftoppm` gives the real number.

---

### `export_deck_pptx.mjs` - export PPTX (two modes)

```bash
# Image-backed slides (100% visual fidelity, text not editable)
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode image

# One independent text box per text element (editable, but fonts may fall back)
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx --mode editable
```

| Mode | Visual fidelity | Editable text | How it works | Limitations |
|------|---------|----------|---------|------|
| `image` | ✅ 100% | ❌ | Playwright screenshot -> `pptxgenjs addImage` | Text becomes an image |
| `editable` | 🟡 ~70% | ✅ | html2pptx extracts each text box independently | See constraints below |

**Hard constraints in editable mode** (the user's HTML must satisfy these, or that slide is skipped):
- All text must be inside `<p>` / `<h1>`-`<h6>` / `<ul>` / `<ol>` (no bare text divs)
- `<p>` / `<h*>` tags themselves cannot have background / border / shadow (move those to an outer div)
- Do not use `::before` / `::after` to inject decorative text (pseudo-elements cannot be extracted)
- Inline elements (`span` / `em` / `strong`) cannot have margin
- Do not use CSS gradients (not renderable)
- Do not use `background-image` on divs (use `<img>`)

The script already includes an **automatic preprocessor** that wraps bare text inside leaf divs into `<p>` while preserving classes. That resolves the most common violation (bare text). But other violations (border on `p`, margin on `span`, etc.) still require compliant HTML at the source.

**Another caveat in editable mode: font fallback**:
- Playwright measures text box sizes using webfonts; PowerPoint / Keynote renders with local machine fonts
- If those differ, you get **overflow or misalignment**—every slide must be checked visually
- Recommended: install the fonts used by the HTML on the target machine, or fall back to `system-ui`

### Make the HTML export-friendly from the start

The most reliable deck is this: **write the HTML under editable-mode constraints from the beginning**. Then `--mode editable` can pass everything directly. The extra cost is low:

```html
<!-- ❌ Bad -->
<div class="title">Key Findings</div>

<!-- ✅ Good (wrapped in p, class preserved) -->
<p class="title">Key Findings</p>

<!-- ❌ Bad (border applied on p) -->
<p class="stat" style="border-left: 3px solid red;">41%</p>

<!-- ✅ Good (border moved to outer div) -->
<div class="stat-wrap" style="border-left: 3px solid red;">
  <p class="stat">41%</p>
</div>
```

### When should you choose which format?

| Scenario | Recommendation |
|------|------|
| Give to the organizer / archive it | **PDF** (universal, high fidelity, searchable text) |
| Send to collaborators so they can tweak wording | **Editable PPTX** (accept font fallback risk) |
| Need to present live, no content edits | **PDF** or **Image PPTX** |
| HTML is the preferred presentation medium | Play directly in the browser; export is just backup |

## Deep path for editable PPTX export (only for long-term projects)

If your deck will be maintained long-term, revised repeatedly, and edited collaboratively, then **write the HTML under html2pptx constraints from day one** so that `--mode editable` passes reliably. See `references/editable-pptx.md` for details (4 hard constraints + HTML template + common-error quick reference).

---

## Frequently Asked Questions

**Multi-file: pages inside the iframe do not open / white screen**
-> Check whether the `file` paths in `MANIFEST` are correct relative to `index.html`. Use browser DevTools to inspect whether the iframe `src` can be accessed directly.

**Multi-file: styles from one page seem to conflict with another page**
-> Impossible with iframe isolation. If it looks like a conflict, it is cache. Hard refresh with `Cmd+Shift+R`.

**Single-file: multiple slides render stacked together**
-> CSS specificity issue. See the section above: "CSS traps in the single-file architecture."

**Single-file: scaling looks wrong**
-> Check whether every slide is mounted directly under `<deck-stage>` as a `<section>`. There cannot be a wrapper `<div>` in between.

**Single-file: want to jump to a specific slide**
-> Add a hash to the URL: `index.html#slide-5` jumps to slide 5.

**Applies to both architectures: text shifts position on different screens**
-> Use fixed dimensions (1920x1080) and `px` units. Do not use `vw` / `vh` / `%`. Scaling should be handled uniformly.

---

## Verification Checklist (must pass before the deck is done)

1. [ ] Open `index.html` directly in the browser (or the main HTML file) and confirm the first page has no broken images and fonts have loaded
2. [ ] Press the right arrow through every page; there should be no blank pages and no layout breakage
3. [ ] Press `P` to open print preview; every page should be exactly one A4 page (or 1920x1080) with no clipping
4. [ ] Randomly pick 3 pages and hard refresh with `Cmd+Shift+R`; localStorage memory should work normally
5. [ ] Batch screenshot with Playwright (multi-file architecture: iterate `slides/*.html`; single-file architecture: use `goTo` to switch) and inspect them visually
6. [ ] Search for leftover `TODO` / `placeholder` text and confirm everything is cleaned up
