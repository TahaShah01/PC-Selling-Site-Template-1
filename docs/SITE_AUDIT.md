# Daddu Charger – Site Audit

**Audited:** 2026-09-19  
**Auditor:** AI Agent (Phase 1 Research)  
**Source:** Live site https://www.dadducharger.com + Shopify JSON API

---

## 1. TECHNICAL STACK (CURRENT / EXISTING SHOPIFY SITE)

| Property | Value |
|---|---|
| Platform | Shopify |
| Theme | Minimog v5.0.1 (Schema: Minimog - OS 2.0) |
| Shop ID | 67973251226 |
| myshopify domain | bqp2r0-fu.myshopify.com |
| Currency | PKR (Pakistani Rupee) |
| Locale | en-PK |
| Country | PK |
| Font | Jost (Regular, Medium, SemiBold) – served from Shopify CDN |
| Apps installed | ReelUp (shoppable videos), Reelfy, Instafeed, Dondy WhatsApp Widget |

### Design tokens (current Shopify theme):
- Background: `rgb(255,255,255)` – plain white
- Foreground: `rgb(34,34,34)`
- Dark color scheme: `rgb(0,0,0)` background
- Sale badge: `#da3f3f` (red)
- Container width: 1550px (fluid: 1880px)
- Section spacing: 100px desktop, 48px mobile

---

## 2. COLLECTIONS AUDIT

Collections retrieved from Shopify JSON API (`/collections.json`):

### CONFIRMED COLLECTIONS WITH PRODUCT COUNTS:

| Collection Title | Handle | Products | Status |
|---|---|---|---|
| 12.12 Mega Sale upto 40%OFF | `12-12-mega-sale-upto-40-off` | 9 | SEASONAL – do not map to permanent route |
| CPU Liquid Cooler | `cpu-liquid-cooler` | 7 | DUPLICATE – merge |
| CPU Liquid Coolers | `cpu-liquid-coolers` | 15 | DUPLICATE – merge |
| Gaming Case | `gaming-case` | 58 | MAP → `/gaming/cases` |
| Gaming Chairs | `gaming-chairs` | 9 | MAP → `/gaming/chairs` |
| Gaming Controllers | `gaming-controllers` | — | MAP → `/gaming/controllers` |

> **NOTE:** Full collections list was truncated in API response. Additional collections likely include: Graphics Cards, Processors, Motherboards, RAM, Storage, Power Supplies, Monitors, Keyboards, Mice, Headsets, Racing Wheels, Prebuilt PCs, Used PCs, Bundles.

### CRITICAL COLLECTION ISSUES:

| Issue | Detail |
|---|---|
| ⚠️ DUPLICATE: Cooling | `cpu-liquid-cooler` (7 products) AND `cpu-liquid-coolers` (15 products) both exist. Merge into `/components/cooling`. |
| ⚠️ Internal collection | "REELUP (DO NOT DELETE)" – internal app collection, must never be customer-facing |
| ⚠️ Seasonal route | `12-12-mega-sale-upto-40-off` – season-specific, redirect to `/sale` |

---

## 3. BUSINESS INFORMATION (VERIFIED)

| Field | Value | Confidence |
|---|---|---|
| Business name | Daddu Charger | ✅ Verified |
| Location | Rawalpindi, Pakistan | ✅ Verified (About page, collection descriptions) |
| Founded | Not explicitly stated | ❓ Flag for client |
| Currency | PKR | ✅ Verified |
| Type | Gaming PC hardware retailer + custom PC builder | ✅ Verified |

### Meta description (homepage):
> "Welcome to Daddu Charger – your ultimate destination for high-performance gaming PCs and accessories. Explore our curated selection of gaming rigs, peripherals, and exclusive deals designed to elevate your gaming experience."

### About page content (raw extracted):
> "At Daddu Charger, we're passionate about delivering top-tier gaming experiences. Founded in Rawalpindi, Pakistan, our mission is to provide gamers with high-performance custom-built PCs and premium accessories that elevate gameplay to the next level."
> 
> "What began as a small venture fueled by a love for gaming has evolved into a trusted destination for gaming enthusiasts. Recognizing the need for reliable and powerful gaming setups, we've dedicated ourselves to assembling rigs that meet the unique demands of each gamer."

### Brands mentioned in collection descriptions:
- Cooler Master
- DeepCool
- Lian Li
- Corsair
- ASUS ROG

---

## 4. FAQ CONTENT (VERIFIED FRAGMENTS)

### Orders & Payments:
- **Q: What payment methods do you accept?**  
  A: We accept major credit/debit cards, PayPal, and bank transfers.
- **Q: Can I modify or cancel my order after placing it?**  
  A: Orders can be modified or canceled within 2 hours of placement.

> ⚠️ **NOTE:** PayPal is listed as accepted — but this is unusual for a Pakistani-focused store. Needs client confirmation.

---

