<sub>🌐 <a href="README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <a href="README.ja.md">日本語</a> · <a href="README.it.md">Italiano</a> · <b>Español</b></sub>

<div align="center">

# MyClaw Design

> *"Escribe. Pulsa enter. Un diseño terminado aparece en tus manos."*

[![Powered by MyClaw.ai](https://img.shields.io/badge/Powered%20by-MyClaw.ai-blue?style=flat-square)](https://myclaw.ai)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blueviolet?style=flat-square)](https://github.com/openclaw/openclaw)
[![License](https://img.shields.io/badge/License-Personal%20Use-orange?style=flat-square)](LICENSE)

<br>

**Di una frase a tu agente. Recibe un diseño listo para entregar.**

De 3 a 30 minutos — produce una **animación de lanzamiento de producto**, un prototipo App clicable, una presentación editable o una infografía lista para imprimir. No "con aspecto generado por IA" — el tipo de trabajo que parece venir de un equipo de diseño real.

Dale a la skill tus assets de marca (logo, paleta, capturas de UI) y leerá el ADN de tu marca. No le des nada, y 20 filosofías de diseño integradas mantendrán el resultado lejos del slop de IA.

</div>

---

<p align="center">
  <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.gif"><img src="docs/hero-preview.jpg" alt="MyClaw Design Hero — Escribe → Elige dirección → Galería → Enfoque → Revelación de marca" width="100%"></a>
</p>

<p align="center"><sub>
  ▲ 25s · Terminal → 4 direcciones → Galería ripple → 4× Enfoque → Revelación de marca<br>
  👉 <a href="https://github.com/LeoYeAI/myclaw-design/releases/download/v1.0.0/hero-animation-v10-en.mp4">Descargar MP4 con BGM + SFX (10 MB)</a>
</sub></p>

---

## Instalación

```bash
# Copia en el directorio de skills de OpenClaw
git clone https://github.com/LeoYeAI/myclaw-design.git ~/.openclaw/skills/myclaw-design
```

Luego simplemente habla con tu agente:

```
"Crea una animación de lanzamiento de producto para nuestra nueva función, sugiere 3 direcciones de estilo"
"Haz un prototipo iOS clicable — 4 pantallas principales con navegación real"
"Crea una presentación 1920×1080, exporta como PPTX editable"
"Convierte esta lógica en un motion graphic de 60 segundos, exporta MP4 y GIF"
"Ejecuta una revisión experta de 5 dimensiones sobre este diseño"
```

Sin botones. Sin paneles. Sin plugins de Figma. Solo conversación.

---

## Qué Puede Hacer

| Capacidad | Entregable | Tiempo Típico |
|---|---|---|
| **Prototipos Interactivos** (App / Web) | HTML de archivo único · Marco iPhone real · Clicable · Verificado con Playwright | 10–15 min |
| **Presentaciones** | Deck HTML (presenta en el navegador) + PPTX editable (cuadros de texto preservados) | 15–25 min |
| **Animaciones Timeline** | MP4 (25fps / 60fps interpolados) + GIF (paleta optimizada) + BGM + SFX | 8–12 min |
| **Variantes de Diseño** | 3+ comparaciones lado a lado · Tweaks en vivo · Exploración cross-dimensión | 10 min |
| **Infografías** | Layout listo para imprimir · Exportación PDF/PNG/SVG | 10 min |
| **Asesor de Dirección de Diseño** | 5 escuelas × 20 filosofías · 3 recomendaciones · Generación de demos en paralelo | 5 min |
| **Revisión Experta de 5 Dimensiones** | Gráfico radar + Mantener/Corregir/Quick Wins · Lista de correcciones accionables | 3 min |

---

## Galería de Demos

### Asesor de Dirección de Diseño

Cuando los requisitos son vagos, la skill elige 3 direcciones diferenciadas de 5 escuelas × 20 filosofías de diseño, genera demos en paralelo y te deja elegir.

<p align="center"><img src="docs/w3-fallback-advisor-en.gif" width="100%"></p>

### Prototipo App iOS

Marco de precisión iPhone 15 Pro (Dynamic Island / barra de estado / Home Indicator) · Navegación multi-pantalla basada en estados · Imágenes reales de Wikimedia/Met/Unsplash · Pruebas auto-click con Playwright antes de la entrega.

<p align="center"><img src="docs/c1-ios-prototype-en.gif" width="100%"></p>

### Motor de Motion Design

Modelo timeline Stage + Sprite · `useTime` / `useSprite` / `interpolate` / `Easing` — cuatro APIs cubren todas las necesidades de animación. Un comando exporta MP4 / GIF / 60fps interpolados / corte final con BGM + SFX.

<p align="center"><img src="docs/c3-motion-design-en.gif" width="100%"></p>

### Presentaciones + PPTX Editable

Slides HTML-first con auto-scale, navegación por teclado y notas del presentador. Exportación a PPTX editable con cuadros de texto nativos — no capturas de pantalla pegadas en las diapositivas.

<p align="center"><img src="docs/c2-slides-pptx-en.gif" width="100%"></p>

### Tweaks en Vivo

Ajuste de parámetros en tiempo real — cambia esquemas de color, layouts, tipografía y densidad sin regenerar. Los cambios persisten mediante localStorage.

<p align="center"><img src="docs/c4-tweaks-en.gif" width="100%"></p>

### Infografías

Layouts data-driven listos para imprimir con tipografía precisa. Exportación a PDF/PNG/SVG.

<p align="center"><img src="docs/c5-infographic-en.gif" width="100%"></p>

### Revisión Experta de 5 Dimensiones

Consistencia filosófica / Jerarquía visual / Ejecución de detalles / Funcionalidad / Innovación — cada una puntuada 0–10 con gráfico radar, lista Mantener, lista Corregir (ordenada por gravedad) y Quick Wins.

<p align="center"><img src="docs/c6-expert-review-en.gif" width="100%"></p>

---

## Cómo Funciona

### Protocolo de Assets de Marca

La skill no adivina tu marca. Sigue un estricto protocolo de 5 pasos:

1. **Preguntar** — Solicita logo, fotos de producto, capturas de UI, paleta de colores, tipografía
2. **Buscar** — Rastrea sitios oficiales, press kits, tiendas de apps en busca de assets
3. **Descargar** — Obtiene archivos reales (logo SVG, imágenes hero del producto, capturas de UI)
4. **Verificar** — Comprueba resolución, transparencia, actualización de versión
5. **Bloquear** — Escribe `brand-spec.md` con todas las rutas de assets; las variables CSS garantizan consistencia

<p align="center"><img src="docs/w1-brand-protocol-en.gif" width="100%"></p>

> **Por qué importa:** Sin assets reales de marca, cada diseño generado por IA se ve igual — gradientes genéricos, iconos placeholder, cero reconocimiento de marca. El protocolo cuesta 30 minutos iniciales pero ahorra 1–2 horas de retrabajo.

### Flujo de Trabajo Junior Designer

La skill funciona como un diseñador junior que te reporta:

1. **Muestra suposiciones primero** — Escribe razonamiento + placeholders antes de cualquier código
2. **Obtiene aprobación** — Espera tu dirección antes de completar los detalles
3. **Itera** — Muestra el progreso a mitad de camino, no solo el resultado final
4. **Verifica** — Ejecuta capturas Playwright + verificación de errores de consola antes de la entrega

<p align="center"><img src="docs/w2-junior-designer-en.gif" width="100%"></p>

### Anti-AI Slop

Cada decisión de diseño se verifica contra una estricta lista anti-slop:

| Evitar | Usar en su Lugar |
|---|---|
| Gradientes morados | Colores de marca / armónicos `oklch()` |
| Emoji como iconos | Placeholders honestos o assets reales |
| Tarjetas redondeadas + acento borde izquierdo | Bordes limpios ganados por el contenido |
| Caras/objetos dibujados en SVG | Imágenes reales o placeholders honestos |
| Siluetas CSS reemplazando fotos de producto | Imágenes de producto reales del protocolo de marca |
| Inter/Roboto/fuentes del sistema como display | Combinación distintiva de fuente display + body |

---

## Componentes Starter

Componentes pre-construidos listos para usar:

| Componente | Caso de Uso |
|---|---|
| `assets/ios_frame.jsx` | Marco iPhone 15 Pro con Dynamic Island, barra de estado, Home Indicator |
| `assets/android_frame.jsx` | Marco de dispositivo Android |
| `assets/macos_window.jsx` | Chrome de ventana macOS con semáforos |
| `assets/browser_window.jsx` | Ventana de navegador con barra URL + pestañas |
| `assets/animations.jsx` | Motor Stage + Sprite + useTime + Easing |
| `assets/deck_index.html` | Ensamblador de presentación multi-archivo |
| `assets/deck_stage.js` | Web component de presentación de archivo único |
| `assets/design_canvas.jsx` | Cuadrícula de comparación de variantes lado a lado |

## Assets de Audio

6 pistas BGM adaptadas a la escena + 37 archivos SFX categorizados para output de animación listo para producción:

- **BGM**: tech / ad / educational / tutorial (+ variantes alt)
- **SFX**: keyboard, terminal, transition, impact, magic, feedback, UI, container, progress

---

## Estructura del Proyecto

```
myclaw-design/
├── SKILL.md              # Instrucciones core de la skill (cargadas por OpenClaw)
├── assets/               # Componentes starter, BGM, SFX, showcases
│   ├── *.jsx             # Componentes React (marcos iOS/Android/macOS, etc.)
│   ├── bgm-*.mp3         # 6 pistas de música de fondo adaptadas a la escena
│   ├── sfx/              # 37 efectos de sonido categorizados
│   └── showcases/        # 24 muestras de diseño pre-construidas (8 escenas × 3 estilos)
├── references/           # Guías en profundidad (cargadas bajo demanda)
│   ├── animation-*.md    # Mejores prácticas de animación + trampas
│   ├── design-styles.md  # Base de datos de 20 filosofías de diseño
│   ├── react-setup.md    # Configuración técnica React + Babel
│   ├── slide-decks.md    # Guía de arquitectura de slides
│   ├── video-export.md   # Pipeline de exportación MP4/GIF
│   └── ...               # 18 archivos de referencia en total
└── scripts/              # Scripts de automatización
    ├── render-video.js   # HTML → MP4 (25fps)
    ├── convert-formats.sh # Interpolación 60fps + GIF
    ├── add-music.sh      # Mezcla BGM + SFX
    ├── export_deck_*.mjs # Exportación PDF + PPTX
    └── verify.py         # Verificación Playwright
```

---

## Requisitos

- [OpenClaw](https://github.com/openclaw/openclaw) (cualquier versión reciente)
- Node.js ≥ 18 (para los scripts)
- [Playwright](https://playwright.dev/) (para verificación + exportación de video)
- ffmpeg (para conversión de formato de video + mezcla de audio)

---

## Licencia

Uso personal gratuito. El uso comercial requiere autorización. Ver [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**[MyClaw.ai](https://myclaw.ai)** — La plataforma de asistente personal con IA que ofrece a cada usuario un servidor completo con control total del código.

</div>
