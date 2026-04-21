<sub>🌐 <a href="README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.fr.md">Français</a> · <b>Deutsch</b> · <a href="README.ru.md">Русский</a> · <a href="README.ja.md">日本語</a> · <a href="README.it.md">Italiano</a> · <a href="README.es.md">Español</a></sub>

<div align="center">

# MyClaw Design

> *„Tippen. Enter drücken. Ein fertiges Design landet auf Ihrem Schreibtisch."*

[![Powered by MyClaw.ai](https://img.shields.io/badge/Powered%20by-MyClaw.ai-blue?style=flat-square)](https://myclaw.ai)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blueviolet?style=flat-square)](https://github.com/openclaw/openclaw)
[![License](https://img.shields.io/badge/License-Personal%20Use-orange?style=flat-square)](LICENSE)

<br>

**Sagen Sie Ihrem Agenten einen Satz. Erhalten Sie ein lieferfertiges Design zurück.**

3 bis 30 Minuten — liefern Sie eine **Produktlaunch-Animation**, einen klickbaren App-Prototyp, ein bearbeitbares Foliendeck oder eine druckfertige Infografik. Nicht „KI-generiert aussehend" — die Art von Arbeit, die aussieht, als käme sie von einem echten Design-Team.

Geben Sie dem Skill Ihre Marken-Assets (Logo, Farbpalette, UI-Screenshots) und er liest Ihre Marken-DNA. Geben Sie nichts, und 20 eingebaute Design-Philosophien halten das Ergebnis trotzdem weit entfernt von KI-Slop.

</div>

---

<p align="center">
  <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.gif"><img src="docs/hero-preview.jpg" alt="MyClaw Design Hero — Tippen → Richtung wählen → Galerie → Fokus → Markenreveal" width="100%"></a>
</p>

<p align="center"><sub>
  ▲ 25s · Terminal → 4 Richtungen → Galerie-Welle → 4× Fokus → Markenreveal<br>
  👉 <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.mp4">MP4 mit BGM + SFX herunterladen (10 MB)</a>
</sub></p>

---

## Installation

```bash
# In Ihr OpenClaw Skills-Verzeichnis kopieren
git clone https://github.com/LeoYeAI/myclaw-design.git ~/.openclaw/skills/myclaw-design
```

Dann sprechen Sie einfach mit Ihrem Agenten:

```
"Erstelle eine Produktlaunch-Animation für unser neues Feature, schlage 3 Stilrichtungen vor"
"Mach einen klickbaren iOS-Prototyp — 4 Kernbildschirme mit echter Navigation"
"Erstelle ein 1920×1080 Foliendeck, exportiere als bearbeitbare PPTX"
"Verwandle diese Logik in eine 60-Sekunden-Motion-Graphic, exportiere MP4 und GIF"
"Führe eine 5-Dimensionen-Expertenprüfung für dieses Design durch"
```

Keine Buttons. Keine Panels. Keine Figma-Plugins. Nur Konversation.

---

## Was es kann

| Fähigkeit | Lieferergebnis | Typische Dauer |
|---|---|---|
| **Interaktive Prototypen** (App / Web) | Einzeldatei-HTML · Echte iPhone-Einfassung · Klickbar · Playwright-verifiziert | 10–15 Min |
| **Foliendecks** | HTML-Deck (im Browser präsentieren) + Bearbeitbare PPTX (Textfelder erhalten) | 15–25 Min |
| **Timeline-Animationen** | MP4 (25fps / 60fps interpoliert) + GIF (Palette-optimiert) + BGM + SFX | 8–12 Min |
| **Design-Varianten** | 3+ Seite-an-Seite-Vergleiche · Live-Tweaks · Dimensionsübergreifende Exploration | 10 Min |
| **Infografiken** | Druckfertiges Layout · PDF/PNG/SVG-Export | 10 Min |
| **Design-Richtungsberater** | 5 Schulen × 20 Philosophien · 3 Empfehlungen · Parallele Demo-Generierung | 5 Min |
| **5-Dimensionen-Expertenprüfung** | Radardiagramm + Behalten/Beheben/Quick Wins · Umsetzbare Korrekturliste | 3 Min |

---

## Demo-Galerie

### Design-Richtungsberater

Wenn Anforderungen vage sind, wählt der Skill 3 differenzierte Richtungen aus 5 Schulen × 20 Design-Philosophien, generiert parallele Demos und lässt Sie wählen.

<p align="center"><img src="docs/w3-fallback-advisor-en.gif" width="100%"></p>

### iOS-App-Prototyp

Präzise iPhone 15 Pro Einfassung (Dynamic Island / Statusleiste / Home Indicator) · Zustandsgesteuerte Multi-Screen-Navigation · Echte Bilder von Wikimedia/Met/Unsplash · Playwright-Auto-Klick-Tests vor Auslieferung.

<p align="center"><img src="docs/c1-ios-prototype-en.gif" width="100%"></p>

### Motion-Design-Engine

Stage + Sprite Timeline-Modell · `useTime` / `useSprite` / `interpolate` / `Easing` — vier APIs decken alle Animationsbedürfnisse ab. Ein Befehl exportiert MP4 / GIF / 60fps interpoliert / Endschnitt mit BGM + SFX.

<p align="center"><img src="docs/c3-motion-design-en.gif" width="100%"></p>

### Foliendecks + Bearbeitbare PPTX

HTML-first Folien mit automatischer Skalierung, Tastaturnavigation und Sprechernotizen. Export als bearbeitbare PPTX mit nativen Textfeldern — keine Screenshots auf Folien eingefügt.

<p align="center"><img src="docs/c2-slides-pptx-en.gif" width="100%"></p>

### Live-Tweaks

Echtzeit-Parameteranpassung — tauschen Sie Farbschemata, Layouts, Typografie und Dichte ohne Neugenerierung. Änderungen bleiben über localStorage erhalten.

<p align="center"><img src="docs/c4-tweaks-en.gif" width="100%"></p>

### Infografiken

Druckfertige, datengetriebene Layouts mit präziser Typografie. Export als PDF/PNG/SVG.

<p align="center"><img src="docs/c5-infographic-en.gif" width="100%"></p>

### 5-Dimensionen-Expertenprüfung

Philosophische Konsistenz / Visuelle Hierarchie / Detailausführung / Funktionalität / Innovation — jedes Kriterium von 0–10 bewertet mit Radardiagramm, Behalten-Liste, Beheben-Liste (nach Schweregrad sortiert) und Quick Wins.

<p align="center"><img src="docs/c6-expert-review-en.gif" width="100%"></p>

---

## Wie es funktioniert

### Marken-Asset-Protokoll

Der Skill rät nicht bei Ihrer Marke. Er folgt einem strikten 5-Schritte-Protokoll:

1. **Fragen** — Fordert Logo, Produktfotos, UI-Screenshots, Farbpalette, Typografie an
2. **Suchen** — Durchsucht offizielle Websites, Pressekits, App Stores nach Assets
3. **Herunterladen** — Lädt echte Dateien herunter (Logo-SVG, Produkt-Hero-Bilder, UI-Screenshots)
4. **Prüfen** — Kontrolliert Auflösung, Transparenz, Versionsaktualität
5. **Sperren** — Schreibt `brand-spec.md` mit allen Asset-Pfaden; CSS-Variablen erzwingen Konsistenz

<p align="center"><img src="docs/w1-brand-protocol-en.gif" width="100%"></p>

> **Warum das wichtig ist:** Ohne echte Marken-Assets sieht jedes KI-generierte Design gleich aus — generische Verläufe, Platzhalter-Icons, null Markenwiedererkennung. Das Protokoll kostet 30 Minuten im Voraus, spart aber 1–2 Stunden Nacharbeit.

### Junior-Designer-Workflow

Der Skill arbeitet wie ein Junior-Designer, der Ihnen Bericht erstattet:

1. **Annahmen zuerst zeigen** — Schreibt Begründung + Platzhalter vor jeglichem Code
2. **Genehmigung einholen** — Wartet auf Ihre Richtung, bevor Details ausgefüllt werden
3. **Iterieren** — Zeigt Fortschritt zwischendurch, nicht nur das Endergebnis
4. **Verifizieren** — Führt Playwright-Screenshots + Konsolenfehlerprüfungen vor Auslieferung durch

<p align="center"><img src="docs/w2-junior-designer-en.gif" width="100%"></p>

### Anti-KI-Slop

Jede Design-Entscheidung wird gegen eine strikte Anti-Slop-Liste geprüft:

| Vermeiden | Stattdessen verwenden |
|---|---|
| Lila Verläufe | Markenfarben / `oklch()`-Harmonien |
| Emoji als Icons | Ehrliche Platzhalter oder echte Assets |
| Abgerundete Karten + linker Randakzent | Saubere Grenzen, die durch Inhalt verdient werden |
| SVG-gezeichnete Gesichter/Objekte | Echte Bilder oder ehrliche Platzhalter |
| CSS-Silhouetten statt Produktfotos | Echte Produktbilder aus dem Markenprotokoll |
| Inter/Roboto/Systemschriften als Display | Markante Display- + Textschrift-Paarung |

---

## Starter-Komponenten

Vorgefertigte Komponenten, die Sie sofort verwenden können:

| Komponente | Anwendungsfall |
|---|---|
| `assets/ios_frame.jsx` | iPhone 15 Pro Einfassung mit Dynamic Island, Statusleiste, Home Indicator |
| `assets/android_frame.jsx` | Android-Geräterahmen |
| `assets/macos_window.jsx` | macOS-Fensterchrome mit Ampelknöpfen |
| `assets/browser_window.jsx` | Browserfenster mit URL-Leiste + Tabs |
| `assets/animations.jsx` | Stage + Sprite + useTime + Easing Engine |
| `assets/deck_index.html` | Multi-Datei-Foliendeck-Assembler |
| `assets/deck_stage.js` | Einzeldatei-Foliendeck Web Component |
| `assets/design_canvas.jsx` | Seite-an-Seite-Variantenvergleichsraster |

## Audio-Assets

6 szenenangepasste BGM-Tracks + 37 kategorisierte SFX-Dateien für produktionsreife Animationsausgabe:

- **BGM**: Tech / Werbung / Bildung / Tutorial (+ alternative Varianten)
- **SFX**: Tastatur, Terminal, Übergang, Impact, Magie, Feedback, UI, Container, Fortschritt

---

## Projektstruktur

```
myclaw-design/
├── SKILL.md              # Kern-Skill-Anweisungen (von OpenClaw geladen)
├── assets/               # Starter-Komponenten, BGM, SFX, Showcases
│   ├── *.jsx             # React-Komponenten (iOS/Android/macOS-Rahmen, etc.)
│   ├── bgm-*.mp3         # 6 szenenangepasste Hintergrundmusik-Tracks
│   ├── sfx/              # 37 kategorisierte Soundeffekte
│   └── showcases/        # 24 vorgefertigte Design-Beispiele (8 Szenen × 3 Stile)
├── references/           # Vertiefende Anleitungen (bei Bedarf geladen)
│   ├── animation-*.md    # Best Practices Animation + Fallstricke
│   ├── design-styles.md  # Datenbank mit 20 Design-Philosophien
│   ├── react-setup.md    # Technisches Setup React + Babel
│   ├── slide-decks.md    # Architekturleitfaden für Folien
│   ├── video-export.md   # MP4/GIF-Export-Pipeline
│   └── ...               # 18 Referenzdateien insgesamt
└── scripts/              # Automatisierungsskripte
    ├── render-video.js   # HTML → MP4 (25fps)
    ├── convert-formats.sh # 60fps-Interpolation + GIF
    ├── add-music.sh      # BGM + SFX Mixing
    ├── export_deck_*.mjs # PDF + PPTX Export
    └── verify.py         # Playwright-Verifizierung
```

---

## Voraussetzungen

- [OpenClaw](https://github.com/openclaw/openclaw) (jede aktuelle Version)
- Node.js ≥ 18 (für Skripte)
- [Playwright](https://playwright.dev/) (für Verifizierung + Videoexport)
- ffmpeg (für Videoformatkonvertierung + Audiomixing)

---

## Lizenz

Persönliche Nutzung kostenlos. Kommerzielle Nutzung erfordert Genehmigung. Siehe [LICENSE](LICENSE) für Details.

---

<div align="center">

**[MyClaw.ai](https://myclaw.ai)** — Die KI-Assistenzplattform, die jedem Nutzer einen vollständigen Server mit kompletter Code-Kontrolle bietet.

</div>
