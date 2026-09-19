"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Magnetic, LineMask } from "../motion/Reveal";
import { useCursor } from "../motion/Cursor";
import { EASE, inViewOnce } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   CLOSING CTA
   The headline scales and tightens as it enters — the page
   ends on the same energy it opened with.
───────────────────────────────────────────────────────── */

export function ClosingCTA() {
    const ref = React.useRef<HTMLElement>(null);
    const reduced = useReducedMotion();
    const cursor = useCursor();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });
    const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
    const letter = useTransform(scrollYProgress, [0, 1], ["0.04em", "-0.045em"]);

    return (
        <section
            ref={ref}
            className="relative z-10 overflow-hidden bg-[var(--dc-bg-elevated)] py-[18vh]"
        >
            <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_120%,rgba(200,255,0,0.14),transparent_70%)]"
                style={{ opacity: scrollYProgress }}
            />

            <div className="dc-container relative">
                <motion.h2
                    style={reduced ? undefined : { scale, letterSpacing: letter }}
                    className="origin-left font-display font-bold text-[var(--dc-text)] text-[clamp(2.5rem,9vw,8rem)] leading-[0.9]"
                >
                    <LineMask lines={["Tell us what", "you play."]} />
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inViewOnce}
                    transition={{ duration: 0.9, ease: EASE.out, delay: 0.3 }}
                    className="mt-12 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="max-w-[44ch] text-[var(--dc-text-muted)] leading-relaxed">
                        Send us your budget and your game list. You get a parts list, a
                        price in PKR and an honest opinion on what to cut — usually the
                        same day.
                    </p>

                    <Magnetic strength={0.45}>
                        <Link
                            href="/build-pc"
                            onMouseEnter={() => cursor.set("hover")}
                            onMouseLeave={cursor.reset}
                            className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-[var(--dc-accent)] text-[var(--dc-accent-text)] sm:h-40 sm:w-40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
                        >
                            <span className="text-sm font-semibold">Start a build</span>
                            <ArrowUpRight
                                size={18}
                                className="absolute bottom-8 right-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                            />
                        </Link>
                    </Magnetic>
                </motion.div>
            </div>
        </section>
    );
}