# Daddu Charger – Design System

**Version:** 1.0  
**Last updated:** 2026-09-19  
**Status:** ACTIVE — all styling decisions must reference this document

---

## PHILOSOPHY

The Daddu Charger design system is built on three visual principles:

1. **Darkness as negative space** — not decoration
2. **Precision over decoration** — clean geometry, intentional accents
3. **Energy through restraint** — the accent color lands harder when used sparingly

The brand visual language should evoke: precision-machined hardware, a high-end enthusiast rig, performance engineering, and Pakistan's premium gaming culture.

---

## COLOR PALETTE

### Background Scale (dark foundation)
```css
--dc-bg: #080808;           /* True base – deepest surface */
--dc-bg-elevated: #0E0E0E;  /* Slightly lifted – cards on base */
--dc-surface: #141414;      /* Primary surface level */
--dc-surface-2: #1C1C1C;    /* Elevated surface, modals */
--dc-surface-3: #242424;    /* Hover states, active surfaces */
```

### Text Scale
```css
--dc-text: #F2F2ED;         /* Primary text – warm white */
--dc-text-muted: #A0A09B;   /* Secondary text – reduced emphasis */
--dc-text-subtle: #6B6B66;  /* Tertiary – timestamps, labels */
--dc-text-inverse: #080808; /* Text on accent backgrounds */
```

### Border Scale
```css
--dc-border: rgba(255, 255, 255, 0.08);   /* Default dividers */
--dc-border-strong: rgba(255, 255, 255, 0.16); /* Emphasized borders */
--dc-border-accent: rgba(200, 255, 0, 0.3);    /* Accent-tinted borders */
```

### Primary Accent — Volt Green (use sparingly)
```css
--dc-accent: #C8FF00;            /* Primary CTA, highlights */
--dc-accent-hover: #D6FF2A;      /* Hover state */
--dc-accent-dim: rgba(200, 255, 0, 0.15); /* Subtle accent glow */
--dc-accent-text: #080808;       /* Text on accent backgrounds */
```

Volt green communicates: **charge, energy, performance, electric**. It is the visual equivalent of a LED power indicator on a premium rig.

### Secondary Accent — Ember Orange (use very sparingly)
```css
--dc-accent-2: #FF6A1A;          /* Secondary CTAs, warnings, sale badges */
--dc-accent-2-hover: #FF8040;    /* Hover state */
--dc-accent-2-dim: rgba(255, 106, 26, 0.15); /* Subtle */
```

Ember orange communicates: **urgency, heat, sale events, performance push**.

### Status Colors
```css
--dc-success: #22C55E;
--dc-warning: #F59E0B;
--dc-error: #EF4444;
--dc-info: #3B82F6;
```

### Special Surfaces
```css
--dc-card: #111111;             /* Standard product card */
--dc-card-hover: #161616;       /* Card on hover */
--dc-overlay: rgba(8, 8, 8, 0.85); /* Modal/drawer overlay */
--dc-scrim: rgba(8, 8, 8, 0.95);   /* Full-screen overlay */
```

---

## TYPOGRAPHY

### Font Families
```css
--dc-font-display: 'Space Grotesk', sans-serif;  /* Headlines, hero text */
--dc-font-body: 'Inter', sans-serif;             /* Body text, UI labels */
--dc-font-mono: 'JetBrains Mono', monospace;     /* Specs, code, technical */
```

**Space Grotesk** — chosen for its geometric confidence, slightly humanist warmth, and strong uppercase presence. It reads as tech-forward without being clinical.

**Inter** — exceptional legibility at small sizes, variable font for fine weight control, universally trusted for UI.

### Type Scale (fluid with clamp)
```css
/* Display sizes – for hero headlines */
--dc-text-display-2xl: clamp(4rem, 10vw, 9rem);   /* Hero mega headline */
--dc-text-display-xl: clamp(3rem, 7vw, 6.5rem);    /* Section headline */
--dc-text-display-lg: clamp(2.25rem, 5vw, 4.5rem); /* Sub-section head */
--dc-text-display-md: clamp(1.75rem, 3.5vw, 3rem); /* Card headline */

/* UI sizes – for body, labels, buttons */
--dc-text-xl: 1.25rem;    /* Large body */
--dc-text-lg: 1.125rem;   /* Body lead */
--dc-text-base: 1rem;     /* Body */
--dc-text-sm: 0.875rem;   /* Small body, labels */
--dc-text-xs: 0.75rem;    /* Captions, meta */
--dc-text-2xs: 0.6875rem; /* Tags, badges */
```

### Font Weights
```css
--dc-weight-regular: 400;
--dc-weight-medium: 500;
--dc-weight-semibold: 600;
--dc-weight-bold: 700;
--dc-weight-extrabold: 800;
```

### Line Heights
```css
--dc-leading-tight: 1.1;     /* Display headlines */
--dc-leading-snug: 1.25;     /* Section headlines */
--dc-leading-normal: 1.5;    /* Body text */
--dc-leading-relaxed: 1.75;  /* Long-form content */
```

### Letter Spacing
```css
--dc-tracking-tighter: -0.04em; /* Large display headings */
--dc-tracking-tight: -0.02em;   /* Medium headings */
--dc-tracking-normal: 0em;      /* Body */
--dc-tracking-wide: 0.05em;     /* Small caps, labels, eyebrows */
--dc-tracking-wider: 0.1em;     /* Category labels in uppercase */
```

---

## SPACING

