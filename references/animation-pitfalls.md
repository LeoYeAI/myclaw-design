# Animation Pitfalls: HTML Animation Bugs and Rules Learned the Hard Way

The most common bugs when making animation, and how to avoid them. Every rule comes from a real failure case.

Read this before writing animation. It saves a full iteration.

## 1. Layered Layout - `position: relative` Is the Default Obligation

**Pitfall**: a `sentence-wrap` element contained 3 `bracket-layer`s (`position: absolute`). `sentence-wrap` was not given `position: relative`, so the absolute brackets used `.canvas` as the coordinate system and drifted 200px below the screen.

**Rule**:
- Any container that includes `position: absolute` children **must** explicitly set `position: relative`
- Even if you do not visually need any "offset," write `position: relative` as the coordinate anchor
- If you're writing `.parent { ... }` and one of its children is `.child { position: absolute }`, instinctively add `relative` to the parent

**Quick check**: every time `position: absolute` appears, count upward through ancestors and make sure the nearest positioned ancestor is the coordinate system you *intend*.

## 2. Character Trap - Do Not Rely on Rare Unicode

**Pitfall**: tried to use `␣` (U+2423 OPEN BOX) to visualize a "space token." `Noto Serif SC` / `Cormorant Garamond` don't have that glyph, so it rendered as blank/tofu. The audience could not see it at all.

**Rule**:
- **Every character appearing in animation must exist in your chosen font**
- Common rare-character blacklist: `␣ ␀ ␐ ␋ ␨ ↩ ⏎ ⌘ ⌥ ⌃ ⇧ ␦ ␖ ␛`
- For metacharacters such as space / return / tab, use a **CSS-constructed semantic box**:
  ```html
  <span class="space-key">Space</span>
  ```
  ```css
  .space-key {
    display: inline-flex;
    padding: 4px 14px;
    border: 1.5px solid var(--accent);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.3em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  ```
- Emoji also need verification: some emoji fall back to gray square boxes outside `Noto Emoji`; best to use an `emoji` font-family or SVG

## 3. Data-Driven Grid/Flex Templates

**Pitfall**: code had `const N = 6` tokens, but CSS hardcoded `grid-template-columns: 80px repeat(5, 1fr)`. The 6th token had no column, and the whole matrix misaligned.

**Rule**:
- When count comes from a JS array (`TOKENS.length`), the CSS template should also be data-driven
- Option A: inject a CSS variable from JS
  ```js
  el.style.setProperty('--cols', N);
  ```
  ```css
  .grid { grid-template-columns: 80px repeat(var(--cols), 1fr); }
  ```
- Option B: use `grid-auto-flow: column` to let the browser expand automatically
- **Ban the combo of hardcoded numbers + JS constants**. If N changes, CSS will not update with it

## 4. Transition Gap - Scene Switches Must Stay Continuous

**Pitfall**: between `zoom1` (13-19s) -> `zoom2` (19.2-23s), the main sentence was already hidden, `zoom1` faded out (0.6s) + `zoom2` faded in (0.6s) + stagger delay (0.2s+) = about 1 second of pure blank screen. The audience thought the animation had frozen.

**Rule**:
- When switching scenes continuously, fade out and fade in must **overlap**, not wait for the previous one to disappear completely before starting the next
  ```js
  // Bad:
  if (t >= 19) hideZoom('zoom1');      // 19.0s out
  if (t >= 19.4) showZoom('zoom2');    // 19.4s in -> 0.4s blank gap in between

  // Good:
  if (t >= 18.6) hideZoom('zoom1');    // start fade out 0.4s early
  if (t >= 18.6) showZoom('zoom2');    // fade in simultaneously (cross-fade)
  ```
- Or use an "anchor element" (such as the main sentence) as visual continuity between scenes, briefly showing it again during the zoom switch
- Calculate CSS transition durations clearly to avoid triggering the next one before the current transition finishes

## 5. Pure Render Principle - Animation State Must Be Seekable

