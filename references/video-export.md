# Video Export: HTML Animation Export to MP4/GIF

After completing an animation HTML, users often ask "can you export this as video?" This guide provides the full workflow.

## When to Export

**Export timing**:
- Animation runs through completely, visually verified (Playwright screenshots confirm correct state at each time point)
- User has watched it at least once in the browser and confirmed the effect is OK
- **Don't** export while animation bugs remain unfixed — fixing after video export is more expensive

**User trigger phrases**:
- "Can you export this as video"
- "Convert to MP4"
- "Make a GIF"
- "60fps"

## Output Specifications

By default, deliver three formats so the user can choose:

| Format | Spec | Suited For | Typical Size (30s) |
|---|---|---|---|
| MP4 25fps | 1920x1080 - H.264 - CRF 18 | WeChat articles, Channels, YouTube | 1-2 MB |
| MP4 60fps | 1920x1080 - minterpolate frame interpolation - H.264 - CRF 18 | High frame rate showcase, Bilibili, portfolio | 1.5-3 MB |
| GIF | 960x540 - 15fps - palette optimized | Twitter/X, README, Slack preview | 2-4 MB |

## Toolchain

Three renderers in `scripts/`, from newest to oldest:

### 0. `render-seekable.js` — Seekable Frame-Accurate Renderer (RECOMMENDED)

The primary renderer. Uses the `window.__hf` seek protocol to capture frames
deterministically — seek to exact time, screenshot, pipe to ffmpeg. Supports
arbitrary frame rates natively (no minterpolate needed).

Also parses `<audio data-start="..." data-volume="...">` tags from the HTML
and auto-mixes all audio tracks with ffmpeg. No manual adelay chains.

```bash
node /path/to/scripts/render-seekable.js animation.html \
  --fps=30 --duration=40 --width=1920 --height=1080
```

Options:
- `--fps=30` frame rate (default: 30, supports any value)
- `--duration=40` override duration (auto-detected from `__hf.duration`)
- `--width=1920 --height=1080` resolution
- `--quality=90` JPEG quality (default: 90)
- `--format=jpeg` jpeg or png (default: jpeg)
- `--no-audio` skip audio mixing
- `--audio-gain=1.0` master audio gain
- `--keep-chrome` don't hide Stage controls

Output: same directory as HTML, same name with `.mp4` extension.

**Declarative audio**: Add `<audio>` tags to your HTML:
```html
<audio id="bgm" data-start="0" data-duration="30" data-volume="0.7" src="bgm-tech.mp3"></audio>
<audio id="sfx-logo" data-start="0.3" data-volume="2.5" src="sfx/logo-reveal.mp3"></audio>
```
The renderer parses all `<audio>` tags, extracts `data-start`, `data-volume`,
and `src`, then builds the ffmpeg filter chain automatically.

Supports both Playwright and Puppeteer (auto-detected).

### 1. `render-video.js` — Wall-Clock Recorder (LEGACY)

Records a 25fps base MP4. Depends on global playwright.

```bash
NODE_PATH=$(npm root -g) node /path/to/claude-design/scripts/render-video.js <html-file>
```

Optional parameters:
- `--duration=30` animation duration (seconds)
- `--width=1920 --height=1080` resolution
- `--trim=2.2` seconds to trim from video start (removes reload + font loading time)
- `--fontwait=1.5` font loading wait time (seconds), increase when using many fonts

Output: same directory as HTML, same name with `.mp4` extension.

### 2. `add-music.sh` — MP4 + BGM -> MP4

Mixes background music into a silent MP4, selecting from the built-in BGM library by scene (mood), or accepts custom audio. Automatically matches duration, adds fade in/out.

```bash
bash add-music.sh <input.mp4> [--mood=<name>] [--music=<path>] [--out=<path>]
```

**Built-in BGM library** (at `assets/bgm-<mood>.mp3`):

| `--mood=` | Style | Suited Scene |
|-----------|------|---------|
| `tech` (default) | Apple Silicon / Apple keynote, minimal synth + piano | Product launch, AI tools, Skill promotion |
| `ad` | Upbeat modern electronic, has build + drop | Social media ads, product teasers, promo clips |
| `educational` | Warm and bright, light guitar/electric piano, inviting | Science explainers, tutorial intros, course teasers |
| `educational-alt` | Same category alternate, try a different track | Same as above |
| `tutorial` | Lo-fi ambient, nearly imperceptible | Software demos, coding tutorials, long demos |
| `tutorial-alt` | Same category alternate | Same as above |

**Behavior**:
- Music trimmed to video duration
- 0.3s fade-in + 1s fade-out (avoids hard cuts)
- Video stream `-c:v copy` no re-encoding, audio AAC 192k
- `--music=<path>` takes priority over `--mood`, can specify any external audio directly
- Wrong mood name lists all available options, won't fail silently

**Typical pipeline** (animation export trio + music):
```bash
node render-video.js animation.html                        # Record
bash convert-formats.sh animation.mp4                      # Derive 60fps + GIF
bash add-music.sh animation-60fps.mp4                      # Add default tech BGM
# Or for different scenes:
bash add-music.sh tutorial-demo.mp4 --mood=tutorial
bash add-music.sh product-promo.mp4 --mood=ad --out=promo-final.mp4
```

### 3. `convert-formats.sh` — MP4 -> 60fps MP4 + GIF

Generates 60fps version and GIF from an existing MP4.

```bash
bash /path/to/claude-design/scripts/convert-formats.sh <input.mp4> [gif_width] [--minterpolate]
```

