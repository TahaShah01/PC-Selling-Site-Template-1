"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Container, Section } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   HOW A BUILD GOES
   A genuine four-step sequence, so it is numbered.
───────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const STEPS = [
    {
        title: "Spec",
        body: "We start from what you actually play and the resolution you want, then work back to parts that hit it without overspending.",
    },
    {
        title: "Source",
        body: "Everything is ordered genuine, with manufacturer warranty. If a part is not in stock, we tell you the wait instead of substituting it quietly.",
    },
    {
        title: "Build & test",
        body: "Assembly, cable management, BIOS setup, thermal and stability testing, then benchmarks in your games. You get the numbers before delivery.",
    },
    {
        title: "Support",
        body: "Driver help, upgrades, RMA handling. Message us on WhatsApp and you reach the workshop, not a ticket queue.",
    },
];

export function ProcessSection() {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <Section id="process" className="bg-[var(--dc-bg-elevated)]">
            <Container ref={ref} className="relative z-10">
                <div className="grid lg:grid-cols-12 gap-8">
                    <h2 className="lg:col-span-3 text-sm font-medium text-[var(--dc-text-subtle)]">
                        How a build goes
                    </h2>

                    <ol className="lg:col-span-9 grid sm:grid-cols-2 gap-x-8">
                        {STEPS.map((step, i) => (
                            <motion.li
                                key={step.title}
                                initial={{ opacity: 0, y: 12 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                className="border-t border-[var(--dc-border)] py-8"
                            >
                                <div className="flex items-baseline justify-between gap-4 mb-4">
                                    <h3 className="font-display font-semibold text-[clamp(1.35rem,2.2vw,1.9rem)] tracking-[-0.02em] text-[var(--dc-text)]">
                                        {step.title}
                                    </h3>
                                    <span className="text-xs tabular-nums text-[var(--dc-accent)]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--dc-text-muted)] leading-relaxed max-w-[46ch]">
                                    {step.body}
                                </p>
                            </motion.li>
                        ))}
                    </ol>
                </div>
            </Container>
        </Section>
    );
}