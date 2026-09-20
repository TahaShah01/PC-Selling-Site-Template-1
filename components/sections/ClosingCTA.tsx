"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useAnimationFrame,
  wrap,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { ArrowUpRight, Star, Clock, Zap, MessageSquare, Gamepad2, type LucideIcon } from "lucide-react";
import { Magnetic, LineMask } from "../motion/Reveal";
import { useCursor } from "../motion/Cursor";

/* ─────────────────────────────────────────────────────────
   CLOSING CTA — Phase 8

   The core fix running through this rebuild: nothing is ever
   hidden by default JSX/CSS waiting for JS to reveal it.
   Every element renders in its real, final, readable state;
   GSAP's own `gsap.set(...)` establishes the "before" pose
   *only inside the effect that's about to animate it*. If
   that effect never runs — reduced motion, or any future bug
   in the effect — the content was never hidden in the first
   place. (The previous version's `style={{ opacity: 0 }}` on
   the CTA button and all three stat cards did the opposite:
   it hid them unconditionally in JSX, and only the very GSAP
   branch that's disabled under reduced motion ever set them
   back to visible. Reduced-motion visitors got an invisible
   primary CTA and zero trust signals.)

   Also:
   • the "How it works" card had no real border — its entire
     outline was the animated SVG stroke, so if that draw
     ever failed to fire the card rendered borderless. It now
     has a permanent CSS border; the SVG stroke is a bonus
     accent sweep on top of it, not the only outline.
   • the stat numbers now genuinely count up (0 → 4.9, 0 → 2,
     0 → 1,200), scroll-triggered, matching the counter motif
     from the build sequence.
   • the games marquee quadruples its list for the seamless
     loop, which meant a screen reader heard every title four
     times. It's marked decorative now, with the real list
     given once via sr-only text; hovering it also pauses it.
───────────────────────────────────────────────────────── */

const GAMES_TICKER = [
  "Valorant", "CS2", "GTA VI", "Fortnite", "Warzone",
  "Apex Legends", "Elden Ring", "Cyberpunk 2077",
  "Hogwarts Legacy", "The Last of Us", "God of War", "Spider-Man 2",
];

