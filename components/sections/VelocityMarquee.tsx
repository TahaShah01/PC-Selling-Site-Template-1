"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  wrap,
  useReducedMotion,
} from "framer-motion";
import { BUSINESS } from "../../data/business";

/* ─────────────────────────────────────────────────────────
   VELOCITY MARQUEE
   Single row of brand names, right → left.
   Reacts to scroll velocity — speeds up on fast scroll,
   skews slightly (subtle, not dramatic).
   Direction stutter fixed: clean velocity threshold, no flip.
───────────────────────────────────────────────────────── */

export function VelocityMarquee({
  items = BUSINESS.featuredBrands,
  baseVelocity = 2.5,
}: {
  items?: readonly string[];
  baseVelocity?: number;
}) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // How much scroll velocity amplifies the marquee
  const velocityFactor = useTransform(smooth, [-1500, 0, 1500], [-3, 0, 3], { clamp: false });
  // Subtle skew — "not very much" as requested
  const skew = useTransform(smooth, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const vel = velocityFactor.get();
    // Always moves right→left; scroll velocity only amplifies, never reverses
    const move = baseVelocity * (delta / 1000) * (1 + Math.abs(vel) * 0.25);
    baseX.set(baseX.get() - move);
  });

  const row = [...items, ...items, ...items, ...items];

  return (
    <section
      className="relative z-10 overflow-hidden border-y border-[var(--dc-border)] bg-[var(--dc-bg)] py-6 sm:py-8"
      aria-label="Brands we stock"
      style={{ isolation: "isolate" }}
    >
      <motion.div
        className="flex whitespace-nowrap"
        style={reduced ? undefined : { x, skewX: skew }}
      >
        {row.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="mr-10 sm:mr-16 font-display font-bold text-[clamp(1.5rem,4vw,3.5rem)] leading-none tracking-[-0.03em] text-[var(--dc-text-subtle)] select-none"
          >
            {brand}
            <span className="ml-10 sm:ml-16 text-[var(--dc-accent)]">/</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}