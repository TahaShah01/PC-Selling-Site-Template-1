"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { DUR, EASE, inViewOnce } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   PAGE HERO — shared animated hero for all inner pages.

   Matches the homepage's motion vocabulary exactly:
   • Headline: GSAP mask-reveal (same as Hero.tsx, ClosingCTA.tsx)
   • Eyebrow: Framer blur-in, staggered before headline
   • Body: blur-in after headline settles
   • Background: ambient radial glow (same as every homepage section)
   • Reduced motion: everything jumps to resolved frame immediately

   Props:
   • eyebrow     — short uppercase label above headline
   • headline    — array of strings, one per visual line
   • body        — optional supporting paragraph
   • children    — optional slot below body (CTA buttons, etc.)
   • size        — "lg" (default) | "sm" (shorter sections)
   • variant     — "elevated" (bg-elevated) | "default" (bg)
───────────────────────────────────────────────────────── */

interface PageHeroProps {
  eyebrow?: string;
  headline: string[];
  body?: string;
  children?: React.ReactNode;
  size?: "lg" | "sm";
  variant?: "elevated" | "default";
  className?: string;
}

export function PageHero({
  eyebrow,
  headline,
  body,
  children,
  size = "lg",
  variant = "elevated",
  className,
}: PageHeroProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const bgColor =
    variant === "elevated"
      ? "bg-[var(--dc-bg-elevated)]"
      : "bg-[var(--dc-bg)]";

  const headlineSize =
    size === "lg"
      ? "text-[clamp(2.5rem,8vw,7rem)]"
      : "text-[clamp(2rem,5vw,4.5rem)]";

  /* ── GSAP mask reveal on headline lines ── */
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const lines = gsap.utils.toArray<HTMLElement>(
        ".ph-line",
        sectionRef.current
      );
      const eyebrowEl = sectionRef.current.querySelector<HTMLElement>(".ph-eyebrow");
      const bodyEl = sectionRef.current.querySelector<HTMLElement>(".ph-body");
      const childEl = sectionRef.current.querySelector<HTMLElement>(".ph-children");

      if (reduced) {
        gsap.set(lines, { yPercent: 0, rotate: 0 });
        if (eyebrowEl) gsap.set(eyebrowEl, { opacity: 1, y: 0 });
        if (bodyEl) gsap.set(bodyEl, { opacity: 1, y: 0, filter: "blur(0px)" });
        if (childEl) gsap.set(childEl, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(lines, { yPercent: 110, rotate: 3 });
      if (eyebrowEl) gsap.set(eyebrowEl, { opacity: 0, y: 10 });
      if (bodyEl) gsap.set(bodyEl, { opacity: 0, y: 16, filter: "blur(8px)" });
      if (childEl) gsap.set(childEl, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      if (eyebrowEl) {
        tl.to(eyebrowEl, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);
      }
      tl.to(
        lines,
        { yPercent: 0, rotate: 0, duration: DUR.reveal, ease: "expo.out", stagger: 0.1 },
        eyebrowEl ? 0.15 : 0
      );
      if (bodyEl) {
        tl.to(
          bodyEl,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: DUR.slow, ease: "power2.out" },
          0.65
        );
      }
      if (childEl) {
        tl.to(childEl, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.85);
      }
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden dc-grid-bg ${bgColor} ${className ?? ""}`}
    >
      {/* Ambient radial glow — matches brand orange theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70rem 50rem at 30% 110%, rgba(255,106,26,0.12), transparent 70%)",
        }}
      />

      <div
        className={`dc-container-wide relative z-10 ${
          size === "lg" ? "pt-[14vh] pb-[8vh]" : "pt-[10vh] pb-[5vh]"
        }`}
      >
        {eyebrow && (
          <p className="ph-eyebrow mb-6 text-xs uppercase tracking-[0.14em] text-[var(--dc-accent)] font-semibold">
            {eyebrow}
          </p>
        )}

        <h1
          className={`font-display font-bold text-[var(--dc-text)] ${headlineSize} leading-[0.9] tracking-[-0.04em]`}
        >
          <span className="sr-only">{headline.join(" ")}</span>
          {headline.map((line) => (
            <span key={line} aria-hidden="true" className="block overflow-hidden">
              <span className="ph-line block">{line}</span>
            </span>
          ))}
        </h1>

        {body && (
          <p className="ph-body mt-8 max-w-[52ch] text-base sm:text-lg text-[var(--dc-text-muted)] leading-relaxed">
            {body}
          </p>
        )}

        {children && (
          <div className="ph-children mt-8">
            {children}
          </div>
        )}
      </div>

      {/* Bottom separator line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--dc-border)]" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE SHELL — consistent wrapper for all inner pages.
   Handles the header offset and min-height.
───────────────────────────────────────────────────────── */

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={`pt-[var(--dc-header-height)] min-h-screen ${className ?? ""}`}
    >
      {children}
    </main>
  );
}

/* ─────────────────────────────────────────────────────────
   REVEAL SECTION — scroll-triggered section wrapper.
   Use as a drop-in replacement for <Section>.
───────────────────────────────────────────────────────── */

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function RevealSection({ children, className, delay = 0 }: RevealSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: DUR.base, ease: EASE.out, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
