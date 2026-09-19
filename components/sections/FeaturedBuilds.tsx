"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { EASE, inViewOnce } from "../../lib/motion/Motion";
import { useCursor } from "../motion/Cursor";

/* ─────────────────────────────────────────────────────────
   FEATURED BUILDS
   Tiles unmask with a clip-path wipe, the photo inside
   parallaxes against the frame, and the spec line slides up
   over the price on hover.

   Swap BUILDS for real product data when the catalogue is
   wired — the motion does not care what the source is.
───────────────────────────────────────────────────────── */

type Build = {
    name: string;
    tier: string;
    spec: string;
    price: string;
    href: string;
    image: string;
};

const BUILDS: Build[] = [
    {
        name: "Volt 4070",
        tier: "1440p / high refresh",
        spec: "Ryzen 7 7800X3D · RTX 4070 Super · 32GB DDR5 · 2TB NVMe",
        price: "PKR 585,000",
        href: "/gaming-pcs/volt-4070",
        image: "/hero-pc.jpg",
    },
    {
        name: "Compact ITX",
        tier: "Small form factor",
        spec: "Core i5-14600K · RTX 4060 Ti · 32GB DDR5 · 1TB NVMe",
        price: "PKR 395,000",
        href: "/gaming-pcs/compact-itx",
        image: "/category_grid_bg_1789821288197.jpg",
    },
    {
        name: "Café Ten",
        tier: "Gaming café fitout",
        spec: "Core i3-13100F · RTX 3050 · 16GB DDR4 · 512GB NVMe",
        price: "From PKR 165,000 / unit",
        href: "/gaming-pcs/cafe-ten",
        image: "/circuit-bg.jpg",
    },
];

export function FeaturedBuilds() {
    return (
        <section className="relative z-10 bg-[var(--dc-bg)] py-[14vh]" aria-label="Featured builds">
            <div className="dc-container">
                <div className="mb-12 flex items-end justify-between gap-6 border-b border-[var(--dc-border)] pb-6">
                    <h2 className="font-display font-bold text-[var(--dc-text)] text-[clamp(1.75rem,4vw,3.25rem)] leading-none tracking-[-0.03em]">
                        Recent builds
                    </h2>
                    <Link
                        href="/gaming-pcs"
                        className="text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors"
                    >
                        All builds
                    </Link>
                </div>

                <div className="grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                    {BUILDS.map((build, i) => (
                        <BuildCard key={build.name} build={build} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BuildCard({ build, index }: { build: Build; index: number }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const cursor = useCursor();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

    return (
        <motion.article
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.9, ease: EASE.out, delay: index * 0.08 }}
        >
            <Link
                href={build.href}
                onMouseEnter={() => cursor.set("view", "View build")}
                onMouseLeave={cursor.reset}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dc-accent)]"
            >
                <motion.div
                    className="relative aspect-[4/5] overflow-hidden rounded-[var(--dc-radius-xl)] bg-[var(--dc-surface)]"
                    initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                    whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    viewport={inViewOnce}
                    transition={{ duration: 1.2, ease: EASE.out, delay: 0.1 + index * 0.08 }}
                >
                    <motion.div className="absolute -inset-y-[12%] inset-x-0" style={reduced ? undefined : { y: imageY }}>
                        <Image
                            src={build.image}
                            alt={`${build.name} — ${build.spec}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                    </motion.div>

                    <span className="absolute left-4 top-4 rounded-full bg-[var(--dc-bg)]/70 px-3 py-1 text-[11px] text-[var(--dc-text-muted)] backdrop-blur-md">
                        {build.tier}
                    </span>
                </motion.div>

                <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--dc-border)] pt-4">
                    <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-[var(--dc-text)] transition-colors duration-300 group-hover:text-[var(--dc-accent)]">
                        {build.name}
                    </h3>

                    {/* Price ↔ spec swap */}
                    <div className="relative h-5 overflow-hidden text-right">
                        <span className="block text-sm tabular-nums text-[var(--dc-text-muted)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                            {build.price}
                        </span>
                        <span className="absolute inset-0 block translate-y-full text-[11px] text-[var(--dc-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                            See full spec
                        </span>
                    </div>
                </div>

                <p className="mt-2 text-sm text-[var(--dc-text-subtle)]">{build.spec}</p>
            </Link>
        </motion.article>
    );
}