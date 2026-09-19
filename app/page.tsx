import type { Metadata } from "next";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { GridGuide } from "../components/sections/GridGuide";
import { HeroSection } from "../components/sections/HeroSection";
import { StatementSection } from "../components/sections/StatementSection";
import { CapabilitiesSection } from "../components/sections/CapabilitiesSection";
import { ProcessSection } from "../components/sections/ProcessSection";
import { AudienceSection } from "../components/sections/AudienceSection";
import { SelectBuildsSection } from "../components/sections/SelectBuildsSection";
import { ClosingStatement } from "../components/sections/ClosingStatement";

export const metadata: Metadata = {
  title: "Daddu Charger — Custom Gaming PCs, Rawalpindi",
  description:
    "Custom gaming PCs assembled, tested and benchmarked in Rawalpindi. Genuine components, live PKR pricing, and support after the sale.",
};

export default function HomePage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--dc-accent)] focus:text-[var(--dc-accent-text)] focus:rounded-[var(--dc-radius-md)] focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <SiteHeader />
      <GridGuide />

      <main id="main-content" tabIndex={-1} className="relative z-[2]">
        <HeroSection />
        <StatementSection />
        <CapabilitiesSection />
        <ProcessSection />
        <AudienceSection />
        <SelectBuildsSection />
        <ClosingStatement />
      </main>

      <SiteFooter />
    </>
  );
}