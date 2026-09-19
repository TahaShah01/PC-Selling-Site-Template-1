"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "../primitives/Button";
import { Container } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   HOMEPAGE HERO SECTION
───────────────────────────────────────────────────────── */

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function HeroSection() {
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 150]);

  const fadeUp = (delay = 0) =>
    prefersReduced
      ? {}
      : {
        initial: { opacity: 0, y: 32 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: EASE_PREMIUM, delay },
      };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Daddu Charger — Pakistan's Premium Gaming PC Store"
    >
      {/* ─── BACKGROUND ─── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_50%,rgba(200,255,0,0.04)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--dc-bg)] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--dc-bg)] to-transparent" />
      </div>

      {/* ─── GRID OVERLAY ─── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.5) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.5) 80px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      {/* ─── CONTENT ─── */}
      <Container className="relative z-10 pt-[calc(var(--dc-header-height)+2rem)] pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-8rem)]">

          {/* ─── TEXT COLUMN ─── */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow */}
            <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--dc-accent)]">
                <Zap size={12} fill="currentColor" />
                Rawalpindi, Pakistan
              </span>
              <span className="h-px w-8 bg-[var(--dc-accent)] opacity-50" />
              <span className="text-xs text-[var(--dc-text-subtle)] uppercase tracking-wider">
                Est. Gaming Store
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-[clamp(3rem,7vw,6.5rem)] font-display font-bold leading-[1.05] tracking-[-0.03em] text-[var(--dc-text)] mb-6"
            >
              Engineered{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[var(--dc-accent)]">to Win.</span>
                {!prefersReduced && (
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--dc-accent)] origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: EASE_PREMIUM }}
                  />
                )}
              </span>
              <br />
              Built for{" "}
              <span className="text-[var(--dc-text-muted)]">You.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fadeUp(0.2)}
              className="text-lg text-[var(--dc-text-muted)] leading-relaxed max-w-lg mb-10"
            >
              Pakistan&apos;s premier destination for custom-built gaming PCs,
              high-performance components, and premium peripherals. Every build
              crafted to your exact specifications.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.3)}
              className="flex flex-wrap items-center gap-4"
            >
              <Button size="lg" variant="primary" rightIcon={<ArrowRight size={18} />}>
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button size="lg" variant="secondary">
                <Link href="/build-pc">Build Your PC</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp(0.4)}
              className="flex gap-8 mt-14 pt-8 border-t border-[var(--dc-border)]"
            >
              {[
                { value: "500+", label: "Products" },
                { value: "PKR", label: "Local Currency" },
                { value: "RWP", label: "Rawalpindi Based" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-display font-bold text-[var(--dc-text)] leading-none mb-1">
                    {value}
                  </p>
                  <p className="text-xs text-[var(--dc-text-subtle)] uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── IMAGE COLUMN ─── */}
          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0, scale: 0.96, x: 40 }}
            animate={prefersReduced ? undefined : { opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE_PREMIUM }}
            className="relative flex items-center justify-center lg:justify-end"
            style={{ y: prefersReduced ? 0 : yParallax }}
          >
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(200,255,0,0.12)_0%,transparent_70%)]"
              aria-hidden="true"
            />
            <div className="relative w-full max-w-lg aspect-[3/4]">
              <Image
                src="/hero-pc.jpg"
                alt="Custom water-cooled gaming PC with volt green ARGB lighting — built by Daddu Charger, Rawalpindi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-center"
                priority
                quality={90}
              />
            </div>
          </motion.div>
        </div>
      </Container>

      {/* ─── SCROLL INDICATOR ─── */}
      {!prefersReduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <span className="text-xs text-[var(--dc-text-subtle)] uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--dc-text-subtle)] to-transparent" />
        </motion.div>
      )}
    </section>
  );
}