## 5. CONTACT PAGE AUDIT

- `/pages/contact` → **Returns 404** on live site
- WhatsApp widget: Dondy WhatsApp Chat Widget app installed (confirms WhatsApp contact exists)
- WhatsApp number: **UNKNOWN** (not extractable from static HTML)
- Phone: **UNKNOWN** (not in extractable metadata)
- Email: **UNKNOWN** (not in extractable metadata)
- Store address: Rawalpindi (confirmed, exact address unknown)
- Hours: **UNKNOWN**

---

## 6. SEO AUDIT

| Page | Current URL | Redirect Needed | New URL |
|---|---|---|---|
| Homepage | `/` | No | `/` |
| About | `/pages/about-us` | Yes (301) | `/about` |
| FAQ | `/pages/faqs` | Yes (301) | `/faq` |
| Collections | `/collections` | Yes (301) | `/categories` |
| CPU Liquid Cooler | `/collections/cpu-liquid-cooler` | Yes → merge | `/components/cooling` |
| CPU Liquid Coolers | `/collections/cpu-liquid-coolers` | Yes → merge | `/components/cooling` |
| Gaming Cases | `/collections/gaming-case` | Yes (301) | `/gaming/cases` |
| Gaming Chairs | `/collections/gaming-chairs` | Yes (301) | `/gaming/chairs` |
| Gaming Controllers | `/collections/gaming-controllers` | Yes (301) | `/gaming/controllers` |

> See `/docs/ROUTES.md` for the complete redirect map.

---

## 7. SOCIAL MEDIA (DETECTED)

- **Instagram:** Connected via Instafeed app (handle unknown)
- **Twitter/X:** Meta tag `@https://` — **INVALID** (empty/broken)
- **Facebook, YouTube:** Not confirmed from metadata

> ⚠️ Twitter meta tag is malformed: `content="@https://"` — this will produce broken Twitter card previews.

---

## 8. APPS / THIRD PARTY

| App | Purpose | Keep in Redesign? |
|---|---|---|
| ReelUp | Shoppable video reels | YES – reimagine as "Inside Daddu Charger" section |
| Reelfy | Short-form video | YES – same as above |
| Instafeed | Instagram feed | YES – as social section |
| Dondy WhatsApp | WhatsApp bubble | YES – integrate natively, no 3rd party bubble |

---

## 9. CONTENT CONFLICTS REQUIRING CLIENT CONFIRMATION

> These items were detected as potentially inconsistent or incomplete and require client confirmation before finalizing:

| # | Issue | Impact |
|---|---|---|
| 1 | **Contact page 404** – `/pages/contact` returns 404. Either contact info is in footer only or there is no dedicated contact page. | HIGH – Contact is a core page |
| 2 | **PayPal listed as payment method** in FAQ, but Shopify store serves Pakistan (PKR). PayPal has limited Pakistan availability. | MEDIUM – verify actual payment methods |
| 3 | **WhatsApp number unknown** – app installed but number not extractable from static content. | HIGH – WhatsApp is primary contact channel |
| 4 | **Twitter/X handle broken** – `@https://` in meta tags is not a valid Twitter handle | MEDIUM – SEO/social |
| 5 | **Founding date unknown** – About page says "began as a small venture" but no year given | LOW – nice to have for About page |
| 6 | **Store exact address unknown** – Only "Rawalpindi" confirmed, no street address | HIGH – needed for LocalBusiness schema |
| 7 | **Store hours unknown** – Not in any extractable metadata | HIGH – needed for Contact page |
| 8 | **Instagram handle unknown** – Instafeed app installed but handle not in metadata | MEDIUM – needed for social links |
| 9 | **CPU Liquid Cooler duplicate** – Two collections (7 and 15 products) exist. Are these the same products or different ranges? | MEDIUM – affects product migration |
| 10 | **"REELUP (DO NOT DELETE)" collection** – Internal app collection must not appear in navigation or sitemaps | HIGH – SEO/UX |

---

## 10. PERFORMANCE RISKS (CURRENT SITE)

- Heavy Shopify theme JS bundles (vendor.min.js ~several hundred KB)
- Multiple app scripts loaded on every page (ReelUp, Reelfy, Instafeed, Dondy)
- Instagram feed loads late on scroll (Instafeed async)
- No evidence of image optimization beyond Shopify CDN
- `user-scalable=0` in viewport meta – accessibility concern

---

## 11. WHAT THE NEW SITE MUST NOT CARRY FORWARD

- Shopify theme markup patterns
- Shopify-specific URL structures (except where redirect needed for SEO)
- Theme-generated junk classes (`.m-color-dark`, `.m-icon-box`, etc.)
- Internal collections exposed as navigation items
- Broken Twitter/X meta tag
- WhatsApp bubble from third-party app (replace with native integration)
- `user-scalable=0` viewport restriction
- Emoji in SEO meta descriptions
- Empty theme fragments and placeholder images
