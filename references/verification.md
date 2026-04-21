# Verification: Output Validation Workflow

Some native design-agent environments have built-in screenshot validation. In OpenClaw, doing it manually with Playwright covers the same verification cases.

## Verification Checklist

Every time you produce HTML, run through this checklist once:

### 1. Browser Render Check (required)

The most basic test: **does the HTML open at all**? On macOS:

```bash
open -a "Google Chrome" "/path/to/your/design.html"
```

Or use Playwright screenshots (next section).

### 2. Console Error Check

The most common issue in HTML files is JS errors causing a blank screen. Run it once with Playwright:

```bash
python scripts/verify.py path/to/design.html
```

This script will:
1. Open the HTML in headless Chromium
2. Save a screenshot into the project directory
3. Capture console errors
4. Report status

See `scripts/verify.py` for details.

### 3. Multi-Viewport Check

If it's a responsive design, capture multiple viewports:

```bash
python verify.py design.html --viewports 1920x1080,1440x900,768x1024,375x667
```

### 4. Interaction Check

Tweaks, animations, button toggles — static screenshots won't show them. **Recommended: let the user open the browser and click through it themselves**, or use Playwright to record video:

```python
page.video.record('interaction.mp4')
```

### 5. Slide-by-Slide Check for Decks

For deck-style HTML, capture slide by slide:

```bash
python verify.py deck.html --slides 10  # capture the first 10 slides
```

This generates `deck-slide-01.png`, `deck-slide-02.png`... for quick review.

## Playwright Setup

First-time setup requires:

```bash
# If not installed yet
npm install -g playwright
npx playwright install chromium

# Or Python version
pip install playwright
playwright install chromium
```

If the user already has Playwright installed globally, just use it.

## Screenshot Best Practices

### Capture Full Page

```python
page.screenshot(path='full.png', full_page=True)
```

### Capture Viewport

```python
page.screenshot(path='viewport.png')  # by default only captures visible area
```

### Capture Specific Element

```python
element = page.query_selector('.hero-section')
element.screenshot(path='hero.png')
```

### High-Resolution Screenshots

```python
page = browser.new_page(device_scale_factor=2)  # retina
```

### Wait for Animations to Settle

```python
page.wait_for_timeout(2000)  # wait 2s for animation to settle
page.screenshot(...)
```

## Sending Screenshots to the User

### Open Local Screenshot Directly

```bash
open screenshot.png
```

The user can inspect it in Preview/Figma/VSCode/browser.

### Upload to an image host and share the link

If you need to share it with remote collaborators (e.g. Slack/Feishu/WeChat), let the user use their own image-hosting tool or MCP uploader:

```bash
python upload_image.py screenshot.png
```

This returns a permanent ImgBB link that can be pasted anywhere.

## When Verification Fails

### Blank Page

There is definitely a console error. Check these first:

1. Are the React+Babel script tag integrity hashes correct (see `react-setup.md`)
2. Is there a `const styles = {...}` naming collision
3. Were cross-file components exported to `window`
4. JSX syntax error (`babel.min.js` may not report clearly; switch to unminified `babel.js`)

### Choppy Animation

- Record a session in Chrome DevTools Performance tab
- Look for layout thrashing (frequent reflow)
- Prefer `transform` and `opacity` for motion (GPU-accelerated)

### Wrong Fonts

- Check whether the `@font-face` URL is accessible
- Check fallback fonts
- Chinese fonts load slowly: show fallback first, switch after loading

### Misaligned Layout

- Check whether `box-sizing: border-box` is applied globally
- Check the `*  margin: 0; padding: 0` reset
- Turn on gridlines in Chrome DevTools to inspect the real layout

## Verification = Designer's Second Pair of Eyes

**Always review it yourself once**. AI-written code often has issues like:

- Looks correct, but interaction is broken
- Static screenshot is fine, but scroll causes misalignment
- Wide screens look good, narrow screens break
- Dark mode was never tested
- Some components don't respond after Tweaks changes

**The last 1 minute of verification can save 1 hour of rework**.

## Common Verification Script Commands

```bash
# Basic: open + screenshot + capture errors
python verify.py design.html

# Multi-viewport
python verify.py design.html --viewports 1920x1080,375x667

# Multi-slide
python verify.py deck.html --slides 10

# Output to a specified directory
python verify.py design.html --output ./screenshots/

# headless=false, open a real browser for inspection
python verify.py design.html --show
```
