"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Container, Section } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   WHO WE BUILD FOR
───────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const AUDIENCES = [
    {
        title: "Competitive players",
        body: "High refresh at 1080p or 1440p, low latency, stable frametimes. Nothing spent on parts that do not move your FPS.",
    },
    {
        title: "First-time builders",
        body: "You know what you want to play but not what to buy. We translate the budget into parts and explain the trade-offs.",
    },
    {
        title: "Creators & streamers",
        body: "Encoding headroom, memory, fast storage and quiet cooling — machines that hold up while recording and playing at once.",
    },
    {
        title: "Offices & cafés",
        body: "Multi-unit builds for gaming cafés, labs and studios, with consistent specs and a single point of contact for support.",
    },
];

export function AudienceSection() {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <Section className="bg-[var(--dc-bg)]">
            <Container ref={ref} className="relative z-10">
                <div className="grid lg:grid-cols-12 gap-8">
                    <h2 className="lg:col-span-4 font-display font-semibold text-[clamp(1.75rem,3.4vw,2.9rem)] leading-[1.08] tracking-[-0.03em] text-[var(--dc-text)]">
                        Who we build for
                    </h2>

                    <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-8">
                        {AUDIENCES.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                                className="border-t border-[var(--dc-border)] py-7"
                            >
                                <h3 className="text-base font-semibold text-[var(--dc-text)] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[var(--dc-text-muted)] leading-relaxed max-w-[44ch]">
                                    {item.body}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex lg:justify-end">
                    <Link
                        href="/build-pc"
                        className="inline-flex items-baseline text-sm text-[var(--dc-text)] border-b border-[var(--dc-border)] pb-0.5 hover:border-[var(--dc-accent)] hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)]"
                    >
                        Configure a machine
                    </Link>
                </div>
            </Container>
        </Section>
    );
}