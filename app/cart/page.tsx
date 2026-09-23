"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Clock 
} from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell } from "@/components/sections/PageHero";
import { Button } from "@/components/primitives/Button";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { BUSINESS } from "@/data/business";
import { EASE } from "@/lib/motion/Motion";

export default function CartPage() {
  const [mounted, setMounted] = React.useState(false);
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const FREE_SHIPPING_THRESHOLD = 50000; // 50,000 PKR
  const progress = Math.min((cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeft = FREE_SHIPPING_THRESHOLD - cart.subtotal;

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    const intro = `Hello! I'd like to place an order from Daddu Charger:%0A%0A`;
    const itemsList = cart.items
      .map(
        (item) =>
          `• ${item.quantity}× ${item.product.title} — ${formatPrice(
            item.priceAtAddition * item.quantity
          )}`
      )
      .join("%0A");
    const total = `%0A%0A*Total: ${formatPrice(cart.subtotal)}*`;
    const outro = `%0A%0APlease confirm availability and share payment details. Thank you!`;
    const whatsappNumber =
      BUSINESS.whatsapp.replace(/[^0-9]/g, "") || "923001234567";
    window.open(
      `https://wa.me/${whatsappNumber}?text=${intro}${itemsList}${total}${outro}`,
      "_blank"
    );
  };

  // Safe SSR placeholder before hydration
  if (!mounted) {
    return (
      <>
        <SiteHeader />
        <PageShell>
          <PageHero
            eyebrow="Order Review"
            headline={["Your", "Cart"]}
            size="sm"
          />
          <div className="dc-container py-16 flex justify-center">
            <div className="h-40 w-full max-w-md animate-pulse rounded-[var(--dc-radius-2xl)] bg-[var(--dc-surface)]" />
          </div>
        </PageShell>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Order Review"
          headline={["Your", "Cart"]}
          body={
            cart.itemCount > 0
              ? `You have ${cart.itemCount} item${cart.itemCount === 1 ? "" : "s"} in your cart.`
              : "Your cart is currently empty."
          }
          size="sm"
        />

        <div className="dc-container py-8 lg:py-16">
          {cart.items.length === 0 ? (
            /* ── EMPTY STATE ── */
            <div className="flex flex-col items-center justify-center py-20 lg:py-28 text-center border border-[var(--dc-border)] rounded-[var(--dc-radius-2xl)] bg-[var(--dc-surface)] px-6">
              <div className="w-20 h-20 rounded-full bg-[var(--dc-surface-2)] border border-[var(--dc-border)] flex items-center justify-center text-[var(--dc-text-subtle)] mb-6">
                <ShoppingBag size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold text-[var(--dc-text)] mb-3">
                Your cart is empty
              </h2>
              <p className="text-[var(--dc-text-muted)] max-w-md mb-8 text-sm sm:text-base leading-relaxed">
                Looks like you haven&apos;t added any gaming hardware or peripherals yet. Explore our curated selection.
              </p>
              <Link href="/shop">
                <Button size="lg" variant="primary" className="gap-2">
                  <ArrowLeft size={16} /> Explore Catalogue
                </Button>
              </Link>
            </div>
          ) : (
            /* ── CART CONTENT ── */
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Items List */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Progress Indicator */}
                <div className="p-5 rounded-[var(--dc-radius-xl)] bg-[var(--dc-surface)] border border-[var(--dc-border)]">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-medium mb-2.5">
                    <span className="text-[var(--dc-text)]">
                      {progress >= 100
                        ? "🎉 You've unlocked free nationwide delivery!"
                        : `Add ${formatPrice(amountLeft)} more for free shipping`}
                    </span>
                    <span className="text-[var(--dc-text-muted)] font-semibold">
                      {Math.floor(progress)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--dc-bg)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--dc-accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: EASE.out }}
                    />
                  </div>
                </div>

                {/* Items Container */}
                <div className="rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] divide-y divide-[var(--dc-border)] overflow-hidden">
                  <div className="p-4 sm:p-5 flex items-center justify-between bg-[var(--dc-surface-2)]">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[var(--dc-text-subtle)]">
                      Product ({cart.items.length})
                    </span>
                    <button
                      onClick={clearCart}
                      className="text-xs text-[var(--dc-text-subtle)] hover:text-red-500 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {cart.items.map((item) => {
                    const price = item.priceAtAddition;
                    const lineTotal = price * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 hover:bg-[var(--dc-surface-2)]/50 transition-colors"
                      >
                        {/* Product Image & Title */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Link
                            href={`/shop/${item.product.slug}`}
                            className="relative h-20 w-20 shrink-0 rounded-[var(--dc-radius-lg)] border border-[var(--dc-border)] bg-[var(--dc-bg)] p-2 overflow-hidden flex items-center justify-center group"
                          >
                            {item.product.images?.[0] ? (
                              <Image
                                src={item.product.images[0].src}
                                alt={item.product.title}
                                fill
                                className="object-contain p-1 group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <ShoppingBag size={20} className="text-[var(--dc-text-subtle)]" />
                            )}
                          </Link>

                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[var(--dc-text-subtle)]">
                              {item.product.brand}
                            </span>
                            <h3 className="text-sm font-semibold text-[var(--dc-text)] leading-snug truncate hover:text-[var(--dc-accent)] transition-colors">
                              <Link href={`/shop/${item.product.slug}`}>
                                {item.product.title}
                              </Link>
                            </h3>
                            <p className="text-xs text-[var(--dc-text-muted)] mt-1">
                              Unit: {formatPrice(price)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls & Line Total */}
                        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-[var(--dc-border)]">
                          {/* Quantity pill */}
                          <div className="flex items-center rounded-full border border-[var(--dc-border)] bg-[var(--dc-bg)] p-1">
                            <button
                              onClick={() => {
                                if (item.quantity === 1) {
                                  removeFromCart(item.product.id);
                                } else {
                                  updateQuantity(item.product.id, item.quantity - 1);
                                }
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--dc-text-muted)] hover:bg-[var(--dc-surface)] hover:text-[var(--dc-text)] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-[var(--dc-text)] tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--dc-text-muted)] hover:bg-[var(--dc-surface)] hover:text-[var(--dc-text)] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          {/* Line price */}
                          <div className="text-right min-w-[90px]">
                            <p className="font-display text-base font-bold text-[var(--dc-text)]">
                              {formatPrice(lineTotal)}
                            </p>
                          </div>

                          {/* Delete item button */}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1.5 text-[var(--dc-text-subtle)] hover:text-red-500 transition-colors"
                            aria-label={`Remove ${item.product.title} from cart`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Back to Shopping */}
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors"
                  >
                    <ArrowLeft size={16} /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-[calc(var(--dc-header-height)+2rem)] rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-6 shadow-xl">
                  <h2 className="font-display text-lg font-bold text-[var(--dc-text)] mb-6 pb-4 border-b border-[var(--dc-border)]">
                    Order Summary
                  </h2>

                  <div className="space-y-4 text-sm mb-6">
                    <div className="flex justify-between items-center text-[var(--dc-text-muted)]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[var(--dc-text)] tabular-nums">
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[var(--dc-text-muted)]">
                      <span>Estimated Shipping</span>
                      <span>
                        {progress >= 100 ? (
                          <span className="font-bold text-[var(--dc-accent)]">FREE</span>
                        ) : (
                          <span className="text-xs text-[var(--dc-text-subtle)]">
                            Confirmed on WhatsApp
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-[var(--dc-border)] flex justify-between items-baseline">
                      <span className="font-display font-bold text-base text-[var(--dc-text)]">
                        Estimated Total
                      </span>
                      <span className="font-display text-2xl font-bold text-[var(--dc-accent)] tabular-nums">
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Checkout Button */}
                  <Link href="/checkout" className="block w-full">
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
                    className="w-full gap-2"
                    onClick={handleCheckout}
                  >
                    <MessageCircle size={18} />
                    Quick Order via WhatsApp
                  </Button>

                  <p className="text-[11px] text-center text-[var(--dc-text-subtle)] mt-4 leading-relaxed">
                    Our team in Rawalpindi verifies part availability, tests all configurations, and confirms payment details directly with you on WhatsApp.
                  </p>

                  {/* Reassurance Badges */}
                  <div className="mt-8 pt-6 border-t border-[var(--dc-border)] space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[var(--dc-text-muted)]">
                      <ShieldCheck size={16} className="text-[var(--dc-accent)] shrink-0" />
                      <span>100% Genuine, Sealed Components</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--dc-text-muted)]">
                      <Truck size={16} className="text-[var(--dc-accent)] shrink-0" />
                      <span>Insured Nationwide Delivery (Pakistan)</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--dc-text-muted)]">
                      <Clock size={16} className="text-[var(--dc-accent)] shrink-0" />
                      <span>Direct WhatsApp Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageShell>
      <SiteFooter />
    </>
  );
}
