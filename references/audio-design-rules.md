# Audio Design Rules · MyClaw Design

> Audio formulas for all animation demos. Use together with `sfx-library.md` (asset inventory).
> Forged through real production: MyClaw Design launch hero v1-v9 iterations · Deep Gemini-style breakdowns of three official Anthropic films · 8000+ A/B comparisons

---

## Core Principle · Dual-Track Audio System (Hard Rule)

Animation audio **must be designed in two independent layers**. Do not do only one:

| Layer | Role | Time Scale | Relation to Visuals | Frequency Band Occupied |
|---|---|---|---|---|
| **SFX (beat layer)** | Marks each visual beat | Short bursts of 0.2-2s | **Strong sync** (frame-level alignment) | **High frequencies 800Hz+** |
| **BGM (atmosphere bed)** | Emotional foundation, soundstage | Continuous 20-60s | Weak sync (section-level) | **Mid-low frequencies <4kHz** |

**An animation with only BGM is crippled**. The viewer subconsciously feels, "the visuals are moving but the sound is not responding." That is the root of the cheap feeling.

---

## Gold Standard · Golden Ratios

These values are **hard production parameters** distilled from real comparisons across three Anthropic official films plus our own v9 final. Use them directly:

### Volume
- **BGM volume**: `0.40-0.50` (relative to full scale 1.0)
- **SFX volume**: `1.00`
- **Loudness gap**: BGM peak should be **-6 to -8 dB** below SFX peak. Do not make SFX stand out through absolute loudness alone. Make it stand out through contrast.
- **`amix` parameter**: `normalize=0` (never use `normalize=1`; it flattens the dynamic range)

### Frequency Separation (P1 hard optimization)
Anthropic's secret is not "loud SFX." It is **frequency layering**:

```bash
[bgm_raw]lowpass=f=4000[bgm]      # Restrict BGM to mid-low frequencies <4kHz
[sfx_raw]highpass=f=800[sfx]      # Push SFX into the mid-high range 800Hz+
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]
```

Why: human hearing is most sensitive in the 2-5kHz range, the so-called presence band. If SFX also sits there while BGM occupies the full spectrum, **the high-frequency portion of the BGM will mask the SFX**. High-pass the SFX upward and low-pass the BGM downward so they occupy different parts of the spectrum. SFX clarity immediately improves.

### Fade
- BGM in: `afade=in:st=0:d=0.3` (0.3s, avoids a hard cut)
- BGM out: `afade=out:st=N-1.5:d=1.5` (1.5s tail, gives closure)
- SFX should already have its own envelope; no extra fade needed

---

## SFX Cue Design Rules

### Density (how many SFX per 10 seconds)
Measured SFX density across Anthropic's three films falls into three tiers:

| Film | SFX per 10s | Product Personality | Scene Type |
|---|---|---|---|
| Artifacts (ref-1) | **~9 per 10s** | Feature-dense, information-rich | Complex tool demo |
| Code Desktop (ref-2) | **0** | Pure atmosphere, meditative | Developer-tool focus state |
| Word (ref-3) | **~4 per 10s** | Balanced, office rhythm | Productivity tool |

**Heuristic**:
- Calm / focused product personality -> low SFX density (0-3 per 10s), BGM-driven
- Lively / information-dense product personality -> high SFX density (6-9 per 10s), rhythm driven by SFX
- **Do not fill every visual beat**. Negative space is more sophisticated than density. **Deleting 30-50% of the cues makes the remaining ones more dramatic**.

### Cue Selection Priority
Not every visual beat needs SFX. Choose by this priority:

**P0 mandatory** (omitting these causes dissonance):
- Typing (terminal / input)
- Click / selection (moments of user decision)
- Focus switch (visual protagonist changes)
- Logo reveal (brand closure)

**P1 recommended**:
- Element entrance / exit (modal / card)
- Completion / success feedback
- AI generation start / end
- Major transition (scene switch)

