# Daddu Charger – Motion System

**Version:** 1.0  
**Last updated:** 2026-09-19

---

## MOTION PHILOSOPHY

> Motion is how the site breathes. It should feel physical, responsive, and purposeful.

Three motion modes:

| Mode | Description | Context |
|---|---|---|
| **Micro** | Sub-200ms | Button hovers, toggles, checkbox ticks |
| **Transition** | 200–500ms | Panel opens, drawer reveals, color changes |
| **Cinematic** | 500ms–1200ms | Hero sequences, page reveals, scroll storytelling |

---

## EASING REFERENCE

```js
// Primary exponential out — most common for UI
const EASE_PREMIUM = [0.22, 1, 0.36, 1]; // "Expo Out"

// Spring — for playful bounces
const EASE_SPRING = [0.34, 1.56, 0.64, 1];

// Sharp in — for exits
const EASE_IN = [0.64, 0, 0.78, 0];

// Symmetric — for toggles
const EASE_IN_OUT = [0.45, 0, 0.55, 1];
```

---

## SCROLL ANIMATIONS

### Pattern: Fade + Rise
Most common scroll reveal pattern. Elements start at `opacity: 0, translateY: 20px` and resolve to `opacity: 1, translateY: 0`.

```tsx
// Using Framer Motion
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
```

### Staggered Children
For grids and lists:

```tsx
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};
```

### Pattern: Reveal (Clip Path)
For editorial headline reveals:

```tsx
const reveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
  }
};
```

### Pattern: Counter / Number Morph
For stats sections:
- Animate numbers from 0 to target value over 1500ms
- Use `react-countup` or custom rAF implementation
- Trigger on scroll into view

---

## SMOOTH SCROLL — LENIS

```typescript
// /src/lib/hooks/useLenis.ts
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.5,
});

// Always connect to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
```

**Lenis must be connected to Framer Motion** via `useScroll` alternative — use `useTransform` with `useMotionValueEvent` not window scroll events.

---

## GSAP SCROLL TRIGGER PATTERNS

### Horizontal Scroll Section
```javascript
gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: container,
    pin: true,
    scrub: 1,
    end: () => `+=${track.scrollWidth}`
  }
});
```

### Parallax Background
```javascript
gsap.to(bgImage, {
  yPercent: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    scrub: true,
    start: 'top bottom',
    end: 'bottom top'
  }
});
```

### Text Scramble / Decode
For hero headlines — characters scramble in as text resolves:
- Use custom JS text scramble utility
- Duration: 800–1200ms
- Only trigger once on mount

---

## PAGE TRANSITIONS

```tsx
// Using Framer Motion + Next.js
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};
```

---

## REDUCED MOTION

All animation code must check `prefers-reduced-motion`:

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      animate={prefersReduced ? {} : { y: 0, opacity: 1 }}
      initial={prefersReduced ? {} : { y: 24, opacity: 0 }}
    />
  );
}
```

For CSS animations:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## HOVER INTERACTIONS

### Button hover
```css
/* Color + scale micro-animation */
transition: background-color 180ms ease-out, transform 180ms ease-out;

&:hover {
  transform: scale(1.02);
}
```

### Product card hover
```css
/* Image zoom + overlay reveal */
.card-image { transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1); }
.card:hover .card-image { transform: scale(1.04); }
```

### Navigation link hover
```css
/* Underline draw animation */
.nav-link::after {
  content: '';
  display: block;
  height: 1px;
  background: var(--dc-accent);
  width: 0;
  transition: width 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.nav-link:hover::after { width: 100%; }
```

---

## ANTI-PATTERNS (DO NOT USE)

- ❌ `animation: spin 1s linear infinite` on anything visible
- ❌ `transition: all 0.3s` (too broad, causes layout thrashing)
- ❌ CSS `filter: blur()` on scroll (GPU intensive)
- ❌ Animating `width`, `height`, `margin`, `padding`, `top`, `left`, `right`, `bottom`
- ❌ JS scroll listeners without throttling
- ❌ Stagger delays > 100ms per element in a grid of more than 4 items
- ❌ Autoplay video without `prefers-reduced-motion` check

Only animate: `transform`, `opacity`, `clip-path`, `filter: brightness/contrast/saturate`.
