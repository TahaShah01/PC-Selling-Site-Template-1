"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/primitives/Button";
import { Badge, Price } from "@/components/primitives/Price";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

/* ─────────────────────────────────────────────────────────
   PRODUCT CARD COMPONENT
   Standardized, production-grade card for product grids.
   Includes:
   - Dynamic Wishlist toggle
   - Direct Add-to-Cart with responsive touch target
   - Image fallback handling
   - Brand orange ambient hover glow
───────────────────────────────────────────────────────── */

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
}

export function ProductCard({ product, className, ...props }: ProductCardProps) {
  const isOnSale = typeof product.priceSale === "number" && product.priceSale < product.priceRegular;
  const { addToCart, setIsOpen } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const isWished = isInWishlist(product.id);
  const [imgError, setImgError] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, 1);
    setIsOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex flex-col h-full bg-[var(--dc-card)] rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] overflow-hidden transition-colors duration-[var(--dc-duration-normal)] hover:border-[var(--dc-border-accent)] relative",
        className
      )}
      {...(props as any)}
    >
      {/* Subtle Orange Glow Background on Hover */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(255,106,26,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* ─── IMAGE / BADGES / WISHLIST ─── */}
      <div className="relative aspect-[4/3] bg-[var(--dc-surface)] p-3 sm:p-5 overflow-hidden z-10">
        <Link 
          href={`/shop/${product.slug}`} 
          className="absolute inset-0 z-10"
          aria-label={`View details for ${product.title}`}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20 pointer-events-none">
          {!product.inStock && <Badge variant="neutral">Out of Stock</Badge>}
          {product.inStock && product.isNew && <Badge variant="new">New Arrival</Badge>}
          {product.inStock && isOnSale && <Badge variant="sale">Sale</Badge>}
        </div>

        {/* Wishlist Button (Top-Right) */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWished ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          className={cn(
            "absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
            isWished 
              ? "bg-[var(--dc-accent)] border-[var(--dc-accent)] text-[var(--dc-accent-text)] shadow-md" 
              : "bg-[var(--dc-bg)]/80 backdrop-blur-md border-[var(--dc-border)] text-[var(--dc-text-muted)] hover:border-[var(--dc-accent)] hover:text-[var(--dc-accent)] hover:bg-[var(--dc-surface)]"
          )}
        >
          <Heart size={16} fill={isWished ? "currentColor" : "none"} className="transition-transform duration-300 active:scale-75" />
        </button>

        {/* Product Image */}
        {product.images?.[0] && !imgError ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
            className="object-contain object-center transition-transform duration-[var(--dc-duration-slow)] ease-[var(--dc-ease-out)] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--dc-text-subtle)] text-xs text-center p-4">
            <span className="font-semibold text-[var(--dc-text-muted)]">{product.brand}</span>
            <span className="truncate max-w-[120px]">{product.title}</span>
          </div>
        )}
      </div>

      {/* ─── CONTENT ─── */}
      <div className="flex flex-col flex-grow p-3.5 sm:p-4.5 border-t border-[var(--dc-border)] z-10">
        {/* Brand */}
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[var(--dc-text-subtle)] mb-1">
          {product.brand}
        </span>
        
        {/* Title */}
        <h3 className="font-semibold text-xs sm:text-sm leading-snug text-[var(--dc-text)] mb-2 line-clamp-2 group-hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)]">
          <Link href={`/shop/${product.slug}`} className="focus:outline-none">
            {product.title}
          </Link>
        </h3>

        {/* Specs snippet */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-3 space-y-0.5 mt-auto">
            {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
              <p key={key} className="text-[11px] sm:text-xs text-[var(--dc-text-muted)] truncate">
                <span className="text-[var(--dc-text-subtle)]">{key}:</span> {value}
              </p>
            ))}
          </div>
        )}

        {/* Bottom Row: Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--dc-border)] relative z-20">
          <Price 
            regular={product.priceRegular} 
            sale={product.priceSale} 
            size="md" 
          />
          
          <button 
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] text-[var(--dc-text-muted)] transition-all duration-300 hover:border-[var(--dc-accent)] hover:bg-[var(--dc-accent)] hover:text-[var(--dc-accent-text)] disabled:opacity-50 disabled:pointer-events-none relative z-30 shadow-sm"
            disabled={!product.inStock}
            aria-label={`Add ${product.title} to cart`}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} className="transition-transform duration-300 active:scale-75" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
