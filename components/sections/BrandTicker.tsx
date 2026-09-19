"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BUSINESS } from "../../data/business";

/* ─────────────────────────────────────────────────────────
   BRAND TICKER
   Auto-scrolling infinite ticker displaying trusted brands.
───────────────────────────────────────────────────────── */

const BRANDS = BUSINESS.featuredBrands;
// Duplicate for infinite scroll illusion
const TICKER_ITEMS = [...BRANDS, ...BRANDS, ...BRANDS];

export function BrandTicker() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="border-y border-[var(--dc-border)] bg-[var(--dc-bg-elevated)] overflow-hidden py-5"
      aria-label="Trusted brands carried by Daddu Charger"
    >
      <div
        className={prefersReduced ? "flex gap-12 px-8 flex-wrap" : "flex gap-12 px-8"}
        style={
          prefersReduced
            ? {}
            : {
              animation: "ticker 24s linear infinite",
              width: "max-content",
            }
        }
      >
        {TICKER_ITEMS.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="text-sm font-semibold uppercase tracking-widest text-[var(--dc-text-subtle)] hover:text-[var(--dc-text-muted)] transition-colors duration-[var(--dc-duration-fast)] whitespace-nowrap select-none"
            aria-hidden={i >= BRANDS.length ? "true" : undefined}
          >
            {brand}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BRAND TICKER (REVERSED DIRECTION variant)
   Used as a second row on homepage for visual depth.
───────────────────────────────────────────────────────── */
export function BrandTickerReverse() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="overflow-hidden py-5" aria-hidden="true">
      <div
        className={prefersReduced ? "flex gap-12 px-8 flex-wrap" : "flex gap-12 px-8"}
        style={
          prefersReduced
            ? {}
            : {
              animation: "tickerReverse 20s linear infinite",
              width: "max-content",
            }
        }
      >
        {[...TICKER_ITEMS].reverse().map((brand, i) => (
          <span
            key={`rev-${brand}-${i}`}
            className="text-xs font-semibold uppercase tracking-widest text-[var(--dc-surface-3)] whitespace-nowrap select-none"
          >
            {brand}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes tickerReverse {
          from { transform: translateX(calc(-100% / 3)); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
