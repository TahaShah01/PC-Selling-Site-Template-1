"use client";

import * as React from "react";
import {
    motion,
    useScroll,
    useVelocity,
    useSpring,
    useTransform,
    useMotionValue,
    useAnimationFrame,
    wrap,
    useReducedMotion,
} from "framer-motion";
import { BUSINESS } from "../../data/business";

/* ─────────────────────────────────────────────────────────
   VELOCITY MARQUEE
   Base speed constant; scroll velocity adds drag, reverses
   direction when you scroll up, and skews the whole row.
   This is the small delight people notice second.
───────────────────────────────────────────────────────── */

export function VelocityMarquee({
    items = BUSINESS.featuredBrands,
    baseVelocity = 3,
}: {
    items?: string[];
    baseVelocity?: number;
}) {
    const reduced = useReducedMotion();
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const factor = useTransform(smooth, [-1200, 0, 1200], [-4, 0, 4], { clamp: false });
    const skew = useTransform(smooth, [-1500, 0, 1500], [-6, 0, 6], { clamp: false });

    const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
    const direction = React.useRef(1);

    useAnimationFrame((_, delta) => {
        if (reduced) return;
        let move = direction.current * baseVelocity * (delta / 1000);
        if (factor.get() < 0) direction.current = -1;
        else if (factor.get() > 0) direction.current = 1;
        move += direction.current * move * factor.get();
        baseX.set(baseX.get() + move);
    });

    const row = [...items, ...items, ...items, ...items];

    return (
        <section
            className="relative z-10 overflow-hidden border-y border-[var(--dc-border)] bg-[var(--dc-bg)] py-6 sm:py-8"
            aria-label="Brands we stock"
        >
            <motion.div
                className="flex whitespace-nowrap"
                style={reduced ? undefined : { x, skewX: skew }}
            >
                {row.map((brand, i) => (
                    <span
                        key={`${brand}-${i}`}
                        className="mr-10 sm:mr-16 font-display font-bold text-[clamp(1.5rem,4vw,3.5rem)] leading-none tracking-[-0.03em] text-[var(--dc-text-subtle)] select-none"
                    >
                        {brand}
                        <span className="ml-10 sm:ml-16 text-[var(--dc-accent)]">/</span>
                    </span>
                ))}
            </motion.div>
        </section>
    );
}