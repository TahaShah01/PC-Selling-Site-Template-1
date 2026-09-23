"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Filter, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES } from "@/data/categories";
import { MOCK_PRODUCTS } from "@/data/products";
import { EASE, inViewOnce, DUR } from "@/lib/motion/Motion";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function ShopPage() {
  const [sort, setSort] = React.useState("featured");
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [gridView, setGridView] = React.useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const products = React.useMemo(() => {
    let list = inStockOnly ? MOCK_PRODUCTS.filter((p) => p.inStock) : MOCK_PRODUCTS;
    if (selectedCategory) list = list.filter((p) => p.category === selectedCategory);
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.priceSale ?? a.priceRegular) - (b.priceSale ?? b.priceRegular));
    if (sort === "price-desc") list = [...list].sort((a, b) => (b.priceSale ?? b.priceRegular) - (a.priceSale ?? a.priceRegular));
    if (sort === "newest") list = [...list].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
    return list;
  }, [sort, inStockOnly, selectedCategory]);

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

  return (
    <>
      <SiteHeader />
      <PageShell>
        {/* ── HERO ── */}
        <PageHero
          eyebrow="Catalogue"
          headline={["All", "Hardware"]}
          body="Explore our complete selection of premium components, peripherals, and accessories."
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
                {(inStockOnly || selectedCategory) && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--dc-accent)] text-[9px] font-bold text-[var(--dc-accent-text)]">
                    {(inStockOnly ? 1 : 0) + (selectedCategory ? 1 : 0)}
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
                <div className="rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Categories */}
                    <div>
                      <p className="text-sm font-medium text-[var(--dc-text-subtle)] uppercase tracking-wider mb-4">
                        Category
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            selectedCategory === null
                              ? "bg-[var(--dc-text)] text-[var(--dc-bg)] border-[var(--dc-text)]"
                              : "bg-[var(--dc-bg)] text-[var(--dc-text-muted)] border-[var(--dc-border)] hover:border-[var(--dc-accent)]"
                          }`}
                        >
                          All
                        </button>
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                              selectedCategory === cat.id
                                ? "bg-[var(--dc-text)] text-[var(--dc-bg)] border-[var(--dc-text)]"
                                : "bg-[var(--dc-bg)] text-[var(--dc-text-muted)] border-[var(--dc-border)] hover:border-[var(--dc-accent)]"
                            }`}
                          >
                            {cat.shortTitle}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <p className="text-sm font-medium text-[var(--dc-text-subtle)] uppercase tracking-wider mb-4">
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
                    </div>
                  </div>
                  
                  {/* Clear all */}
                  {(inStockOnly || selectedCategory) && (
                    <div className="mt-6 pt-6 border-t border-[var(--dc-border)]">
                      <button
                        onClick={() => {
                          setInStockOnly(false);
                          setSelectedCategory(null);
                        }}
                        className="flex items-center gap-1 text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-text)]"
                      >
                        <X size={14} /> Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-5xl font-display font-bold text-[var(--dc-border)] mb-4">∅</p>
              <p className="text-[var(--dc-text-muted)]">No products match your criteria.</p>
              <button
                onClick={() => {
                  setInStockOnly(false);
                  setSelectedCategory(null);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--dc-accent)] px-6 py-3 text-sm font-semibold text-[var(--dc-accent-text)] hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              ref={gridRef}
              className={
                gridView === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[2560px]:grid-cols-5 min-[3840px]:grid-cols-6"
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