**Pitfall**: used `setTimeout` + `fireOnce(key, fn)` to chain-trigger animation state. Normal playback worked, but during frame-by-frame recording or seeking to an arbitrary timestamp, previously executed setTimeouts could not "go back in time."

**Rule**:
- The ideal `render(t)` function is a **pure function**: given t, it outputs a unique DOM state
- If side effects are unavoidable (such as toggling classes), use a `fired` set with explicit reset:
  ```js
  const fired = new Set();
  function fireOnce(key, fn) { if (!fired.has(key)) { fired.add(key); fn(); } }
  function reset() { fired.clear(); /* clear all .show classes */ }
  ```
- Expose `window.__seek(t)` for Playwright / debugging:
  ```js
  window.__seek = (t) => { reset(); render(t); };
  ```
- Animation-related setTimeouts should not span >1 second, otherwise seeking backward will break state

## 6. Measuring Before Fonts Load = Measuring the Wrong Thing

**Pitfall**: called `charRect(idx)` right at `DOMContentLoaded` to measure bracket positions. Fonts had not loaded yet, so every character width came from the fallback font and all positions were wrong. Once the font loaded (~500ms later), the bracket `left: Xpx` stayed at the old value and remained permanently offset.

**Rule**:
- Any layout code that depends on DOM measurement (`getBoundingClientRect`, `offsetWidth`) **must** be wrapped in `document.fonts.ready.then()`
  ```js
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      buildBrackets(...);  // fonts ready now, measurement is accurate
      tick();              // animation starts
    });
  });
  ```
- The extra `requestAnimationFrame` gives the browser one frame to commit layout
- If using Google Fonts CDN, add `<link rel="preconnect">` to speed up first load

## 7. Recording Preparation - Leave Hooks for Video Export

**Pitfall**: Playwright `recordVideo` defaults to 25fps and starts recording from context creation. The first 2 seconds of page loading and font loading were all captured. Final delivery video had 2 seconds of blank/flashing white at the front.

**Rule**:
- Provide a `render-video.js` tool to handle this: warmup navigate -> reload restart animation -> wait duration -> ffmpeg trim head + convert to H.264 MP4
- Animation **frame 0** must already be the complete initial layout (not blank or loading)
- Want 60fps? Use ffmpeg `minterpolate` in post-processing. Do not expect browser source frame rate to do it
- Want GIF? Use two-stage palette (`palettegen` + `paletteuse`) — for a 30s 1080p animation this can compress to 3MB

See `video-export.md` for the full script invocation.

## 8. Batch Export - tmp Directory Must Include PID to Prevent Parallel Conflicts

**Pitfall**: used `render-video.js` to record 3 HTML files in parallel with 3 processes. Because `TMP_DIR` was named only with `Date.now()`, 3 processes starting in the same millisecond shared one tmp directory. The first process to finish cleaned it up, the other two got `ENOENT` when reading it, and the whole batch crashed.

**Rule**:
- Any temporary directory that may be shared across multiple processes must include **PID or a random suffix** in its name:
  ```js
  const TMP_DIR = path.join(DIR, '.video-tmp-' + Date.now() + '-' + process.pid);
  ```
- If you really want multi-file parallelism, use shell `&` + `wait` instead of forking inside one node script
- For batch-recording multiple HTML files, the conservative approach is **serial** execution (2 or fewer can run in parallel, 3+ should queue)

## 9. Progress Bar / Replay Button in Recording - Chrome Elements Pollute the Video

**Pitfall**: the animation HTML included `.progress` progress bar, `.replay` replay button, and `.counter` timestamp for human playback debugging. After exporting to MP4, these elements appeared at the bottom of the video like the dev tools had been recorded into the final deliverable.

**Rule**:
- In HTML, separate "chrome elements" for humans (progress bar / replay button / footer / masthead / counter / phase labels) from the video content itself
- **Convention class name** `.no-record`: any element with this class is automatically hidden by the recording script
- Script side (`render-video.js`) should inject CSS to hide common chrome class names by default:
  ```
  .progress .counter .phases .replay .masthead .footer .no-record [data-role="chrome"]
  ```
