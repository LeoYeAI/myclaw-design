# Design Review Deep Guide

> Detailed reference for Phase 7. Provides scoring criteria, scene-specific priorities, and common issues checklist.

---

## Scoring Criteria Explained

### 1. Philosophy Alignment

| Score | Criteria |
|-------|----------|
| 9-10 | Design perfectly embodies the chosen philosophy's core spirit; every detail has philosophical justification |
| 7-8 | Overall direction is correct, core characteristics are present, occasional details deviate |
| 5-6 | Intent is visible, but execution mixes in other style elements, not pure enough |
| 3-4 | Only surface-level imitation, core philosophy not understood |
| 1-2 | Essentially unrelated to the chosen philosophy |

**Review points**:
- Does it use the signature techniques of that designer/studio?
- Do colors, typography, and layout conform to that philosophy's system?
- Are there "self-contradictory" elements? (e.g., choosing Kenya Hara but cramming the page with content)

### 2. Visual Hierarchy

| Score | Criteria |
|-------|----------|
| 9-10 | User's gaze naturally follows the designer's intent; zero friction in information acquisition |
| 7-8 | Primary/secondary relationships are clear, with 1-2 spots of ambiguous hierarchy |
| 5-6 | Can distinguish headings from body text, but mid-level hierarchy is confused |
| 3-4 | Information is flat, no clear visual entry point |
| 1-2 | Chaotic, user doesn't know where to look first |

**Review points**:
- Is the font size contrast between heading and body sufficient? (at least 2.5x)
- Do color/weight/size establish 3-4 clear levels?
- Is whitespace guiding the eye?
- "Squint test": squint your eyes — is the hierarchy still clear?

### 3. Craft Quality

| Score | Criteria |
|-------|----------|
| 9-10 | Pixel-perfect precision; alignment, spacing, and color are flawless |
| 7-8 | Overall polished, with 1-2 minor alignment/spacing issues |
| 5-6 | Basically aligned, but spacing is inconsistent and color usage isn't systematic |
| 3-4 | Obvious alignment errors, chaotic spacing, too many colors |
| 1-2 | Rough, looks like a draft |

**Review points**:
- Is a consistent spacing system used (e.g., 8pt grid)?
- Is spacing between similar elements consistent?
- Is the number of colors controlled? (typically no more than 3-4)
- Is the font family unified? (typically no more than 2)
- Is edge alignment precise?

### 4. Functionality

| Score | Criteria |
|-------|----------|
| 9-10 | Every design element serves the goal; zero redundancy |
| 7-8 | Clearly function-driven, with a few removable decorations |
| 5-6 | Basically usable, but obvious decorative elements distract attention |
| 3-4 | Form over function; user has to work to find information |
| 1-2 | Completely drowned in decoration; lost the ability to convey information |

