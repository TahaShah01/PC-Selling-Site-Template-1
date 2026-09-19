"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Command } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/data/products";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = React.useState(initialQuery);
  const [isFocused, setIsFocused] = React.useState(false);

  // Simple client-side search across title, brand, description, and tags
  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(" ").filter(Boolean);
    
    return MOCK_PRODUCTS.filter(product => {
      const searchableText = `
        ${product.title} 
        ${product.brand} 
        ${product.description} 
        ${product.tags?.join(" ")}
      `.toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen">
        <Section className="pb-8">
          <Container className="max-w-4xl mx-auto">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative group mb-12">
              <div 
                className={`absolute inset-0 bg-[var(--dc-accent)] rounded-[var(--dc-radius-2xl)] blur-lg opacity-0 transition-opacity duration-500 ${isFocused ? 'opacity-20' : ''}`}
              />
              <div className="relative flex items-center bg-[var(--dc-surface)] border border-[var(--dc-border)] rounded-[var(--dc-radius-2xl)] overflow-hidden focus-within:border-[var(--dc-accent)] transition-colors h-16 sm:h-20 px-6">
                <Search className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${isFocused ? 'text-[var(--dc-accent)]' : 'text-[var(--dc-text-muted)]'}`} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Search products, brands, or categories..."
                  className="flex-1 bg-transparent border-none outline-none px-4 sm:px-6 text-lg sm:text-2xl text-[var(--dc-text)] placeholder:text-[var(--dc-text-subtle)] w-full"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      router.push('/search');
                    }}
                    className="p-2 text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] transition-colors rounded-full hover:bg-[var(--dc-surface-2)]"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
              <div className="absolute right-0 -bottom-8 flex items-center gap-2 text-xs text-[var(--dc-text-subtle)]">
                <span className="flex items-center gap-1 border border-[var(--dc-border-strong)] rounded px-1.5 py-0.5 bg-[var(--dc-surface-2)]">
                  Enter
                </span>
                to search
              </div>
            </form>

            {/* Results Header */}
            {query.trim() && (
              <div className="mb-6 flex items-center justify-between border-b border-[var(--dc-border)] pb-4">
                <h2 className="text-xl font-bold">
                  {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
                </h2>
              </div>
            )}

            {/* Results Grid / List */}
            {query.trim() ? (
              results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((product) => (
                    <Link 
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="group flex flex-col sm:flex-row gap-6 p-4 rounded-[var(--dc-radius-xl)] bg-[var(--dc-surface-2)] border border-[var(--dc-border)] hover:border-[var(--dc-border-accent)] transition-all"
                    >
                      <div className="w-full sm:w-40 aspect-square sm:aspect-auto rounded-[var(--dc-radius-md)] bg-[var(--dc-surface)] border border-[var(--dc-border-dashed)] relative overflow-hidden flex items-center justify-center p-4 shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.title}
                            fill
                            className="object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-sm text-[var(--dc-text-subtle)]">No image</span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dc-text-subtle)] mb-1">
                          {product.brand}
                        </p>
                        <h3 className="text-lg font-medium text-[var(--dc-text)] group-hover:text-[var(--dc-accent)] transition-colors mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-sm text-[var(--dc-text-muted)] line-clamp-2 mb-4">
                          {product.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-lg font-bold">
                            {formatPrice(product.priceSale ?? product.priceRegular)}
                          </span>
                          {!product.inStock && (
                            <span className="text-xs font-medium text-[var(--dc-danger)] bg-[rgba(239,68,68,0.1)] px-2 py-1 rounded">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-[var(--dc-surface)] rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border-dashed)]">
                  <Search className="w-12 h-12 text-[var(--dc-text-subtle)] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-[var(--dc-text)] mb-2">No results found</h3>
                  <p className="text-[var(--dc-text-muted)]">
                    We couldn't find anything matching "{query}". Try checking your spelling or using more general terms.
                  </p>
                </div>
              )
            ) : (
              // Empty State / Suggestions
              <div className="py-12">
                <p className="text-sm font-medium text-[var(--dc-text-subtle)] mb-4 uppercase tracking-wider">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {["RTX 4090", "Intel Core i9", "Lian Li Cases", "DDR5 RAM", "1000W Power Supply"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface-2)] text-sm text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:border-[var(--dc-border-accent)] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