- Inject with Playwright `addInitScript` (takes effect before each navigate, stable across reload)
- To see the original HTML with chrome, add the `--keep-chrome` flag

## 10. First Few Seconds Repeat in Recording - Warmup Frames Leak In

**Pitfall**: old `render-video.js` flow was `goto -> wait fonts 1.5s -> reload -> wait duration`. Recording began at context creation, so the warmup phase had already played part of the animation, then reload restarted from 0. The result: the first few seconds of the video were "middle of animation + cut + animation from 0 again" — strong sense of repetition.

**Rule**:
- **Warmup and Record must use separate contexts**:
  - Warmup context (no `recordVideo` option): only loads url, waits for fonts, then closes
  - Record context (with `recordVideo`): starts from a fresh state, animation records from t=0
- ffmpeg `-ss trim` can only trim a little Playwright startup latency (~0.3s), **it cannot hide warmup frames**; the source must be clean
- Closing the recording context = writing the webm file to disk. This is a Playwright constraint
- Related code pattern:
  ```js
  // Phase 1: warmup (throwaway)
  const warmupCtx = await browser.newContext({ viewport });
  const warmupPage = await warmupCtx.newPage();
  await warmupPage.goto(url, { waitUntil: 'networkidle' });
  await warmupPage.waitForTimeout(1200);
  await warmupCtx.close();

  // Phase 2: record (fresh)
  const recordCtx = await browser.newContext({ viewport, recordVideo });
  const page = await recordCtx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(DURATION * 1000);
  await page.close();
  await recordCtx.close();
  ```

## 11. Do Not Draw "Fake Chrome" Inside the Frame - Decorative Player UI Collides with Real Chrome

**Pitfall**: the animation used the `Stage` component, which already includes scrubber + timecode + pause button (these are `.no-record` chrome and are auto-hidden during export). Then an additional decorative progress bar was drawn at the bottom of the frame — `00:60 ---- CLAUDE-DESIGN / ANATOMY` — to create a "magazine page number" feeling. The result: users saw two progress bars, one from Stage controls and one decorative. Visually it fully collided and was perceived as a bug. "Why is there another progress bar inside the video?"

**Rule**:

- Stage already provides: scrubber + timecode + pause/replay controls. **Do not draw** progress indicators, current timecodes, copyright bars, chapter counters, or similar inside the frame again — they either collide with chrome or become filler slop (violating the "earn its place" principle)
- Decorative desires like "page-number feeling," "magazine feel," "bottom signature strip" are high-frequency filler AI tends to add automatically. Every appearance should trigger suspicion — does it actually communicate irreplaceable information, or is it just filling empty space?
- If you insist that some bottom strip must exist (for example, the animation theme is literally about player UI), then it must be **narratively necessary** and **visually distinct from the Stage scrubber** (different position, different form, different tonal treatment)

**Element ownership test** (every element drawn into the canvas must answer this):

| What It Belongs To | Handling |
|------------|------|
| Narrative content of a specific scene | OK, keep it |
| Global chrome (for control/debugging) | Add `.no-record` class, hide during export |
| **Neither belongs to any scene nor chrome** | **Delete it**. This is ownerless filler slop |

**Self-check (3 seconds before delivery)**: capture one static frame and ask yourself:

- Is there anything in the frame that "looks like video player UI" (horizontal progress bar, timecode, control-button shape)?
- If yes, does deleting it damage the narrative? If not, delete it.
- Is the same class of information (progress/time/signature) appearing twice? Merge it into one chrome location.

**Anti-patterns**: drawing `00:42 ---- PROJECT NAME` at the bottom, drawing a chapter counter like `CH 03 / 06` in the lower-right, drawing version number `v0.3.1` at the edge of the frame — all are fake-chrome filler.

## 12. Blank Recording Head + Offset Recording Start - The `__ready` x tick x lastTick Triple Trap

