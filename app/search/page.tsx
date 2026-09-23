"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageShell } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";

// Extracted to a separate component to wrap it in a Suspense boundary
// This is required because useSearchParams() bails out of static generation
function SearchContent() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.toLowerCase().trim();
  
  const [isSearching, setIsSearching] = React.useState(true);
  const [results, setResults] = React.useState<typeof MOCK_PRODUCTS>([]);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Simulate search delay for effect
  React.useEffect(() => {
    setIsSearching(true);
    
    const timer = setTimeout(() => {
      if (!query) {
        setResults([]);
      } else {
        const matches = MOCK_PRODUCTS.filter(
          (p) => 
            p.title.toLowerCase().includes(query) || 
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
        );
        setResults(matches);
      }
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Animate results when they appear
  useGSAP(
    () => {
      if (isSearching || results.length === 0 || !gridRef.current || reduced) return;
      
      const cards = gsap.utils.toArray<HTMLElement>(".product-card-item", gridRef.current);
      gsap.fromTo(
        cards,
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, y: 20 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.05,
        }
      );
    },
    { scope: gridRef, dependencies: [results, isSearching, reduced] }
  );

  return (
    <>
      <div className="dc-container py-8 lg:py-16">
        <div className="max-w-3xl mx-auto mb-16">
          <form action="/search" className="relative group">
            <div className="absolute inset-0 bg-[var(--dc-accent)] blur-2xl opacity-0 group-focus-within:opacity-10 transition-opacity duration-500 rounded-full" />
            <input
              type="text"
              name="q"
              defaultValue={rawQuery}
              placeholder="Search components, PCs, peripherals..."
              className="w-full bg-[var(--dc-surface)] border border-[var(--dc-border)] rounded-full px-8 py-6 text-xl lg:text-2xl text-[var(--dc-text)] placeholder:text-[var(--dc-text-muted)] focus:border-[var(--dc-accent)] focus:outline-none transition-colors relative z-10"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[var(--dc-accent)] text-[var(--dc-bg)] rounded-full z-20 hover:scale-105 transition-transform"
            >
              <Search size={24} />
            </button>
          </form>
        </div>

        {query && (
          <div className="mb-8 border-b border-[var(--dc-border)] pb-4">
            <p className="text-xl text-[var(--dc-text-muted)]">
              {isSearching ? (
                <span className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin text-[var(--dc-accent)]" /> 
                  Searching for "{rawQuery}"...
                </span>
              ) : (
                <span>
                  Found <strong className="text-[var(--dc-text)] font-bold">{results.length}</strong> results for "{rawQuery}"
                </span>
              )}
            </p>
          </div>
        )}

        {!isSearching && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-[var(--dc-border-dashed)] rounded-[var(--dc-radius-2xl)] bg-[var(--dc-surface)]">
            <Search size={48} className="text-[var(--dc-border-strong)] mb-6" />
            <h2 className="text-2xl font-display font-bold text-[var(--dc-text)] mb-2">No results found</h2>
            <p className="text-[var(--dc-text-muted)] max-w-md mx-auto">
              We couldn't find anything matching "{rawQuery}". Try checking your spelling or using more general terms like "RTX" or "Ryzen".
            </p>
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {results.map((product) => (
              <div key={product.id} className="product-card-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <div className="relative overflow-hidden bg-[var(--dc-bg-elevated)] pt-[10vh]">
          {/* Ambient radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60rem 50rem at 50% 110%, rgba(255,106,26,0.10), transparent 65%)",
            }}
          />
          <div className="dc-container relative z-10 text-center pb-8">
            <p className="mb-4 text-xs uppercase tracking-[0.14em] text-[var(--dc-accent)] font-semibold">
              Find Hardware
            </p>
            <h1 className="font-display font-bold text-[var(--dc-text)] text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] tracking-[-0.04em]">
              Search
            </h1>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--dc-border)]" />
        </div>
        
        {/* Suspense boundary required for useSearchParams */}
        <React.Suspense fallback={
          <div className="dc-container py-24 text-center">
            <Loader2 size={32} className="animate-spin text-[var(--dc-accent)] mx-auto" />
          </div>
        }>
          <SearchContent />
        </React.Suspense>
      </PageShell>
      <SiteFooter />
    </>
  );
}