type Stat = {
  Icon: LucideIcon;
  accent: string;
  label: string;
  sub: string;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

const SOCIAL_PROOF: Stat[] = [
  {
    Icon: Star,
    accent: "#C8FF00",
    label: "Customer satisfaction",
    sub: "Based on 200+ build reviews",
    to: 4.9,
    decimals: 1,
    suffix: " / 5",
  },
  {
    Icon: Clock,
    accent: "#C8FF00",
    label: "Avg. response time",
    sub: "Same-day spec reply, Mon–Sat",
    to: 2,
    prefix: "< ",
    suffix: " h",
  },
  {
    Icon: Zap,
    accent: "#FF6A1A",
    label: "Builds delivered",
    sub: "And counting — since 2019",
    to: 1200,
    suffix: "+",
  },
];

const RECAP = ["Tell us", "We price it", "We build it"];

function formatCount(v: number, decimals: number) {
  return v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function ClosingCTA() {
  const ref = React.useRef<HTMLElement>(null);
  const bentoRef = React.useRef<HTMLDivElement>(null);
  const ctaBtnRef = React.useRef<HTMLAnchorElement>(null);
  const howCardRef = React.useRef<HTMLDivElement>(null);
  const borderRectRef = React.useRef<SVGRectElement>(null);
  const reduced = useReducedMotion();
  const cursor = useCursor();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  useGSAP(
    () => {
      if (reduced || !bentoRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(".social-card", bentoRef.current);
      const statEls = cards.map((c) => c.querySelector<HTMLElement>(".stat-value"));

      gsap.set(cards, { x: 60, autoAlpha: 0 });
      if (ctaBtnRef.current) gsap.set(ctaBtnRef.current, { scale: 0.5, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bentoRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      tl.to(cards, { x: 0, autoAlpha: 1, duration: 0.85, ease: "expo.out", stagger: 0.12 }, 0);

      statEls.forEach((el, i) => {
        if (!el) return;
        const to = Number(el.dataset.to);
        const decimals = Number(el.dataset.decimals ?? 0);
        const prefix = el.dataset.prefix ?? "";
        const suffix = el.dataset.suffix ?? "";
        el.textContent = prefix + formatCount(0, decimals) + suffix;
        const proxy = { v: 0 };
        tl.to(
          proxy,
          {
            v: to,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = prefix + formatCount(proxy.v, decimals) + suffix;
            },
          },
          0.15 + i * 0.12
        );
      });

      if (ctaBtnRef.current) {
        tl.to(ctaBtnRef.current, { scale: 1, autoAlpha: 1, duration: 1.0, ease: "elastic.out(1, 0.6)" }, 0.25);
      }

      let cleanupResize: (() => void) | undefined;

      if (borderRectRef.current && howCardRef.current) {
        const card = howCardRef.current;
        const rect = borderRectRef.current;

        // Measured in JS, not left to CSS calc()-in-SVG-attribute
        // support (patchy in older engines) — this guarantees
        // getTotalLength() matches the card's real rendered size.
        const setSize = () => {
          rect.setAttribute("width", String(Math.max(0, card.offsetWidth - 1)));
          rect.setAttribute("height", String(Math.max(0, card.offsetHeight - 1)));
        };
        setSize();

        const perimeter = rect.getTotalLength?.() ?? (card.offsetWidth + card.offsetHeight) * 2;
        gsap.set(rect, { strokeDasharray: perimeter, strokeDashoffset: perimeter });
        tl.to(rect, { strokeDashoffset: 0, duration: 0.9, ease: "expo.out" }, 0.1);

        const ro = new ResizeObserver(setSize);
        ro.observe(card);
        cleanupResize = () => ro.disconnect();
      }

      return () => {
        tl.kill();
        cleanupResize?.();
      };
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <section
      ref={ref}
      className="relative z-10 overflow-hidden bg-[var(--dc-bg-elevated)]"
      aria-label="Start your build"
      style={{ isolation: "isolate" }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: bgOpacity,
          background: "radial-gradient(80rem 60rem at 50% 60%, rgba(200,255,0,0.10), transparent 65%)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, #C8FF00, transparent 30%, #FF6A1A, transparent 60%, #C8FF00)",
        }}
      />

      <div className="dc-container relative py-[16vh]">
        <motion.div style={{ scale }}>
          <h2 className="origin-left font-display text-[clamp(2.5rem,9vw,8rem)] font-bold leading-[0.9] text-[var(--dc-text)]">
            <LineMask lines={["Tell us what", "you play."]} />
          </h2>
        </motion.div>

        <div ref={bentoRef} className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* ── LEFT: how-it-works + CTA ── */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div
              ref={howCardRef}
              className="relative rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-6 transition-colors duration-500 hover:border-[var(--dc-accent)]/30"
            >
              {/* Accent stroke sweep — decorative, sits on top of the real border above */}
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                fill="none"
              >
                <rect
                  ref={borderRectRef}
                  className="card-border-path"
                  x="0.5"
                  y="0.5"
                  rx="var(--dc-radius-xl, 16px)"
                  stroke="rgba(200,255,0,0.5)"
                  strokeWidth="1"
                />
              </svg>

              <div className="mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-[var(--dc-accent)]" />
                <span className="text-xs uppercase tracking-[0.12em] text-[var(--dc-accent)]">How it works</span>
              </div>
              <p className="leading-relaxed text-[var(--dc-text-muted)]">
                Send us your budget and your game list. You get a parts list, a price in PKR and an
                honest opinion on what to cut — usually the same day.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--dc-text-subtle)]">
                {RECAP.map((label, i) => (
                  <React.Fragment key={label}>
                    <span className="flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--dc-border)] text-[9px] tabular-nums">
                        {i + 1}
                      </span>
                      {label}
                    </span>
                    {i < RECAP.length - 1 && <span className="h-px w-4 bg-[var(--dc-border)]" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Magnetic strength={0.4}>
                <Link
                  ref={ctaBtnRef}
                  href="/build-pc"
                  onMouseEnter={() => cursor.set("hover")}
                  onMouseLeave={cursor.reset}
                  aria-label="Start a build"
                  className="group relative flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
                >
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[var(--dc-accent)]/40"
                    animate={reduced ? undefined : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    style={{ borderTopColor: "var(--dc-accent)", borderTopWidth: "2px" }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-[-10px] rounded-full border border-[var(--dc-accent)]/15"
                    animate={reduced ? undefined : { scale: [1, 1.1, 1], opacity: [0.3, 0.08, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />

                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-95">
                    <span
                      className="px-2 text-center text-sm font-bold leading-snug"
                      style={{ color: "var(--dc-accent-text)" }}
                    >
                      Start a
                      <br />
                      build
                    </span>
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="absolute bottom-[22%] right-[22%] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                      style={{ color: "var(--dc-accent-text)" }}
                    />
                  </div>
                </Link>
              </Magnetic>

              <Link
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => cursor.set("hover")}
                onMouseLeave={cursor.reset}
                className="group flex items-center gap-2 rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] px-5 py-3 text-sm text-[var(--dc-text-muted)] transition-all duration-300 hover:border-[#25D366]/40 hover:text-[var(--dc-text)]"
              >
                <span className="h-2 w-2 rounded-full bg-[#25D366] transition-all group-hover:shadow-[0_0_8px_#25D366]" />
                WhatsApp us
              </Link>
            </div>
          </div>

          {/* ── RIGHT: social proof ── */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            {SOCIAL_PROOF.map((item) => (
              <div key={item.label} className="social-card">
                <SocialCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-[var(--dc-border)] py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--dc-bg-elevated)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--dc-bg-elevated)] to-transparent" />
        <GamesTicker items={GAMES_TICKER} reduced={!!reduced} />
      </div>
    </section>
  );
}

/* ── Seamless games ticker — decorative, pauses on hover ── */
function GamesTicker({ items, reduced }: { items: string[]; reduced: boolean }) {
  const baseX = useMotionValue(0);
  const paused = React.useRef(false);
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const row = [...items, ...items, ...items, ...items];

  useAnimationFrame((_, delta) => {
    if (reduced || paused.current) return;
    baseX.set(baseX.get() - 0.15 * (delta / 16.67));
  });

  return (
    <div onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <span className="sr-only">Games we build and tune for: {items.join(", ")}.</span>
      <motion.div
        aria-hidden="true"
        className="flex whitespace-nowrap"
        style={reduced ? undefined : { x }}
      >
        {row.map((game, i) => (
          <span key={i} className="mr-8 flex items-center gap-2 text-sm text-[var(--dc-text-subtle)]">
            <Gamepad2 size={12} className="text-[var(--dc-accent)]" />
            {game}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Social proof card ── */
function SocialCard({ item }: { item: Stat }) {
  const { Icon, accent, label, sub, to, decimals = 0, prefix = "", suffix = "" } = item;
  return (
    <div className="group relative overflow-hidden rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-5 transition-colors duration-500 hover:border-[var(--dc-accent)]/30">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}10, transparent 60%)` }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--dc-radius-md)]"
            style={{ background: `${accent}18` }}
          >
            <Icon size={18} style={{ color: accent }} />
          </div>
          <div>
            <p className="text-[11px] text-[var(--dc-text-subtle)]">{label}</p>
            <p className="mt-0.5 text-sm text-[var(--dc-text-muted)]">{sub}</p>
          </div>
        </div>
        <p
          className="stat-value shrink-0 font-display text-2xl font-bold tracking-[-0.03em] tabular-nums"
          data-to={to}
          data-decimals={decimals}
          data-prefix={prefix}
          data-suffix={suffix}
          style={{ color: accent }}
        >
          {prefix}
          {formatCount(to, decimals)}
          {suffix}
        </p>
      </div>
    </div>
  );
}