**Pitfall (A - blank head)**: exported a 60-second animation to MP4 and the first 2-3 seconds were a blank page. `ffmpeg --trim=0.3` could not cut it out.

**Pitfall (B - shifted start, real incident 2026-04-20)**: exported a 24-second video and the user's perception was "the video only starts showing the first frame at 19 seconds." In reality the animation began recording from t=5, recorded through t=24, looped back to t=0, then recorded another 5 seconds to the end — so the true start of the animation only appeared in the last 5 seconds of the video.

**Root cause** (both issues share one cause):

Playwright `recordVideo` starts writing WebM the moment `newContext()` is created. During this, Babel/React/font loading consumes L seconds (2-6s). The recording script waits for `window.__ready = true` as the anchor for "animation starts here" — that signal must be strictly paired with animation `time = 0`. Two common failure modes:

| Wrong Pattern | Symptom |
|------|------|
| `__ready` is set in `useEffect` or synchronous setup phase (before first tick) | recording script thinks animation started, but WebM is still capturing a blank page -> **blank recording head** |
| tick's `lastTick = performance.now()` is initialized at top-level script scope | font-loading L seconds gets counted into first-frame `dt`, `time` jumps instantly to L -> full recording lags by L seconds -> **shifted start** |

**✅ Correct full starter tick template** (hand-written animation must use this skeleton):

```js
// ━━━━━━ state ━━━━━━
let time = 0;
let playing = false;   // ❗ don't play by default, wait for fonts ready
let lastTick = null;   // ❗ sentinel — first tick forces dt = 0 (do not use performance.now())
const fired = new Set();

// ━━━━━━ tick ━━━━━━
function tick(now) {
  if (lastTick === null) {
    lastTick = now;
    window.__ready = true;   // ✅ pair: "recording start" and animation t=0 on the same frame
    render(0);               // render once more to ensure DOM is ready (fonts already ready here)
    requestAnimationFrame(tick);
    return;
  }
  const dt = (now - lastTick) / 1000;   // only after first tick does dt start advancing
  lastTick = now;

  if (playing) {
    let t = time + dt;
    if (t >= DURATION) {
      t = window.__recording ? DURATION - 0.001 : 0;  // don't loop during recording; keep 0.001s to preserve final frame
      if (!window.__recording) fired.clear();
    }
    time = t;
    render(time);
  }
  requestAnimationFrame(tick);
}

// ━━━━━━ boot ━━━━━━
// do not start rAF at top-level — wait for fonts to load first
document.fonts.ready.then(() => {
  render(0);                 // draw initial frame first (fonts are ready)
  playing = true;
  requestAnimationFrame(tick);  // first tick pairs __ready + t=0
});

// ━━━━━━ seek interface (for render-video defensive correction) ━━━━━━
window.__seek = (t) => { fired.clear(); time = t; lastTick = null; render(t); };
```

**Why this template is correct**:

| Part | Why It Must Be This Way |
|------|-------------|
| `lastTick = null` + first tick `return` | prevents L seconds between "script load" and first tick from being counted into animation time |
| `playing = false` by default | even if `tick` runs during font loading, time does not advance, avoiding render offset |
| `__ready` set on first tick | recording script starts timing at this moment, and the frame corresponds to real animation t=0 |
| only start tick inside `document.fonts.ready.then(...)` | avoids fallback font width measurement and first-frame font jump |
| `window.__seek` exists | allows `render-video.js` to actively correct — second line of defense |

**Corresponding defensive logic on recording-script side**:
1. `addInitScript` injects `window.__recording = true` (before page goto)
2. `waitForFunction(() => window.__ready === true)`, record that offset for ffmpeg trim
3. **Additionally**: after `__ready`, actively run `page.evaluate(() => window.__seek && window.__seek(0))` to force-reset any HTML time drift back to zero — this is the second line of defense against HTML that does not strictly follow the starter template

