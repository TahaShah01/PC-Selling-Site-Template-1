# Daddu Charger – Agent Rules (AGENTS.md)

> This file is the permanent behavioral contract for all agents working on this codebase.
> Read this file before modifying any code.

---

## PROJECT OVERVIEW
Daddu Charger is a premium gaming PC hardware e-commerce website built with Next.js 16+ / React 19 / TailwindCSS v4. It is Pakistan's premier enthusiast PC hardware destination based in Rawalpindi.

**Target audience:** Gaming enthusiasts, PC builders, streamers, creators in Pakistan.
**Brand feel:** Precision · Performance · Craftsmanship · Technology · Premium Hardware

---

## RULE 1 — READ BEFORE EDITING
Before modifying any feature, inspect:
- Related components (`/src/components/`)
- Global styles (`/src/styles/`)
- Design tokens (`/src/styles/tokens.css`)
- Data models (`/src/data/` or `/src/lib/`)
- Providers/stores (`/src/providers/`)
- Utilities (`/src/lib/utils/`)
- Relevant documentation (`/docs/`)

Do NOT assume you know the current state of a file. Read it first.

---

## RULE 2 — NEVER CREATE RANDOM STYLING
No arbitrary values anywhere:
- ❌ `style={{ color: '#abc123' }}`
- ❌ `className="text-[14.7px]"`
- ❌ `margin: 37px`
- ❌ `z-index: 999`
- ❌ `duration: 0.37s`

All values must come from design tokens defined in `/src/styles/tokens.css` and the Tailwind config.

---

## RULE 3 — DESIGN SYSTEM FIRST
All visual decisions must use the centralized design system:

| Category | Token location |
|---|---|
| Colors | `--dc-*` CSS custom properties |
| Typography | `--dc-font-*` tokens + Tailwind config |
| Spacing | Tailwind spacing scale (configured) |
| Radii | `--dc-radius-*` |
| Easing | `--dc-ease-*` |
| Duration | `--dc-duration-*` |
| Shadows | `--dc-shadow-*` |
| Z-index | `--dc-z-*` |
| Breakpoints | Tailwind config breakpoints |
| Containers | `--dc-container-max` |

See `/docs/DESIGN_SYSTEM.md` for full token reference.

---

## RULE 4 — REUSE BEFORE CREATE
Before creating a new component:
1. Search `/src/components/` for an existing match
2. Search `/src/components/primitives/` for a composable primitive
3. If extending an existing component, prefer composition

Never duplicate components.

---

## RULE 5 — NO MONOLITHIC PAGES
Large pages must be composed of clearly named semantic components:
- `HeroSection`
- `FeaturedBuilds`
- `CategoryGrid`
- etc.

No page file should exceed ~200 lines of JSX without strong justification.

---

## RULE 6 — DATA ≠ UI
Product data, category data, and business information must NOT be hardcoded inside JSX repeatedly.

- Static product/category data → `/src/data/*.ts`
- Business info (address, phone, hours) → `/src/data/business.ts`
- Navigation structure → `/src/data/navigation.ts`

---

## RULE 7 — MOTION MUST HAVE PURPOSE
Animation is a communication tool, not decoration.

Animation should:
- Establish visual hierarchy
- Explain spatial relationships
- Improve navigation clarity
- Create rhythm and pacing
- Make interactions feel physical

Never add animation purely because it looks impressive.

---

## RULE 8 — NEVER SACRIFICE UX FOR MOTION
- Buttons must remain instantly clickable
- Text must remain readable during transitions
- Scroll must remain user-controlled at all times
- Commerce actions (Add to Cart, Checkout) must never be delayed by animation

If motion impedes usability → reduce or remove it.

---

## RULE 9 — PERFORMANCE IS PART OF DESIGN
Forbidden without explicit justification:
- Unoptimized images (use `next/image` with proper `sizes`)
- Autoplay video in hero without user consent and a `prefers-reduced-motion` check
- Scroll listeners that trigger layout
- Expensive CSS filters during scroll (`blur`, `backdrop-filter` on animated elements)
- Importing 3D libraries on pages that don't need them
- Large client components where Server Components suffice

Use `transform` and `opacity` for animations — they are GPU-composited.

---

## RULE 10 — MOBILE IS NOT A SHRUNK DESKTOP
Mobile must be designed, not auto-shrunk:
- Navigation becomes a drawer
- PC Builder becomes step-based
- Horizontal carousels become swipeable
- Heavy parallax becomes subtle opacity transitions
- Large typography scales down gracefully via `clamp()`

Test at: 360px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1600px+.

---

## RULE 11 — ACCESSIBILITY
Minimum WCAG AA:
- All interactive elements keyboard-navigable with visible focus
- Semantic HTML structure (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`)
- All images have descriptive `alt` text
- Form fields have associated `<label>` elements
- Dialogs/drawers trap focus correctly and close on Escape
- Color contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text

---

## RULE 12 — REDUCED MOTION
Every animation must have a `prefers-reduced-motion` alternative:

```css
@media (prefers-reduced-motion: reduce) {
  /* replace with opacity fade or remove entirely */
}
```

GSAP animations must check `window.matchMedia('(prefers-reduced-motion: reduce)')`.

---

## RULE 13 — DO NOT FABRICATE BUSINESS CLAIMS
NEVER invent:
- Customer reviews or testimonials (unless explicitly provided)
- Sales numbers or awards
- Warranty terms different from audited data
- Discounts not confirmed by the client
- Product specifications not verified
- Availability claims for out-of-stock items

Use real audited data from `/src/data/` or mark with `[PLACEHOLDER - CONFIRM WITH CLIENT]`.

---

## RULE 14 — DO NOT BREAK WORKING LOGIC FOR VISUAL POLISH
Architecture integrity > visual polish.
If fixing a visual issue would break existing functionality, document the conflict first.

---

## RULE 15 — TEST AFTER MATERIAL CHANGES
After any significant change, run:
```bash
npm run lint
npx tsc --noEmit
npm run build
```

Fix all introduced errors before moving on.

---

## TECHNOLOGY STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Styling | TailwindCSS v4 + CSS Custom Properties |
| Fonts | Space Grotesk (display) + Inter (UI) via next/font/google |
| Animation | Framer Motion + GSAP + ScrollTrigger (lazy-loaded) |
| Smooth Scroll | Lenis |
| State | React Context + Zustand (for cart/wishlist) |
| Data | Static JSON + Shopify Storefront API (future) |
| Images | next/image |
| Icons | Custom SVG + Lucide React |
| Lint | ESLint (eslint-config-next) |

---

## DIRECTORY STRUCTURE

```
src/
  app/              # Next.js App Router pages
  components/
    layout/         # Header, Footer, Navigation
    primitives/     # Button, Badge, Price, Container...
    sections/       # HomepageHero, FeaturedBuilds...
    shop/           # ProductCard, FilterPanel...
    builder/        # PC Builder components
  data/             # Static data files
  lib/
    utils/          # cn(), formatPrice(), etc.
    hooks/          # useScrollProgress, useLenis...
    motion/         # Animation utilities
    compatibility/  # PC Builder compatibility engine
  styles/
    tokens.css      # CSS Custom Properties
  providers/        # CartProvider, WishlistProvider...
  types/            # TypeScript type definitions
```

---

## CONTACT / CONFLICT LOG
See `/docs/SITE_AUDIT.md` → section: **CONTENT CONFLICTS REQUIRING CLIENT CONFIRMATION**

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
