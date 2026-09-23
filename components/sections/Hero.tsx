"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { ArrowDownRight, ChevronDown } from "lucide-react";
import { DUR, SPRING } from "../../lib/motion/Motion";
import { Magnetic } from "../motion/Reveal";
import { useCursor } from "../motion/Cursor";
import { useLenis } from "../providers/SmoothScrollProvider";

/* ─────────────────────────────────────────────────────────
   HERO — rebuild + mobile fix

   MOBILE FIX (the only change from the previous rewrite):
   `h-[130vh]` on the section and `h-screen` on the sticky
   inner div both resolve to `vh`, which on mobile Safari/Chrome
   is measured against the *maximum* viewport — i.e. as if the
   address bar were already hidden. The address bar starts
   visible, so on load the sticky inner div is taller than what's
   actually on screen, and the scroll-exit runway (130vh - 100vh
   = 30vh) is calculated against a viewport you don't yet have.
   Net effect on a phone: the hero can show a gap of bare
   background below the content on first load, and the scroll-exit
   timing drifts as the address bar collapses. Swapped both to
   `svh` (small viewport height — the guaranteed-visible minimum,
   address bar accounted for), which is the correct unit for
   "fill exactly what's on screen right now." Nothing else here
   changed; the rest of this file is the existing rewrite
   (GSAP entrance timeline, GSAP scroll-exit scrub, Framer pointer
   tilt/glow) untouched.
───────────────────────────────────────────────────────── */

const LINES = ["Engineered", "to win."];

