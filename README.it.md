<sub>🌐 <a href="README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <a href="README.ja.md">日本語</a> · <b>Italiano</b> · <a href="README.es.md">Español</a></sub>

<div align="center">

# MyClaw Design

> *"Scrivi. Premi invio. Un design finito ti arriva tra le mani."*

[![Powered by MyClaw.ai](https://img.shields.io/badge/Powered%20by-MyClaw.ai-blue?style=flat-square)](https://myclaw.ai)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blueviolet?style=flat-square)](https://github.com/openclaw/openclaw)
[![License](https://img.shields.io/badge/License-Personal%20Use-orange?style=flat-square)](LICENSE)

<br>

**Dì una frase al tuo agente. Ricevi un design pronto per la consegna.**

Da 3 a 30 minuti — realizza un'**animazione per il lancio di un prodotto**, un prototipo App cliccabile, una presentazione modificabile o un'infografica pronta per la stampa. Non "dall'aspetto generato dall'IA" — il tipo di lavoro che sembra provenire da un vero team di design.

Fornisci alla skill i tuoi asset del brand (logo, palette, screenshot UI) e leggerà il DNA del tuo brand. Non fornire nulla, e 20 filosofie di design integrate manterranno comunque l'output lontano dallo slop dell'IA.

</div>

---

<p align="center">
  <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.gif"><img src="docs/hero-preview.jpg" alt="MyClaw Design Hero — Scrivi → Scegli direzione → Galleria → Focus → Rivelazione brand" width="100%"></a>
</p>

<p align="center"><sub>
  ▲ 25s · Terminale → 4 direzioni → Galleria ripple → 4× Focus → Rivelazione brand<br>
  👉 <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.mp4">Scarica MP4 con BGM + SFX (10 MB)</a>
</sub></p>

---

## Installazione

```bash
# Copia nella directory delle skill di OpenClaw
git clone https://github.com/LeoYeAI/myclaw-design.git ~/.openclaw/skills/myclaw-design
```

Poi parla semplicemente con il tuo agente:

```
"Crea un'animazione per il lancio del prodotto per la nostra nuova funzionalità, suggerisci 3 direzioni stilistiche"
"Realizza un prototipo iOS cliccabile — 4 schermate principali con navigazione reale"
"Crea una presentazione 1920×1080, esporta come PPTX modificabile"
"Trasforma questa logica in un motion graphic di 60 secondi, esporta MP4 e GIF"
"Esegui una revisione esperta a 5 dimensioni su questo design"
```

Nessun pulsante. Nessun pannello. Nessun plugin Figma. Solo conversazione.

---

## Cosa Può Fare

| Capacità | Deliverable | Tempo Tipico |
|---|---|---|
| **Prototipi Interattivi** (App / Web) | HTML singolo file · Cornice iPhone reale · Cliccabile · Verificato con Playwright | 10–15 min |
| **Presentazioni** | Deck HTML (presenta nel browser) + PPTX modificabile (caselle di testo preservate) | 15–25 min |
| **Animazioni Timeline** | MP4 (25fps / 60fps interpolati) + GIF (palette ottimizzata) + BGM + SFX | 8–12 min |
| **Varianti di Design** | 3+ confronti affiancati · Tweaks in tempo reale · Esplorazione cross-dimensione | 10 min |
| **Infografiche** | Layout pronto per la stampa · Esportazione PDF/PNG/SVG | 10 min |
| **Consulente Direzione Design** | 5 scuole × 20 filosofie · 3 raccomandazioni · Generazione demo parallela | 5 min |
| **Revisione Esperta a 5 Dimensioni** | Grafico radar + Mantieni/Correggi/Quick Wins · Lista correzioni attuabili | 3 min |

---

## Galleria Demo

### Consulente Direzione Design

Quando i requisiti sono vaghi, la skill sceglie 3 direzioni differenziate da 5 scuole × 20 filosofie di design, genera demo parallele e ti lascia scegliere.

<p align="center"><img src="docs/w3-fallback-advisor-en.gif" width="100%"></p>

### Prototipo App iOS

Cornice di precisione iPhone 15 Pro (Dynamic Island / barra di stato / Home Indicator) · Navigazione multi-schermo guidata dallo stato · Immagini reali da Wikimedia/Met/Unsplash · Test auto-click Playwright prima della consegna.

<p align="center"><img src="docs/c1-ios-prototype-en.gif" width="100%"></p>

### Motore Motion Design

Modello timeline Stage + Sprite · `useTime` / `useSprite` / `interpolate` / `Easing` — quattro API coprono tutte le esigenze di animazione. Un comando esporta MP4 / GIF / 60fps interpolati / montaggio finale con BGM + SFX.

<p align="center"><img src="docs/c3-motion-design-en.gif" width="100%"></p>

### Presentazioni + PPTX Modificabile

Slide HTML-first con auto-scale, navigazione da tastiera e note del relatore. Esportazione in PPTX modificabile con caselle di testo native — non screenshot incollati sulle slide.

<p align="center"><img src="docs/c2-slides-pptx-en.gif" width="100%"></p>

### Tweaks in Tempo Reale

Regolazione parametri in tempo reale — cambia schemi colore, layout, tipografia e densità senza rigenerare. Le modifiche persistono tramite localStorage.

<p align="center"><img src="docs/c4-tweaks-en.gif" width="100%"></p>

### Infografiche

Layout data-driven pronti per la stampa con tipografia precisa. Esportazione in PDF/PNG/SVG.

<p align="center"><img src="docs/c5-infographic-en.gif" width="100%"></p>

### Revisione Esperta a 5 Dimensioni

Coerenza filosofica / Gerarchia visiva / Esecuzione dei dettagli / Funzionalità / Innovazione — ciascuna valutata 0–10 con grafico radar, lista Mantieni, lista Correggi (ordinata per gravità) e Quick Wins.

<p align="center"><img src="docs/c6-expert-review-en.gif" width="100%"></p>

---

## Come Funziona

### Protocollo Asset del Brand

La skill non indovina il tuo brand. Segue un rigoroso protocollo in 5 passaggi:

1. **Chiedi** — Richiede logo, foto prodotto, screenshot UI, palette colori, tipografia
2. **Cerca** — Esplora siti ufficiali, press kit, app store per trovare gli asset
3. **Scarica** — Recupera file reali (logo SVG, immagini hero del prodotto, screenshot UI)
4. **Verifica** — Controlla risoluzione, trasparenza, aggiornamento della versione
5. **Blocca** — Scrive `brand-spec.md` con tutti i percorsi degli asset; le variabili CSS garantiscono coerenza

<p align="center"><img src="docs/w1-brand-protocol-en.gif" width="100%"></p>

> **Perché è importante:** Senza asset reali del brand, ogni design generato dall'IA appare uguale — gradienti generici, icone placeholder, zero riconoscibilità del brand. Il protocollo costa 30 minuti iniziali ma risparmia 1–2 ore di rilavorazione.

### Flusso di Lavoro Junior Designer

La skill funziona come un junior designer che riporta a te:

1. **Mostra prima le ipotesi** — Scrive ragionamento + placeholder prima di qualsiasi codice
2. **Ottieni approvazione** — Attende la tua direzione prima di compilare i dettagli
3. **Itera** — Mostra i progressi a metà strada, non solo il risultato finale
4. **Verifica** — Esegue screenshot Playwright + controllo errori console prima della consegna

<p align="center"><img src="docs/w2-junior-designer-en.gif" width="100%"></p>

### Anti-AI Slop

Ogni decisione di design viene verificata contro una rigorosa lista anti-slop:

| Evita | Usa Invece |
|---|---|
| Gradienti viola | Colori del brand / armoniche `oklch()` |
| Emoji come icone | Placeholder onesti o asset reali |
| Card arrotondate + accento bordo sinistro | Bordi puliti guadagnati dal contenuto |
| Volti/oggetti disegnati in SVG | Immagini reali o placeholder onesti |
| Silhouette CSS al posto delle foto prodotto | Immagini prodotto reali dal protocollo brand |
| Inter/Roboto/font di sistema come display | Abbinamento font display distintivo + body |

---

## Componenti Starter

Componenti pre-costruiti utilizzabili immediatamente:

| Componente | Caso d'Uso |
|---|---|
| `assets/ios_frame.jsx` | Cornice iPhone 15 Pro con Dynamic Island, barra di stato, Home Indicator |
| `assets/android_frame.jsx` | Cornice dispositivo Android |
| `assets/macos_window.jsx` | Chrome finestra macOS con semafori |
| `assets/browser_window.jsx` | Finestra browser con barra URL + tab |
| `assets/animations.jsx` | Motore Stage + Sprite + useTime + Easing |
| `assets/deck_index.html` | Assemblatore presentazione multi-file |
| `assets/deck_stage.js` | Web component presentazione singolo file |
| `assets/design_canvas.jsx` | Griglia confronto varianti affiancate |

## Asset Audio

6 tracce BGM abbinate alla scena + 37 file SFX categorizzati per output di animazione pronto per la produzione:

- **BGM**: tech / ad / educational / tutorial (+ varianti alt)
- **SFX**: keyboard, terminal, transition, impact, magic, feedback, UI, container, progress

---

## Struttura del Progetto

```
myclaw-design/
├── SKILL.md              # Istruzioni core della skill (caricate da OpenClaw)
├── assets/               # Componenti starter, BGM, SFX, showcase
│   ├── *.jsx             # Componenti React (cornici iOS/Android/macOS, ecc.)
│   ├── bgm-*.mp3         # 6 tracce musicali di sottofondo abbinate alla scena
│   ├── sfx/              # 37 effetti sonori categorizzati
│   └── showcases/        # 24 campioni di design pre-costruiti (8 scene × 3 stili)
├── references/           # Guide approfondite (caricate su richiesta)
│   ├── animation-*.md    # Best practice animazione + insidie
│   ├── design-styles.md  # Database 20 filosofie di design
│   ├── react-setup.md    # Setup tecnico React + Babel
│   ├── slide-decks.md    # Guida architettura slide
│   ├── video-export.md   # Pipeline esportazione MP4/GIF
│   └── ...               # 18 file di riferimento totali
└── scripts/              # Script di automazione
    ├── render-video.js   # HTML → MP4 (25fps)
    ├── convert-formats.sh # Interpolazione 60fps + GIF
    ├── add-music.sh      # Mixaggio BGM + SFX
    ├── export_deck_*.mjs # Esportazione PDF + PPTX
    └── verify.py         # Verifica Playwright
```

---

## Requisiti

- [OpenClaw](https://github.com/openclaw/openclaw) (qualsiasi versione recente)
- Node.js ≥ 18 (per gli script)
- [Playwright](https://playwright.dev/) (per verifica + esportazione video)
- ffmpeg (per conversione formato video + mixaggio audio)

---

## Licenza

Uso personale gratuito. L'uso commerciale richiede autorizzazione. Vedi [LICENSE](LICENSE) per i dettagli.

---

<div align="center">

**[MyClaw.ai](https://myclaw.ai)** — La piattaforma di assistente personale IA che offre a ogni utente un server completo con pieno controllo del codice.

</div>
