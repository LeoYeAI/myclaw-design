#!/usr/bin/env node
/**
 * render-seekable.js — Seekable frame-accurate HTML → MP4 renderer
 *
 * Design inspired by HyperFrames' seek protocol. Instead of recording a
 * wall-clock video (Playwright recordVideo), this renderer:
 *   1. Loads the HTML page
 *   2. Waits for window.__hf (or window.__ready as fallback)
 *   3. For each frame: seek(time) → screenshot → pipe to ffmpeg
 *
 * Benefits over render-video.js:
 *   - Arbitrary frame rate (30/60/120fps — no minterpolate needed)
 *   - Deterministic (same input = identical output, CI-reproducible)
 *   - No trim offset (no "black frames at start" problem)
 *   - Frame-accurate audio sync (audio mixed separately, muxed at end)
 *
 * Audio: Parses <audio data-start="..." data-volume="..."> from the HTML
 * and auto-mixes with ffmpeg. No more hand-writing N-input adelay chains.
 *
 * Supports both Puppeteer (preferred) and Playwright (fallback).
 *
 * Requirements: puppeteer or playwright, ffmpeg, chromium/chrome
 *
 * Usage:
 *   node render-seekable.js <html-file> [options]
 *   Options:
 *     --duration=40    Animation duration (seconds). Auto-detected from __hf.duration if available.
 *     --fps=30         Frame rate (default: 30)
 *     --width=1920     Width (default: 1920)
 *     --height=1080    Height (default: 1080)
 *     --quality=90     JPEG quality 1-100 (default: 90)
 *     --format=jpeg    jpeg or png (default: jpeg)
 *     --no-audio       Skip audio mixing
 *     --audio-gain=1.0 Master audio gain (default: 1.0)
 *     --keep-chrome    Don't hide Stage controls
 */

const path = require('path');
const fs = require('fs');
const { spawn, spawnSync } = require('child_process');

// ── Arg parsing ────────────────────────────────────────────────────────────
function arg(name, def) {
  const p = process.argv.find(a => a.startsWith('--' + name + '='));
  return p ? p.slice(name.length + 3) : def;
}
function hasFlag(name) { return process.argv.includes('--' + name); }

const HTML_FILE = process.argv[2];
if (!HTML_FILE || HTML_FILE.startsWith('--')) {
  console.error('Usage: node render-seekable.js <html-file> [--fps=30] [--duration=40] ...');
  process.exit(1);
}

const FPS       = parseInt(arg('fps', '30'));
const WIDTH     = parseInt(arg('width', '1920'));
const HEIGHT    = parseInt(arg('height', '1080'));
const QUALITY   = parseInt(arg('quality', '90'));
const FORMAT    = arg('format', 'jpeg');
const NO_AUDIO  = hasFlag('no-audio');
const AUDIO_GAIN = parseFloat(arg('audio-gain', '1.0'));
const KEEP_CHROME = hasFlag('keep-chrome');
const DURATION_OVERRIDE = arg('duration', null);

const HTML_ABS  = path.resolve(HTML_FILE);
const BASENAME  = path.basename(HTML_FILE, path.extname(HTML_FILE));
const DIR       = path.dirname(HTML_ABS);
const MP4_OUT   = path.join(DIR, BASENAME + '.mp4');

// ── Resolve browser driver ─────────────────────────────────────────────────
let DRIVER, driverMod;
function tryRequire(...names) {
  for (const n of names) {
    try { return require(n); } catch {}
  }
  // Try local node_modules
  const local = path.join(DIR, 'node_modules');
  for (const n of names) {
    try { return require(path.join(local, n)); } catch {}
  }
  return null;
}

driverMod = tryRequire('puppeteer', 'puppeteer-core');
if (driverMod) {
  DRIVER = 'puppeteer';
} else {
  driverMod = tryRequire('playwright');
  if (driverMod) {
    DRIVER = 'playwright';
  } else {
    console.error('Cannot find puppeteer or playwright. Install one.');
    process.exit(1);
  }
}

// ── Chrome hide CSS ────────────────────────────────────────────────────────
const HIDE_CHROME_CSS = `
  .no-record, .progress, .progress-bar, .counter, .tCur,
  .phases, .phase-label, .phase, .replay, button.replay,
  .masthead, .kicker, .title, .footer,
  [data-role="chrome"], [data-record="hidden"] {
    display: none !important;
  }
`;

const HIDE_CHROME_JS = `(function(css) {
  function inject() {
    var s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    document.querySelectorAll('div, nav, footer').forEach(function(el) {
      var st = getComputedStyle(el);
      if (st.position !== 'fixed' && st.position !== 'sticky') return;
      var r = el.getBoundingClientRect();
      if (r.height > window.innerHeight * 0.25) return;
      if (r.bottom < window.innerHeight - 30) return;
      if (el.querySelector('button')) el.style.setProperty('display', 'none', 'important');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
  setTimeout(inject, 1000);
})`;