**Review points**:
- If you remove any single element, would the design get worse? (If not, it should be removed)
- Is the CTA/key information in the most prominent position?
- Are there elements added "because they look nice"?
- Does information density match the medium? (Slides shouldn't be too dense; PDFs can be denser)

### 5. Originality

| Score | Criteria |
|-------|----------|
| 9-10 | Refreshingly original; found a unique expression within the philosophy's framework |
| 7-8 | Has its own ideas; not a simple template application |
| 5-6 | Middle-of-the-road; looks like a template |
| 3-4 | Heavy use of cliches (e.g., gradient spheres representing AI) |
| 1-2 | Entirely template or stock asset collage |

**Review points**:
- Does it avoid common cliches? (See "Common Issues Checklist" below)
- Is there personal expression while following the design philosophy?
- Are there "unexpected but logical" design decisions?

---

## Scene-Specific Review Priorities

Different output types have different review priorities:

| Scene | Most Important | Second Most | Can Be Relaxed |
|-------|---------------|-------------|----------------|
| WeChat cover/illustration | Originality, Visual Hierarchy | Philosophy Alignment | Functionality (single image, no interaction) |
| Infographic | Functionality, Visual Hierarchy | Craft Quality | Originality (accuracy first) |
| PPT/Keynote | Visual Hierarchy, Functionality | Craft Quality | Originality (clarity first) |
| PDF/White Paper | Craft Quality, Functionality | Visual Hierarchy | Originality (professionalism first) |
| Landing Page/Website | Functionality, Visual Hierarchy | Originality | — (comprehensive requirements) |
| App UI | Functionality, Craft Quality | Visual Hierarchy | Philosophy Alignment (usability first) |
| Xiaohongshu (RED) images | Originality, Visual Hierarchy | Philosophy Alignment | Craft Quality (atmosphere first) |

---

## Top 10 Common Design Issues

### 1. AI/Tech Cliches
**Problem**: Gradient spheres, digital rain, blue circuit boards, robot faces
**Why it's a problem**: Users are already visually fatigued by these; they can't distinguish you from anyone else
**Fix**: Use abstract metaphors instead of literal symbols (e.g., use a "conversation" metaphor instead of a chat bubble icon)

### 2. Insufficient Font Size Hierarchy
**Problem**: Heading and body text size difference is too small (<2.5x)
**Why it's a problem**: Users can't quickly locate key information
**Fix**: Heading should be at least 3x the body text (e.g., body 16px → heading 48-64px)

### 3. Too Many Colors
**Problem**: Using 5+ colors with no primary/secondary distinction
**Why it's a problem**: Visual chaos, weak brand identity
**Fix**: Limit to 1 primary + 1 secondary + 1 accent + grayscale

### 4. Inconsistent Spacing
**Problem**: Element spacing is arbitrary, no system
**Why it's a problem**: Looks unprofessional, visual rhythm is broken
**Fix**: Establish an 8pt grid system (spacing only uses 8/16/24/32/48/64px)

### 5. Insufficient Whitespace
**Problem**: All space is filled with content
**Why it's a problem**: Crowded information causes reading fatigue, actually reducing communication efficiency
**Fix**: Whitespace should be at least 40% of total area (60%+ for minimalist styles)

### 6. Too Many Fonts
**Problem**: Using 3+ font families
**Why it's a problem**: Visual noise, undermines unity
**Fix**: Maximum 2 fonts (1 for headings + 1 for body), create variation with weight and size

### 7. Inconsistent Alignment
**Problem**: Some left-aligned, some centered, some right-aligned
**Why it's a problem**: Breaks visual order
**Fix**: Choose one alignment approach (left-aligned recommended), apply globally

### 8. Decoration Over Content
**Problem**: Background patterns/gradients/shadows steal the spotlight from main content
**Why it's a problem**: Putting the cart before the horse — users come for information, not decoration
**Fix**: "If I remove this decoration, would the design get worse?" If not, remove it

### 9. Cyber Neon Overuse
**Problem**: Dark blue background (#0D1117) + neon glow effects
**Why it's a problem**: Default aesthetic no-go zone (this skill's taste baseline), and already one of the biggest cliches — users can override with their own brand
**Fix**: Choose a more distinctive color scheme (reference the 20 styles' color systems)

### 10. Information Density Mismatch with Medium
**Problem**: A full page of text on a slide / 10 elements crammed into a cover image
**Why it's a problem**: Different media have different optimal information densities
**Fix**:
- Slides: 1 core point per page
- Cover images: 1 visual focal point
- Infographics: layered presentation
- PDFs: can be denser, but need clear navigation

---

## Review Output Template

```
## Design Review Report

**Overall Score**: X.X/10 [Excellent(8+)/Good(6-7.9)/Needs Improvement(4-5.9)/Failing(<4)]

**Category Scores**:
- Philosophy Alignment: X/10 [one-line explanation]
- Visual Hierarchy: X/10 [one-line explanation]
- Craft Quality: X/10 [one-line explanation]
- Functionality: X/10 [one-line explanation]
- Originality: X/10 [one-line explanation]

### Strengths (Keep)
- [Specifically identify what's done well, describe in design language]

### Issues (Fix)
[Sorted by severity]

**1. [Issue Name]** — ⚠️Critical / ⚡Important / 💡Optimization
- Current: [describe current state]
- Problem: [why this is a problem]
- Fix: [specific action, with values]

### Quick Fix Checklist (Quick Wins)
If you only have 5 minutes, prioritize these 3 things:
- [ ] [Most impactful fix]
- [ ] [Second most important fix]
- [ ] [Third most important fix]
```

---

**Version**: v1.0
**Updated**: 2026-02-13
