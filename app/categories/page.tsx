"use client";

import * as React from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell } from "@/components/sections/PageHero";
import { CATEGORIES } from "@/data/categories";

export default function CategoriesPage() {
  const reduced = useReducedMotion();
  const gridRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current || reduced) return;
      const cards = gsap.utils.toArray<HTMLElement>(".category-card", gridRef.current);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
          stagger: 0.05,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: gridRef, dependencies: [reduced] }
  );

  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Catalogue"
          headline={["All", "Categories"]}
          body="Browse our complete selection of premium PC hardware and gaming peripherals."
        />

        <div className="dc-container py-16 lg:py-24">
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className={`category-card group relative overflow-hidden rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-6 transition-all duration-[var(--dc-duration-normal)] hover:border-[var(--dc-border-accent)] hover:shadow-2xl`}
              >
                {/* Gradient wash on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient ?? "from-zinc-800 to-zinc-950"} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                />

                <div className="relative z-10 flex h-full flex-col">
                  {/* Icon or visual placeholder */}
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-[var(--dc-radius-lg)] bg-[var(--dc-bg)] border border-[var(--dc-border)] text-[var(--dc-text-muted)] transition-colors group-hover:border-[var(--dc-accent)] group-hover:text-[var(--dc-accent)]">
                    {/* Fallback to simple icon since we aren't dynamically importing Lucide icons yet */}
                    <span className="text-xl font-display font-bold">
                      {category.shortTitle.charAt(0)}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h2 className="mb-2 font-display text-xl font-bold tracking-tight text-[var(--dc-text)] group-hover:text-[var(--dc-accent)] transition-colors">
                      {category.title}
                    </h2>
                    <p className="text-sm text-[var(--dc-text-subtle)] line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageShell>
      <SiteFooter />
    </>
  );
}
