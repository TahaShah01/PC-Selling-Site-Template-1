"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_CATEGORIES } from "../../data/categories";
import { useCursor } from "../motion/Cursor";
import { SPRING } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   HORIZONTAL SHOWCASE
   Vertical scroll is translated into a horizontal track.
   Each panel counter-parallaxes its image so the row has
   depth instead of sliding as one rigid strip.
───────────────────────────────────────────────────────── */

export function HorizontalShowcase() {
    const ref = React.useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const cursor = useCursor();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    const raw = useTransform(scrollYProgress, [0, 1], ["2%", "-78%"]);
    const x = useSpring(raw, SPRING.scroll);

    const items = FEATURED_CATEGORIES;

    return (
        <section
            ref={ref}
            className="relative z-10 bg-[var(--dc-bg)]"
            style={{ height: `${Math.max(2, items.length * 0.55)}00vh` }}
            aria-label="Shop by category"
        >
            <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
                <div className="dc-container mb-10 flex items-end justify-between gap-6">
                    <h2 className="font-display font-bold text-[var(--dc-text)] text-[clamp(1.75rem,4vw,3.25rem)] leading-none tracking-[-0.03em]">
                        Everything in the rig
                    </h2>
                    <span className="hidden sm:block text-xs text-[var(--dc-text-subtle)]">
                        Keep scrolling
                    </span>
                </div>

                <motion.div
                    className="flex gap-4 sm:gap-6 pl-[max(1.25rem,calc((100vw-var(--dc-container-max,88rem))/2+1.25rem))]"
                    style={reduced ? undefined : { x }}
                    onMouseEnter={() => cursor.set("label", "Scroll")}
                    onMouseLeave={cursor.reset}
                >
                    {items.map((category, i) => (
                        <Panel key={category.id} index={i} progress={scrollYProgress} category={category} />
                    ))}

                    {/* Tail card */}
                    <Link
                        href="/categories"
                        className="group relative flex h-[58vh] w-[78vw] shrink-0 flex-col justify-between rounded-[var(--dc-radius-2xl)] border border-[var(--dc-accent)]/40 bg-[var(--dc-accent-dim)] p-8 sm:w-[34vw]"
                    >
                        <span className="text-xs text-[var(--dc-accent)]">Everything else</span>
                        <span className="font-display font-bold text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.02] tracking-[-0.03em] text-[var(--dc-text)]">
                            Browse the full catalogue
                            <ArrowUpRight
                                className="ml-2 inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:-translate-y-2"
                                size={28}
                            />
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

function Panel({
    category,
    index,
    progress,
}: {
    category: (typeof FEATURED_CATEGORIES)[number];
    index: number;
    progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
    const cursor = useCursor();
    // Slight counter-drift per panel = depth
    const drift = useTransform(progress, [0, 1], [index % 2 === 0 ? 40 : -40, 0]);

    return (
        <motion.div style={{ y: drift }} className="shrink-0">
            <Link
                href={category.href}
                onMouseEnter={() => cursor.set("view", "Open")}
                onMouseLeave={() => cursor.set("label", "Scroll")}
                className="group relative flex h-[58vh] w-[78vw] flex-col justify-between overflow-hidden rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-card)] p-8 sm:w-[34vw] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 translate-y-full bg-[var(--dc-accent)] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                />

                <span className="relative z-10 text-xs tabular-nums text-[var(--dc-text-subtle)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]/70">
                    {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative z-10">
                    <h3 className="font-display font-bold text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.02] tracking-[-0.03em] text-[var(--dc-text)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]">
                        {category.shortTitle}
                    </h3>
                    {category.productCount && (
                        <p className="mt-2 text-sm text-[var(--dc-text-subtle)] transition-colors duration-500 group-hover:text-[var(--dc-accent-text)]/70">
                            {category.productCount}+ products
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}