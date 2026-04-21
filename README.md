<sub>🌐 <b>English</b> · <a href="README.zh-CN.md">中文</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <a href="README.ja.md">日本語</a> · <a href="README.it.md">Italiano</a> · <a href="README.es.md">Español</a></sub>

<div align="center">

# MyClaw Design

> *"Type. Hit enter. A finished design lands in your lap."*

[![Powered by MyClaw.ai](https://img.shields.io/badge/Powered%20by-MyClaw.ai-blue?style=flat-square)](https://myclaw.ai)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blueviolet?style=flat-square)](https://github.com/openclaw/openclaw)
[![License](https://img.shields.io/badge/License-Personal%20Use-orange?style=flat-square)](LICENSE)

<br>

**Say one sentence to your agent. Get back a deliverable design.**

3 to 30 minutes — ship a **product launch animation**, a clickable App prototype, an editable slide deck, or a print-ready infographic. Not "AI-generated-looking" — the kind of work that looks like it came from a real design team.

Give the skill your brand assets (logo, palette, UI screenshots) and it reads your brand DNA. Give it nothing, and 20 built-in design philosophies still keep the output far from AI slop.

</div>

---

<p align="center">
  <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.gif"><img src="docs/hero-preview.jpg" alt="MyClaw Design Hero — Type → Pick direction → Gallery → Focus → Brand reveal" width="100%"></a>
</p>

<p align="center"><sub>
  ▲ 25s · Terminal → 4 directions → Gallery ripple → 4× Focus → Brand reveal<br>
  👉 <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.mp4">Download MP4 with BGM + SFX (10 MB)</a>
</sub></p>

---

## Install

```bash
# Copy to your OpenClaw skills directory
git clone https://github.com/LeoYeAI/myclaw-design.git ~/.openclaw/skills/myclaw-design
```

Then just talk to your agent:

```
"Build a product launch animation for our new feature, suggest 3 style directions"
"Make a clickable iOS prototype — 4 core screens with real navigation"
"Create a 1920×1080 slide deck, export as editable PPTX"
"Turn this logic into a 60-second motion graphic, export MP4 and GIF"
"Run a 5-dimension expert review on this design"
```

No buttons. No panels. No Figma plugins. Just conversation.

---

## What It Can Do

| Capability | Deliverable | Typical Time |
|---|---|---|
| **Interactive Prototypes** (App / Web) | Single-file HTML · Real iPhone bezel · Clickable · Playwright-verified | 10–15 min |
| **Slide Decks** | HTML deck (present in browser) + Editable PPTX (text boxes preserved) | 15–25 min |
| **Timeline Animations** | MP4 (25fps / 60fps interpolated) + GIF (palette-optimized) + BGM + SFX | 8–12 min |
| **Design Variants** | 3+ side-by-side comparisons · Live Tweaks · Cross-dimension exploration | 10 min |
| **Infographics** | Print-ready layout · PDF/PNG/SVG export | 10 min |
| **Design Direction Advisor** | 5 schools × 20 philosophies · 3 recommendations · Parallel demo generation | 5 min |
| **5-Dimension Expert Review** | Radar chart + Keep/Fix/Quick Wins · Actionable fix list | 3 min |

---

## Demo Gallery

### Design Direction Advisor

When requirements are vague, the skill picks 3 differentiated directions from 5 schools × 20 design philosophies, generates parallel demos, and lets you choose.

<p align="center"><img src="docs/w3-fallback-advisor-en.gif" width="100%"></p>

### iOS App Prototype

iPhone 15 Pro precision bezel (Dynamic Island / status bar / Home Indicator) · State-driven multi-screen navigation · Real images from Wikimedia/Met/Unsplash · Playwright auto-click testing before delivery.

<p align="center"><img src="docs/c1-ios-prototype-en.gif" width="100%"></p>

### Motion Design Engine

Stage + Sprite timeline model · `useTime` / `useSprite` / `interpolate` / `Easing` — four APIs cover all animation needs. One command exports MP4 / GIF / 60fps interpolated / final cut with BGM + SFX.

<p align="center"><img src="docs/c3-motion-design-en.gif" width="100%"></p>

### Slide Decks + Editable PPTX

HTML-first slides with auto-scale, keyboard navigation, and speaker notes. Export to editable PPTX with native text boxes — not screenshots pasted on slides.

<p align="center"><img src="docs/c2-slides-pptx-en.gif" width="100%"></p>

### Live Tweaks

Real-time parameter adjustment — swap color schemes, layouts, typography, and density without regenerating. Changes persist via localStorage.

<p align="center"><img src="docs/c4-tweaks-en.gif" width="100%"></p>

### Infographics

Print-ready, data-driven layouts with precise typography. Export to PDF/PNG/SVG.

<p align="center"><img src="docs/c5-infographic-en.gif" width="100%"></p>

### 5-Dimension Expert Review

Philosophy consistency / Visual hierarchy / Detail execution / Functionality / Innovation — each scored 0–10 with a radar chart, Keep list, Fix list (severity-ranked), and Quick Wins.

<p align="center"><img src="docs/c6-expert-review-en.gif" width="100%"></p>

---

## How It Works

### Brand Asset Protocol

The skill doesn't guess your brand. It follows a strict 5-step protocol:

1. **Ask** — Requests logo, product photos, UI screenshots, color palette, typography
2. **Search** — Crawls official sites, press kits, app stores for assets
3. **Download** — Fetches real files (logo SVG, product hero images, UI screenshots)
4. **Verify** — Checks resolution, transparency, version freshness
5. **Lock** — Writes `brand-spec.md` with all asset paths; CSS variables enforce consistency

<p align="center"><img src="docs/w1-brand-protocol-en.gif" width="100%"></p>

> **Why this matters:** Without real brand assets, every AI-generated design looks the same — generic gradients, placeholder icons, zero brand recognition. The protocol costs 30 minutes upfront but saves 1–2 hours of rework.

### Junior Designer Workflow

The skill works like a junior designer reporting to you:

1. **Show assumptions first** — Writes reasoning + placeholders before any code
2. **Get approval** — Waits for your direction before filling in details
3. **Iterate** — Shows progress mid-way, not just the final result
4. **Verify** — Runs Playwright screenshots + console error checks before delivery

<p align="center"><img src="docs/w2-junior-designer-en.gif" width="100%"></p>

### Anti-AI Slop

Every design decision is checked against a strict anti-slop list:

| Avoid | Use Instead |
|---|---|
| Purple gradients | Brand colors / `oklch()` harmonics |
| Emoji as icons | Honest placeholders or real assets |
| Rounded cards + left border accent | Clean boundaries earned by content |
| SVG-drawn faces/objects | Real images or honest placeholders |
| CSS silhouettes replacing product photos | Actual product images from brand protocol |
| Inter/Roboto/system fonts as display | Distinctive display + body font pairing |

---

## Starter Components

Pre-built components you can use immediately:

| Component | Use Case |
|---|---|
| `assets/ios_frame.jsx` | iPhone 15 Pro bezel with Dynamic Island, status bar, Home Indicator |
| `assets/android_frame.jsx` | Android device frame |
| `assets/macos_window.jsx` | macOS window chrome with traffic lights |
| `assets/browser_window.jsx` | Browser window with URL bar + tabs |
| `assets/animations.jsx` | Stage + Sprite + useTime + Easing engine |
| `assets/deck_index.html` | Multi-file slide deck assembler |
| `assets/deck_stage.js` | Single-file slide deck web component |
| `assets/design_canvas.jsx` | Side-by-side variant comparison grid |

## Audio Assets

6 scene-matched BGM tracks + 37 categorized SFX files for production-ready animation output:

- **BGM**: tech / ad / educational / tutorial (+ alt variants)
- **SFX**: keyboard, terminal, transition, impact, magic, feedback, UI, container, progress

---

## Project Structure

```
myclaw-design/
├── SKILL.md              # Core skill instructions (loaded by OpenClaw)
├── assets/               # Starter components, BGM, SFX, showcases
│   ├── *.jsx             # React components (iOS/Android/macOS frames, etc.)
│   ├── bgm-*.mp3         # 6 scene-matched background music tracks
│   ├── sfx/              # 37 categorized sound effects
│   └── showcases/        # 24 pre-built design samples (8 scenes × 3 styles)
├── references/           # Deep-dive guides (loaded on demand)
│   ├── animation-*.md    # Animation best practices + pitfalls
│   ├── design-styles.md  # 20 design philosophies database
│   ├── react-setup.md    # React + Babel technical setup
│   ├── slide-decks.md    # Slide architecture guide
│   ├── video-export.md   # MP4/GIF export pipeline
│   └── ...               # 18 reference files total
└── scripts/              # Automation scripts
    ├── render-video.js   # HTML → MP4 (25fps)
    ├── convert-formats.sh # 60fps interpolation + GIF
    ├── add-music.sh      # BGM + SFX mixing
    ├── export_deck_*.mjs # PDF + PPTX export
    └── verify.py         # Playwright verification
```

---

## Requirements

- [OpenClaw](https://github.com/openclaw/openclaw) (any recent version)
- Node.js ≥ 18 (for scripts)
- [Playwright](https://playwright.dev/) (for verification + video export)
- ffmpeg (for video format conversion + audio mixing)

---

## License

Personal use free. Commercial use requires authorization. See [LICENSE](LICENSE) for details.

---

<div align="center">

**[MyClaw.ai](https://myclaw.ai)** — The AI personal assistant platform that gives every user a full server with complete code control.

</div>