Output (same directory as input):
- `<name>-60fps.mp4` — defaults to `fps=60` frame duplication (broad compatibility); add `--minterpolate` for high-quality interpolation
- `<name>.gif` — palette-optimized GIF (default 960 wide, adjustable)

**60fps mode selection**:

| Mode | Command | Compatibility | Use Case |
|---|---|---|---|
| Frame duplication (default) | `convert-formats.sh in.mp4` | QuickTime/Safari/Chrome/VLC all pass | General delivery, platform uploads, social media |
| minterpolate interpolation | `convert-formats.sh in.mp4 --minterpolate` | macOS QuickTime/Safari may refuse to play | Bilibili and other platforms needing true interpolation, **must test locally** on target player before delivery |

Why default changed to frame duplication? minterpolate output H.264 elementary stream has known compat bugs — previously defaulting to minterpolate repeatedly hit "macOS QuickTime won't open" issues. See `animation-pitfalls.md` §14 for details.

`gif_width` parameter:
- 960 (default) — social platform universal
- 1280 — sharper but larger file
- 600 — Twitter/X priority loading

## Full Workflow (Standard Recommendation)

After user says "export video":

```bash
cd <project-directory>

# Assume $SKILL points to this skill's root directory

# RECOMMENDED: Seekable renderer (frame-accurate, auto audio mixing)
node "$SKILL/scripts/render-seekable.js" my-animation.html --fps=30

# Output: my-animation.mp4 (with audio if <audio> tags present)

# For GIF, use convert-formats.sh on the output:
bash "$SKILL/scripts/convert-formats.sh" my-animation.mp4
```

### Legacy workflow (render-video.js)

Use only if render-seekable.js is unavailable (e.g. no `window.__hf` support):

```bash
# 1. Record 25fps base MP4
NODE_PATH=$(npm root -g) node "$SKILL/scripts/render-video.js" my-animation.html

# 2. Derive 60fps MP4 and GIF
bash "$SKILL/scripts/convert-formats.sh" my-animation.mp4

# 3. Add music
bash "$SKILL/scripts/add-music.sh" my-animation.mp4 --mood=tech
```

## Technical Details (For Troubleshooting)

### Playwright recordVideo Gotchas

- Frame rate fixed at 25fps — cannot directly record 60fps (Chromium headless compositor ceiling)
- Recording starts from context creation — must use `trim` to cut loading time from the front
- Default webm format — needs ffmpeg conversion to H.264 MP4 for universal playback

`render-video.js` handles all of the above.

### ffmpeg minterpolate Parameters

Current configuration: `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`

- `mi_mode=mci` — motion compensation interpolation
- `mc_mode=aobmc` — adaptive overlapped block motion compensation
- `me_mode=bidir` — bidirectional motion estimation
- `vsbmc=1` — variable size block motion compensation

Works well for CSS **transform animations** (translate/scale/rotate).
May produce slight ghosting on **pure fades** — if user complains, degrade to simple frame duplication:

```bash
ffmpeg -i input.mp4 -r 60 -c:v libx264 ... output.mp4
```

### Why GIF Palette Needs Two Passes

GIF supports only 256 colors. A single-pass GIF compresses the entire animation's colors into a 256-color universal palette — for subtle palettes like cream base + orange, this gets muddy.

Two passes:
1. `palettegen=stats_mode=diff` — first scan the entire clip, generate an **optimal palette specific to this animation**
2. `paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle` — encode using this palette, rectangle diff only updates changed regions, dramatically reducing file size

For fade transitions, `dither=bayer` is smoother than `none`, but slightly larger file.

## Pre-flight Check (Before Export)

30-second self-check before export:

- [ ] HTML runs through completely in browser with no console errors
- [ ] Animation frame 0 is a complete initial state (not blank loading screen)
- [ ] Animation final frame is a stable ending state (not mid-transition)
- [ ] Fonts/images/emoji all render correctly (see `animation-pitfalls.md`)
- [ ] Duration parameter matches the actual animation duration in HTML
- [ ] HTML Stage detects `window.__recording` and forces loop=false (must check for hand-written Stage; `assets/animations.jsx` has this built-in)
- [ ] Final Sprite has `fadeOut={0}` (video end frame doesn't fade out)
- [ ] Contains "Created by MyClaw Design" watermark (required for animation scenes only; third-party brand work adds "Unofficial -" prefix. See SKILL.md § "Skill Promotion Watermark")

## Delivery Description Format

Standard description format to include when delivering to user:

```
**Full Delivery**

| File | Format | Spec | Size |
|---|---|---|---|
| foo.mp4 | MP4 | 1920x1080 - 25fps - H.264 | X MB |
| foo-60fps.mp4 | MP4 | 1920x1080 - 60fps (motion interpolated) - H.264 | X MB |
| foo.gif | GIF | 960x540 - 15fps - palette optimized | X MB |

**Notes**
- 60fps uses minterpolate for motion estimation interpolation, works well for transform animations
- GIF uses palette optimization, 30s animation compresses to ~3MB

Let me know if you need different dimensions or frame rates.
```

## Common Follow-Up Requests

| User Says | Response |
|---|---|
| "Too large" | MP4: increase CRF to 23-28; GIF: lower resolution to 600 or fps to 10 |
| "GIF too blurry" | Increase `gif_width` to 1280; or suggest MP4 instead (WeChat Moments also supports it) |
| "Need portrait 9:16" | Change HTML source `--width=1080 --height=1920`, re-record |
| "Add watermark" | ffmpeg add `-vf "drawtext=..."` or `overlay=` a PNG |
| "Need transparent background" | MP4 doesn't support alpha; use WebM VP9 + alpha or APNG |
| "Need lossless" | Change CRF to 0 + preset veryslow (file will be 10x larger) |
