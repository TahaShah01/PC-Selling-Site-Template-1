"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Container, Section } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   STATEMENT + WHO WE ARE
   Oversized paragraph as a visual element, then a
   label-left / prose-right editorial row.
───────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function StatementSection() {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-120px" });

    return (
        <Section className="bg-[var(--dc-bg)]">
            <Container ref={ref} className="relative z-10">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="font-display font-medium text-[var(--dc-text)] text-[clamp(1.5rem,3.4vw,2.9rem)] leading-[1.18] tracking-[-0.02em] max-w-[30ch]"
                >
                    We spec, build and support gaming machines for people who would
                    rather play than troubleshoot.
                </motion.p>

                <div className="mt-24 grid lg:grid-cols-12 gap-x-8 gap-y-6 border-t border-[var(--dc-border)] pt-10">
                    <h2 className="lg:col-span-3 text-sm font-medium text-[var(--dc-text-subtle)]">
                        Who we are
                    </h2>

                    <div className="lg:col-span-7 lg:col-start-5 space-y-6">
                        <p className="text-[var(--dc-text-muted)] leading-relaxed max-w-[62ch]">
                            Daddu Charger is a gaming hardware shop in Rawalpindi. We stock
                            genuine, manufacturer-warranted components, and we put every
                            machine we sell through assembly, stress testing and benchmarking
                            before it leaves the workshop.
                        </p>
                        <p className="text-[var(--dc-text-muted)] leading-relaxed max-w-[62ch]">
                            Walk in and talk to the person who will build your rig. No
                            resellers in between, no counterfeit parts, no disappearing after
                            the invoice. When something goes wrong a year later, you message
                            us and we pick up.
                        </p>
                        <Link
                            href="/about"
                            className="inline-flex items-baseline text-sm text-[var(--dc-text)] border-b border-[var(--dc-border)] pb-0.5 hover:border-[var(--dc-accent)] hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)]"
                        >
                            More about the shop
                        </Link>
                    </div>
                </div>
            </Container>
        </Section>
    );
}