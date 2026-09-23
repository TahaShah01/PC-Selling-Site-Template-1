"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { ScrollWordFill } from "../motion/Reveal";
import { EASE, inViewOnce } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   MANIFESTO — Phase 2 + mobile fix

   MOBILE FIX: the pin (`height: 300vh`, GSAP pinning the cards
   in from the right over 200% of scroll) now only runs when
   `isDesktop` — same reasoning as BuildSequence: pinning fights
   touch-scroll momentum and costs three screens of vertical
   scroll for four cards, on the device where scroll distance
   matters most.

   Below `lg`, the section is un-pinned, un-heighted, and the
   cards render in normal flow with a plain Framer `whileInView`
   stagger instead of the GSAP scrub timeline. The cards were
   never hidden by static CSS in the first place — the GSAP
   effect below sets `opacity:0` itself, only when it's about to
   run — so skipping that effect on mobile was already safe by
   construction; this just adds a real entrance for mobile
   instead of "no entrance at all."

   Everything else — the ScrollWordFill on the left, the counter
   cards' own logic, the trust checklist — is untouched.
───────────────────────────────────────────────────────── */

const FIGURES = [
  { value: 500, suffix: "+", label: "Parts in stock" },
  { value: 100, suffix: "%", label: "Genuine, warranted" },
  { value: 48, suffix: "h", label: "Typical build time" },
];

const TRUST_ITEMS = [
  "Hand-built in Rawalpindi",
  "48 h burn-in on every PC",
  "Manufacturer warranty included",
  "Same-day spec + price reply",
];

export function Manifesto() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const usePinned = isDesktop && !reduced;

  useGSAP(
    () => {
      if (!usePinned || !sectionRef.current || !cardsRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(".manifesto-card", cardsRef.current);

      gsap.set(cards, {
        x: 110,
        opacity: 0,
        rotateY: 8,
        transformOrigin: "left center",
        transformPerspective: 1000,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: pinRef.current,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      cards.forEach((card, i) => {
        const start = i * 0.22;
        tl.to(card, { x: 0, opacity: 1, rotateY: 0, duration: 1, ease: "expo.out" }, start);
      });

      return () => {
        tl.kill();
      };
    },
    { scope: sectionRef, dependencies: [usePinned] }
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.3"],
  });

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-[var(--dc-bg)] dc-grid-bg"
      style={usePinned ? { height: "300vh" } : undefined}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[60vh] w-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,106,26,0.08),transparent_70%)]"
      />

      <div ref={pinRef} className={usePinned ? "will-change-transform" : undefined}>
        <div className="dc-container-wide py-[10vh] sm:py-[16vh] lg:py-[20vh]">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 lg:items-center">
            {/* ── LEFT: scroll word-fill ── */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewOnce}
                transition={{ duration: 0.6, ease: EASE.out }}
                className="mb-8 text-xs uppercase tracking-[0.14em] text-[var(--dc-accent)]"
              >
                Our philosophy
              </motion.p>

              <ScrollWordFill
                text="Anyone can sell you a box of parts. We spec the machine around the games you actually play, build it by hand, run it hot for two days, and put our name on the result."
                className="font-display font-medium text-[var(--dc-text)] text-[clamp(1.6rem,3.6vw,3.4rem)] leading-[1.14] tracking-[-0.03em]"
              />

              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={inViewOnce}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.4 } },
                }}
                className="mt-10 space-y-3"
              >
                {TRUST_ITEMS.map((item) => (
                  <motion.li
                    key={item}
                    variants={{
                      hidden: { opacity: 0, x: -18 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE.out } },
                    }}
                    className="flex items-center gap-3 text-sm text-[var(--dc-text-muted)]"
                  >
                    <span className="h-px w-4 shrink-0 bg-[var(--dc-accent)]" />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* ── RIGHT: cards ── */}
            {usePinned ? (
              <div ref={cardsRef} className="flex flex-col gap-5">
                {FIGURES.map((figure, i) => (
                  <div key={figure.label} className="manifesto-card">
                    <Figure {...figure} index={i} />
                  </div>
                ))}
                <div className="manifesto-card">
                  <LiveCard />
                </div>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={inViewOnce}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                className="flex flex-col gap-5"
              >
                {FIGURES.map((figure, i) => (
                  <motion.div
                    key={figure.label}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.out } },
                    }}
                  >
                    <Figure {...figure} index={i} />
                  </motion.div>
                ))}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.out } },
                  }}
                >
                  <LiveCard />
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Animated counter card ─── */
function Figure({
  value,
  suffix,
  label,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, inViewOnce);
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => Math.round(v).toString());

  React.useEffect(() => {
    if (!inView) return;
    if (reduced) { count.set(value); return; }
    const controls = animate(count, value, {
      duration: 1.8,
      delay: 0.1 + index * 0.1,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, value, count, index, reduced]);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-6 transition-colors duration-500 hover:border-[var(--dc-accent)]/30"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top_right,rgba(255,106,26,0.10),transparent_60%)]"
      />
      <div className="relative flex items-end justify-between">
        <div>
          <p className="font-display font-bold text-[var(--dc-text)] text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-[-0.04em] tabular-nums">
            <motion.span>{display}</motion.span>
            <span className="text-[var(--dc-accent)]">{suffix}</span>
          </p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 + index * 0.1, ease: EASE.out }}
            className="mt-2 text-sm text-[var(--dc-text-subtle)]"
          >
            {label}
          </motion.p>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: EASE.out, delay: 0.4 + index * 0.12 }}
          className="mb-1 h-px w-12 origin-right bg-[var(--dc-accent)] opacity-50"
        />
      </div>
    </div>
  );
}

/* ─── Live pulse card ─── */
function LiveCard() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, inViewOnce);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[var(--dc-radius-xl)] border border-[var(--dc-accent)]/20 bg-[var(--dc-accent-dim)] p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--dc-accent)] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--dc-accent)]" />
            </span>
            <span className="text-xs uppercase tracking-[0.12em] text-[var(--dc-accent)]">
              Open for builds
            </span>
          </div>
          <p className="font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-[var(--dc-text)]">
            DM us your game list.
            <br />
            Get a spec today.
          </p>
        </div>
        <motion.svg
          width="36"
          height="36"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          animate={inView ? { rotate: [0, -8, 8, 0] } : {}}
          transition={{ duration: 1.4, ease: EASE.out, delay: 0.6, repeat: Infinity, repeatDelay: 4 }}
        >
          <path d="M9 1L3 9H8L7 15L13 7H8L9 1Z" fill="var(--dc-accent)" strokeLinejoin="round" />
        </motion.svg>
      </div>
    </div>
  );
}