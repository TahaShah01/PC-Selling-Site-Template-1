"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { BUSINESS } from "@/data/business";
import { Button } from "@/components/primitives/Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity } = useCartStore();

  // Prevent background scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCheckout = () => {
    if (cart.items.length === 0) return;

    // WhatsApp Order Generation
    const intro = `Hello Daddu Charger! I would like to place an order:%0A%0A`;
    const itemsList = cart.items
      .map(
        (item) =>
          `- ${item.quantity}x ${item.product.title} (${formatPrice(
            item.priceAtAddition
          )})`
      )
      .join("%0A");
    const total = `%0A%0ATotal: ${formatPrice(cart.subtotal)}`;
    const outro = `%0A%0APlease let me know the payment details and delivery process.`;

    const message = intro + itemsList + total + outro;
    const whatsappNumber = BUSINESS.whatsapp.replace(/[^0-9]/g, ""); // Clean formatting

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[var(--dc-overlay)] backdrop-blur-sm z-[var(--dc-z-overlay)]"
            onClick={onClose}
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[var(--dc-surface)] border-l border-[var(--dc-border)] z-[var(--dc-z-modal)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--dc-border)]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[var(--dc-text)]" />
                <h2 className="text-xl font-bold font-display text-[var(--dc-text)]">
                  Your Cart
                </h2>
                <span className="bg-[var(--dc-surface-2)] text-[var(--dc-text-subtle)] text-xs font-medium px-2 py-0.5 rounded-full">
                  {cart.itemCount} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--dc-surface-2)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--dc-surface-2)] flex items-center justify-center text-[var(--dc-text-muted)]">
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[var(--dc-text)]">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-[var(--dc-text-subtle)] mt-1 max-w-[250px] mx-auto">
                      Looks like you haven't added any gear to your cart yet.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cart.items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-[var(--dc-radius-md)] bg-[var(--dc-surface-2)] border border-[var(--dc-border)] shrink-0 relative overflow-hidden flex items-center justify-center p-2">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0].src}
                            alt={item.product.title}
                            fill
                            className="object-contain mix-blend-screen"
                          />
                        ) : (
                          <span className="text-xs text-[var(--dc-text-subtle)]">
                            No image
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/shop/${item.product.slug}`}
                            onClick={onClose}
                            className="text-sm font-medium text-[var(--dc-text)] line-clamp-2 hover:text-[var(--dc-accent)] transition-colors leading-snug"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-sm font-semibold mt-1">
                            {formatPrice(item.priceAtAddition)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center h-8 rounded-[var(--dc-radius-sm)] border border-[var(--dc-border)] bg-[var(--dc-bg)]">
                            <button
                              className="w-8 h-full flex items-center justify-center text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] disabled:opacity-50"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              className="w-8 h-full flex items-center justify-center text-[var(--dc-text-muted)] hover:text-[var(--dc-text)]"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs font-medium text-[var(--dc-text-muted)] hover:text-[var(--dc-danger)] transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="p-6 bg-[var(--dc-surface-2)] border-t border-[var(--dc-border)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--dc-text-muted)]">Subtotal</span>
                    <span className="font-medium text-[var(--dc-text)]">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--dc-text-muted)]">Shipping</span>
                    <span className="text-[var(--dc-text-subtle)]">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-[var(--dc-border-dashed)] pt-3 flex justify-between">
                    <span className="font-bold text-[var(--dc-text)]">
                      Estimated Total
                    </span>
                    <span className="text-xl font-bold text-[var(--dc-text)]">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full relative overflow-hidden group"
                  onClick={handleCheckout}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Checkout via WhatsApp
                  </span>
                </Button>
                
                <p className="text-xs text-center text-[var(--dc-text-subtle)] mt-4">
                  Tax and shipping are calculated during WhatsApp confirmation.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
