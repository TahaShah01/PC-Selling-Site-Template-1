"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { CursorProvider } from "../components/motion/Cursor";
import { Preloader } from "../components/sections/Preloader";
import { Hero } from "../components/sections/Hero";
import { Manifesto } from "../components/sections/Manifesto";
import { HorizontalShowcase } from "../components/sections/HorizontalShowcase";
import { BuildSequence } from "../components/sections/BuildSequence";
import { VelocityMarquee } from "../components/sections/VelocityMarquee";
import { FeaturedBuilds } from "../components/sections/FeaturedBuilds";
import { ClosingCTA } from "../components/sections/ClosingCTA";

/* ─────────────────────────────────────────────────────────
   HOMEPAGE
   Order is deliberate — loud, quiet, loud:
   hero → manifesto (calm) → horizontal (kinetic) →
   build sequence (the set piece) → marquee (release) →
   builds (product) → closing (loud again)

   NOTE: metadata must live in a server file. Keep this page
   as "use client" and put the export in app/layout.tsx, or
   split a server wrapper — see the note I sent with these.
───────────────────────────────────────────────────────── */

export default function HomePage() {
  // Start as false so Hero always enters from its initial (hidden) state.
  // The Preloader calls setReady(true) once it exits — first-visit via the
  // full animation sequence, repeat-visits via the 120ms fast-exit path.
  const [ready, setReady] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <CursorProvider>
      <Preloader onDone={() => setReady(true)} />

      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[9997] h-px origin-left bg-[var(--dc-accent)]"
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-[var(--dc-radius-md)] focus:bg-[var(--dc-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--dc-accent-text)]"
      >
        Skip to main content
      </a>

      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        <Hero ready={ready} />
        <Manifesto />
        <HorizontalShowcase />
        <BuildSequence />
        <VelocityMarquee />
        <FeaturedBuilds />
        <ClosingCTA />
      </main>

      <SiteFooter />
    </CursorProvider>
  );
}