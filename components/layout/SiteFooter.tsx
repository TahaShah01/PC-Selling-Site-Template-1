"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowUp,
  MapPin,
  MessageCircle,
  Zap,
  Camera,
  Users,
  Play,
  Mail,
} from "lucide-react";
import { BUSINESS } from "../../data/business";
import { FOOTER_NAV } from "../../data/navigation";
import { useCursor } from "../motion/Cursor";
import { Magnetic } from "../motion/Reveal";
import { useLenis } from "../providers/SmoothScrollProvider";
import { EASE, inViewOnce } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   SITE FOOTER — complete redesign

   Layout (top → bottom):
   1. HERO CTA STRIP — full-bleed "WhatsApp us" hover reveal
   2. BRAND TICKER — horizontal marquee of stocked brands
   3. NAV GRID — logo lockup left, 3 nav columns + contact right
   4. DIVIDER ROW — stats pills (builds, satisfaction, response)
   5. WORDMARK — oversized parallax wordmark
   6. LEGAL BAR — copyright + back-to-top (scroll-aware)
───────────────────────────────────────────────────────── */

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    Icon: Camera,
    color: "#E1306C",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    Icon: Users,
    color: "#1877F2",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    Icon: Play,
    color: "#FF0000",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/923001234567",
    Icon: MessageCircle,
    color: "#25D366",
  },
];

const STATS = [
  { value: "1,200+", label: "Builds delivered" },
  { value: "4.9 / 5", label: "Customer rating" },
  { value: "< 2 h", label: "Avg. reply time" },
  { value: "Since 2019", label: "In Rawalpindi" },
];

