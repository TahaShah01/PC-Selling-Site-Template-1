"use client";

import * as React from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";

export default function LatestPage() {
  const reduced = useReducedMotion();
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Filter for new products, sorted by date (mock sorting)
  const products = React.useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.isNew)
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  }, []);

  useGSAP(
    () => {
      if (!gridRef.current || reduced) return;
      const cards = gsap.utils.toArray<HTMLElement>(".product-card-item", gridRef.current);
      gsap.fromTo(
        cards,
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: gridRef, dependencies: [products, reduced] }
  );

  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Fresh Drops"
          headline={["New", "Arrivals"]}
          body="The latest hardware releases and newest additions to our catalogue."
        />

        <div className="dc-container py-16">
          <div className="mb-6 pb-4 border-b border-[var(--dc-border)]">
            <p className="text-sm text-[var(--dc-text-subtle)]">
              Showing <strong className="text-[var(--dc-text)]">{products.length}</strong> new items
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[var(--dc-text-muted)]">No new arrivals this week. Check back soon!</p>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {products.map((product) => (
                <div key={product.id} className="product-card-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </PageShell>
      <SiteFooter />
    </>
  );
}