// ── Audio parser ───────────────────────────────────────────────────────────
function parseAudioElements(htmlContent, baseDir) {
  const elements = [];
  const audioRegex = /<audio\s[^>]*>/gi;
  let match;
  while ((match = audioRegex.exec(htmlContent)) !== null) {
    const tag = match[0];
    const getAttr = (name) => {
      const m = tag.match(new RegExp(`${name}=["']([^"']*)["']`));
      return m ? m[1] : null;
    };
    const src = getAttr('src') || getAttr('data-src');
    if (!src) continue;

    const id = getAttr('id') || `audio-${elements.length}`;
    const start = parseFloat(getAttr('data-start') || '0');
    const end = getAttr('data-end') ? parseFloat(getAttr('data-end')) : null;
    const duration = getAttr('data-duration') ? parseFloat(getAttr('data-duration')) : null;
    const volume = parseFloat(getAttr('data-volume') || '1.0');
    const mediaStart = parseFloat(getAttr('data-media-start') || '0');

    let resolvedSrc = src;
    if (!src.startsWith('/') && !src.startsWith('http')) {
      resolvedSrc = path.resolve(baseDir, src);
    }

    elements.push({ id, src: resolvedSrc, start, end, duration, volume, mediaStart });
  }
  return elements;
}

function buildAudioMixCommand(elements, totalDuration, outputPath) {
  if (elements.length === 0) return null;
  const inputs = [];
  const filterParts = [];

  elements.forEach((el, i) => {
    inputs.push('-i', el.src);
    const delayMs = Math.round(el.start * 1000);
    const dur = el.duration || (el.end ? el.end - el.start : totalDuration - el.start);
    const trimEnd = Math.min(dur, totalDuration - el.start);
    filterParts.push(
      `[${i}:a]atrim=0:${trimEnd},asetpts=PTS-STARTPTS,volume=${el.volume},adelay=${delayMs}|${delayMs},apad=whole_dur=${totalDuration}[a${i}]`
    );
  });

  const mixInputs = elements.map((_, i) => `[a${i}]`).join('');
  const mixFilter = `${mixInputs}amix=inputs=${elements.length}:duration=longest:dropout_transition=0:normalize=0[mixed]`;
  const gainFilter = `[mixed]volume=${AUDIO_GAIN}[out]`;
  const fullFilter = [...filterParts, mixFilter, gainFilter].join(';');

  return [
    ...inputs,
    '-filter_complex', fullFilter,
    '-map', '[out]',
    '-acodec', 'aac', '-b:a', '192k',
    '-t', String(totalDuration),
    '-y', outputPath,
  ];
}

// ── Main ───────────────────────────────────────────────────────────────────
console.log(`▸ Seekable render: ${HTML_FILE}`);
console.log(`  ${WIDTH}x${HEIGHT} @ ${FPS}fps · driver: ${DRIVER}`);

