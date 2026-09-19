# Daddu Charger – Route Map

**Version:** 1.0  
**Last updated:** 2026-09-19

---

## PRIMARY ROUTES

### Core
| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Primary landing + storytelling |
| `/shop` | All Products | Full catalog with filtering |
| `/shop/[slug]` | Product Detail | Individual product page |
| `/categories` | Category Hub | Category discovery grid |
| `/latest` | Latest Arrivals | New products |
| `/sale` | Promotions | Current deals and offers |
| `/build-pc` | PC Builder | Interactive custom PC configurator |

### Gaming PCs
| Route | Page |
|---|---|
| `/gaming-pcs` | All Gaming PCs |

### Components
| Route | Page |
|---|---|
| `/components/processors` | Processors (CPUs) |
| `/components/motherboards` | Motherboards |
| `/components/graphics-cards` | Graphics Cards |
| `/components/used-graphics-cards` | Used Graphics Cards |
| `/components/ram` | RAM / Memory |
| `/components/storage` | Storage (NVMe, SSD, HDD) |
| `/components/power-supplies` | Power Supply Units |
| `/components/cooling` | Cooling (Air + Liquid, merged) |

### Peripherals & Accessories
| Route | Page |
|---|---|
| `/gaming/monitors` | Gaming Monitors |
| `/gaming/keyboards` | Gaming Keyboards |
| `/gaming/mice` | Gaming Mice |
| `/gaming/headsets` | Gaming Headsets |
| `/gaming/controllers` | Game Controllers |
| `/gaming/racing-wheels` | Racing Wheels & Sim |
| `/gaming/chairs` | Gaming Chairs |
| `/gaming/cases` | PC Cases |

### Bundles
| Route | Page |
|---|---|
| `/bundles/new` | New PC Bundles |
| `/bundles/used` | Used PC Bundles |

### Company
| Route | Page |
|---|---|
| `/about` | About Daddu Charger |
| `/contact` | Contact & Store Info |
| `/faq` | FAQ |

### Commerce / Utilities
| Route | Page |
|---|---|
| `/search` | Search Results |
| `/wishlist` | Saved Items |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/account` | Customer Account |

### Legal
| Route | Page |
|---|---|
| `/legal/privacy` | Privacy Policy |
| `/legal/refunds` | Refund Policy |
| `/legal/shipping` | Shipping Policy |
| `/legal/terms` | Terms of Service |

---

## SHOPIFY → NEW SITE REDIRECT MAP (301)

| From (Shopify URL) | To (New URL) | Priority |
|---|---|---|
| `/pages/about-us` | `/about` | HIGH |
| `/pages/faqs` | `/faq` | HIGH |
| `/pages/contact` | `/contact` | HIGH |
| `/collections` | `/categories` | HIGH |
| `/collections/cpu-liquid-cooler` | `/components/cooling` | HIGH |
| `/collections/cpu-liquid-coolers` | `/components/cooling` | HIGH |
| `/collections/gaming-case` | `/gaming/cases` | HIGH |
| `/collections/gaming-chairs` | `/gaming/chairs` | MEDIUM |
| `/collections/gaming-controllers` | `/gaming/controllers` | MEDIUM |
| `/collections/12-12-mega-sale-upto-40-off` | `/sale` | LOW |
| `/cart` | `/cart` | SAME |
| `/search` | `/search` | SAME |

> Additional Shopify collection redirects will be documented as more collections are identified.

---

## NAVIGATION STRUCTURE

### Desktop Primary Navigation
```
Logo
├── Shop
├── PC Builds
│   └── Gaming PCs
├── Components
│   ├── Processors
│   ├── Motherboards
│   ├── Graphics Cards
│   ├── RAM
│   ├── Storage
│   ├── Power Supplies
│   └── Cooling
├── Peripherals
│   ├── Monitors
│   ├── Keyboards
│   ├── Mice
│   ├── Headsets
│   ├── Controllers
│   ├── Racing Wheels
│   ├── Chairs
│   └── Cases
├── Build Your PC          ← Accent CTA
└── About
    └── About Us

[Utilities]
├── Search (icon)
├── Wishlist (icon)
└── Cart (icon + count)
```

### Mobile Navigation (Drawer)
```
Logo + Close
├── Shop All
├── Gaming PCs
├── Components (expandable)
├── Peripherals (expandable)
├── Build Your PC
├── About
├── Contact
└── [Account / Wishlist / Cart]
```

---

## ROUTE NOTES

1. **`/components/cooling`** — merges both `cpu-liquid-cooler` and `cpu-liquid-coolers` Shopify collections
2. **`/gaming/cases`** — maps Shopify `gaming-case` (58 products)
3. **`/build-pc`** — the flagship interactive PC builder; no Shopify equivalent
4. **`/latest`** — filter for recently added products
5. **`/sale`** — consolidates seasonal collections; do not expose seasonal collection handles directly

---

## FUTURE ROUTES (PHASE 2+)

| Route | Description |
|---|---|
| `/builds/[slug]` | Individual featured build showcase pages |
| `/blog` | Content marketing (optional) |
| `/brands/[brand]` | Brand-filtered product pages |
| `/compare` | Product comparison tool |
