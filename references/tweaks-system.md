# Tweaks: Real-Time Parameter Tuning for Design Variants

Tweaks are a core capability in this skill — they let users switch variations or adjust parameters in real time without editing code.

**Cross-environment compatibility**: This skill uses a **pure frontend localStorage approach** — state survives refreshes, and persistence happens in browser localStorage rather than source files. This works in any agent environment.

## When to Add Tweaks

- The user explicitly asks for "tunable parameters" or "multiple version switching"
- The design has multiple variations that need side-by-side comparison
- The user didn't ask, but you judge that **adding a few insightful tweaks helps the user see the space of possibilities**

Default recommendation: **Add 2-3 tweaks to every design** (color theme / font size / layout variant) even if the user didn't ask — showing the possibility space is part of the design service.

## Implementation (Pure Frontend Version)

### Basic Structure

```jsx
const TWEAK_DEFAULTS = {
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
};

function useTweaks() {
  const [tweaks, setTweaks] = React.useState(() => {
    try {
      const stored = localStorage.getItem('design-tweaks');
      return stored ? { ...TWEAK_DEFAULTS, ...JSON.parse(stored) } : TWEAK_DEFAULTS;
    } catch {
      return TWEAK_DEFAULTS;
    }
  });

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    try {
      localStorage.setItem('design-tweaks', JSON.stringify(next));
    } catch {}
  };

  const reset = () => {
    setTweaks(TWEAK_DEFAULTS);
    try {
      localStorage.removeItem('design-tweaks');
    } catch {}
  };

  return { tweaks, update, reset };
}
```

### Tweaks Panel UI

Floating panel in the lower-right corner. Collapsible:

```jsx
function TweaksPanel() {
  const { tweaks, update, reset } = useTweaks();
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
    }}>
      {open ? (
        <div style={{
          background: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          width: 280,
          fontFamily: 'system-ui',
          fontSize: 13,
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <strong>Tweaks</strong>
            <button onClick={() => setOpen(false)} style={{
              border: 'none', background: 'none', cursor: 'pointer', fontSize: 16,
            }}>×</button>
          </div>

          {/* Color */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Primary color</div>
            <input 
              type="color" 
              value={tweaks.primaryColor} 
              onChange={e => update({ primaryColor: e.target.value })}
              style={{ width: '100%', height: 32 }}
            />
          </label>

          {/* Font size slider */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Font size ({tweaks.fontSize}px)</div>
            <input 
              type="range" 
              min={12} max={24} step={1}
              value={tweaks.fontSize}
              onChange={e => update({ fontSize: +e.target.value })}
              style={{ width: '100%' }}
            />
          </label>

          {/* Density options */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Density</div>
            <select 
              value={tweaks.density}
              onChange={e => update({ density: e.target.value })}
              style={{ width: '100%', padding: 6 }}
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </label>

          {/* Dark mode toggle */}
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            <input 
              type="checkbox" 
              checked={tweaks.dark}
              onChange={e => update({ dark: e.target.checked })}
            />
            <span>Dark mode</span>
          </label>

          <button onClick={reset} style={{
            width: '100%',
            padding: '8px 12px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}>Reset</button>
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          style={{
            background: '#1A1A1A',
            color: 'white',
            border: 'none',
            borderRadius: 999,
            padding: '10px 16px',
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >⚙ Tweaks</button>
      )}
    </div>
  );
}
```

### Applying Tweaks

Use Tweaks in the main component:

```jsx
function App() {
  const { tweaks } = useTweaks();

  return (
    <div style={{
      '--primary': tweaks.primaryColor,
      '--font-size': `${tweaks.fontSize}px`,
      background: tweaks.dark ? '#0A0A0A' : '#FAFAFA',
      color: tweaks.dark ? '#FAFAFA' : '#1A1A1A',
    }}>
      {/* Your content */}
      <TweaksPanel />
    </div>
  );
}
```

Use variables in CSS:

```css
button.cta {
  background: var(--primary);
  color: white;
  font-size: var(--font-size);
}
```

## Typical Tweak Options

What tweaks to add for different design types:

### General
- Primary color (color picker)
- Font size (slider 12-24px)
- Typeface (select: display font vs body font)
- Dark mode (toggle)

### Slide decks
- Theme (light/dark/brand)
- Background style (solid/gradient/image)
- Typeface contrast (more decorative vs more restrained)
- Information density (minimal/standard/dense)

### Product prototypes
- Layout variants (layout A / B / C)
- Interaction speed (animation speed 0.5x-2x)
- Data volume (mock item count 5/20/100)
- State (empty/loading/success/error)

### Animation
- Speed (0.5x-2x)
- Looping (once/loop/ping-pong)
- Easing (linear/easeOut/spring)

### Landing pages
- Hero style (image/gradient/pattern/solid)
- CTA copy (several variants)
- Structure (single column / two column / sidebar)

## Tweak Design Principles

### 1. Meaningful options, not busywork

Every tweak must expose **real design options**. Don't add tweaks no one would actually switch to (for example, a border-radius 0-50px slider where every middle value looks bad).

Good tweaks expose **discrete, thoughtful variations**:
- "Corner style": none / slight rounding / heavy rounding (three options)
- Not: "Corner radius": 0-50px slider

### 2. Less is more

A Tweaks panel should have **at most 5-6 options**. Beyond that it becomes a configuration page and loses the purpose of quickly exploring variations.

### 3. Default value = finished design

Tweaks are **a bonus layer**. The default values must already represent a complete, publishable design. What the user sees with the Tweaks panel closed is the deliverable.

### 4. Group logically

When there are many options, show grouped sections:

```
---- Visual ----
Primary color | Font size | Dark mode

---- Layout ----
Density | Sidebar position

---- Content ----
Visible data volume | State
```

## Forward-Compatible with Source-Level Persistent Hosts

If later you want to upload the design to an environment that supports source-level tweaks persistence (such as Claude.ai Artifacts), keep the **EDITMODE marker block**:

```jsx
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
}/*EDITMODE-END*/;
```

In the localStorage approach, the marker block **does nothing** (it's just a normal comment), but in a host that supports source write-back it will be read to enable source-level persistence. Adding it is harmless in the current environment while preserving forward compatibility.

## Common Issues

**Tweaks panel blocks design content**
→ Make it closable. Default to closed, show a small button, expand only when the user clicks.

**User has to reconfigure tweaks after switching/reloading**
→ Already handled with localStorage. If it doesn't persist after refresh, check whether localStorage is available (private/incognito mode may fail, so wrap in try/catch).

**Multiple HTML pages need to share tweaks**
→ Add the project name to the localStorage key: `design-tweaks-[projectName]`.

**I want relationships between tweaks**
→ Add logic in `update`:

```jsx
const update = (patch) => {
  let next = { ...tweaks, ...patch };
  // Linked behavior: when dark mode is selected, auto-switch text color
  if (patch.dark === true && !patch.textColor) {
    next.textColor = '#F0EEE6';
  }
  setTweaks(next);
  localStorage.setItem(...);
};
```