(async () => {
  const htmlContent = fs.readFileSync(HTML_ABS, 'utf-8');

  // ── Parse audio ────────────────────────────────────────────────────────
  const audioElements = NO_AUDIO ? [] : parseAudioElements(htmlContent, DIR);
  if (audioElements.length > 0) {
    console.log(`  audio: ${audioElements.length} track(s)`);
    audioElements.forEach(el => {
      console.log(`    ${el.id}: start=${el.start}s vol=${el.volume} src=${path.basename(el.src)}`);
    });
  }

  // ── Launch browser ─────────────────────────────────────────────────────
  let browser, page;

  if (DRIVER === 'puppeteer') {
    browser = await driverMod.launch({
      headless: 'new',
      args: [
        `--window-size=${WIDTH},${HEIGHT}`,
        '--no-sandbox', '--disable-setuid-sandbox',
        '--disable-gpu', '--disable-dev-shm-usage',
        '--force-color-profile=srgb',
      ],
    });
    page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(() => { window.__recording = true; });
    if (!KEEP_CHROME) {
      await page.evaluateOnNewDocument(new Function('css', HIDE_CHROME_JS + '(css)'), HIDE_CHROME_CSS);
    }
    await page.goto('file://' + HTML_ABS, { waitUntil: 'load', timeout: 60000 });
  } else {
    // Playwright
    const { chromium } = driverMod;
    browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    await context.addInitScript(() => { window.__recording = true; });
    if (!KEEP_CHROME) {
      await context.addInitScript(({ css, fn }) => {
        (new Function('css', fn + '(css)'))(css);
      }, { css: HIDE_CHROME_CSS, fn: HIDE_CHROME_JS });
    }
    page = await context.newPage();
    await page.goto('file://' + HTML_ABS, { waitUntil: 'load', timeout: 60000 });
  }

  // ── Wait for __hf or __ready ───────────────────────────────────────────
  let duration;
  const hfReady = await page.waitForFunction(
    () => window.__hf && typeof window.__hf.seek === 'function' && window.__hf.duration > 0,
    { timeout: 15000 }
  ).then(() => true).catch(() => false);

  if (hfReady) {
    duration = DURATION_OVERRIDE
      ? parseFloat(DURATION_OVERRIDE)
      : await page.evaluate(() => window.__hf.duration);
    console.log(`  __hf protocol: duration=${duration}s`);
  } else {
    await page.waitForFunction(() => window.__ready === true, { timeout: 15000 }).catch(() => {});
    duration = DURATION_OVERRIDE ? parseFloat(DURATION_OVERRIDE) : 30;
    console.log(`  fallback mode: duration=${duration}s`);
  }

  const totalFrames = Math.ceil(duration * FPS);
  console.log(`  frames: ${totalFrames}`);

  // ── Spawn ffmpeg for streaming encode ──────────────────────────────────
  const hasAudio = audioElements.length > 0;
  const videoTarget = hasAudio ? path.join(DIR, BASENAME + '-silent.mp4') : MP4_OUT;

  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'medium',
    '-movflags', '+faststart',
    videoTarget,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });

  let ffmpegStderr = '';
  ffmpeg.stderr.on('data', (d) => { ffmpegStderr += d.toString(); });

  // ── Frame capture loop ─────────────────────────────────────────────────
  const startMs = Date.now();
  let lastPct = -1;

  for (let i = 0; i < totalFrames; i++) {
    const time = i / FPS;

    // Seek
    if (hfReady) {
      await page.evaluate((t) => window.__hf.seek(t), time);
    } else {
      await page.evaluate((t) => {
        if (typeof window.__seek === 'function') window.__seek(t);
      }, time);
    }

    // Wait for React re-render
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

    // Screenshot
    const buf = await page.screenshot({
      type: FORMAT === 'png' ? 'png' : 'jpeg',
      quality: FORMAT === 'png' ? undefined : QUALITY,
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });

    // Pipe to ffmpeg
    const canWrite = ffmpeg.stdin.write(buf);
    if (!canWrite) {
      await new Promise(r => ffmpeg.stdin.once('drain', r));
    }

    // Progress
    const pct = Math.floor((i / totalFrames) * 100);
    if (pct !== lastPct && pct % 10 === 0) {
      const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
      const capFps = (i / (Date.now() - startMs) * 1000).toFixed(1);
      console.log(`  ${pct}% (${i}/${totalFrames}, ${capFps} cap-fps, ${elapsed}s)`);
      lastPct = pct;
    }
  }

  // Close ffmpeg
  ffmpeg.stdin.end();
  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code !== 0) reject(new Error(`ffmpeg exited ${code}: ${ffmpegStderr.slice(-500)}`));
      else resolve();
    });
  });

  await page.close();
  await browser.close();

  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
  const videoSize = (fs.statSync(videoTarget).size / 1024 / 1024).toFixed(1);
  console.log(`  video: ${videoSize} MB (${elapsed}s)`);

  // ── Audio mixing ───────────────────────────────────────────────────────
  if (hasAudio) {
    console.log(`▸ Mixing ${audioElements.length} audio track(s)...`);
    const audioOut = path.join(DIR, BASENAME + '-audio.m4a');
    const mixArgs = buildAudioMixCommand(audioElements, duration, audioOut);

    const mixResult = spawnSync('ffmpeg', mixArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
    if (mixResult.status !== 0) {
      console.error('  audio mix failed:', mixResult.stderr?.toString().slice(-500));
      fs.renameSync(videoTarget, MP4_OUT);
    } else {
      console.log(`▸ Muxing video + audio...`);
      const muxResult = spawnSync('ffmpeg', [
        '-y', '-i', videoTarget, '-i', audioOut,
        '-c:v', 'copy', '-c:a', 'copy',
        '-shortest', MP4_OUT,
      ], { stdio: ['ignore', 'ignore', 'pipe'] });

      if (muxResult.status !== 0) {
        console.error('  mux failed:', muxResult.stderr?.toString().slice(-500));
        fs.renameSync(videoTarget, MP4_OUT);
      } else {
        try { fs.unlinkSync(videoTarget); } catch {}
        try { fs.unlinkSync(audioOut); } catch {}
      }
    }
  }

  const finalSize = (fs.statSync(MP4_OUT).size / 1024 / 1024).toFixed(1);
  console.log(`✓ Done: ${MP4_OUT} (${finalSize} MB)`);
})().catch(err => {
  console.error('✗ Fatal:', err.message);
  process.exit(1);
});
