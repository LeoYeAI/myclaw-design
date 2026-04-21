# Content Guidelines: Anti-AI Slop, Content Rules, Scale Spec

The easiest traps to fall into in AI design. This is a "what NOT to do" checklist, more important than "what to do" — because AI slop is the default, and if you don't actively avoid it, it will happen.

## AI Slop Complete Blacklist

### Visual Traps

**❌ Aggressive gradient backgrounds**
- Purple → pink → blue full-screen gradient (the signature AI-generated web page look)
- Rainbow gradients in any direction
- Mesh gradients filling the background
- ✅ If you must use gradients: subtle, monochromatic, intentionally placed as accents (e.g., button hover)

**❌ Rounded cards + left border accent color**
```css
/* This is the signature of an AI-flavored card */
.card {
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  padding: 16px;
}
```
This card style is rampant in AI-generated dashboards. Want emphasis? Use more design-conscious approaches: background color contrast, font weight/size contrast, plain dividers, or just don't use cards at all.

**❌ Emoji decoration**
Unless the brand itself uses emoji (e.g., Notion, Slack), don't put emoji in the UI. **Especially not**:
- 🚀 ⚡️ ✨ 🎯 💡 before headings
- ✅ in feature lists
- → in CTA buttons (standalone arrows are OK, emoji arrows are not)

If you need icons, use a real icon library (Lucide/Heroicons/Phosphor), or use placeholders.

**❌ SVG-drawn imagery**
Don't try to draw people, scenes, devices, objects, or abstract art with SVG. AI-drawn SVG imagery is instantly recognizable as AI — childish and cheap. **A gray rectangle with "illustration placeholder 1200×800" text label is 100x better than a clumsy SVG hero illustration**.

The only acceptable SVG use cases:
- Actual icons (16×16 to 32×32 scale)
- Geometric shapes as decorative elements
- Data viz charts

**❌ Excessive iconography**
Not every heading/feature/section needs an icon. Icon overuse makes the interface look like a toy. Less is more.

**❌ "Data slop"**
Fabricated stats as decoration:
- "10,000+ happy customers" (you don't even know if that's true)
- "99.9% uptime" (no real data to back it up)
- Decorative "metric cards" made of icon + number + phrase
- Fancy-looking fake data in mock tables

If you don't have real data, use placeholders or ask the user for it.

**❌ "Quote slop"**
Fabricated user testimonials or celebrity quotes decorating the page. Use placeholders and ask the user for real quotes.

### Font Traps

