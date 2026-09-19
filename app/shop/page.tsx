import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";
import { ProductCard } from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop High-Performance PC Components",
  description: "Browse our entire catalog of premium PC hardware, from RTX 4090s to liquid coolers.",
};

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen">
        <Section>
          <Container>
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-display font-bold mb-4">All Products</h1>
              <p className="text-[var(--dc-text-muted)] max-w-2xl">
                Explore our full catalog of premium components and peripherals. Everything you need for your next build, all in one place.
              </p>
            </div>

            {/* Layout: Sidebar + Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters (Placeholder for now) */}
              <aside className="w-full lg:w-64 shrink-0">
                <div className="p-5 rounded-[var(--dc-radius-xl)] bg-[var(--dc-surface-2)] border border-[var(--dc-border)]">
                  <h3 className="font-semibold mb-4 text-[var(--dc-text)]">Filters</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2 text-[var(--dc-text-subtle)]">Category</p>
                      <div className="space-y-2">
                        {["Graphics Cards", "Processors", "Motherboards", "RAM", "Storage", "Cases"].map(cat => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded-[var(--dc-radius-sm)] border-[var(--dc-border)] bg-[var(--dc-bg)] accent-[var(--dc-accent)]" />
                            <span className="text-sm text-[var(--dc-text-muted)] group-hover:text-[var(--dc-text)] transition-colors">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2 text-[var(--dc-text-subtle)]">Availability</p>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded-[var(--dc-radius-sm)] border-[var(--dc-border)] bg-[var(--dc-bg)] accent-[var(--dc-accent)]" />
                          <span className="text-sm text-[var(--dc-text-muted)] group-hover:text-[var(--dc-text)] transition-colors">In Stock Only</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Product Grid */}
              <div className="flex-1">
                {/* Active filters / Sorting bar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--dc-border)]">
                  <p className="text-sm text-[var(--dc-text-subtle)]">
                    Showing <strong className="text-[var(--dc-text)]">{MOCK_PRODUCTS.length}</strong> products
                  </p>
                  <select className="bg-transparent border border-[var(--dc-border)] rounded-[var(--dc-radius-md)] text-sm text-[var(--dc-text)] px-3 py-1.5 focus:outline-none focus:border-[var(--dc-accent)]">
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {MOCK_PRODUCTS.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
