"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingCart, Heart, ShieldCheck, Truck, ArrowLeft, Check } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageShell } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/primitives/Button";
import { Price, Badge } from "@/components/primitives/Price";
import { MOCK_PRODUCTS } from "@/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { cn } from "@/lib/utils";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  const { addToCart, setIsOpen: setCartOpen } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  if (!product) notFound();

  const isWished = isInWishlist(product.id);
  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, 1);
    setCartOpen(true);
  };

  useGSAP(
    () => {
      if (!containerRef.current || reduced) return;
      
      const tl = gsap.timeline();

      // Image entrance
      tl.fromTo(
        ".product-image-container",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: "expo.out" }
      )
      // Info stagger
      .fromTo(
        ".product-info-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.6"
      );
    },
    { scope: containerRef, dependencies: [reduced] }
  );

  return (
    <>
      <SiteHeader />
      <PageShell>
        <div ref={containerRef} className="dc-container-wide pt-8 pb-24">
          
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Image with ambient glow */}
            <div className="product-image-container relative aspect-square w-full rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] overflow-hidden flex items-center justify-center p-8 lg:p-12">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,106,26,0.10),transparent_70%)] opacity-50 pointer-events-none"
              />
              
              {/* Badges Overlay */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {!product.inStock && <Badge variant="neutral">Out of Stock</Badge>}
                {product.inStock && product.isNew && <Badge variant="new">New Arrival</Badge>}
                {product.inStock && (typeof product.priceSale === "number") && <Badge variant="sale">Sale</Badge>}
              </div>

              {product.images?.[0] ? (
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt || product.title}
                  fill
                  className="object-contain p-12"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="text-[var(--dc-text-subtle)]">No image available</div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col pt-4">
              <div className="product-info-item">
                <Link href={`/components/${product.category}`} className="dc-eyebrow hover:text-[var(--dc-accent)] transition-colors inline-block mb-3">
                  {product.brand}
                </Link>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--dc-text)] mb-4 leading-tight">
                  {product.title}
                </h1>
              </div>

              <div className="product-info-item flex items-end gap-4 pb-8 border-b border-[var(--dc-border)] mb-8">
                <Price 
                  regular={product.priceRegular} 
                  sale={product.priceSale} 
                  size="lg" 
                />
              </div>

              {/* Actions */}
              <div className="product-info-item flex gap-3 mb-10">
                <Button 
                  size="lg" 
                  variant="primary" 
                  className="flex-1 text-base font-semibold"
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className={cn(
                    "w-14 px-0 shrink-0 border-[var(--dc-border)] hover:border-[var(--dc-accent)] transition-colors",
                    isWished && "text-red-500 hover:text-red-600 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50"
                  )}
                  onClick={() => toggleWishlist(product)}
                  aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} className={isWished ? "fill-current" : ""} />
                </Button>
              </div>

              {/* Description & Specs Tab (simplified for now) */}
              <div className="product-info-item">
                <p className="text-[var(--dc-text-muted)] text-base leading-relaxed mb-8">
                  {product.description}
                </p>

                {product.highlights && product.highlights.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dc-text)] mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[var(--dc-text-muted)]">
                          <Check size={16} className="text-[var(--dc-accent)] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--dc-text)] mb-4">Specifications</h3>
                    <div className="divide-y divide-[var(--dc-border)] border-y border-[var(--dc-border)]">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex py-3 text-sm">
                          <span className="w-1/3 text-[var(--dc-text-subtle)]">{key}</span>
                          <span className="w-2/3 text-[var(--dc-text)] font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Signals */}
              <div className="product-info-item grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-[var(--dc-border)]">
                <div className="flex items-center gap-3 text-sm text-[var(--dc-text-muted)]">
                  <ShieldCheck size={20} className="text-[var(--dc-accent)]" />
                  <span>Authorized Dealer Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--dc-text-muted)]">
                  <Truck size={20} className="text-[var(--dc-accent)]" />
                  <span>Fast Nationwide Delivery</span>
                </div>
              </div>

            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-32">
              <h2 className="text-2xl font-display font-bold text-[var(--dc-text)] mb-8">Related Products</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
          
        </div>
      </PageShell>
      <SiteFooter />
    </>
  );
}
