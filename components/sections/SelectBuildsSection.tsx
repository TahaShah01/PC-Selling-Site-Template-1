"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Container, Section } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   SELECT BUILDS
   Large image tiles, caption below. Replace BUILDS with real
   product data when the catalogue is wired up.
───────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type Build = {
    name: string;
    summary: string;
    spec: string;
    price: string;
    href: string;
    image: string;
};

const BUILDS: Build[] = [
    {
        name: "Volt 4070",
        summary: "1440p high refresh",
        spec: "Ryzen 7 7800X3D · RTX 4070 Super · 32GB DDR5",
        price: "PKR 585,000",
        href: "/gaming-pcs/volt-4070",
        image: "/hero-pc.jpg",
    },
    {
        name: "Compact ITX",
        summary: "Small form factor",
        spec: "Core i5-14600K · RTX 4060 Ti · 32GB DDR5",
        price: "PKR 395,000",
        href: "/gaming-pcs/compact-itx",
        image: "/category_grid_bg_1789821288197.jpg",
    },
    {
        name: "Café Ten",
        summary: "Ten-unit gaming café fitout",
        spec: "Core i3-13100F · RTX 3050 · 16GB DDR4",
        price: "From PKR 165,000 / unit",
        href: "/gaming-pcs/cafe-ten",
        image: "/circuit-bg.jpg",
    },
];

export function SelectBuildsSection() {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <Section className="bg-[var(--dc-bg)]">
            <Container ref={ref} className="relative z-10">
                <div className="flex items-baseline justify-between gap-6 mb-10">
                    <h2 className="text-sm font-medium text-[var(--dc-text-subtle)]">
                        Select builds
                    </h2>
                    <Link
                        href="/gaming-pcs"
                        className="text-sm text-[var(--dc-text-muted)] border-b border-transparent pb-0.5 hover:text-[var(--dc-text)] hover:border-[var(--dc-border)] transition-colors duration-[var(--dc-duration-fast)]"
                    >
                        All builds
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                    {BUILDS.map((build, i) => (
                        <motion.article
                            key={build.name}
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                        >
                            <Link href={build.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]">
                                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--dc-surface)]">
                                    <Image
                                        src={build.image}
                                        alt={`${build.name} — ${build.spec}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                                    />
                                </div>

                                <div className="pt-5 border-t border-[var(--dc-border)] mt-5 flex items-baseline justify-between gap-4">
                                    <h3 className="font-display font-semibold text-xl tracking-[-0.02em] text-[var(--dc-text)] group-hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)]">
                                        {build.name}
                                    </h3>
                                    <span className="text-xs text-[var(--dc-text-subtle)]">
                                        {build.summary}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-[var(--dc-text-muted)]">{build.spec}</p>
                                <p className="mt-1 text-sm tabular-nums text-[var(--dc-text-subtle)]">
                                    {build.price}
                                </p>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </Container>
        </Section>
    );
}