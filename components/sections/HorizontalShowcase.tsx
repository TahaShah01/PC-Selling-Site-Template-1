"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_CATEGORIES, CATEGORIES } from "../../data/categories";
import { useCursor } from "../motion/Cursor";
import { SPRING } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   HORIZONTAL SHOWCASE — Phase 3

   Fixes:
   ✓ isolation: isolate prevents stacking-context bleed
   ✓ Track A and B have independent scroll speed ratios —
     A runs at full speed, B at 55% speed creating real depth
   ✓ Section height formula is deterministic (Track B no longer
     counted in height — it scrolls within the same range at
     its own rate)
   ✓ GSAP entry momentum: on viewport enter, tracks get a
     brief skewX impulse that springs back — they feel heavy
   ✓ Panel 3D tilt on hover via GSAP
───────────────────────────────────────────────────────── */

const TRACK_B_ITEMS = [
  "Gaming PCs",
  "Components",
  "Peripherals",
  "Cooling",
  "RGB & Lighting",
  "Cables & PSU",
];

export function HorizontalShowcase() {
  const ref = React.useRef<HTMLDivElement>(null);
  const trackARef = React.useRef<HTMLDivElement>(null);
  const trackBRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const cursor = useCursor();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Track A — full speed right→left
  const rawA = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);
  const xA = useSpring(rawA, SPRING.scroll);

  // Track B — 55% speed left→right (slower = visual depth between rows)
  const rawB = useTransform(scrollYProgress, [0, 1], ["-44%", "8%"]);
  const xB = useSpring(rawB, SPRING.scroll);

  // Entry skew impulse via GSAP
  useGSAP(() => {
    if (reduced) return;
    const tracks = [trackARef.current, trackBRef.current].filter(Boolean);

    gsap.fromTo(
      tracks,
      { skewX: (i) => (i === 0 ? -3 : 3) },
      {
        skewX: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: ref });

  const itemsA = FEATURED_CATEGORIES;
  // Section height: based on Track A items only — Track B rides same range at different rate
  const sectionH = `${Math.max(300, itemsA.length * 60)}vh`;

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[var(--dc-bg)]"
      // isolation: isolate fixes the "hovering over another section" feeling
      style={{ height: sectionH, isolation: "isolate" }}
      aria-label="Shop by category"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden gap-6">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="dc-container flex items-end justify-between gap-6"
        >
          <h2 className="font-display font-bold text-[var(--dc-text)] text-[clamp(1.75rem,4vw,3.25rem)] leading-none tracking-[-0.03em]">
            Everything in the rig
          </h2>
          <span className="hidden sm:block text-xs text-[var(--dc-text-subtle)]">
            Scroll to explore
          </span>
        </motion.div>

        {/* ── TRACK A (→ fast, right to left) ── */}
        <div ref={trackARef}>
          <motion.div
            className="flex gap-4 sm:gap-5 pl-[var(--dc-gutter)]"
            style={reduced ? undefined : { x: xA }}
            onMouseEnter={() => cursor.set("label", "Scroll")}
            onMouseLeave={cursor.reset}
          >
            {itemsA.map((category, i) => (
              <Panel
                key={category.id}
                index={i}
                progress={scrollYProgress}
                label={category.shortTitle}
                description={category.description}
                productCount={category.productCount}
                href={category.href}
                size="large"
              />
            ))}

            {/* Tail: all categories */}
            <Link
              href="/categories"
              className="group relative flex h-[50vh] w-[72vw] shrink-0 flex-col justify-between rounded-[var(--dc-radius-2xl)] border border-[var(--dc-accent)]/40 bg-[var(--dc-accent-dim)] p-7 sm:w-[28vw]"
            >
              <span className="text-xs text-[var(--dc-accent)]">Everything else</span>
              <span className="font-display font-bold text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.02] tracking-[-0.03em] text-[var(--dc-text)]">
                Browse the full catalogue
                <ArrowUpRight
                  className="ml-2 inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:-translate-y-2"
                  size={26}
                />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* ── TRACK B (← slower, left to right) ── */}
        <div ref={trackBRef}>
          <motion.div
            className="flex gap-4 sm:gap-5 pl-[var(--dc-gutter)]"
            style={reduced ? undefined : { x: xB }}
            onMouseEnter={() => cursor.set("label", "Scroll")}
            onMouseLeave={cursor.reset}
          >
            {TRACK_B_ITEMS.map((label, i) => (
              <SmallPanel key={label} label={label} index={i} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}

/* ── Large panel (Track A) ── */
function Panel({
  label,
  description,
  productCount,
  href,
  index,
  progress,
  size = "large",
}: {
  label: string;
  description?: string;
  productCount?: number;
  href: string;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  size?: "large" | "small";
}) {
  const cursor = useCursor();
  const reduced = useReducedMotion();
  const panelRef = React.useRef<HTMLAnchorElement>(null);

  // Subtle vertical drift per panel (alternating) for depth
  const drift = useTransform(
    progress,
    [0, 1],
    [index % 2 === 0 ? 24 : -24, 0]
  );

  // 3D tilt on hover via GSAP
  useGSAP(() => {
    if (reduced || !panelRef.current) return;
    const el = panelRef.current;

    const enter = () => {
      gsap.to(el, { rotateY: 3, rotateX: -2, scale: 1.025, duration: 0.5, ease: "expo.out" });
    };
    const leave = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  });

  return (
    <motion.div style={reduced ? undefined : { y: drift }} className="shrink-0">
      <Link
        ref={panelRef}
        href={href}
        onMouseEnter={() => cursor.set("view", "Open")}
        onMouseLeave={() => cursor.set("label", "Scroll")}
        style={{ transformPerspective: 800 } as React.CSSProperties}
        className="group relative flex h-[50vh] w-[72vw] shrink-0 flex-col justify-between overflow-hidden rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-card)] p-6 sm:w-[28vw] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
      >
        {/* Full hover fill */}
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-y-full bg-[var(--dc-accent)] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
        />

        <span className="relative z-10 text-xs tabular-nums text-[var(--dc-text-subtle)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]/70">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative z-10">
          <h3 className="font-display font-bold leading-[1.02] tracking-[-0.03em] text-[clamp(1.5rem,2.6vw,2.4rem)] text-[var(--dc-text)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]">
            {label}
          </h3>
          {productCount && (
            <p className="mt-1.5 text-sm text-[var(--dc-text-subtle)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]/70">
              {productCount}+ products
            </p>
          )}
          {description && (
            <p className="mt-1.5 text-xs text-[var(--dc-text-subtle)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]/60 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Small text panel (Track B) ── */
function SmallPanel({ label, index }: { label: string; index: number }) {
  const cursor = useCursor();

  return (
    <div
      onMouseEnter={() => cursor.set("label", "Scroll")}
      className="group relative flex h-[28vh] w-[52vw] shrink-0 flex-col justify-between overflow-hidden rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] px-5 py-4 sm:w-[18vw]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-y-full bg-[var(--dc-surface-3)] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
      />
      <span className="relative z-10 text-[10px] tabular-nums text-[var(--dc-text-subtle)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="relative z-10 font-display font-bold text-[clamp(1rem,1.6vw,1.5rem)] leading-[1.02] tracking-[-0.03em] text-[var(--dc-text)]">
        {label}
      </h3>
    </div>
  );
}