**Validation method**: after exporting MP4
```bash
ffmpeg -i video.mp4 -ss 0 -vframes 1 frame-0.png
ffmpeg -i video.mp4 -ss $DURATION-0.1 -vframes 1 frame-end.png
```
The first frame must be the animation's t=0 initial state (not mid-sequence, not black), and the last frame must be the final state (not some moment from a second loop).

**Reference implementation**: `assets/animations.jsx` Stage component and `scripts/render-video.js` already implement this protocol. Hand-written HTML must use the starter tick template — every line exists to prevent a real bug.

## 13. Forbid Loop During Recording - `window.__recording` Signal

**Pitfall**: animation Stage defaulted to `loop=true` (convenient in browser preview). `render-video.js` waited an extra 300ms buffer after recording duration before stopping, and that 300ms let Stage enter the next loop. When ffmpeg truncated with `-t DURATION`, the last 0.5-1s came from the next loop — the video ending suddenly jumped back to frame 1 (Scene 1), and the audience thought the video was broken.

**Root cause**: no "I am recording" handshake protocol between the recording script and the HTML. The HTML does not know it is being recorded, so it keeps looping like an interactive browser preview.

**Rule**:

1. **Recording script**: inject `window.__recording = true` in `addInitScript` (before page goto):
   ```js
   await recordCtx.addInitScript(() => { window.__recording = true; });
   ```

2. **Stage component**: detect that signal and force loop=false:
   ```js
   const effectiveLoop = (typeof window !== 'undefined' && window.__recording) ? false : loop;
   // ...
   if (next >= duration) return effectiveLoop ? 0 : duration - 0.001;
   //                                                       ↑ keep 0.001 so Sprite end=duration is not shut off
   ```

3. **Ending Sprite fadeOut**: in recording scenarios it should be `fadeOut={0}`, otherwise the video end will fade to transparent/dark — users expect the video to stop on a clear final frame, not fade away. For hand-written HTML, ending Sprites should generally use `fadeOut={0}`.

**Reference implementation**: `assets/animations.jsx` Stage and `scripts/render-video.js` already include this handshake. Hand-written Stage must implement `__recording` detection — otherwise this pitfall is guaranteed.

**Validation**: after exporting MP4, run `ffmpeg -ss 19.8 -i video.mp4 -frames:v 1 end.png` and check whether the last 0.2 seconds still show the expected final frame, with no sudden jump to another scene.

## 14. Default 60fps Video Should Use Frame Duplication - minterpolate Has Poor Compatibility

**Pitfall**: `convert-formats.sh` used `minterpolate=fps=60:mi_mode=mci...` to generate 60fps MP4, but on some versions of macOS QuickTime / Safari the file would not open at all (black screen or outright refusal). VLC / Chrome could open it.

**Root cause**: the H.264 elementary stream output by minterpolate includes SEI / SPS fields that some players parse incorrectly.

**Rule**:

- By default, 60fps should use simple `fps=60` filter (frame duplication), which has broad compatibility (QuickTime/Safari/Chrome/VLC all work)
- High-quality interpolation should be explicitly enabled with `--minterpolate` — but **must be tested locally** on the target player before delivery
- The main value of the 60fps tag is **platform algorithm recognition** (Bilibili / YouTube will prioritize higher stream quality for 60fps labels). The perceptual smoothness improvement for CSS animation is modest
- Add `-profile:v high -level 4.0` to improve general H.264 compatibility

**`convert-formats.sh` has already been changed to compatibility mode by default**. If you need higher-quality interpolation, add the `--minterpolate` flag:
```bash
bash convert-formats.sh input.mp4 --minterpolate
```

## 15. `file://` + External `.jsx` CORS Trap - Single-File Delivery Must Inline the Engine

**Pitfall**: animation HTML used `<script type="text/babel" src="animations.jsx"></script>` to load the engine externally. Double-clicking locally (`file://` protocol) made Babel Standalone fetch the `.jsx` via XHR, then Chrome threw `Cross origin requests are only supported for protocol schemes: http, https, chrome, chrome-extension...`, and the whole page went black. It did not raise `pageerror`, only a console error, so it was easy to misdiagnose as "animation didn't trigger."