export function SiteFooter() {
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const cursor = useCursor();
  const { scrollTo } = useLenis();

  /* Wordmark parallax */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end end"],
  });
  const washOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* Scroll-aware back-to-top */
  const { scrollY } = useScroll();
  const [showTop, setShowTop] = React.useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShowTop(y > 600));

  const navGroups = Object.values(FOOTER_NAV);

  return (
    <footer
      ref={ref}
      role="contentinfo"
      className="relative z-10 overflow-hidden bg-[var(--dc-bg-elevated)]"
    >
      {/* ── Ambient radial glow ── */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: washOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80rem_55rem_at_50%_110%,rgba(200,255,0,0.10),transparent_65%)]"
      />

      {/* ══════════════════════════════════════════════════
          1. HERO CTA STRIP — full-bleed WhatsApp reveal
      ══════════════════════════════════════════════════ */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease: EASE.out }}
          className="dc-gutter pt-[8vh] sm:pt-[10vh]"
        >
          <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--dc-accent)]">
            <Zap size={12} />
            Talk to the workshop
          </p>
        </motion.div>

        <a
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => cursor.set("view", "Message")}
          onMouseLeave={cursor.reset}
          className="group relative block overflow-hidden"
          aria-label="WhatsApp us — open chat"
        >
          {/* Full-bleed hover fill */}
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-[var(--dc-accent)] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
          />

          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.9, ease: EASE.out, delay: 0.1 }}
            className="relative flex flex-col items-center justify-center gap-3 border-y border-[var(--dc-border)] py-10 text-center group-hover:border-[var(--dc-accent)]"
            style={{ transition: "border-color 700ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--dc-text-subtle)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]/60">
              We reply same day
            </span>
            <span className="flex items-center gap-4">
              <span className="font-display text-[clamp(2rem,7vw,6rem)] font-bold leading-none tracking-[-0.04em] text-[var(--dc-text)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]">
                WhatsApp us
              </span>
              <ArrowUpRight
                className="shrink-0 text-[var(--dc-text-subtle)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:text-[var(--dc-accent-text)]"
                size={44}
              />
            </span>
          </motion.span>
        </a>
      </div>

      {/* ══════════════════════════════════════════════════
          3. NAV GRID — logo + 3 columns + contact
      ══════════════════════════════════════════════════ */}
      <div className="dc-gutter relative grid grid-cols-2 gap-x-6 gap-y-12 py-16 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr]">

        {/* Brand column */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease: EASE.out }}
          className="col-span-2 sm:col-span-3 lg:col-span-1"
        >
          {/* Logo lockup */}
          <Link
            href="/"
            className="group mb-5 inline-flex items-center gap-2.5"
            onMouseEnter={() => cursor.set("hover")}
            onMouseLeave={cursor.reset}
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--dc-radius-md)] bg-[var(--dc-accent)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M9 1L3 9H8L7 15L13 7H8L9 1Z"
                  fill="var(--dc-accent-text)"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-display text-lg font-bold leading-none tracking-[-0.03em] text-[var(--dc-text)]">
              daddu<span className="text-[var(--dc-accent)]">charger</span>
            </span>
          </Link>

          <p className="mb-6 max-w-[28ch] text-sm leading-relaxed text-[var(--dc-text-muted)]">
            Pakistan's premium gaming hardware destination. Built, tested and
            supported in Rawalpindi.
          </p>

          {/* Social icons */}
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                onMouseEnter={() => cursor.set("hover")}
                onMouseLeave={cursor.reset}
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] text-[var(--dc-text-subtle)] transition-all duration-300 hover:border-[var(--dc-accent)]/40 hover:text-[var(--dc-accent)]"
              >
                <s.Icon size={15} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Nav columns */}
        {navGroups.map((group, gi) => (
          <motion.nav
            key={group.title}
            aria-label={group.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.7, ease: EASE.out, delay: 0.08 + gi * 0.07 }}
          >
            <h2 className="mb-5 text-xs uppercase tracking-[0.12em] text-[var(--dc-text-subtle)]">
              {group.title}
            </h2>
            <ul className="space-y-3.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative inline-block text-sm text-[var(--dc-text-muted)] transition-colors duration-300 hover:text-[var(--dc-text)]"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ))}

        {/* Contact + visit column */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{
            duration: 0.7,
            ease: EASE.out,
            delay: 0.08 + navGroups.length * 0.07,
          }}
          className="space-y-6"
        >
          <div>
            <h2 className="mb-5 text-xs uppercase tracking-[0.12em] text-[var(--dc-text-subtle)]">
              Visit
            </h2>
            <div className="flex items-start gap-2 text-sm leading-relaxed text-[var(--dc-text-muted)]">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--dc-accent)]" />
              <address className="not-italic">
                {BUSINESS.city}
                <br />
                Punjab, Pakistan
              </address>
            </div>
            <a
              href={`https://maps.google.com/?q=Rawalpindi,Pakistan`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex items-center gap-1 text-xs text-[var(--dc-text-subtle)] transition-colors hover:text-[var(--dc-accent)]"
            >
              Get directions
              <ArrowUpRight
                size={11}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <LocalTime />
          </div>

          <div>
            <h2 className="mb-4 text-xs uppercase tracking-[0.12em] text-[var(--dc-text-subtle)]">
              Contact
            </h2>
            <a
              href="mailto:hello@dadducharger.com"
              className="group flex items-center gap-2 text-sm text-[var(--dc-text-muted)] transition-colors hover:text-[var(--dc-accent)]"
            >
              <Mail size={13} className="shrink-0" />
              hello@dadducharger.com
            </a>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════
          4. STATS STRIP
      ══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inViewOnce}
        transition={{ duration: 0.8, ease: EASE.out }}
        className="dc-gutter relative border-t border-[var(--dc-border)]"
      >
        <div className="grid grid-cols-2 gap-4 py-10 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.6, ease: EASE.out, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] px-5 py-4 transition-colors duration-500 hover:border-[var(--dc-accent)]/30"
            >
              {/* Hover glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top_left,rgba(200,255,0,0.07),transparent_60%)]"
              />
              <p className="relative font-display text-xl font-bold tracking-[-0.03em] text-[var(--dc-text)]">
                {stat.value}
              </p>
              <p className="relative mt-0.5 text-xs text-[var(--dc-text-subtle)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════
          5. LEGAL BAR — compact brand mark + links
      ══════════════════════════════════════════════════ */}
      <div className="relative border-t border-[var(--dc-border)]">
        <div className="dc-gutter flex flex-wrap items-center justify-between gap-4 py-6">

          <div className="flex items-center gap-3"> <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] bg-[var(--dc-accent)] shadow-[0_0_20px_rgba(200,255,0,0.12)]"> <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true" > <path d="M9 1L3 9H8L7 15L13 7H8L9 1Z" fill="var(--dc-accent-text)" strokeLinejoin="round" /> </svg> </span>

            <div className="flex items-center gap-2"> <span className="font-display text-sm font-bold tracking-[-0.03em] text-[var(--dc-text)]"> daddu<span className="text-[var(--dc-accent)]">charger</span> </span>

              <span className="h-1 w-1 rounded-full bg-[var(--dc-border)]" aria-hidden="true" />

              <span suppressHydrationWarning className="text-xs text-[var(--dc-text-subtle)]">
                © {new Date().getFullYear()} {BUSINESS.legalName}
              </span>

            </div> </div>

          {/* Scroll-aware back-to-top */}
          <AnimatePresence>
            {showTop && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.35, ease: EASE.out }}
              >
                <Magnetic strength={0.4}>
                  <button
                    type="button"
                    onClick={() => scrollTo(0)}
                    onMouseEnter={() => cursor.set("hover")}
                    onMouseLeave={cursor.reset}
                    aria-label="Back to top"
                    className="group flex h-9 w-9 items-center justify-center rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] text-[var(--dc-text-subtle)] transition-all duration-300 hover:border-[var(--dc-accent)] hover:bg-[var(--dc-accent)] hover:text-[var(--dc-accent-text)]"
                  >
                    <ArrowUp size={14} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
                  </button>
                </Magnetic>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </footer>
  );
}

/* ─── Live local time, ticking every second ─── */
function LocalTime() {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Karachi",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="mt-4 flex items-center gap-2 text-xs tabular-nums text-[var(--dc-text-subtle)]">
      <span
        className="relative flex h-1.5 w-1.5"
        aria-hidden="true"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--dc-accent)] opacity-50" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--dc-accent)]" />
      </span>
      <span suppressHydrationWarning>{time ?? "--:--:--"} PKT</span>
    </p>
  );
}