Using TailwindCSS v4 default spacing scale with these semantic tokens:

```css
--dc-space-section-desktop: 120px;  /* Between major sections */
--dc-space-section-tablet: 80px;    /* Between sections on tablet */
--dc-space-section-mobile: 56px;    /* Between sections on mobile */

--dc-space-block: 40px;    /* Internal block padding */
--dc-space-card: 24px;     /* Card internal padding */
--dc-space-tight: 16px;    /* Tight groups */
--dc-space-micro: 8px;     /* Small gaps */
```

---

## LAYOUT & GRID

### Containers
```css
--dc-container: 1440px;      /* Primary max-width */
--dc-container-wide: 1600px; /* Wide content (featured sections) */
--dc-container-narrow: 768px; /* Text-heavy content */

/* Horizontal padding */
--dc-gutter: clamp(1rem, 5vw, 5rem); /* Responsive gutter */
```

### Grid
- Desktop: 12 columns, 24px gap
- Tablet: 8 columns, 16px gap
- Mobile: 4 columns, 16px gap

---

## BORDER RADIUS

```css
--dc-radius-sm: 4px;    /* Tags, badges */
--dc-radius-md: 8px;    /* Buttons, inputs */
--dc-radius-lg: 12px;   /* Cards */
--dc-radius-xl: 16px;   /* Large cards, panels */
--dc-radius-2xl: 24px;  /* Feature cards */
--dc-radius-full: 9999px; /* Pills, circular elements */
```

---

## SHADOWS

```css
--dc-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
--dc-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.6);
--dc-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.7);
--dc-shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.8);
--dc-shadow-accent: 0 0 24px rgba(200, 255, 0, 0.2); /* Volt glow */
--dc-shadow-accent-strong: 0 0 48px rgba(200, 255, 0, 0.4);
```

---

## Z-INDEX SCALE

```css
--dc-z-base: 0;
--dc-z-raised: 10;
--dc-z-dropdown: 100;
--dc-z-sticky: 200;
--dc-z-overlay: 300;
--dc-z-modal: 400;
--dc-z-toast: 500;
--dc-z-cursor: 600;
```

---

## MOTION SYSTEM

### Easing Functions
```css
--dc-ease-linear: linear;
--dc-ease-out: cubic-bezier(0.22, 1, 0.36, 1);      /* Primary exit */
--dc-ease-in: cubic-bezier(0.64, 0, 0.78, 0);       /* Primary enter */
--dc-ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);   /* Symmetric */
--dc-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Elastic feel */
--dc-ease-premium: cubic-bezier(0.22, 1, 0.36, 1);  /* "Expo out" - premium feel */
```

### Duration Tokens
```css
--dc-duration-instant: 80ms;    /* Micro interactions (checkbox, toggle) */
--dc-duration-fast: 180ms;      /* Button hover, color transitions */
--dc-duration-normal: 320ms;    /* Panel open, drawer, transitions */
--dc-duration-slow: 500ms;      /* Page reveals, card enters */
--dc-duration-slower: 700ms;    /* Hero sequence, large reveals */
--dc-duration-cinematic: 1000ms; /* Cinematic sequences only */
```

### Motion Principles
1. **Enter:** Use `ease-out` (starts fast, decelerates naturally)
2. **Exit:** Use `ease-in` (starts slow, accelerates to disappear)
3. **Hover:** `180ms ease-out` for color/scale changes
4. **Reveals on scroll:** `700ms ease-out` staggered by 80ms per element
5. **Page transitions:** `500ms ease-out`

---

## BUTTON SYSTEM

### Primary Button (Volt Green)
```
Background: #C8FF00
Text: #080808
Weight: 600
Hover: scale(1.02) + brightness(1.1)
```

### Secondary Button (Outlined)
```
Border: 1px solid rgba(255,255,255,0.2)
Text: #F2F2ED
Hover: border-color #C8FF00, text #C8FF00
```

### Ghost Button
```
Background: transparent
Text: #F2F2ED
Hover: background rgba(255,255,255,0.05)
```

### Danger / Sale
```
Background: #FF6A1A
Text: #080808
```

---

## BREAKPOINTS

```
xs:   360px    (small phones)
sm:   390px    (iPhone 15 Pro)
md:   768px    (tablets)
lg:   1024px   (laptop)
xl:   1280px   (desktop)
2xl:  1440px   (large desktop)
3xl:  1600px   (ultra-wide)
```

---

## BRAND IDENTITY NOTES

- **Do not** use bright full-saturation RGB colors across multiple elements simultaneously
- **Do not** apply volt green to headings, body text, or decorative elements routinely
- **Do** use volt green as a laser-precise accent on: primary CTAs, active states, key differentiators
- **Do** use ember orange for: sale events, secondary actions, urgency signals
- Volt green on `#080808` background has ~13:1 contrast ratio — excellent accessibility
- Dark surfaces must have sufficient contrast against `#141414` cards

---

## DESIGN DECISION LOG

| Decision | Rationale |
|---|---|
| Volt green `#C8FF00` over `#D7FF3F` | Slightly deeper saturation — less yellow, more electric. Better contrast on near-black. |
| Space Grotesk over General Sans | Freely licensed, available via Google Fonts, similar geometric personality |
| Inter over Jost (current site) | Significantly better legibility, variable font, widely trusted |
| Container max 1440px | Keeps editorial feel on ultra-wide without feeling stretched |
| Dark-first design | Enforces premium feel; hardware product photography looks better on dark backgrounds |
