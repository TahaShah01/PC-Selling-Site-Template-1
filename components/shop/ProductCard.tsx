"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/primitives/Button";
import { Badge, Price } from "@/components/primitives/Price";
import { useCartStore } from "@/lib/store/cart";

/* ─────────────────────────────────────────────────────────
   PRODUCT CARD COMPONENT
   Primary component for displaying products in grids.
───────────────────────────────────────────────────────── */

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
}

export function ProductCard({ product, className, ...props }: ProductCardProps) {
  const isOnSale = typeof product.priceSale === "number" && product.priceSale < product.priceRegular;
  const { addToCart, setIsOpen } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if button is inside a link wrapper
    if (!product.inStock) return;
    addToCart(product, 1);
    setIsOpen(true);
  };
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex flex-col h-full bg-[var(--dc-card)] rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] overflow-hidden transition-colors duration-[var(--dc-duration-normal)] hover:border-[var(--dc-border-accent)] relative",
        className
      )}
      {...props as any}
    >
      {/* Subtle Glow Background on Hover */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(200,255,0,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* ─── IMAGE / BADGES ─── */}
      <Link 
        href={`/shop/${product.slug}`} 
        className="relative block aspect-[4/3] bg-[var(--dc-surface)] p-6 overflow-hidden z-10"
      >
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {!product.inStock && <Badge variant="neutral">Out of Stock</Badge>}
          {product.inStock && product.isNew && <Badge variant="new">New Arrival</Badge>}
          {product.inStock && isOnSale && <Badge variant="sale">Sale</Badge>}
        </div>

        {/* Product Image */}
        {product.images?.[0] ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain object-center transition-transform duration-[var(--dc-duration-slow)] ease-[var(--dc-ease-out)] group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--dc-text-subtle)] text-sm">
            No image
          </div>
        )}
      </Link>

      {/* ─── CONTENT ─── */}
      <div className="flex flex-col flex-grow p-5 border-t border-[var(--dc-border)] z-10">
        {/* Brand */}
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--dc-text-subtle)] mb-1">
          {product.brand}
        </span>
        
        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug text-[var(--dc-text)] mb-3 line-clamp-2 group-hover:text-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)]">
          <Link href={`/shop/${product.slug}`} className="focus:outline-none before:absolute before:inset-0">
            {product.title}
          </Link>
        </h3>

        {/* Specs snippet */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-4 space-y-1 mt-auto">
            {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
              <p key={key} className="text-xs text-[var(--dc-text-muted)] truncate">
                <span className="text-[var(--dc-text-subtle)]">{key}:</span> {value}
              </p>
            ))}
          </div>
        )}

        {/* Bottom Row: Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--dc-border)] relative z-20">
          <Price 
            regular={product.priceRegular} 
            sale={product.priceSale} 
            size="md" 
          />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-8 h-8 p-0 rounded-full bg-[var(--dc-surface)] text-[var(--dc-text)] hover:bg-[var(--dc-accent)] hover:text-[var(--dc-accent-text)] relative z-30"
            disabled={!product.inStock}
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
