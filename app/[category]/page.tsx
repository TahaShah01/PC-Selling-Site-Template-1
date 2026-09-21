import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES } from "@/data/categories";
import { MOCK_PRODUCTS } from "@/data/products";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c: any) => c.id === categorySlug || c.shopifyHandle === categorySlug);
  
  if (!category) {
    return { title: "Category Not Found" };
  }
  
  return {
    title: `${category.title} | Shop Premium PC Parts`,
    description: `Shop the best ${category.title.toLowerCase()} in Pakistan at Daddu Charger.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  
  // Try to find category by id or handle (for compatibility)
  const category = CATEGORIES.find((c: any) => c.id === categorySlug || c.shopifyHandle === categorySlug);

  if (!category) {
    notFound();
  }

  // Filter products for this category
  // In a real app this would be an API call or database query
  const products = MOCK_PRODUCTS.filter((p) => p.category === category.id);

  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen">
        <Section>
          <Container>
            {/* Header */}
            <div className="mb-10">
              <p className="dc-eyebrow mb-2">Category</p>
              <h1 className="text-4xl font-display font-bold mb-4">{category.title}</h1>
              <p className="text-[var(--dc-text-muted)] max-w-2xl">
                Browse our curated selection of high-performance {category.title.toLowerCase()} for your custom gaming PC.
              </p>
            </div>

            {/* Layout: Sidebar + Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 shrink-0">
                <div className="p-5 rounded-[var(--dc-radius-xl)] bg-[var(--dc-surface-2)] border border-[var(--dc-border)]">
                  <h3 className="font-semibold mb-4 text-[var(--dc-text)]">Filters</h3>
                  <div className="space-y-4">
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
                    Showing <strong className="text-[var(--dc-text)]">{products.length}</strong> products
                  </p>
                  <select className="bg-transparent border border-[var(--dc-border)] rounded-[var(--dc-radius-md)] text-sm text-[var(--dc-text)] px-3 py-1.5 focus:outline-none focus:border-[var(--dc-accent)]">
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[var(--dc-surface)] rounded-[var(--dc-radius-xl)] border border-[var(--dc-border-dashed)]">
                    <p className="text-[var(--dc-text-muted)]">No products found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