**❌ Avoid these overused fonts**:
- Inter (the default for AI-generated web pages)
- Roboto
- Arial / Helvetica
- Pure system font stack
- Fraunces (AI discovered this one and ran it into the ground)
- Space Grotesk (AI's latest favorite)

**✅ Use distinctive display+body pairings**. Inspiration:
- Serif display + sans-serif body (editorial feel)
- Mono display + sans body (technical feel)
- Heavy display + light body (contrast)
- Variable font for hero weight animations

Font resources:
- Lesser-known gems on Google Fonts (Instrument Serif, Cormorant, Bricolage Grotesque, JetBrains Mono)
- Open-source font sites (Fraunces siblings, Adobe Fonts)
- Don't invent font names that don't exist

### Color Traps

**❌ Inventing colors from scratch**
Don't design an entire unfamiliar color palette from scratch. It usually won't be harmonious.

**✅ Strategy**:
1. Have brand colors → use them; fill missing color tokens with oklch interpolation
2. No brand colors but have references → sample colors from reference product screenshots
3. Starting from zero → pick a known color system (Radix Colors / Tailwind default palette / Anthropic brand), don't roll your own

**Defining colors with oklch** is the most modern approach:
```css
:root {
  --primary: oklch(0.65 0.18 25);      /* Warm terracotta */
  --primary-light: oklch(0.85 0.08 25); /* Same hue, lighter */
  --primary-dark: oklch(0.45 0.20 25);  /* Same hue, darker */
}
```
oklch ensures hue doesn't drift when adjusting lightness — better than hsl.

**❌ Casually adding dark mode with inverted colors**
It's not as simple as inverting colors. Good dark mode requires re-tuning saturation, contrast, and accent colors. If you don't want to do dark mode properly, don't do it at all.

### Layout Traps

**❌ Bento grid overuse**
Every AI-generated landing page wants to do bento. Unless your information structure genuinely suits bento, use a different layout.

**❌ Big hero + 3-column features + testimonials + CTA**
This landing page template has been done to death. If you want to innovate, actually innovate.

**❌ Every card in a card grid looks the same**
Asymmetric cards, different sizes, some with images and some text-only, some spanning columns — that's what real design looks like.

## Content Rules

### 1. Don't add filler content

Every element must earn its place. Emptiness is a design problem — solve it with **composition** (contrast, rhythm, whitespace), **not** by stuffing in more content.

**Questions to identify filler**:
- If I remove this content, will the design get worse? If the answer is "no," remove it.
- What real problem does this element solve? If it's "making the page less empty," delete it.
- Is this stat/quote/feature backed by real data? If not, don't fabricate it.

"One thousand no's for every yes."

### 2. Ask before adding material

Think adding another paragraph/page/section would be better? Ask the user first — don't add unilaterally.

Why:
- The user knows their audience better than you
- Adding content has a cost; the user may not want it
- Unilaterally adding content violates the "junior designer reporting to manager" relationship

### 3. Create a system up front

After exploring design context, **verbally state the system you'll use** and let the user confirm:

```markdown
My design system:
- Colors: #1A1A1A body + #F0EEE6 background + #D97757 accent (from your brand)
- Type: Instrument Serif for display + Geist Sans for body
- Rhythm: section titles use full-bleed colored background + white text; regular sections use white background
- Images: hero uses full-bleed photo, feature sections use placeholders until you provide them
- Max 2 background colors to avoid clutter

Confirm this direction and I'll start.
```

Get user confirmation before starting. This check-in prevents "halfway through and the direction is wrong."

## Scale Spec

### Slides (1920×1080)

- Body text minimum **24px**, ideal 28-36px
- Titles 60-120px
- Section titles 80-160px
- Hero headlines can use 180-240px large text
- Never use <24px text on slides

### Print Documents

- Body text minimum **10pt** (≈13.3px), ideal 11-12pt
- Titles 18-36pt
- Captions 8-9pt

### Web and Mobile

- Body text minimum **14px** (16px for accessibility)
- Mobile body text **16px** (prevents iOS auto-zoom)
- Hit targets (tappable elements) minimum **44×44px**
- Line height 1.5-1.7 (Chinese text 1.7-1.8)

### Contrast

- Body vs background **at least 4.5:1** (WCAG AA)
- Large text vs background **at least 3:1**
- Check with Chrome DevTools accessibility tools

## CSS Power Tools

**Advanced CSS features** are a designer's best friend — use them boldly:

### Typography

```css
/* Make heading line breaks more natural, no lonely last word */
h1, h2, h3 { text-wrap: balance; }

/* Body text wrapping, avoid widows and orphans */
p { text-wrap: pretty; }

/* Chinese typography essentials: punctuation compression, line-start/end control */
p { 
  text-spacing-trim: space-all;
  hanging-punctuation: first;
}
```

### Layout

```css
/* CSS Grid + named areas = extremely readable */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* Subgrid for aligning card contents */
.card { display: grid; grid-template-rows: subgrid; }
```

### Visual Effects

```css
/* Stylish scrollbars */
* { scrollbar-width: thin; scrollbar-color: #666 transparent; }

/* Glassmorphism (use sparingly) */
.glass {
  backdrop-filter: blur(20px) saturate(150%);
  background: color-mix(in oklch, white 70%, transparent);
}

/* View transitions API for smooth page transitions */
@view-transition { navigation: auto; }
```

### Interaction

```css
/* :has() selector makes conditional styling easy */
.card:has(img) { padding-top: 0; } /* Cards with images get no top padding */

/* Container queries for truly responsive components */
@container (min-width: 500px) { ... }

/* The new color-mix function */
.button:hover {
  background: color-mix(in oklch, var(--primary) 85%, black);
}
```

## Quick Decision Guide: When You're Unsure

- Want to add a gradient? → Probably don't
- Want to add an emoji? → Don't
- Want to add rounded corners + border-left accent to a card? → Don't, find another way
- Want to draw a hero illustration with SVG? → Don't, use a placeholder
- Want to add a decorative quote? → First ask the user if they have a real quote
- Want to add a row of icon features? → First ask if icons are needed — maybe they're not
- Using Inter? → Switch to something more distinctive
- Using a purple gradient? → Switch to a well-grounded color scheme

**When you feel "adding this would look better" — that's usually a sign of AI slop**. Build the simplest version first, and only add when the user asks.
