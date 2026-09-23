"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageShell } from "@/components/sections/PageHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/primitives/Button";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCartStore } from "@/lib/store/cart";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "framer-motion";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const { addToCart, setIsOpen: setCartOpen } = useCartStore();
  const gridRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const handleMoveAllToCart = () => {
    items.forEach(item => {
      if (item.inStock) {
        addToCart(item, 1);
      }
    });
    clearWishlist();
    setCartOpen(true);
  };

  useGSAP(
    () => {
      if (!gridRef.current || reduced || items.length === 0) return;
      
      const cards = gsap.utils.toArray<HTMLElement>(".wishlist-item", gridRef.current);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
          stagger: 0.08,
        }
      );
    },
    { scope: gridRef, dependencies: [items.length, reduced] }
  );

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
          <div className="dc-container relative z-10 pb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-end gap-6">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.14em] text-[var(--dc-accent)] font-semibold text-center sm:text-left">
                Your Selection
              </p>
              <h1 className="font-display font-bold text-[var(--dc-text)] text-[clamp(2.5rem,6vw,4rem)] leading-[0.9] tracking-[-0.04em]">
                Wishlist
              </h1>
            </div>
            
            {items.length > 0 && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleMoveAllToCart}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--dc-accent)] hover:text-[var(--dc-accent-hover)] transition-colors"
                >
                  <ShoppingBag size={16} /> Move to Cart
                </button>
                <button 
                  onClick={clearWishlist}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--dc-text-muted)] hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} /> Clear All
                </button>
              </div>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--dc-border)]" />
        </div>

        <div className="dc-container py-12 lg:py-16">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 lg:py-32 text-center border border-[var(--dc-border-dashed)] rounded-[var(--dc-radius-2xl)] bg-[var(--dc-surface)]">
              <Heart size={48} className="text-[var(--dc-border-strong)] mb-6" />
              <h2 className="text-2xl font-display font-bold text-[var(--dc-text)] mb-2">Your wishlist is empty</h2>
              <p className="text-[var(--dc-text-muted)] mb-8 max-w-sm">
                Save items you&apos;re interested in by clicking the heart icon on any product.
              </p>
              <Link href="/shop" passHref legacyBehavior>
                <Button size="lg" variant="primary" className="gap-2">
                  <ShoppingBag size={18} /> Browse Shop
                </Button>
              </Link>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <div key={product.id} className="wishlist-item relative group">
                  <ProductCard product={product} />
                  {/* Subtle hover accent for wishlist items */}
                  <div className="absolute inset-0 border-2 border-[var(--dc-accent)] opacity-0 group-hover:opacity-100 rounded-[var(--dc-radius-xl)] pointer-events-none transition-opacity duration-300" />
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