**P2 optional** (too many becomes messy):
- hover / focus-in
- progress tick
- decorative ambient

### Timestamp Alignment Precision
- **Same-frame alignment** (0ms error): click / focus switch / logo landing
- **Lead by 1-2 frames** (-33ms): fast whoosh, gives the viewer psychological anticipation
- **Lag by 1-2 frames** (+33ms): object landing / impact, matches real-world physics

---

## BGM Selection Decision Tree

The MyClaw Design skill includes 6 BGM tracks (`assets/bgm-*.mp3`):

```
What is the animation personality?
├─ Product launch / tech demo -> bgm-tech.mp3 (minimal synth + piano)
├─ Tutorial / tool usage -> bgm-tutorial.mp3 (warm, instructional)
├─ Educational / concept explanation -> bgm-educational.mp3 (curious, thoughtful)
├─ Marketing ad / brand promo -> bgm-ad.mp3 (upbeat, promotional)
└─ Need a variation in the same family -> bgm-*-alt.mp3 (alternate version)
```

### Cases with no BGM (worth considering)
Refer to Anthropic Code Desktop (ref-2): **0 SFX + pure Lo-fi BGM** can still feel very premium.

**When to choose no BGM**:
- Animation duration <10s (the BGM does not have time to establish itself)
- Product personality is "focused / meditative"
- The scene already has environmental sound or voiceover
- SFX density is already high (avoid auditory overload)

---

## Scene Recipes (ready to use)

### Recipe A · Product launch hero (same configuration as MyClaw Design v9)
```
Duration: 25s
BGM: bgm-tech.mp3 · 45% · frequency-limited to <4kHz
SFX density: ~6 per 10s

cue:
  terminal typing -> type × 4 (0.6s apart)
  Enter           -> enter
  Card convergence -> card × 4 (staggered 0.2s)
  Selection       -> click
  Ripple          -> whoosh
  4 focus shifts  -> focus × 4
  Logo            -> thud (1.5s)

Volume: BGM 0.45 / SFX 1.0 · amix normalize=0
```

### Recipe B · Tool feature demo (refer to Anthropic Code Desktop)
```
Duration: 30-45s
BGM: bgm-tutorial.mp3 · 50%
SFX density: 0-2 per 10s (extremely sparse)

Strategy: let BGM + voiceover drive the piece. Use SFX only on decisive moments (save complete / command executed)
```

### Recipe C · AI generation demo
```
Duration: 15-20s
BGM: bgm-tech.mp3 or no BGM
SFX density: ~8 per 10s (high density)

cue:
  User input -> type + enter
  AI starts processing -> magic/ai-process (1.2s loop)
  Generation complete -> feedback/complete-done
  Result reveal -> magic/sparkle

Highlight: ai-process can loop 2-3 times through the whole generation sequence
```

### Recipe D · Pure-atmosphere long take (refer to Artifacts)
```
Duration: 10-15s
BGM: none
SFX: 3-5 carefully designed cues used on their own

Strategy: every SFX is the protagonist. Without BGM smearing things together, each sound lands with maximum clarity.
Best for: slow product shots, close-up feature showcase
```

---

## ffmpeg Mixing Templates

### Template 1 · Layer a single SFX onto video
```bash
ffmpeg -y -i video.mp4 -itsoffset 2.5 -i sfx.mp3 \
  -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0[a]" \
  -map 0:v -map "[a]" output.mp4
```

### Template 2 · Multi-SFX timeline composite (align by cue timestamps)
```bash
ffmpeg -y \
  -i sfx-type.mp3 -i sfx-enter.mp3 -i sfx-click.mp3 -i sfx-thud.mp3 \
  -filter_complex "\
[0:a]adelay=1100|1100[a0];\
[1:a]adelay=3200|3200[a1];\
[2:a]adelay=7000|7000[a2];\
[3:a]adelay=21800|21800[a3];\
[a0][a1][a2][a3]amix=inputs=4:duration=longest:normalize=0[mixed]" \
  -map "[mixed]" -t 25 sfx-track.mp3
```
**Key parameters**:
- `adelay=N|N`: first value is left-channel delay (ms), second is right-channel delay. Write both to keep stereo aligned.
- `normalize=0`: preserve dynamic range. Critical.
- `-t 25`: trim to target duration

