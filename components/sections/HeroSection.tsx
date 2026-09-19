"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   HERO
   One oversized statement, a single supporting line, and a
   quiet image bleed. No cards, no stat row, no badges.
───────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const LINES = ["Your build,", "our bench."];

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden"
      aria-label="Daddu Charger — custom gaming PCs, Rawalpindi"
    >
      {/* Image bleed, right half, low contrast */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[52%] z-0" aria-hidden="true">
        <Image
          src="/hero-pc.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover object-center opacity-[0.22] lg:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--dc-bg)] via-[var(--dc-bg)]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--dc-bg)] to-transparent" />
      </div>

      <Container className="relative z-10 pt-[calc(var(--dc-header-height)+6rem)] pb-20">
        <h1 className="font-display font-bold text-[var(--dc-text)] text-[clamp(2.75rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.04em] max-w-[16ch]">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduced ? undefined : { y: "110%" }}
                animate={reduced ? undefined : { y: "0%" }}
                transition={{ duration: 0.9, delay: 0.05 + i * 0.09, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 grid lg:grid-cols-12 gap-8 items-end"
        >
          <p className="lg:col-span-5 text-base sm:text-lg text-[var(--dc-text-muted)] leading-relaxed max-w-[52ch]">
            Custom gaming PCs assembled, tested and benchmarked in Rawalpindi.
            Genuine parts, live PKR pricing, and someone to call afterwards.
          </p>

          <div className="lg:col-span-7 flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
            <Link
              href="/build-pc"
              className="group inline-flex items-baseline gap-3 text-lg text-[var(--dc-text)] border-b border-[var(--dc-text)] pb-1 hover:border-[var(--dc-accent)] hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
            >
              Start a build
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-baseline text-lg text-[var(--dc-text-muted)] border-b border-transparent pb-1 hover:text-[var(--dc-text)] hover:border-[var(--dc-border)] transition-colors duration-[var(--dc-duration-fast)]"
            >
              Shop parts
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}