# Design Philosophy Showcases — Asset Index

> 8 scenes × 3 styles = 24 pre-built design samples
> Used during Phase 3 recommendations to directly show "what this style looks like in practice"

## Style Guide

| Code | School | Style Name | Visual Character |
|------|--------|-----------|-----------------|
| **Pentagram** | Information Architecture | Pentagram / Michael Bierut | Black-white restraint, Swiss grid, strong typographic hierarchy, #E63946 red accent |
| **Build** | Minimalism | Build Studio | Luxury-grade whitespace (70%+), subtle font weights (200-600), #D4A574 warm gold, refined |
| **Takram** | Eastern Philosophy | Takram | Soft tech feel, natural colors (beige/gray/green), rounded corners, charts as art |

## Scene Quick Reference

### Content Design Scenes

| # | Scene | Dimensions | Pentagram | Build | Takram |
|---|-------|-----------|-----------|-------|--------|
| 1 | WeChat Cover | 1200×510 | `cover/cover-pentagram` | `cover/cover-build` | `cover/cover-takram` |
| 2 | PPT Data Page | 1920×1080 | `ppt/ppt-pentagram` | `ppt/ppt-build` | `ppt/ppt-takram` |
| 3 | Vertical Infographic | 1080×1920 | `infographic/infographic-pentagram` | `infographic/infographic-build` | `infographic/infographic-takram` |

### Website Design Scenes

| # | Scene | Dimensions | Pentagram | Build | Takram |
|---|-------|-----------|-----------|-------|--------|
| 4 | Personal Homepage | 1440×900 | `website-homepage/homepage-pentagram` | `website-homepage/homepage-build` | `website-homepage/homepage-takram` |
| 5 | AI Navigation Site | 1440×900 | `website-ai-nav/ainav-pentagram` | `website-ai-nav/ainav-build` | `website-ai-nav/ainav-takram` |
| 6 | AI Writing Tool | 1440×900 | `website-ai-writing/aiwriting-pentagram` | `website-ai-writing/aiwriting-build` | `website-ai-writing/aiwriting-takram` |
| 7 | SaaS Landing Page | 1440×900 | `website-saas/saas-pentagram` | `website-saas/saas-build` | `website-saas/saas-takram` |
| 8 | Developer Docs | 1440×900 | `website-devdocs/devdocs-pentagram` | `website-devdocs/devdocs-build` | `website-devdocs/devdocs-takram` |

> Each entry has both `.html` (source) and `.png` (screenshot) files

## Usage Guide

### Referencing During Phase 3 Recommendations
After recommending design directions, show the corresponding pre-built screenshots:
```
"Here's what Pentagram style looks like for a cover → [show cover/cover-pentagram.png]"
"Takram style for a PPT data page feels like this → [show ppt/ppt-takram.png]"
```

### Scene Matching Priority
1. User's need has an exact scene match → show that scene directly
2. No exact match but similar type → show the closest scene (e.g., "product website" → show SaaS landing page)
3. No match at all → skip pre-built samples, go straight to Phase 3.5 live generation

### Side-by-Side Comparison
The 3 styles for the same scene work well shown side by side, helping users compare visually:
- "Here's the same cover design implemented in 3 different styles"
- Display order: Pentagram (rational restraint) → Build (luxury minimal) → Takram (soft warmth)

## Content Details

### WeChat Cover (cover/)
- Content: Claude Code Agent Workflow — 8 Parallel Agent Architecture
- Pentagram: Giant red "8" + Swiss grid lines + data bars
- Build: Ultra-thin weight "Agent" floating in 70% whitespace + warm gold hairlines
- Takram: 8-node radial flow chart as art piece + beige background

### PPT Data Page (ppt/)
- Content: GLM-4.7 Open Source Model Coding Breakthrough (AIME 95.7 / SWE-bench 73.8% / τ²-Bench 87.4)
- Pentagram: 260px "95.7" anchor + red/gray/light-gray comparison bar chart
- Build: Three groups of 120px ultra-thin numbers floating + warm gold gradient bars
- Takram: SVG radar chart + tri-color overlay + rounded data cards

### Vertical Infographic (infographic/)
- Content: AI Memory System CLAUDE.md Optimized from 93KB to 22KB
- Pentagram: Giant "93→22" numbers + numbered blocks + CSS data bars
- Build: Extreme whitespace + soft-shadow cards + warm gold connecting lines
- Takram: SVG ring charts + organic curve flow diagram + frosted glass cards

### Personal Homepage (website-homepage/)
- Content: Independent Developer Alex Chen's Portfolio Homepage
- Pentagram: 112px large name + Swiss grid columns + editorial numbers
- Build: Glass-morphism nav + floating stat cards + ultra-thin weights
- Takram: Paper texture + small circular avatar + hairline dividers + asymmetric layout

### AI Navigation Site (website-ai-nav/)
- Content: AI Compass — 500+ AI Tool Directory
- Pentagram: Square search box + numbered tool list + uppercase category labels
- Build: Rounded search box + refined white tool cards + pill tags
- Takram: Organic offset card layout + soft category tags + chart-style connections

### AI Writing Tool (website-ai-writing/)
- Content: Inkwell — AI Writing Assistant
- Pentagram: 86px large headline + wireframe editor mockup + grid feature columns
- Build: Floating editor card + warm gold CTA + luxury writing experience
- Takram: Poetic serif headline + organic editor + flow diagram

### SaaS Landing Page (website-saas/)
- Content: Meridian — Business Intelligence Analytics Platform
- Pentagram: Black-white split columns + structured dashboard + 140px "3x" anchor
- Build: Floating dashboard card + SVG area chart + warm gold gradient
- Takram: Rounded bar charts + flow nodes + soft earth tones

### Developer Docs (website-devdocs/)
- Content: Nexus API — Unified AI Model Gateway
- Pentagram: Left sidebar nav + square code blocks + red string highlighting
- Build: Centered floating code card + soft shadow + warm gold icons
- Takram: Beige code blocks + flow diagram connections + dashed feature cards

## File Statistics

- HTML source files: 24
- PNG screenshots: 24
- Total assets: 48 files

---

**Version**: v1.0
**Created**: 2026-02-13
**Used for**: Design philosophy skill Phase 3 recommendation flow
