"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { BUSINESS } from "@/data/business";
import { EASE, DUR, blurIn, staggerList } from "@/lib/motion/Motion";
import { useScrollLock } from "@/components/providers/SmoothScrollProvider";

/* ─────────────────────────────────────────────────────────
   CART DRAWER — Redesigned v2
   
   Design language: matches the homepage premium dark aesthetic.
   - Architectural dark panel sliding in from right
   - Volt-green (#C8FF00) accent touches on totals + CTA
   - Staggered item entrance via blurIn variant
   - Spring-physics slide from right (damping 28, stiffness 260)
   - Scrim with backdrop-blur, matching the hero overlay
   - Image cards on dark surface-2 with accent hover border
   - Footer uses the same pill CTA style as the hero button
───────────────────────────────────────────────────────── */

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  // Use the Lenis-aware scroll lock so we don't cause layout shifts
  useScrollLock(isOpen);

  const FREE_SHIPPING_THRESHOLD = 50000; // 50,000 PKR
  const progress = Math.min((cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeft = FREE_SHIPPING_THRESHOLD - cart.subtotal;

  // Close on Escape key
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    const intro = `Hello! I'd like to place an order from Daddu Charger:%0A%0A`;
    const itemsList = cart.items
      .map((item) => `• ${item.quantity}× ${item.product.title} — ${formatPrice(item.priceAtAddition)}`)
      .join("%0A");
    const total = `%0A%0A*Total: ${formatPrice(cart.subtotal)}*`;
    const outro = `%0A%0APlease confirm availability and share payment details. Thank you!`;
    const whatsappNumber = BUSINESS.whatsapp.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${whatsappNumber}?text=${intro}${itemsList}${total}${outro}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Scrim ── */}
          <motion.div
            key="cart-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
            className="fixed inset-0 z-[var(--dc-z-overlay)] bg-[var(--dc-overlay)] backdrop-blur-[3px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Drawer Panel ── */}
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260, mass: 0.8 }}
            className="fixed top-0 right-0 bottom-0 z-[var(--dc-z-modal)] w-full max-w-[420px] flex flex-col bg-[var(--dc-surface)] border-l border-[var(--dc-border)]"
            style={{ boxShadow: "var(--dc-shadow-xl)" }}
          >
            {/* ── Accent hairline at top ── */}
            <div className="h-px w-full bg-[var(--dc-accent)] opacity-60" aria-hidden="true" />

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--dc-border)]">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-[var(--dc-radius-md)] bg-[var(--dc-accent-dim)] flex items-center justify-center text-[var(--dc-accent)]"
                  aria-hidden="true"
                >
                  <ShoppingBag size={15} />
                </div>
                <h2 className="font-display font-bold text-[var(--dc-text)] text-base tracking-tight">
                  Your Cart
                </h2>
                {cart.itemCount > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--dc-accent)] text-[var(--dc-accent-text)] leading-none">
                    {cart.itemCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {cart.items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-medium text-[var(--dc-text-subtle)] hover:text-[var(--dc-error)] transition-colors px-2 py-1"
                    aria-label="Clear cart"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-[var(--dc-radius-md)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface-2)] transition-colors"
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Free Shipping Progress ── */}
            <div className="px-6 py-4 bg-[var(--dc-surface-2)] border-b border-[var(--dc-border)]">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-[var(--dc-text)]">
                  {progress >= 100 ? "You've unlocked free shipping!" : `Add ${formatPrice(amountLeft)} for free shipping`}
                </span>
                <span className="text-[var(--dc-text-muted)]">{Math.floor(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--dc-bg)] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[var(--dc-accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: EASE.out }}
                />
              </div>
            </div>

            {/* ── Cart Items ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {cart.items.length === 0 ? (
                <EmptyCart onClose={onClose} />
              ) : (
                <motion.ul
                  variants={staggerList(0.06, 0.05)}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-[var(--dc-border)]"
                >
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => (
                      <motion.li
                        key={item.id}
                        variants={blurIn}
                        exit={{ opacity: 0, x: 24, transition: { duration: 0.25, ease: EASE.in } }}
                        layout
                        className="flex gap-4 px-6 py-5"
                      >
                        {/* ── Product Image ── */}
                        <Link
                          href={`/shop/${item.product.slug}`}
                          onClick={onClose}
                          className="group shrink-0 relative w-[80px] h-[80px] rounded-[var(--dc-radius-lg)] bg-[var(--dc-bg)] border border-[var(--dc-border)] hover:border-[var(--dc-accent)] transition-colors overflow-hidden flex items-center justify-center p-2"
                          aria-label={item.product.title}
                          tabIndex={-1}
                        >
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0].src}
                              alt={item.product.title}
                              fill
                              className="object-contain dark:mix-blend-screen group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={20} className="text-[var(--dc-text-subtle)]" />
                            </div>
                          )}
                        </Link>

                        {/* ── Details ── */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--dc-text-subtle)] block mb-0.5">
                              {item.product.brand}
                            </span>
                            <Link
                              href={`/shop/${item.product.slug}`}
                              onClick={onClose}
                              className="text-sm font-medium text-[var(--dc-text)] hover:text-[var(--dc-accent)] transition-colors line-clamp-2 leading-snug block"
                            >
                              {item.product.title}
                            </Link>
                            <p className="text-sm font-bold text-[var(--dc-text)] mt-1.5 tabular-nums">
                              {formatPrice(item.priceAtAddition)}
                            </p>
                          </div>

                          {/* ── Qty + Remove ── */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center h-7 rounded-[var(--dc-radius-md)] border border-[var(--dc-border)] bg-[var(--dc-bg)] overflow-hidden">
                              <button
                                className="w-7 h-full flex items-center justify-center text-[var(--dc-text-subtle)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface)] transition-colors disabled:opacity-30"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold text-[var(--dc-text)] tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                className="w-7 h-full flex items-center justify-center text-[var(--dc-text-subtle)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface)] transition-colors"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="h-7 w-7 flex items-center justify-center rounded-[var(--dc-radius-md)] text-[var(--dc-text-subtle)] hover:text-[var(--dc-error)] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                              aria-label={`Remove ${item.product.title} from cart`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>

            {/* ── Footer / Checkout ── */}
            <AnimatePresence>
              {cart.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: DUR.fast, ease: EASE.out }}
                  className="border-t border-[var(--dc-border)] bg-[var(--dc-bg)] px-6 pt-5 pb-6"
                >
                  {/* Summary rows */}
                  <div className="space-y-2.5 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--dc-text-muted)]">Subtotal</span>
                      <span className="text-sm font-medium text-[var(--dc-text)] tabular-nums">
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--dc-text-muted)]">Shipping</span>
                      <span className="text-xs font-medium text-[var(--dc-text-subtle)]">
                        {progress >= 100 ? <span className="text-[var(--dc-accent)] font-bold">FREE</span> : "Calculated on WhatsApp"}
                      </span>
                    </div>
                    <div className="h-px w-full bg-[var(--dc-border)]" />
                    <div className="flex justify-between items-baseline">
                      <span className="font-display font-bold text-[var(--dc-text)] text-sm">
                        Estimated Total
                      </span>
                      <span className="font-display font-bold text-[var(--dc-accent)] text-xl tabular-nums">
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Checkout Button */}
                  <Link href="/checkout" onClick={onClose} className="block w-full">
                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full gap-2 shadow-[var(--dc-shadow-accent)]"
                    >
                      Proceed to Checkout
                      <ArrowRight size={18} />
                    </Button>
                  </Link>

                  <div className="relative my-4 flex items-center gap-4">
                    <div className="h-px flex-1 bg-[var(--dc-border)]" />
                    <span className="text-[10px] font-semibold uppercase text-[var(--dc-text-subtle)]">Or</span>
                    <div className="h-px flex-1 bg-[var(--dc-border)]" />
                  </div>

                  {/* Secondary WhatsApp CTA */}
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full gap-2 text-sm"
                    onClick={handleCheckout}
                  >
                    <MessageCircle size={16} />
                    Quick Order via WhatsApp
                  </Button>

                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="block text-center text-xs font-semibold text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors mt-3 py-1.5"
                  >
                    View Full Cart Details →
                  </Link>

                  <p className="text-[11px] text-center text-[var(--dc-text-subtle)] mt-2 leading-relaxed">
                    Secure checkout. We'll confirm your order and shipping details.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Empty state ── */
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      variants={blurIn}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col items-center justify-center px-8 text-center gap-5"
    >
      <div
        className="w-16 h-16 rounded-full bg-[var(--dc-surface-2)] border border-[var(--dc-border)] flex items-center justify-center text-[var(--dc-text-subtle)]"
        aria-hidden="true"
      >
        <ShoppingBag size={26} />
      </div>
      <div>
        <p className="font-display font-bold text-[var(--dc-text)] text-base mb-1.5">
          Your cart is empty
        </p>
        <p className="text-sm text-[var(--dc-text-subtle)] max-w-[220px] mx-auto leading-relaxed">
          Add some gear and it&apos;ll show up here.
        </p>
      </div>
      <Link
        href="/shop"
        onClick={onClose}
        className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--dc-accent)] hover:text-[var(--dc-accent-hover)] transition-colors"
      >
        Browse the store
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
