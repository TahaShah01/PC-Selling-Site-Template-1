"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Container, Section } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   WHAT WE DO
   Full-width rule-separated rows. Heading left, description
   right. The rule and the hover shift carry the structure —
   no cards.
───────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const SERVICES = [
    {
        title: "Custom builds",
        description:
            "Pick every part with live compatibility checks and PKR pricing. We assemble, cable-manage and benchmark it.",
        href: "/build-pc",
    },
    {
        title: "Components",
        description:
            "GPUs, CPUs, boards, memory, storage, cooling and power — sourced genuine, warranted by the manufacturer.",
        href: "/categories/components",
    },
    {
        title: "Peripherals",
        description:
            "Monitors, keyboards, mice, headsets and chairs, chosen because we use them, not because margins are good.",
        href: "/categories/peripherals",
    },
    {
        title: "Upgrades & repairs",
        description:
            "Bring in the machine you already own. We diagnose it, tell you what is worth replacing, and say so when nothing is.",
        href: "/services/upgrades",
    },
    {
        title: "Ready builds",
        description:
            "Pre-configured rigs at fixed price points, in stock and tested — for when you want it working this week.",
        href: "/gaming-pcs",
    },
];

export function CapabilitiesSection() {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <Section className="bg-[var(--dc-bg)]">
            <Container ref={ref} className="relative z-10">
                <div className="grid lg:grid-cols-12 gap-8">
                    <h2 className="lg:col-span-3 text-sm font-medium text-[var(--dc-text-subtle)]">
                        What we do
                    </h2>

                    <div className="lg:col-span-9">
                        <ul className="border-t border-[var(--dc-border)]">
                            {SERVICES.map((service, i) => (
                                <motion.li
                                    key={service.title}
                                    initial={{ opacity: 0 }}
                                    animate={inView ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                                    className="border-b border-[var(--dc-border)]"
                                >
                                    <Link
                                        href={service.href}
                                        className="group grid md:grid-cols-12 gap-x-8 gap-y-2 py-8 md:py-10 transition-colors duration-[var(--dc-duration-normal)] hover:bg-[var(--dc-card)]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dc-accent)] md:px-2"
                                    >
                                        <h3 className="md:col-span-5 font-display font-semibold text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.1] tracking-[-0.02em] text-[var(--dc-text)] group-hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-normal)]">
                                            {service.title}
                                        </h3>
                                        <p className="md:col-span-7 text-[var(--dc-text-muted)] leading-relaxed max-w-[58ch] self-center">
                                            {service.description}
                                        </p>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                        <p className="mt-10 text-[var(--dc-text-muted)] leading-relaxed max-w-[58ch]">
                            There is no fixed package. Tell us the games you play, the
                            resolution you want and the budget you have, and we will build
                            back from that.
                        </p>
                    </div>
                </div>
            </Container>
        </Section>
    );
}