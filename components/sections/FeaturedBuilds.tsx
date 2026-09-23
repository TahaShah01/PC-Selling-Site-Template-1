"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { ArrowUpRight } from "lucide-react";
import { EASE, inViewOnce } from "../../lib/motion/Motion";
import { useCursor } from "../motion/Cursor";

/* ─────────────────────────────────────────────────────────
   FEATURED BUILDS — rebuild

   What was actually broken, not just "could look nicer":

   ✓ The "View build" badge could not be discovered by hovering
     the card. Framer set its opacity/scale inline at mount, and
     an inline style always beats a Tailwind class on the same
     property — so `group-hover:opacity-100` never had a chance
     to win. And `whileHover` only fires when the pointer is
     directly over that one small badge, not anywhere on the
     group it visually implies it reacts to. Net effect: hovering
     the photo (the obvious thing to do) revealed nothing; you'd
     have to already be hovering the exact 24px corner to see it
     appear. It's now driven by the same GSAP hover handlers as
     the tilt, with real spring physics, so it actually shows up
     when you hover the card.

   ✓ `transformPerspective: 900` was set as a plain inline style
     on a plain `<Link>`. That's a Framer-motion-only style key —
     on a non-`motion.*` element the browser just drops it as an
     unrecognized property. So the GSAP-driven "3D tilt" had zero
     perspective to tilt into; it was rendering as a flat skew.
     Moved `transformPerspective` into the GSAP tween itself,
     where it's a real, documented GSAP property that actually
     gets composited into the transform.

   ✓ Each card ran its own Framer `useScroll` + `useTransform`
     for image parallax, on top of GSAP for the hover tilt and
     GSAP for the entrance stagger — three motion systems on one
     card. The parallax is now a GSAP ScrollTrigger scrub, so a
     card's motion lives in one place and one less scroll
     listener runs per card.

   New: a cursor-tracked spotlight per card — the one deliberately
   bold touch for this section, echoing "inspecting the rig under
   a work light" rather than a generic hover glow.
───────────────────────────────────────────────────────── */

import { FEATURED_BUILDS, GamingPC } from "@/data/gaming-pcs";