Starting an HTTP server might not even save it — on machines with a global proxy, `localhost` may also go through the proxy and return 502 / connection failure.

**Rule**:

- **Single-file delivery (double-click open and use HTML)** -> `animations.jsx` must be **inlined** into a `<script type="text/babel">...</script>` tag, not loaded with `src="animations.jsx"`
- **Multi-file project (served over HTTP)** -> external loading is fine, but delivery must clearly specify `python3 -m http.server 8000`
- Decision rule: is the user being delivered an "HTML file" or a "project directory with a server"? The former must inline
- Stage component / `animations.jsx` often runs 200+ lines — putting it directly into the HTML `<script>` block is completely acceptable. Do not fear the size

**Minimum validation**: double-click the generated HTML. Do **not** open it through any server. If the Stage renders the animation's first frame correctly, it passes.

## 16. Cross-Scene Inverted Color Context - In-Frame Elements Must Not Hardcode Color

**Pitfall**: in a multi-scene animation, cross-scene elements like `ChapterLabel` / `SceneNumber` / `Watermark` hardcoded `color: '#1A1A1A'` (dark text) inside the component. The first 4 scenes had light backgrounds so it worked fine. In scene 5 with a black background, the "05" and watermark disappeared completely — no error, no check triggered, but critical information became invisible.

**Rule**:

- **In-frame elements reused across multiple scenes** (chapter labels / scene numbers / timecodes / watermarks / copyright strips) must **never hardcode color values**
- Use one of these three approaches instead:
  1. **`currentColor` inheritance**: element only uses `color: currentColor`, parent scene container sets `color` to computed value
  2. **invert prop**: component accepts `<ChapterLabel invert />` to switch light/dark manually
  3. **Auto-compute from background**: `color: contrast-color(var(--scene-bg))` (CSS 4 new API, or JS fallback)
- Before delivery, use Playwright to capture **representative frames from every scene** and manually inspect whether all cross-scene elements remain visible

This pitfall is insidious because **there is no bug alert**. Only human eyes or OCR will catch it.

## Quick Self-Check Checklist (5 Seconds Before Starting)

- [ ] Every parent of `position: absolute` has `position: relative`?
- [ ] All special characters in the animation (`␣`, `⌘`, emoji) exist in the font?
- [ ] Grid/Flex template counts match JS data length?
- [ ] Cross-scene transitions use cross-fade, with no >0.3s blank gap?
- [ ] DOM measurement code is wrapped in `document.fonts.ready.then()`?
- [ ] `render(t)` is pure, or has an explicit reset mechanism?
- [ ] Frame 0 is a complete initial state, not blank?
- [ ] There is no "fake chrome" decoration inside the frame (progress bar/timecode/bottom signature strip colliding with Stage scrubber)?
- [ ] Does the animation tick set `window.__ready = true` on the first frame? (use built-in `animations.jsx`; add manually for hand-written HTML)
- [ ] Does Stage detect `window.__recording` and force loop=false? (mandatory for hand-written HTML)
- [ ] Is ending Sprite `fadeOut` set to 0 (video ends on a clear frame)?
- [ ] Does 60fps MP4 default to frame duplication mode (compatibility), with `--minterpolate` only for high-quality interpolation?
- [ ] After export, did you extract frame 0 + final frame to verify they match the animation's initial/final states?
- [ ] If a specific brand is involved (Stripe/Anthropic/Lovart/...): did you complete the "brand asset protocol" (SKILL.md §1.a five steps)? Did you write `brand-spec.md`?
- [ ] For single-file HTML delivery: is `animations.jsx` inlined instead of `src="..."`? (external `.jsx` under `file://` causes a CORS black screen)
- [ ] Cross-scene elements (chapter labels/watermarks/scene numbers) do not hardcode color and stay visible on every scene background?
