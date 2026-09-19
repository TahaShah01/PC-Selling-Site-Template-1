import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";
import { Price, Badge } from "@/components/primitives/Price";
import { AddToCartForm } from "@/components/shop/AddToCartForm";
import { MOCK_PRODUCTS } from "@/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  
  if (!product) {
    return { title: "Product Not Found" };
  }
  
  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const isOnSale = typeof product.priceSale === "number" && product.priceSale < product.priceRegular;

  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen">
        
        {/* Breadcrumb / Back Navigation */}
        <Container className="mb-8">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>
        </Container>

        <Section noPadding className="pb-16">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              
              {/* ─── LEFT: IMAGE GALLERY ─── */}
              <div className="relative aspect-square w-full bg-[var(--dc-surface)] rounded-[var(--dc-radius-2xl)] p-8 border border-[var(--dc-border)] overflow-hidden flex items-center justify-center">
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                  {!product.inStock && <Badge variant="neutral">Out of Stock</Badge>}
                  {product.inStock && product.isNew && <Badge variant="new">New Arrival</Badge>}
                  {product.inStock && isOnSale && <Badge variant="sale">Sale</Badge>}
                </div>

                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-center mix-blend-screen p-8"
                    priority
                  />
                ) : (
                  <div className="text-[var(--dc-text-subtle)]">No image available</div>
                )}
              </div>

              {/* ─── RIGHT: PRODUCT INFO ─── */}
              <div className="flex flex-col">
                {/* Brand & Title */}
                <p className="dc-eyebrow mb-2">{product.brand}</p>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--dc-text)] leading-tight mb-4">
                  {product.title}
                </h1>

                {/* Price & Status */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--dc-border)]">
                  <Price 
                    regular={product.priceRegular} 
                    sale={product.priceSale} 
                    size="xl" 
                  />
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--dc-success)] bg-[rgba(34,197,94,0.1)] px-3 py-1.5 rounded-full border border-[rgba(34,197,94,0.2)]">
                    <Check size={14} />
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </div>
                </div>

                {/* Highlights */}
                {product.highlights && product.highlights.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-[var(--dc-text)] mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {product.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[var(--dc-text-muted)] text-sm leading-relaxed">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--dc-accent)] shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add to Cart Actions */}
                <AddToCartForm product={product} />

                {/* Trust Signals */}
                <div className="grid grid-cols-2 gap-4 py-6 border-y border-[var(--dc-border)] mb-8">
                  <div className="flex items-center gap-3 text-sm text-[var(--dc-text-muted)]">
                    <ShieldCheck size={20} className="text-[var(--dc-accent)]" />
                    <span>Official Local Warranty</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--dc-text-muted)]">
                    <Truck size={20} className="text-[var(--dc-accent)]" />
                    <span>Nationwide Delivery</span>
                  </div>
                </div>

                {/* Specifications List */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--dc-text)] mb-4">Specifications</h3>
                    <div className="divide-y divide-[var(--dc-border)]">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="py-3 flex sm:items-center justify-between flex-col sm:flex-row gap-1 sm:gap-4">
                          <span className="text-sm font-medium text-[var(--dc-text-subtle)] shrink-0 sm:w-1/3">
                            {key}
                          </span>
                          <span className="text-sm text-[var(--dc-text)]">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </Container>
        </Section>

        {/* ─── DESCRIPTION SECTION ─── */}
        <Section className="bg-[var(--dc-bg-elevated)] border-t border-[var(--dc-border)]">
          <Container className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-6 text-center">Product Overview</h2>
            <div className="prose prose-invert prose-p:text-[var(--dc-text-muted)] prose-p:leading-relaxed prose-a:text-[var(--dc-accent)] text-center mx-auto">
              <p>{product.description}</p>
            </div>
          </Container>
        </Section>

      </main>
      <SiteFooter />
    </>
  );
}
