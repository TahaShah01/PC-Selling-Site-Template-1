import type { Metadata } from "next";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { HeroSection } from "../components/sections/HeroSection";
import { BrandTicker } from "../components/sections/BrandTicker";
import { CategoryGrid } from "../components/sections/CategoryGrid";
import { BuilderCTA } from "../components/sections/BuilderCTA";
import { TrustSection } from "../components/sections/TrustSection";

/* ─────────────────────────────────────────────────────────
   HOMEPAGE
───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Daddu Charger — Pakistan's Premium Gaming PC Store",
  description:
    "Custom-built gaming PCs, high-performance components, and premium peripherals from Rawalpindi's premier gaming hardware destination. Expert builds, genuine parts, best prices in Pakistan.",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        {/* Skip-to-content anchor */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--dc-accent)] focus:text-[var(--dc-accent-text)] focus:rounded-[var(--dc-radius-md)] focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>

        {/* 1. Hero — Full-screen editorial statement */}
        <HeroSection />

        {/* 2. Brand Ticker — Trusted brands scroll */}
        <BrandTicker />

        {/* 3. Category Grid — Visual product category discovery */}
        <CategoryGrid />

        {/* 4. PC Builder CTA — Core product differentiator */}
        <BuilderCTA />

        {/* 5. Trust Section — Brand credibility signals */}
        <TrustSection />
      </main>

      <SiteFooter />
    </>
  );
}
