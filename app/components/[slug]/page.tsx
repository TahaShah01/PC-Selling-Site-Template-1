"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Filter, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES } from "@/data/categories";
import { MOCK_PRODUCTS } from "@/data/products";
import { EASE, inViewOnce, DUR, staggerList, fadeUp } from "@/lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   COMPONENTS CATEGORY PAGE  /components/[slug]
   e.g. /components/processors, /components/graphics-cards
───────────────────────────────────────────────────────── */

const COMPONENT_IDS = [
  "graphics-cards",
  "processors",
  "motherboards",
  "ram",
  "storage",
  "power-supplies",
  "cooling",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function ComponentsCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const category = CATEGORIES.find((c) => c.id === slug);

  const [sort, setSort] = React.useState("featured");
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [gridView, setGridView] = React.useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rawProducts = React.useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.category === slug),
    [slug]
  );

  const products = React.useMemo(() => {
    let list = inStockOnly ? rawProducts.filter((p) => p.inStock) : rawProducts;
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.priceSale ?? a.priceRegular) - (b.priceSale ?? b.priceRegular));
    if (sort === "price-desc") list = [...list].sort((a, b) => (b.priceSale ?? b.priceRegular) - (a.priceSale ?? a.priceRegular));
    if (sort === "newest") list = [...list].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
    return list;
  }, [rawProducts, sort, inStockOnly]);

  /* GSAP clip-path stagger on grid items */
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

  if (!category || !COMPONENT_IDS.includes(slug)) {
    return (
      <>
        <SiteHeader />
        <PageShell>
          <PageHero
            eyebrow="Components"
            headline={["Category", "not found."]}
            body="This category doesn't exist. Try browsing the shop."
          />
        </PageShell>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <PageShell>
        {/* ── HERO ── */}
        <PageHero
          eyebrow="Components"
          headline={[category.shortTitle]}
          body={category.description}
          size="sm"
        />

        {/* ── CONTENT ── */}
        <div className="dc-container-wide py-12">
          {/* Toolbar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--dc-border)] pb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] px-4 py-2 text-sm text-[var(--dc-text-muted)] transition-colors hover:border-[var(--dc-accent)] hover:text-[var(--dc-text)]"
              >
                <SlidersHorizontal size={14} />
                Filters
                {inStockOnly && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--dc-accent)] text-[9px] font-bold text-[var(--dc-accent-text)]">
                    1
                  </span>
                )}
              </button>
              <p className="text-sm text-[var(--dc-text-subtle)]">
                <strong className="text-[var(--dc-text)]">{products.length}</strong> products
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] py-2 pl-4 pr-9 text-sm text-[var(--dc-text)] focus:border-[var(--dc-accent)] focus:outline-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dc-text-subtle)]" />
              </div>

              {/* Grid / list toggle */}
              <div className="hidden sm:flex items-center gap-1 rounded-full border border-[var(--dc-border)] p-1">
                <button
                  onClick={() => setGridView("grid")}
                  className={`rounded-full p-1.5 transition-colors ${gridView === "grid" ? "bg-[var(--dc-accent)] text-[var(--dc-accent-text)]" : "text-[var(--dc-text-muted)]"}`}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={13} />
                </button>
                <button
                  onClick={() => setGridView("list")}
                  className={`rounded-full p-1.5 transition-colors ${gridView === "list" ? "bg-[var(--dc-accent)] text-[var(--dc-accent-text)]" : "text-[var(--dc-text-muted)]"}`}
                  aria-label="List view"
                >
                  <List size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter strip */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE.out }}
                className="mb-8 overflow-hidden"
              >
                <div className="rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-5">
                  <div className="flex flex-wrap items-center gap-6">
                    <p className="text-sm font-medium text-[var(--dc-text-subtle)] uppercase tracking-wider">
                      Availability
                    </p>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="h-4 w-4 rounded border-[var(--dc-border)] accent-[var(--dc-accent)]"
                      />
                      <span className="text-sm text-[var(--dc-text-muted)]">In Stock Only</span>
                    </label>
                    {inStockOnly && (
                      <button
                        onClick={() => setInStockOnly(false)}
                        className="ml-auto flex items-center gap-1 text-xs text-[var(--dc-text-subtle)] hover:text-[var(--dc-text)]"
                      >
                        <X size={12} /> Clear
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-5xl font-display font-bold text-[var(--dc-border)] mb-4">∅</p>
              <p className="text-[var(--dc-text-muted)]">No products found in this category.</p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--dc-accent)] px-6 py-3 text-sm font-semibold text-[var(--dc-accent-text)] hover:opacity-90 transition-opacity"
              >
                Browse all products
              </Link>
            </div>
          ) : (
            <div
              ref={gridRef}
              className={
                gridView === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "flex flex-col gap-3"
              }
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