### Template 3 · Video + SFX track + BGM (with frequency separation)
```bash
ffmpeg -y -i video.mp4 -i sfx-track.mp3 -i bgm.mp3 \
  -filter_complex "\
[2:a]atrim=0:25,afade=in:st=0:d=0.3,afade=out:st=23.5:d=1.5,\
     lowpass=f=4000,volume=0.45[bgm];\
[1:a]highpass=f=800,volume=1.0[sfx];\
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k final.mp4
```

---

## Failure Mode Quick Reference

| Symptom | Root Cause | Fix |
|---|---|---|
| SFX is inaudible | BGM high frequencies are masking it | Apply `lowpass=f=4000` to BGM + `highpass=f=800` to SFX |
| Sound effects are painfully loud | Absolute SFX volume is too high | Lower SFX to 0.7 and also lower BGM to 0.3, preserving the contrast |
| BGM and SFX rhythms fight each other | Wrong BGM choice (music has too much strong beat) | Switch to an ambient / minimal synth BGM |
| BGM cuts off abruptly at the end | No fade out | Add `afade=out:st=N-1.5:d=1.5` |
| SFX overlaps into mush | Cue density too high + each SFX too long | Keep each SFX under 0.5s, cue spacing ≥ 0.2s |
| MP4 has no sound in WeChat posts | WeChat sometimes mutes autoplay | Do not worry. Sound will play once the user opens it. GIF naturally has no sound |

---

## Linking Audio to Visuals (Advanced)

### SFX timbre should match the visual style
- Warm beige / paper-like visuals -> use **wooden / soft** timbres (Morse, paper snap, soft click)
- Cold black tech visuals -> use **metallic / digital** timbres (beep, pulse, glitch)
- Hand-drawn / playful visuals -> use **cartoon / exaggerated** timbres (boing, pop, zap)

Our current `apple-gallery-showcase.md` warm beige base pairs with `keyboard/type.mp3` (mechanical) + `container/card-snap.mp3` (soft) + `impact/logo-reveal-v2.mp3` (cinematic bass)

### SFX can lead visual rhythm
Advanced technique: **design the SFX timeline first, then adjust the visual animation to align to the SFX**. Not the other way around.
Because each SFX cue becomes a clock tick, visuals that adapt to the SFX rhythm feel extremely stable. If you try to make SFX chase the visuals instead, a ±1-frame mismatch often feels wrong.

---

## Quality Checklist (self-check before release)

- [ ] Loudness gap: SFX peak - BGM peak = -6 to -8 dB?
- [ ] Frequency split: BGM lowpass 4kHz + SFX highpass 800Hz?
- [ ] `amix normalize=0` (dynamic range preserved)?
- [ ] BGM fade-in 0.3s + fade-out 1.5s?
- [ ] Is the number of SFX appropriate for the scene personality?
- [ ] Is every SFX aligned to the visual beat within ±1 frame?
- [ ] Is the logo reveal SFX long enough (recommend 1.5s)?
- [ ] Listen once with BGM muted: does the SFX alone have enough rhythmic clarity?
- [ ] Listen once with SFX muted: does the BGM alone have emotional contour?

Each layer should make sense on its own. If it only works when the two layers are stacked together, it is not properly designed.

---

## References

- SFX asset inventory: `sfx-library.md`
- Visual style reference: `apple-gallery-showcase.md`
- Deep audio analysis of three Anthropic films: see `AUDIO-BEST-PRACTICES.md`
- MyClaw Design v9 production case: see hero-animation-v9-final.mp4
