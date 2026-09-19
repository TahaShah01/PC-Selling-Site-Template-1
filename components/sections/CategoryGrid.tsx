"use client";

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as [number, number, number, number];

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Monitor, Cpu, Wind, Gamepad2, Keyboard, Box } from "lucide-react";
import { cn } from "../../lib/utils";
import { FEATURED_CATEGORIES } from "../../data/categories";
import { Container, Section } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   CATEGORY GRID SECTION
   Editorial bento-style grid of featured product categories.
───────────────────────────────────────────────────────── */

// Map category icon string names to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Monitor,
  Cpu,
  Wind,
  Gamepad2,
  Keyboard,
  Box,
};

const CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_PREMIUM },
  },
};

export function CategoryGrid() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section className="bg-[var(--dc-bg)] relative overflow-hidden">
      {/* Circuit board background */}
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{ backgroundImage: "url('/circuit-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[var(--dc-bg)] via-transparent to-[var(--dc-bg)]" aria-hidden="true" />

      <Container className="relative z-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12 gap-6">
          <div>
            <p className="dc-eyebrow mb-3">Shop by Category</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-[var(--dc-text)] leading-tight tracking-tight">
              Everything You Need.
              <br />
              <span className="text-[var(--dc-text-muted)]">All in One Place.</span>
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden md:inline-flex items-center gap-2 text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)] shrink-0 group"
          >
            View all categories
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-[var(--dc-duration-fast)]" />
          </Link>
        </div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4"
        >
          {FEATURED_CATEGORIES.map((category) => {
            const IconComponent = ICON_MAP[category.icon] || Box;

            return (
              <motion.div key={category.id} variants={CARD_VARIANTS}>
                <Link
                  href={category.href}
                  className={cn(
                    "group flex flex-col gap-3 p-4 sm:p-5",
                    "bg-[var(--dc-card)] border border-[var(--dc-border)]",
                    "rounded-[var(--dc-radius-xl)]",
                    "hover:border-[var(--dc-border-accent)] hover:bg-[var(--dc-card-hover)]",
                    "transition-all duration-[var(--dc-duration-normal)] ease-[var(--dc-ease-out)]",
                    "hover:shadow-[var(--dc-shadow-accent)]",
                    "relative overflow-hidden"
                  )}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(200,255,0,0.04)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--dc-duration-normal)]" aria-hidden="true" />

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-[var(--dc-radius-md)] bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-text-subtle)] group-hover:text-[var(--dc-accent)] group-hover:bg-[var(--dc-accent-dim)] transition-all duration-[var(--dc-duration-normal)]">
                    <IconComponent size={18} />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-sm font-semibold text-[var(--dc-text)] leading-snug mb-0.5 group-hover:text-[var(--dc-text)]">
                      {category.shortTitle}
                    </p>
                    {category.productCount && (
                      <p className="text-xs text-[var(--dc-text-subtle)]">
                        {category.productCount}+ products
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <ArrowRight
                    size={14}
                    className="text-[var(--dc-text-subtle)] group-hover:text-[var(--dc-accent)] group-hover:translate-x-1 transition-all duration-[var(--dc-duration-fast)] mt-auto"
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile "view all" link */}
        <div className="flex md:hidden justify-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)] group"
          >
            View all categories
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
