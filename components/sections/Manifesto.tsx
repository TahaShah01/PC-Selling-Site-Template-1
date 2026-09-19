"use client";

import * as React from "react";
import {
    motion,
    useInView,
    useMotionValue,
    useTransform,
    animate,
    useReducedMotion,
} from "framer-motion";
import { ScrollWordFill } from "../motion/Reveal";
import { EASE, inViewOnce } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   MANIFESTO
   The statement lights up word by word as you scroll it,
   then three counters tick up once the rule passes them.
───────────────────────────────────────────────────────── */

const FIGURES = [
    { value: 500, suffix: "+", label: "Parts in stock" },
    { value: 100, suffix: "%", label: "Genuine, warranted" },
    { value: 48, suffix: "h", label: "Typical build time" },
];

export function Manifesto() {
    return (
        <section
            id="manifesto"
            className="relative z-10 bg-[var(--dc-bg)] py-[16vh] sm:py-[22vh]"
        >
            <div className="dc-container">
                <ScrollWordFill
                    text="Anyone can sell you a box of parts. We spec the machine around the games you actually play, build it by hand, run it hot for two days, and put our name on the result."
                    className="font-display font-medium text-[var(--dc-text)] text-[clamp(1.6rem,4.6vw,4rem)] leading-[1.14] tracking-[-0.03em] max-w-[22ch] sm:max-w-[26ch]"
                />

                <div className="mt-[12vh] grid grid-cols-1 sm:grid-cols-3 gap-y-10 border-t border-[var(--dc-border)] pt-10">
                    {FIGURES.map((figure, i) => (
                        <Figure key={figure.label} {...figure} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

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
        if (reduced) {
            count.set(value);
            return;
        }
        const controls = animate(count, value, {
            duration: 1.8,
            delay: 0.15 + index * 0.12,
            ease: [0.16, 1, 0.3, 1],
        });
        return () => controls.stop();
    }, [inView, value, count, index, reduced]);

    return (
        <div ref={ref}>
            <p className="font-display font-bold text-[var(--dc-text)] text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-[-0.04em] tabular-nums">
                <motion.span>{display}</motion.span>
                <span className="text-[var(--dc-accent)]">{suffix}</span>
            </p>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + index * 0.1, ease: EASE.out }}
                className="mt-3 text-sm text-[var(--dc-text-subtle)]"
            >
                {label}
            </motion.p>
        </div>
    );
}