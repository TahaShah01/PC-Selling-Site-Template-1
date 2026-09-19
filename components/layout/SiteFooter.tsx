"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { BUSINESS } from "../../data/business";
import { FOOTER_NAV } from "../../data/navigation";
import { useCursor } from "../motion/Cursor";
import { Magnetic } from "../motion/Reveal";
import { useLenis } from "../providers/SmoothScrollProvider";
import { EASE, inViewOnce } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   SITE FOOTER

   Fixed from the previous pass (per your screenshot):
   • min-h-svh + justify-between stretched three short bands
     across a full viewport, so on most screens it produced
     two large dead gaps instead of a designed layout. Height
     now comes from real padding, not from forcing content to
     fill a viewport it doesn't need.
   • the column grid was a fixed 6 tracks; with 5 actual
     columns (3 nav groups + Visit + Follow) that left an
     empty 6th track — the block of blank space on the right
     in your screenshot. It's now auto-fit, so it always fills
     however many columns FOOTER_NAV actually has.
   • the floating white dot in the screenshot is your custom
     cursor (mix-blend-mode dot) sitting wherever the pointer
     was — real, working code, not a footer bug. A full-page
     screenshot just freezes a `position: fixed` element at
     one spot instead of scrolling it out of frame.
───────────────────────────────────────────────────────── */

const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "WhatsApp", href: "#" },
];

export function SiteFooter() {
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const cursor = useCursor();
  const { scrollTo } = useLenis();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end end"],
  });
  const markY = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const markScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const washOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const navGroups = Object.values(FOOTER_NAV);

  return (
    <footer
      ref={ref}
      role="contentinfo"
      className="relative z-10 overflow-hidden bg-[var(--dc-bg-elevated)]"
    >
      <motion.div
        aria-hidden="true"
        style={{ opacity: washOpacity }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70rem_40rem_at_50%_115%,rgba(200,255,0,0.12),transparent_70%)]"
      />

      {/* ── 1. CONTACT STRIP ── */}
      <div className="dc-gutter relative pt-[8vh] sm:pt-[10vh]">
        <p className="mb-5 text-xs text-[var(--dc-text-subtle)]">Talk to the workshop</p>
        <a
          href="https://wa.me/00000000000"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => cursor.set("view", "Message")}
          onMouseLeave={cursor.reset}
          className="group relative block overflow-hidden border-y border-[var(--dc-border)] py-6"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 bg-[var(--dc-accent)] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
          />
          <span className="relative flex items-center justify-between gap-6">
            <span className="font-display text-[clamp(1.75rem,6vw,5rem)] font-bold leading-none tracking-[-0.04em] text-[var(--dc-text)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]">
              WhatsApp us
            </span>
            <ArrowUpRight
              className="shrink-0 text-[var(--dc-text-subtle)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:text-[var(--dc-accent-text)]"
              size={40}
            />
          </span>
        </a>
      </div>

      {/* ── 2. COLUMNS ──
          auto-fit + minmax instead of a fixed track count: this
          always fills the row edge to edge no matter how many
          groups FOOTER_NAV has (currently nav groups + Visit +
          Follow), so there's never a phantom empty column. */}
      <div className="dc-gutter relative grid grid-cols-2 gap-x-8 gap-y-12 py-[7vh] sm:grid-cols-3 md:py-[8vh] lg:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
        {navGroups.map((group, gi) => (
          <motion.nav
            key={group.title}
            aria-label={group.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.7, ease: EASE.out, delay: gi * 0.06 }}
          >
            <h2 className="mb-5 text-xs text-[var(--dc-text-subtle)]">{group.title}</h2>
            <ul className="space-y-3">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative inline-block text-sm text-[var(--dc-text-muted)] transition-colors hover:text-[var(--dc-text)]"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease: EASE.out, delay: navGroups.length * 0.06 }}
        >
          <h2 className="mb-5 text-xs text-[var(--dc-text-subtle)]">Visit</h2>
          <address className="not-italic text-sm leading-relaxed text-[var(--dc-text-muted)]">
            {BUSINESS.city}
            <br />
            Punjab, Pakistan
          </address>
          <LocalTime />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.7, ease: EASE.out, delay: (navGroups.length + 1) * 0.06 }}
        >
          <h2 className="mb-5 text-xs text-[var(--dc-text-subtle)]">Follow</h2>
          <ul className="space-y-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block h-5 overflow-hidden text-sm text-[var(--dc-text-muted)]"
                >
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                    {s.label}
                  </span>
                  <span className="absolute inset-0 block translate-y-full text-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                    {s.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── 3. WORDMARK ──
          Fixed presence via border + padding, not viewport
          math — reads as an intentional closing band at any
          screen height instead of stretching to fill one. */}
      <div className="relative border-t border-[var(--dc-border)]">
        <div className="dc-gutter flex items-end justify-between gap-6 pt-8">
          <p className="max-w-[34ch] text-xs leading-relaxed text-[var(--dc-text-subtle)]">
            {BUSINESS.tagline}. Built, tested and supported in Pakistan.
          </p>

          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              onMouseEnter={() => cursor.set("hover")}
              onMouseLeave={cursor.reset}
              aria-label="Back to top"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--dc-border)] text-[var(--dc-text-muted)] transition-colors hover:border-[var(--dc-accent)] hover:text-[var(--dc-accent)]"
            >
              <ArrowUp size={18} />
            </button>
          </Magnetic>
        </div>

        <div className="dc-gutter overflow-hidden pt-4">
          <motion.p
            style={reduced ? undefined : { y: markY, scale: markScale }}
            className="origin-bottom font-display text-[13.5vw] font-bold leading-[0.78] tracking-[-0.055em] text-[var(--dc-text)]"
          >
            daddu<span className="text-[var(--dc-accent)]">charger</span>
          </motion.p>
        </div>

        <div className="border-t border-[var(--dc-border)]">
          <div className="dc-gutter flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-[var(--dc-text-subtle)]">
            <span>
              © {new Date().getFullYear()} {BUSINESS.legalName}
            </span>
            <span className="flex gap-5">
              <Link href="/privacy" className="hover:text-[var(--dc-text)] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[var(--dc-text)] transition-colors">
                Terms
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Live local time, ticking ─── */
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
    <p className="mt-5 flex items-center gap-2 text-sm tabular-nums text-[var(--dc-text-subtle)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--dc-accent)]" aria-hidden="true" />
      {/* suppressHydrationWarning: server has no client clock */}
      <span suppressHydrationWarning>{time ?? "--:--:--"} PKT</span>
    </p>
  );
}