export function Hero({ ready = true }: { ready?: boolean }) {
  const reduced = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const rigRef = React.useRef<HTMLDivElement>(null);
  const tiltRef = React.useRef<HTMLDivElement>(null);
  const introRef = React.useRef<HTMLDivElement>(null);
  const cueRef = React.useRef<HTMLButtonElement>(null);
  const entranceTl = React.useRef<gsap.core.Timeline | null>(null);
  const cursor = useCursor();
  const { scrollTo } = useLenis();

  /* ── Pointer-tracked glow + rig tilt (live cursor, not scroll) ── */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, SPRING.scroll);
  const spy = useSpring(py, SPRING.scroll);

  const glowBg = useTransform([spx, spy], ([x, y]) =>
    `radial-gradient(38rem 30rem at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,106,26,0.16), transparent 70%)`
  );

  const rigTiltY = useTransform(spx, [0, 1], [10, -10]);
  const rigTiltX = useTransform(spy, [0, 1], [-6, 6]);

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    px.set(e.clientX / window.innerWidth);
    py.set(e.clientY / window.innerHeight);
  };

  /* ── One-time load choreography — a single GSAP timeline ── */
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const lines = gsap.utils.toArray<HTMLElement>(".hero-line", sectionRef.current);

      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });

      tl.fromTo(
        rigRef.current,
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.6 },
        0.3
      )
        .fromTo(
          lines,
          { yPercent: 115, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: DUR.reveal, stagger: 0.1 },
          0.25
        )
        .fromTo(
          introRef.current,
          { opacity: 0, y: 24, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: DUR.slow },
          0.8
        )
        .fromTo(
          cueRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.7 },
          1.6
        );

      entranceTl.current = tl;

      if (reduced) tl.progress(1);
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  React.useEffect(() => {
    if (ready && !reduced) entranceTl.current?.play();
  }, [ready, reduced]);

  /* ── Scroll-linked exit — one GSAP scrub timeline ── */
  useGSAP(
    () => {
      if (reduced || !sectionRef.current || !contentRef.current || !rigRef.current) return;

      gsap.set(contentRef.current, { clipPath: "inset(0% 0% 0% 0%)" });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.4,
          },
        })
        .to(contentRef.current, { yPercent: 26, scale: 0.92, duration: 1 }, 0)
        .to(contentRef.current, { opacity: 0, duration: 0.65 }, 0)
        .to(contentRef.current, { filter: "blur(18px)", duration: 0.8 }, 0)
        .to(contentRef.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.4 }, 0.45)
        .to(rigRef.current, { yPercent: -16, duration: 1 }, 0);
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      onPointerMove={onMove}
      className="relative h-[130svh] overflow-hidden dc-grid-bg"
      aria-label="Daddu Charger — custom gaming PCs built in Rawalpindi"
    >
      <div ref={contentRef} className="sticky top-0 h-[100svh] flex flex-col justify-end">
        {/* ── Pointer-tracked glow ── */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{ background: glowBg }}
          />
        )}

        {/* ── Ambient base glow (always present) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(70rem 60rem at 65% 55%, rgba(255,106,26,0.12), transparent 70%)",
          }}
        />

        {/* ── Rig layer: GSAP owns entrance clip/scale + scroll drift ── */}
        <div
          ref={rigRef}
          aria-hidden="true"
          className="absolute inset-y-0 right-0 z-0 w-full lg:w-[62%] xl:w-[66%] 2xl:w-[70%]"
        >
          <motion.div
            ref={tiltRef}
            className="absolute inset-0"
            style={
              reduced
                ? undefined
                : {
                  transformPerspective: 1200,
                  rotateY: rigTiltY,
                  rotateX: rigTiltX,
                }
            }
          >
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_80%_50%,black_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_80%_50%,black_30%,transparent_75%)]">
              <Image
                src="/hero-pc.jpg"
                alt="Daddu Charger Custom Gaming PC"
                fill
                priority
                quality={95}
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover object-center lg:object-[center_right] opacity-40 sm:opacity-55 lg:opacity-85 xl:opacity-95"
              />
            </div>
          </motion.div>
        </div>

        {/* ── Desktop Floating HUD Spec Card ── */}
        <div className="hidden xl:flex absolute top-28 right-[clamp(2rem,4vw,6rem)] z-10 flex-col gap-2 p-4 rounded-xl border border-[var(--dc-border)] bg-[var(--dc-bg)]/85 backdrop-blur-xl max-w-xs shadow-2xl">
          <div className="flex items-center justify-between text-[11px] text-[var(--dc-accent)] font-mono font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--dc-accent)] animate-ping" />
              Flagship Rig
            </span>
            <span className="px-2 py-0.5 rounded bg-[var(--dc-orange-dim)] text-[var(--dc-accent)] text-[10px] font-semibold">
              Live Showcase
            </span>
          </div>
          <p className="text-sm font-display font-bold text-[var(--dc-text)]">Apex Volt 4090 OC</p>
          <p className="text-xs text-[var(--dc-text-muted)] font-mono leading-relaxed">
            Ryzen 9 7950X3D · RTX 4090 24GB · 64GB DDR5 · Hardline Loop
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-[var(--dc-border)] text-[11px] text-[var(--dc-text-subtle)]">
            <span>48h Burn-in Tested</span>
            <span className="text-[var(--dc-accent)] font-bold">PKR 1,250,000</span>
          </div>
        </div>

        {/* ── Headline & Content ── */}
        <div className="dc-hero-container relative z-10 pb-16 sm:pb-20">
          {/* Enthusiast Builder Chip */}
          <div className="hidden sm:inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)]/85 backdrop-blur-md mb-6 text-xs text-[var(--dc-text-muted)]">
            <span className="flex h-2 w-2 rounded-full bg-[var(--dc-accent)] animate-pulse" />
            <span className="font-mono font-semibold text-[var(--dc-accent)]">CUSTOM BUILDS</span>
            <span className="text-[var(--dc-border-strong)]">|</span>
            <span>Handcrafted in Rawalpindi</span>
            <span className="text-[var(--dc-border-strong)]">|</span>
            <span className="text-[var(--dc-text)] font-medium">Nationwide Insured Delivery</span>
          </div>

          <h1 className="font-display font-bold text-[var(--dc-text)] text-[clamp(2.25rem,11vw,12rem)] leading-[0.88] tracking-[-0.05em]">
            <span className="sr-only">Engineered to win. Built in Rawalpindi.</span>
            {LINES.map((line) => (
              <span key={line} aria-hidden="true" className="block overflow-hidden">
                <span className="hero-line block">{line}</span>
              </span>
            ))}
          </h1>

          <div
            ref={introRef}
            className="mt-8 sm:mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-[48ch] text-base sm:text-lg text-[var(--dc-text-muted)] leading-relaxed">
              Custom gaming machines specced, assembled and benchmarked in our
              Rawalpindi workshop. Genuine parts, live PKR pricing, and a real
              person on the other end afterwards.
            </p>

            <Magnetic strength={0.4}>
              <Link
                href="/build-pc"
                onMouseEnter={() => cursor.set("hover")}
                onMouseLeave={cursor.reset}
                className="group relative inline-flex h-16 items-center gap-4 overflow-hidden rounded-full bg-[var(--dc-accent)] pl-8 pr-6 text-[var(--dc-accent-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
              >
                <span className="relative z-10 text-base font-semibold" style={{ color: "var(--dc-accent-text)" }}>
                  Start your build
                </span>
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dc-accent-text)] text-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-45deg]">
                  <ArrowDownRight size={16} />
                </span>
                <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* ── Scroll cue ── */}
        <button
          ref={cueRef}
          type="button"
          onClick={() => scrollTo("#manifesto")}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 group"
          aria-label="Scroll down"
        >
          <span className="text-[10px] tracking-[0.3em] text-[var(--dc-text-subtle)] uppercase">
            Scroll
          </span>
          <motion.div
            animate={reduced ? undefined : { y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown
              size={18}
              className="text-[var(--dc-accent)] transition-transform duration-300 group-hover:translate-y-1"
            />
          </motion.div>
        </button>
      </div>
    </section>
  );
}