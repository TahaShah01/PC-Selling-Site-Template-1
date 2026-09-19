"use client";

import * as React from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/types";

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart, setIsOpen } = useCartStore();

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product, quantity);
    setIsOpen(true);
  };

  return (
    <div className="flex gap-4 mb-8">
      {/* Quantity selector */}
      <div className="flex items-center justify-between h-12 w-32 border border-[var(--dc-border-strong)] rounded-[var(--dc-radius-lg)] bg-[var(--dc-surface)] px-2">
        <button
          className="w-8 h-full flex items-center justify-center text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] disabled:opacity-50"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || !product.inStock}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="font-medium text-[var(--dc-text)]">
          {quantity}
        </span>
        <button
          className="w-8 h-full flex items-center justify-center text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] disabled:opacity-50"
          onClick={() => setQuantity(quantity + 1)}
          disabled={!product.inStock}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {/* Add to Cart Button */}
      <Button 
        variant="primary" 
        size="lg" 
        className="flex-1"
        disabled={!product.inStock}
        leftIcon={<ShoppingCart size={18} />}
        onClick={handleAdd}
      >
        {product.inStock ? "Add to Cart" : "Out of Stock"}
      </Button>
    </div>
  );
}
