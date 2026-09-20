"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { EASE, DUR } from "@/lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   PAGE TRANSITION — TEMPLATE

   IMPORTANT: The homepage ("/") is excluded from this
   animation because it has its own cinematic entrance via
   the Preloader + Hero. Applying opacity:0 here would hide
   the Preloader during its own animation, breaking it.

   All other routes (shop, search, category, etc.) get a
   smooth fade-up entrance using the shared motion vocabulary.
───────────────────────────────────────────────────────── */

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const { lenis } = useLenis();
  const isHome = pathname === "/";

  // Reset scroll to top on every route change
  React.useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  // Homepage and reduced-motion users: no wrapper animation
  if (isHome || reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DUR.slow,   // 1.1s — long expo-out tail feels premium
        ease: EASE.out,
      }}
    >
      {children}
    </motion.div>
  );
}
