# Daddu Charger – Information Architecture

**Version:** 1.0  
**Last updated:** 2026-09-19

---

## BRAND POSITIONING

> **Daddu Charger** — Pakistan's premium enthusiast PC hardware destination.

**Tone:** Knowledgeable. Confident. Direct. Never hype-heavy.  
**Voice:** An enthusiast talking to another enthusiast. Expert, not salesman.

---

## SITE PURPOSE

Primary goal: Convert visitors into customers for custom-built gaming PCs and PC hardware components.

Secondary goals:
1. Build brand trust and loyalty with Pakistani gaming community
2. Serve as the authoritative destination for PC hardware information in Pakistan
3. Generate leads for the PC Builder tool
4. Showcase builds as aspirational hardware experiences

---

## CONTENT HIERARCHY

### Level 1 — Brand Experience
Homepage. Sets identity, tone, energy. Not a product listing. It's an editorial experience.

### Level 2 — Discovery
Category pages, Shop, Builds collection. Helps users navigate to what they need.

### Level 3 — Consideration
Product listing pages, filtered shop. Enables comparison and evaluation.

### Level 4 — Decision
Product detail pages, PC Builder configurator. Drives conversion.

### Level 5 — Trust
About, FAQ, Contact. Reduces purchase friction and builds brand credibility.

---

## HOMEPAGE SECTION ARCHITECTURE

1. **Hero** — Full-screen editorial statement. "Engineered in Pakistan." Animated. CTA to Shop + Build Your PC.

2. **Brand Bar** — Scrolling ticker of trusted brands (Cooler Master, ASUS ROG, Corsair, DeepCool, Lian Li, MSI, NZXT, Gigabyte)

3. **Featured Builds** — 3–4 showcase builds with specs, cinematic product imagery, price in PKR. Editorial layout.

4. **Category Grid** — 8–10 category tiles with hover animations. Visual-first category navigation.

5. **PC Builder CTA** — Full-width interactive teaser for the PC Builder tool. Large editorial text.

6. **Latest Arrivals** — 4–6 recently added products in a horizontal scroll / grid.

7. **Why Daddu Charger** — 3–4 trust signals: Expert builds, Genuine parts, Rawalpindi-based, Support.

8. **Social Proof / Instagram** — Curated Instagram feed section. "Inside Daddu Charger."

9. **Footer** — Navigation, contact info, newsletter, brand socials, legal links.

---

## PRODUCT DATA MODEL

```typescript
interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  
  // Pricing
  priceRegular: number;     // in PKR
  priceSale?: number;       // in PKR (if on sale)
  currency: 'PKR';
  
  // Media
  images: ProductImage[];
  
  // Specifications
  specs: Record<string, string>; // dynamic, varies by category
  
  // Status
  inStock: boolean;
  stockCount?: number;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  condition: 'new' | 'used' | 'refurbished';
  
  // Content
  description: string;
  highlights: string[];    // 3-5 bullet points
  
  // Metadata
  tags: string[];
  sku?: string;
  publishedAt: string;
}
```

---

## CATEGORY TAXONOMY

```
Hardware
├── Gaming PCs (custom builds)
├── Components
│   ├── Processors (CPUs)
│   ├── Motherboards
│   ├── Graphics Cards
│   │   └── Used Graphics Cards
│   ├── RAM
│   ├── Storage
│   │   ├── NVMe SSDs
│   │   ├── SATA SSDs
│   │   └── Hard Drives
│   ├── Power Supplies
│   └── Cooling
│       ├── Air Coolers
│       └── Liquid (AIO) Coolers
├── Bundles
│   ├── New PC Bundles
│   └── Used PC Bundles

Gaming
├── Monitors
├── Keyboards
├── Mice
├── Headsets
├── Controllers
├── Racing Wheels & Sim
├── Chairs
└── PC Cases
```

---

## PC BUILDER ARCHITECTURE

The PC Builder is a core differentiator. No competitor in Pakistan has this feature done well.

### Builder Flow:
1. **Choose use case** — Gaming, Streaming, Content Creation, Workstation
2. **Set budget** — Slider or preset tiers (Entry, Mid, High, Extreme)
3. **Pick CPU** — Filtered by use case + budget
4. **Pick Motherboard** — Auto-filtered by CPU socket
5. **Pick GPU** — Filtered by budget
6. **Pick RAM** — Auto-filtered by motherboard
7. **Pick Storage** — Free choice
8. **Pick PSU** — Auto-calculated based on component wattage
9. **Pick Cooling** — Filtered by CPU TDP
10. **Pick Case** — Filtered by form factor
11. **Review + Order** — Summary, total price, compatibility check

### Builder Rules:
- Real-time compatibility checking (socket, form factor, wattage)
- Real-time price total in PKR
- "Ask Us to Build It" CTA → WhatsApp order form
- Save config as shareable link

---

## NAVIGATION IA

See `/docs/ROUTES.md` for full route structure.

---

## FOOTER IA

```
Daddu Charger
├── Tagline: "Pakistan's Premium Gaming Hardware Store"
├── Address: [Rawalpindi – CONFIRM WITH CLIENT]
├── Phone: [CONFIRM WITH CLIENT]
├── Email: [CONFIRM WITH CLIENT]
├── WhatsApp: [CONFIRM WITH CLIENT]
├── Hours: [CONFIRM WITH CLIENT]

Shop
├── Gaming PCs
├── Components
├── Peripherals
├── Sale
├── New Arrivals

Company
├── About Us
├── Contact
├── FAQ
├── PC Builder

Legal
├── Privacy Policy
├── Refund Policy
├── Shipping Policy
└── Terms of Service

Follow Us
├── Instagram: [CONFIRM HANDLE]
├── Facebook: [CONFIRM]
├── YouTube: [CONFIRM]
└── TikTok: [CONFIRM]

Newsletter
└── Email signup (optional)

© 2024 Daddu Charger. All rights reserved.
```
