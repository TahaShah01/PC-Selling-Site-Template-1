"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
   ✓ High-resolution hardware showcase imagery with dark scrims
     and smooth scale on hover
───────────────────────────────────────────────────────── */

type TrackBItem = {
  id: string;
  label: string;
  count?: string;
  href: string;
  image: string;
};

const TRACK_B_ITEMS: TrackBItem[] = [
  {
    id: "keyboards",
    label: "Keyboards",
    count: "30+ models",
    href: "/gaming/keyboards",
    image: "/categories/keyboards.jpg",
  },
  {
    id: "mice",
    label: "Gaming Mice",
    count: "24+ models",
    href: "/gaming/mice",
    image: "/categories/mice.png",
  },
  {
    id: "headsets",
    label: "Audio & Headsets",
    count: "18+ models",
    href: "/gaming/headsets",
    image: "/categories/headsets.webp",
  },
  {
    id: "motherboards",
    label: "Motherboards",
    count: "40+ boards",
    href: "/components/motherboards",
    image: "/categories/motherboards.png",
  },
  {
    id: "ram",
    label: "RAM & Memory",
    count: "35+ kits",
    href: "/components/ram",
    image: "/categories/ram.jpg",
  },
  {
    id: "cases",
    label: "Chassis & Cases",
    count: "58+ cases",
    href: "/gaming/cases",
    image: "/categories/cases.png",
  },
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
                image={category.image}
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
            {TRACK_B_ITEMS.map((item, i) => (
              <SmallPanel key={item.id} item={item} index={i} />
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
  image,
  index,
  progress,
  size = "large",
}: {
  label: string;
  description?: string;
  productCount?: number;
  href: string;
  image?: string;
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
      gsap.to(el, { rotateY: 4, rotateX: -3, scale: 1.025, duration: 0.5, ease: "expo.out" });
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
        className="group relative flex h-[50vh] w-[72vw] shrink-0 flex-col justify-between overflow-hidden rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-card)] p-6 sm:w-[28vw] transition-colors duration-500 hover:border-[var(--dc-accent)]/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
      >
        {/* Background Image with smooth zoom and gradient scrim */}
        {image && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <Image
              src={image}
              alt={label}
              fill
              sizes="(max-width: 768px) 72vw, 28vw"
              className="object-cover object-center opacity-70 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-108 group-hover:opacity-90"
              priority={index < 2}
            />
            {/* Dark gradient scrims ensure text is razor sharp */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--dc-bg)] via-[var(--dc-bg)]/55 to-black/35 opacity-90 transition-opacity duration-500 group-hover:opacity-75" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--dc-bg)] to-transparent" />
          </div>
        )}

        {/* Ambient top & bottom hover accent glow line */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--dc-accent)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 z-20"
        />

        {/* Top header row: Index pill + hover Arrow badge */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono text-[var(--dc-text-muted)] bg-black/60 backdrop-blur-md border border-white/10 group-hover:border-[var(--dc-accent)]/40 group-hover:text-[var(--dc-accent)] transition-colors duration-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-[var(--dc-text-muted)] transition-all duration-400 group-hover:scale-110 group-hover:border-[var(--dc-accent)] group-hover:bg-[var(--dc-accent)] group-hover:text-[var(--dc-accent-text)]">
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Bottom content: Title & details */}
        <div className="relative z-10">
          <h3 className="font-display font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(1.5rem,2.6vw,2.4rem)] text-white transition-colors duration-400 group-hover:text-[var(--dc-accent)]">
            {label}
          </h3>
          {productCount && (
            <p className="mt-1.5 text-sm font-medium text-white/70 transition-colors duration-400 group-hover:text-white/90">
              {productCount}+ products
            </p>
          )}
          {description && (
            <p className="mt-1.5 text-xs text-white/60 transition-colors duration-400 group-hover:text-white/80 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Small panel (Track B) ── */
function SmallPanel({ item, index }: { item: TrackBItem; index: number }) {
  const cursor = useCursor();

  return (
    <Link
      href={item.href}
      onMouseEnter={() => cursor.set("view", "Open")}
      onMouseLeave={() => cursor.set("label", "Scroll")}
      className="group relative flex h-[26vh] sm:h-[28vh] w-[50vw] sm:w-[19vw] shrink-0 flex-col justify-between overflow-hidden rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-card)] p-5 transition-all duration-500 hover:border-[var(--dc-accent)]/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
    >
      {/* Background Image with dark gradient scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src={item.image}
          alt={item.label}
          fill
          sizes="(max-width: 768px) 50vw, 19vw"
          className="object-cover object-center opacity-65 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--dc-bg)] via-[var(--dc-bg)]/60 to-black/35 opacity-90 transition-opacity duration-500 group-hover:opacity-75" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--dc-bg)] to-transparent" />
      </div>

      {/* Ambient hover line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--dc-accent)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 z-20"
      />

      {/* Top row: index pill + micro arrow */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono text-[var(--dc-text-muted)] bg-black/60 backdrop-blur-md border border-white/10 group-hover:border-[var(--dc-accent)]/40 group-hover:text-[var(--dc-accent)] transition-colors duration-400">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-[var(--dc-text-muted)] transition-all duration-400 group-hover:scale-110 group-hover:border-[var(--dc-accent)] group-hover:bg-[var(--dc-accent)] group-hover:text-[var(--dc-accent-text)]">
          <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Bottom text */}
      <div className="relative z-10">
        <h3 className="font-display font-bold text-[clamp(1.05rem,1.7vw,1.4rem)] leading-[1.05] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-[var(--dc-accent)]">
          {item.label}
        </h3>
        {item.count && (
          <p className="mt-1 text-[11px] font-medium text-white/60 transition-colors duration-300 group-hover:text-white/80">
            {item.count}
          </p>
        )}
      </div>
    </Link>
  );
}