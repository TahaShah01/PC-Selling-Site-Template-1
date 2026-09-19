"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { EASE, DUR, SPRING } from "../../lib/motion/Motion";
import { Magnetic } from "../motion/Reveal";
import { useCursor } from "../motion/Cursor";
import { useLenis } from "../providers/SmoothScrollProvider";

/* ─────────────────────────────────────────────────────────
   HERO
   Choreography, in order:
   1. lines unmask on load (after the preloader hands off)
   2. the rig wipes in from the bottom and drifts on pointer
   3. a volt glow tracks the pointer across the whole stage
   4. on scroll the whole hero sinks, scales and blurs out,
      so the next section feels like it is passing over it
───────────────────────────────────────────────────────── */

const LINES = ["Engineered", "to win."];

export function Hero({ ready = true }: { ready?: boolean }) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const cursor = useCursor();
  const { scrollTo } = useLenis();

  /* Scroll-linked exit */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(14px)"]);
  const rigY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);

  /* Pointer-tracked glow + rig drift */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, SPRING.scroll);
  const spy = useSpring(py, SPRING.scroll);
  const glowX = useTransform(spx, [0, 1], ["30%", "70%"]);
  const glowY = useTransform(spy, [0, 1], ["35%", "65%"]);
  const rigTiltY = useTransform(spx, [0, 1], [10, -10]);
  const rigTiltX = useTransform(spy, [0, 1], [-6, 6]);

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    px.set(e.clientX / window.innerWidth);
    py.set(e.clientY / window.innerHeight);
  };

  const show = ready && !reduced;

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      className="relative h-[115vh] overflow-hidden"
      aria-label="Daddu Charger — custom gaming PCs built in Rawalpindi"
    >
      <motion.div
        style={reduced ? undefined : { y, scale, opacity, filter: blur }}
        className="sticky top-0 h-screen flex flex-col justify-end"
      >
        {/* Pointer glow */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: `radial-gradient(38rem 30rem at ${""}50% 50%, rgba(200,255,0,0.13), transparent 70%)`,
              backgroundPositionX: glowX,
              backgroundPositionY: glowY,
            }}
          />
        )}

        {/* Rig */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 z-0 w-full lg:w-[58%]"
          style={reduced ? undefined : { y: rigY, rotateY: rigTiltY, rotateX: rigTiltX }}
          initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 }}
          animate={show ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : {}}
          transition={{ duration: 1.6, ease: EASE.out, delay: 0.3 }}
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

        {/* Headline */}
        <div className="dc-container relative z-10 pb-16 sm:pb-20">
          <h1 className="font-display font-bold text-[var(--dc-text)] text-[clamp(3rem,13vw,12rem)] leading-[0.86] tracking-[-0.05em]">
            <span className="sr-only">Engineered to win. Built in Rawalpindi.</span>
            {LINES.map((line, i) => (
              <span key={line} aria-hidden="true" className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "115%", rotate: 4 }}
                  animate={show ? { y: "0%", rotate: 0 } : {}}
                  transition={{ duration: DUR.reveal, ease: EASE.out, delay: 0.25 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: DUR.slow, ease: EASE.out, delay: 0.8 }}
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
                <span className="relative z-10 text-base font-semibold">Start your build</span>
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dc-accent-text)] text-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-45deg]">
                  <ArrowDownRight size={16} />
                </span>
                <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-white/25 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          type="button"
          onClick={() => scrollTo("#manifesto")}
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] tracking-[0.3em] text-[var(--dc-text-subtle)] uppercase"
        >
          <motion.span
            className="block"
            animate={reduced ? undefined : { y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          >
            Scroll
          </motion.span>
        </motion.button>
      </motion.div>
    </section>
  );
}