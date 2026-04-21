# Design Context: Start from Existing Context

**This is the single most important thing in this skill.**

Good hi-fi design always grows from existing design context. **Creating hi-fi from scratch is a last resort and will always produce generic work**. So at the start of every design task, ask: is there anything to reference?

## What Is Design Context

In order of priority from highest to lowest:

### 1. User's Design System/UI Kit
The user's existing component library, color tokens, typography spec, icon system for their own product. **The ideal scenario**.

### 2. User's Codebase
If the user provides a codebase, it contains living component implementations. Read those component files:
- `theme.ts` / `colors.ts` / `tokens.css` / `_variables.scss`
- Specific components (Button.tsx, Card.tsx)
- Layout scaffold (App.tsx, MainLayout.tsx)
- Global stylesheets

**Read the code and copy exact values**: hex codes, spacing scale, font stack, border radius. Don't redraw from memory.

### 3. User's Published Product
If the user has a live product but didn't provide code, use Playwright or ask the user for screenshots.

```bash
# Screenshot a public URL with Playwright
npx playwright screenshot https://example.com screenshot.png --viewport-size=1920,1080
```

This lets you see the real visual vocabulary.

### 4. Brand Guidelines/Logo/Existing Assets
The user may have: logo files, brand color specs, marketing materials, slide templates. These are all context.

### 5. Competitor References
The user says "like XX website" — have them provide a URL or screenshot. **Don't** rely on vague impressions from your training data.

### 6. Known Design Systems (fallback)
If none of the above exist, use a well-known design system as a base:
- Apple HIG
- Material Design 3
- Radix Colors (color palette)
- shadcn/ui (components)
- Tailwind default palette

Explicitly tell the user what you're using, so they know it's a starting point, not a final design.

## Context Gathering Flow

### Step 1: Ask the user

Required questions at the start of every task (from `workflow.md`):

```markdown
1. Do you have an existing design system/UI kit/component library? Where is it?
2. Do you have brand guidelines, color/typography specs?
3. Can you give me screenshots or a URL of your existing product?
4. Is there a codebase I can read?
```

### Step 2: When the user says "no," help them find context

Don't give up immediately. Try:

```markdown
Let me see if there are any clues:
- Do you have related designs from previous projects?
- What colors/typography does your company's marketing website use?
- What style is your product logo? Can you send me one?
- Are there any products you admire as references?
```

### Step 3: Read all available context

If the user provides a codebase path, read:
1. **List the file structure first**: Find style/theme/component-related files
2. **Read theme/token files**: Lift specific hex/px values
3. **Read 2-3 representative components**: See the visual vocabulary (hover state, shadow, border, padding patterns)
4. **Read global stylesheet**: Base reset, font loading
5. **If there's a Figma link/screenshot**: Look at it, but **trust the code more**

**Important**: **Don't** glance at it and work from impression. You need 30+ specific values lifted to truly capture the context.

### Step 4: Vocalize the system you'll use

After reviewing context, tell the user the system you'll use:

```markdown
Based on your codebase and product screenshots, here's the design system I've extracted:

**Colors**
- Primary: #C27558 (from tokens.css)
- Background: #FDF9F0
- Text: #1A1A1A
- Muted: #6B6B6B

**Typography**
- Display: Instrument Serif (from global.css @font-face)
- Body: Geist Sans
- Mono: JetBrains Mono

**Spacing** (from your scale system)
- 4, 8, 12, 16, 24, 32, 48, 64

**Shadow pattern**
- `0 1px 2px rgba(0,0,0,0.04)` (subtle card)
- `0 10px 40px rgba(0,0,0,0.1)` (elevated modal)

**Border-radius**
- Small widgets 4px, cards 12px, buttons 8px

**Component vocabulary**
- Button: filled primary, outlined secondary, ghost tertiary, all 8px radius
- Card: white background, subtle shadow, no border

I'll start building with this system. Confirm it looks right?
```

Get user confirmation before starting.

## Designing from Scratch (Fallback When There's No Context)

**Strong warning**: Output quality will drop significantly in this scenario. Tell the user explicitly.

```markdown
You don't have design context, so I can only work from general intuition.
The output will be "looks OK but lacks distinctiveness."
Want to proceed, or would you rather gather some reference materials first?
```

If the user insists, make decisions in this order:

### 1. Pick an aesthetic direction
Don't give generic results. Pick a clear direction:
- brutally minimal
- editorial/magazine
- brutalist/raw
- organic/natural
- luxury/refined
- playful/toy
- retro-futuristic
- soft/pastel

Tell the user which one you picked.

### 2. Pick a known design system as the skeleton
- Use Radix Colors for palette (https://www.radix-ui.com/colors)
- Use shadcn/ui for component vocabulary (https://ui.shadcn.com)
- Use Tailwind spacing scale (multiples of 4)

### 3. Pick distinctive font pairings

Don't use Inter/Roboto. Suggested combinations (free from Google Fonts):
- Instrument Serif + Geist Sans
- Cormorant Garamond + Inter Tight
- Bricolage Grotesque + Söhne (paid)
- Fraunces + Work Sans (note: Fraunces has been overused by AI)
- JetBrains Mono + Geist Sans (technical feel)

### 4. Every key decision needs reasoning

Don't choose silently. Write it in HTML comments:

```html
<!--
Design decisions:
- Primary color: warm terracotta (oklch 0.65 0.18 25) — fits the "editorial" direction  
- Display: Instrument Serif for humanist, literary feel
- Body: Geist Sans for cleanness contrast
- No gradients — committed to minimal, no AI slop
- Spacing: 8px base, golden ratio friendly (8/13/21/34)
-->
```

## Import Strategy (When User Provides a Codebase)

If the user says "import this codebase as reference":

### Small (<50 files)
Read everything, internalize the context.

### Medium (50-500 files)
Focus on:
- `src/components/` or `components/`
- All styles/tokens/theme-related files
- 2-3 representative full-page components (Home.tsx, Dashboard.tsx)

### Large (>500 files)
Ask the user to specify focus:
- "I'm building a settings page" → read existing settings-related files
- "I'm building a new feature" → read the overall shell + closest reference
- Don't aim for completeness; aim for accuracy

## Working with Figma/Design Mockups

If the user provides a Figma link:

- **Don't** expect to directly "convert Figma to HTML" — that requires additional tools
- Figma links are usually not publicly accessible
- Ask the user to: export as **screenshots** and send them + tell you specific color/spacing values

If only given Figma screenshots, tell the user:
- I can see the visuals, but can't extract precise values
- Please tell me the key numbers (hex, px), or export as code (Figma supports this)

## Final Reminder

**A project's design quality ceiling is determined by the quality of context you obtain.**

Spending 10 minutes gathering context is more valuable than spending 1 hour creating hi-fi from scratch.

**When there's no context, prioritize asking the user for it rather than pushing through.**