export function FeaturedBuilds() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Entrance stagger for the grid — unchanged, this part was fine.
  useGSAP(() => {
    if (reduced || !gridRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>(".build-card", gridRef.current);

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: sectionRef, dependencies: [reduced] });

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[var(--dc-bg)] py-[12vh] overflow-hidden"
      aria-label="Featured builds"
      style={{ isolation: "isolate" }}
    >
      {/* Ambient background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          background:
            "radial-gradient(80rem 50rem at 50% 15%, rgba(255,106,26,0.08), transparent 70%)",
        }}
      />

      <div className="dc-container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.8, ease: EASE.out }}
          className="mb-14 flex items-end justify-between gap-6 border-b border-[var(--dc-border)] pb-6"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.6, ease: EASE.out }}
              className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--dc-accent)] font-semibold"
            >
              Enthusiast Showroom
            </motion.p>
            <h2 className="font-display font-bold text-[var(--dc-text)] text-[clamp(2rem,4vw,3.5rem)] leading-none tracking-[-0.03em]">
              Featured PC Builds
            </h2>
          </div>
          <Link
            href="/gaming-pcs"
            className="group flex items-center gap-2 text-sm font-semibold text-[var(--dc-text)] hover:text-[var(--dc-accent)] transition-colors px-4 py-2 rounded-full border border-[var(--dc-border)] hover:border-[var(--dc-accent)] bg-[var(--dc-surface)]"
          >
            <span>View All Rigs</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--dc-accent)]"
            />
          </Link>
        </motion.div>

        <div ref={gridRef} className="grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[2560px]:grid-cols-4 min-[3840px]:grid-cols-5">
          {FEATURED_BUILDS.map((build, i) => (
            <BuildCard key={build.slug} build={build} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BuildCard({ build }: { build: GamingPC; index: number }) {
  const articleRef = React.useRef<HTMLElement>(null);
  const cardRef = React.useRef<HTMLAnchorElement>(null);
  const imageWrapRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLSpanElement>(null);
  const spotlightRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const cursor = useCursor();

  // Hover cluster: tilt, badge reveal, cursor spotlight — one set
  // of handlers driving all three, so they're always in sync.
  useGSAP(() => {
    if (reduced || !cardRef.current) return;
    const el = cardRef.current;

    gsap.set(spotlightRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
    const setSpotX = gsap.quickTo(spotlightRef.current, "x", { duration: 0.4, ease: "power3" });
    const setSpotY = gsap.quickTo(spotlightRef.current, "y", { duration: 0.4, ease: "power3" });

    const enter = () => {
      gsap.to(el, {
        rotateY: 4,
        rotateX: -3,
        scale: 1.02,
        transformPerspective: 900,
        duration: 0.5,
        ease: "expo.out",
      });
      gsap.to(badgeRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.8)" });
    };
    const leave = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      gsap.to(badgeRef.current, { scale: 0.7, opacity: 0, duration: 0.3, ease: "power2.in" });
    };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setSpotX(e.clientX - rect.left);
      setSpotY(e.clientY - rect.top);
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("focus", enter);
    el.addEventListener("blur", leave);
    el.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("focus", enter);
      el.removeEventListener("blur", leave);
      el.removeEventListener("mousemove", onMove);
    };
  }, { dependencies: [reduced] });

  // Image parallax — GSAP scroll-scrub instead of a per-card
  // Framer useScroll/useTransform pair.
  useGSAP(() => {
    if (reduced || !articleRef.current || !imageWrapRef.current) return;

    gsap.fromTo(
      imageWrapRef.current,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: articleRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, { dependencies: [reduced] });

  return (
    <article ref={articleRef} className="build-card p-4 rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)]/60 hover:border-[var(--dc-border-accent)] hover:bg-[var(--dc-surface)] transition-all duration-500 hover:shadow-2xl flex flex-col justify-between">
      <Link
        ref={cardRef}
        href={`/gaming-pcs/${build.slug}`}
        onMouseEnter={() => cursor.set("view", "View build")}
        onMouseLeave={cursor.reset}
        className="group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
      >
        {/* Image frame */}
        <div className="relative aspect-[16/11] sm:aspect-[4/5] overflow-hidden rounded-[var(--dc-radius-xl)] bg-[var(--dc-surface-2)] transition-shadow duration-700 group-hover:shadow-[0_0_40px_var(--dc-orange-glow)]">
          <div ref={imageWrapRef} className="absolute -inset-y-[12%] inset-x-0">
            <Image
              src={build.image}
              alt={`${build.name} — ${build.spec}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          </div>

          {/* Cursor-tracked spotlight — skipped entirely for reduced motion */}
          {!reduced && (
            <div
              ref={spotlightRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(circle, var(--dc-orange-glow-strong), transparent 70%)" }}
            />
          )}

          {/* Tier badge */}
          <span className="absolute left-4 top-4 rounded-full bg-[var(--dc-bg)]/85 px-3 py-1 text-[11px] font-semibold text-[var(--dc-text)] backdrop-blur-md border border-[var(--dc-border)]">
            {build.tier}
          </span>

          {/* View badge */}
          <span
            ref={badgeRef}
            className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[var(--dc-accent)] px-3 py-1 text-[11px] font-semibold"
            style={
              reduced
                ? { color: "var(--dc-accent-text)" }
                : { color: "var(--dc-accent-text)", opacity: 0, transform: "scale(0.7)" }
            }
          >
            Configure
            <ArrowUpRight size={11} />
          </span>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Header & Price */}
        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-[var(--dc-border)] pt-3.5">
          <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-[var(--dc-text)] transition-colors duration-300 group-hover:text-[var(--dc-accent)]">
            {build.name}
          </h3>

          <div className="relative h-5 overflow-hidden text-right">
            <span className="block text-sm font-bold tabular-nums text-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
              {build.price}
            </span>
            <span className="absolute inset-0 block translate-y-full text-[11px] font-bold text-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
              Customize Rig →
            </span>
          </div>
        </div>

        {/* Spec Chips Row */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[var(--dc-surface-2)] text-[var(--dc-text-muted)] border border-[var(--dc-border)]">
            {build.components.gpu.split(" ").slice(0, 3).join(" ")}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[var(--dc-surface-2)] text-[var(--dc-text-muted)] border border-[var(--dc-border)]">
            {build.components.cpu.split(" ").slice(0, 3).join(" ")}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[var(--dc-surface-2)] text-[var(--dc-text-muted)] border border-[var(--dc-border)]">
            {build.components.ram}
          </span>
        </div>
      </Link>
    </article>
  );
}