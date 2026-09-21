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
   HERO — rebuild

   What was actually broken, not just "could look nicer":

   ✓ Reduced motion deleted the hero instead of simplifying it.
     `show` was `ready && !reduced`, and every entrance used
     `animate={show ? end : {}}` — animating "to nothing" when
     show is false. With reduced motion on, `show` never becomes
     true, so the headline, description, CTA and scroll cue sat
     at their hidden initial values (opacity 0, y "115%")
     forever. Now there's one GSAP timeline for the whole
     entrance; a reduced-motion visitor gets it jumped straight
     to its finished frame instead of stalled on its first one.

   ✓ The rig's pointer-tilt (rotateX/rotateY) had no perspective
     anywhere in its ancestry, so it rendered as a flat skew, not
     depth. Isolated the tilt onto its own layer with a real
     `transformPerspective`, which Framer actually honors because
     it's set on a `motion.*` element this time.

   ✓ The scroll-exit (y / scale / opacity / blur / clip curtain)
     was five independent Framer transforms reading one
     scrollYProgress by hand-tuned ranges (0–0.65, 0–0.8,
     0.45–0.85...). Works, but it's a second animation system
     living alongside GSAP for no reason, and every new stage
     means inventing another range. It's now one GSAP scrub
     timeline — the same five stages, but as one number line you
     can actually read.

   Kept as Framer: the pointer glow. That's a live cursor
   position, not a scroll position — a spring is the right tool,
   a scrub timeline isn't.
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
    `radial-gradient(38rem 30rem at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(200,255,0,0.14), transparent 70%)`
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

      // Reduced motion means "don't animate," not "never finish."
      // Jump straight to the resolved frame instead of leaving
      // everything parked on its hidden starting values.
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

      // Baseline so the clip-path tween below has a real "from"
      // value to interpolate out of, instead of starting from
      // the browser's computed "none".
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
      className="relative h-[130vh] overflow-hidden"
      aria-label="Daddu Charger — custom gaming PCs built in Rawalpindi"
    >
      <div ref={contentRef} className="sticky top-0 h-screen flex flex-col justify-end">
        {/* ── Pointer-tracked glow ── */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: glowBg }}
        />

        {/* ── Ambient base glow (always present) ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(60rem 50rem at 65% 55%, rgba(200,255,0,0.05), transparent 65%)",
          }}
        />

        {/* ── Rig layer: GSAP owns entrance clip/scale + scroll drift ── */}
        <div
          ref={rigRef}
          aria-hidden="true"
          className="absolute inset-y-0 right-0 z-0 w-full lg:w-[58%]"
        >
          {/* Tilt layer: Framer owns the pointer-driven 3D tilt */}
          <motion.div
            ref={tiltRef}
            className="absolute inset-0"
            style={{
              transformPerspective: 1200,
              rotateY: rigTiltY,
              rotateX: rigTiltX,
            }}
          >
            <Image
              src="/hero-pc.jpg"
              alt=""
              fill
              priority
              quality={95}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center opacity-45 lg:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--dc-bg)] via-[var(--dc-bg)]/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--dc-bg)] to-transparent" />
          </motion.div>
        </div>

        {/* ── Headline ── */}
        <div className="dc-container relative z-10 pb-16 sm:pb-20">
          <h1 className="font-display font-bold text-[var(--dc-text)] text-[clamp(3rem,13vw,12rem)] leading-[0.86] tracking-[-0.05em]">
            <span className="sr-only">Engineered to win. Built in Rawalpindi.</span>
            {LINES.map((line) => (
              <span key={line} aria-hidden="true" className="block overflow-hidden">
                <span className="hero-line block">{line}</span>
              </span>
            ))}
          </h1>

          <div
            ref={introRef}
            className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-[46ch] text-base sm:text-lg text-[var(--dc-text-muted)] leading-relaxed">
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