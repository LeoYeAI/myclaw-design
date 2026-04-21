# Animations: Timeline Animation Engine

Read this when building animations/motion design HTML. Principles, usage, typical patterns.

## Core Pattern: Stage + Sprite

Our animation system (`assets/animations.jsx`) provides a timeline-driven engine:

- **`<Stage>`**: Container for the entire animation, auto-provides auto-scale (fit viewport) + scrubber + play/pause/loop controls
- **`<Sprite start end>`**: Time segment. A Sprite is only visible between `start` and `end`. Internally, the `useSprite()` hook reads its local progress `t` (0→1)
- **`useTime()`**: Reads the current global time (seconds)
- **`Easing.easeInOut` / `Easing.easeOut` / ...**:  Easing functions
- **`interpolate(t, from, to, easing?)`**: Interpolates based on t

This pattern is inspired by Remotion/After Effects, but lightweight and zero-dependency.

## Getting Started

```html
<script type="text/babel" src="animations.jsx"></script>
<script type="text/babel">
  const { Stage, Sprite, useTime, useSprite, Easing, interpolate } = window.Animations;

  function Title() {
    const { t } = useSprite();  // Local progress 0→1
    const opacity = interpolate(t, [0, 1], [0, 1], Easing.easeOut);
    const y = interpolate(t, [0, 1], [40, 0], Easing.easeOut);
    return (
      <h1 style={{ 
        opacity, 
        transform: `translateY(${y}px)`,
        fontSize: 120,
        fontWeight: 900,
      }}>
        Hello.
      </h1>
    );
  }

  function Scene() {
    return (
      <Stage duration={10}>  {/* 10-second animation */}
        <Sprite start={0} end={3}>
          <Title />
        </Sprite>
        <Sprite start={2} end={5}>
          <SubTitle />
        </Sprite>
        {/* ... */}
      </Stage>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Scene />);
</script>
```

## Common Animation Patterns

### 1. Fade In / Fade Out

```jsx
function FadeIn({ children }) {
  const { t } = useSprite();
  const opacity = interpolate(t, [0, 0.3], [0, 1], Easing.easeOut);
  return <div style={{ opacity }}>{children}</div>;
}
```

**Note the range**: `[0, 0.3]` means the fade-in completes during the first 30% of the sprite's time, then opacity stays at 1.

### 2. Slide In

```jsx
function SlideIn({ children, from = 'left' }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, 0.4], [0, 1], Easing.easeOut);
  const offset = (1 - progress) * 100;
  const directions = {
    left: `translateX(-${offset}px)`,
    right: `translateX(${offset}px)`,
    top: `translateY(-${offset}px)`,
    bottom: `translateY(${offset}px)`,
  };
  return (
    <div style={{
      transform: directions[from],
      opacity: progress,
    }}>
      {children}
    </div>
  );
}
```

### 3. Character-by-Character Typewriter

```jsx
function Typewriter({ text }) {
  const { t } = useSprite();
  const charCount = Math.floor(text.length * Math.min(t * 2, 1));
  return <span>{text.slice(0, charCount)}</span>;
}
```

### 4. Number Counter

```jsx
function CountUp({ from = 0, to = 100, duration = 0.6 }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, duration], [0, 1], Easing.easeOut);
  const value = Math.floor(from + (to - from) * progress);
  return <span>{value.toLocaleString()}</span>;
}
```

### 5. Segmented Explanation (Typical Educational Animation)

```jsx
function Scene() {
  return (
    <Stage duration={20}>
      {/* Phase 1: Present the problem */}
      <Sprite start={0} end={4}>
        <Problem />
      </Sprite>

      {/* Phase 2: Present the approach */}
      <Sprite start={4} end={10}>
        <Approach />
      </Sprite>

      {/* Phase 3: Present the result */}
      <Sprite start={10} end={16}>
        <Result />
      </Sprite>

      {/* Always-visible captions */}
      <Sprite start={0} end={20}>
        <Caption />
      </Sprite>
    </Stage>
  );
}
```

## Easing Functions

Preset easing curves:

| Easing | Characteristics | Use For |
|--------|----------------|---------|
| `linear` | Constant speed | Scrolling text, continuous animation |
| `easeIn` | Slow→fast | Exit/disappear |
| `easeOut` | Fast→slow | Enter/appear |
| `easeInOut` | Slow→fast→slow | Position changes |
| **`expoOut`** ⭐ | **Exponential ease-out** | **Primary easing for Anthropic-grade motion** (physical weight feel) |
| **`overshoot`** ⭐ | **Elastic bounce-back** | **Toggle / button pop / interaction emphasis** |
| `spring` | Spring | Interaction feedback, geometry settling |
| `anticipation` | Reverse then forward | Emphasizing an action |

**Default primary easing is `expoOut`** (not `easeOut`) — see `animation-best-practices.md` §2.
Enter with `expoOut`, exit with `easeIn`, toggle with `overshoot` — the foundational rules for Anthropic-grade animation.

## Pacing and Duration Guide

### Micro-interactions (0.1-0.3s)
- Button hover
- Card expand
- Tooltip appear

### UI Transitions (0.3-0.8s)
- Page transitions
- Modal appear
- List item enter

### Narrative Animations (2-10s per segment)
- One phase of a concept explanation
- Data chart reveal
- Scene transitions

### Single narrative animation segment should not exceed 10 seconds
Human attention is limited. Say one thing in 10 seconds, then move on to the next.

## Thinking Order for Designing Animations

### 1. Content/story first, animation second

**Wrong**: Think up fancy animations first, then stuff content into them
**Right**: First decide what information to convey, then use animation to serve that information

Animation is **signal**, not **decoration**. A fade-in emphasizes "this is important, look here" — if everything fades in, the signal is lost.

### 2. Write the timeline by scene

```
0:00 - 0:03   Problem appears (fade in)
0:03 - 0:06   Problem enlarges/expands (zoom+pan)
0:06 - 0:09   Solution appears (slide in from right)
0:09 - 0:12   Solution explanation (typewriter)
0:12 - 0:15   Result demo (counter up + chart reveal)
0:15 - 0:18   Summary sentence (static, read for 3s)
0:18 - 0:20   CTA or fade out
```

Write the timeline first, then write the components.

### 3. Assets first

Prepare images/icons/fonts **before** starting the animation. Don't stop mid-animation to hunt for assets — it breaks your rhythm.

## Common Issues

**Animation stuttering**
→ Mostly layout thrashing. Use `transform` and `opacity`, don't animate `top`/`left`/`width`/`height`/`margin`. Browsers GPU-accelerate `transform`.

**Animation too fast, can't read it**
→ A human needs 100-150ms to read one Chinese character, 300-500ms for a word. If you're telling a story with text, allow at least 3 seconds per sentence.

**Animation too slow, audience gets bored**
→ Interesting visual changes should be dense. Static frames beyond 5 seconds feel dull.

**Multiple animations interfering with each other**
→ Use CSS `will-change: transform` to tell the browser in advance that this element will animate, reducing reflow.

**Recording as video**
→ Use the skill's built-in toolchain (one command, three formats): see `video-export.md`
- `scripts/render-video.js` — HTML → 25fps MP4 (Playwright + ffmpeg)
- `scripts/convert-formats.sh` — 25fps MP4 → 60fps MP4 + optimized GIF
- Want more precise frame rendering? Make render(t) a pure function — see `animation-pitfalls.md` item 5

## Integration with Video Tools

This skill produces **HTML animations** (running in the browser). If the final output needs to be video material:

- **Short animations/concept demos**: Build HTML animation using these methods → screen record
- **Long videos/narratives**: This skill focuses on HTML animation; for long videos use AI video generation skills or professional video software
- **Motion graphics**: Professional After Effects/Motion Canvas is more appropriate

## About Popmotion and Similar Libraries

If you truly need physics-based animation (spring, decay, keyframes with precise timing) that our engine can't handle, you can fall back to Popmotion:

```html
<script src="https://unpkg.com/popmotion@11.0.5/dist/popmotion.min.js"></script>
```

But **try our engine first**. It's sufficient for 90% of cases.
