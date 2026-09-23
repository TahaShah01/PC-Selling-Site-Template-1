"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, Lock, CreditCard, Wallet, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageShell } from "@/components/sections/PageHero";
import { Button } from "@/components/primitives/Button";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { BUSINESS } from "@/data/business";
import { cn } from "@/lib/utils";

type PaymentMethod = "cod" | "bank";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const { cart, clearCart } = useCartStore();

  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });
  
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("cod");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setMounted(true);
    // Redirect if cart is empty
    if (cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart.items.length, router]);

  const FREE_SHIPPING_THRESHOLD = 50000;
  const isFreeShipping = cart.subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : 500; // Standard shipping fallback
  const estimatedTotal = cart.subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Delivery address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Build the WhatsApp message
    const intro = `*New Order - DadduCharger*%0A%0AHello! I'd like to place an order.%0A`;
    const customerDetails = `%0A*Customer Details:*%0AName: ${formData.fullName}%0APhone: ${formData.phone}${formData.email ? `%0AEmail: ${formData.email}` : ''}%0AAddress: ${formData.address}%0ACity: ${formData.city}${formData.postalCode ? ` (${formData.postalCode})` : ''}%0APayment Method: ${paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}`;
    
    const itemsList = `%0A%0A*Order Items:*%0A` + cart.items
      .map(
        (item) =>
          `• ${item.quantity}× ${item.product.title} — ${formatPrice(item.priceAtAddition * item.quantity)}`
      )
      .join("%0A");
      
    const total = `%0A%0A*Summary:*%0ASubtotal: ${formatPrice(cart.subtotal)}%0AShipping: ${isFreeShipping ? "FREE" : "To be confirmed"}%0A*Estimated Total: ${formatPrice(estimatedTotal)}*`;
    
    const outro = `%0A%0APlease confirm my order. Thank you!`;
    
    const whatsappNumber = BUSINESS.whatsapp.replace(/[^0-9]/g, "") || "923001234567";
    const fullMessage = `${intro}${customerDetails}${itemsList}${total}${outro}`;

    // Simulate short loading state then redirect
    setTimeout(() => {
      setIsSubmitting(false);
      window.open(`https://wa.me/${whatsappNumber}?text=${fullMessage}`, "_blank");
      // Optional: clear cart after successful handoff
      // clearCart();
      // router.push("/shop");
    }, 800);
  };

  if (!mounted || cart.items.length === 0) return null;

  return (
    <>
      <SiteHeader />
      <PageShell>
        <div className="dc-container py-8 lg:py-16">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Cart
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--dc-text)] mb-3">
              Checkout
            </h1>
            <p className="text-[var(--dc-text-muted)]">
              Complete your delivery details to finalize the order.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-10">
              
              {/* Delivery Details */}
              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dc-border)]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dc-accent-dim)] text-[var(--dc-accent)] font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-xl font-display font-bold text-[var(--dc-text)]">
                    Delivery Details
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-[var(--dc-text-subtle)]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full h-12 px-4 rounded-[var(--dc-radius-md)] bg-[var(--dc-bg)] border border-[var(--dc-border)] text-[var(--dc-text)] outline-none transition-colors focus:border-[var(--dc-accent)] focus:ring-1 focus:ring-[var(--dc-accent)]",
                        errors.fullName && "border-[var(--dc-error)] focus:border-[var(--dc-error)] focus:ring-[var(--dc-error)]"
                      )}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-xs text-[var(--dc-error)] flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errors.fullName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--dc-text-subtle)]">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full h-12 px-4 rounded-[var(--dc-radius-md)] bg-[var(--dc-bg)] border border-[var(--dc-border)] text-[var(--dc-text)] outline-none transition-colors focus:border-[var(--dc-accent)] focus:ring-1 focus:ring-[var(--dc-accent)]",
                        errors.phone && "border-[var(--dc-error)] focus:border-[var(--dc-error)] focus:ring-[var(--dc-error)]"
                      )}
                      placeholder="+92 300 1234567"
                    />
                    {errors.phone && <p className="text-xs text-[var(--dc-error)] flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errors.phone}</p>}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--dc-text-subtle)]">
                      Email Address <span className="text-[var(--dc-text-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-[var(--dc-radius-md)] bg-[var(--dc-bg)] border border-[var(--dc-border)] text-[var(--dc-text)] outline-none transition-colors focus:border-[var(--dc-accent)] focus:ring-1 focus:ring-[var(--dc-accent)]"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-[var(--dc-text-subtle)]">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full h-12 px-4 rounded-[var(--dc-radius-md)] bg-[var(--dc-bg)] border border-[var(--dc-border)] text-[var(--dc-text)] outline-none transition-colors focus:border-[var(--dc-accent)] focus:ring-1 focus:ring-[var(--dc-accent)]",
                        errors.address && "border-[var(--dc-error)] focus:border-[var(--dc-error)] focus:ring-[var(--dc-error)]"
                      )}
                      placeholder="House/Apartment, Street Name"
                    />
                    {errors.address && <p className="text-xs text-[var(--dc-error)] flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errors.address}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-[var(--dc-text-subtle)]">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={cn(
                        "w-full h-12 px-4 rounded-[var(--dc-radius-md)] bg-[var(--dc-bg)] border border-[var(--dc-border)] text-[var(--dc-text)] outline-none transition-colors focus:border-[var(--dc-accent)] focus:ring-1 focus:ring-[var(--dc-accent)]",
                        errors.city && "border-[var(--dc-error)] focus:border-[var(--dc-error)] focus:ring-[var(--dc-error)]"
                      )}
                      placeholder="Rawalpindi"
                    />
                    {errors.city && <p className="text-xs text-[var(--dc-error)] flex items-center gap-1 mt-1"><AlertCircle size={12}/>{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-[var(--dc-text-subtle)]">
                      Postal Code <span className="text-[var(--dc-text-muted)] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-[var(--dc-radius-md)] bg-[var(--dc-bg)] border border-[var(--dc-border)] text-[var(--dc-text)] outline-none transition-colors focus:border-[var(--dc-accent)] focus:ring-1 focus:ring-[var(--dc-accent)]"
                      placeholder="46000"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--dc-border)]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--dc-accent-dim)] text-[var(--dc-accent)] font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-xl font-display font-bold text-[var(--dc-text)]">
                    Payment Method
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* COD Option */}
                  <label 
                    className={cn(
                      "flex items-start gap-4 p-5 rounded-[var(--dc-radius-lg)] border-2 cursor-pointer transition-all duration-200",
                      paymentMethod === "cod" 
                        ? "border-[var(--dc-accent)] bg-[var(--dc-accent-dim)]" 
                        : "border-[var(--dc-border)] bg-[var(--dc-surface)] hover:border-[var(--dc-border-strong)]"
                    )}
                  >
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--dc-accent)] shrink-0">
                      {paymentMethod === "cod" && <div className="h-2.5 w-2.5 rounded-full bg-[var(--dc-accent)]" />}
                    </div>
                    <div>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === "cod"} 
                        onChange={() => setPaymentMethod("cod")} 
                        className="sr-only" 
                      />
                      <span className="block font-semibold text-[var(--dc-text)] mb-1 flex items-center gap-2">
                        Cash on Delivery <Wallet size={16} className="text-[var(--dc-text-muted)]" />
                      </span>
                      <span className="text-xs text-[var(--dc-text-muted)] leading-relaxed block">
                        Pay with cash upon delivery. We will verify your order via WhatsApp first.
                      </span>
                    </div>
                  </label>

                  {/* Bank Transfer Option */}
                  <label 
                    className={cn(
                      "flex items-start gap-4 p-5 rounded-[var(--dc-radius-lg)] border-2 cursor-pointer transition-all duration-200",
                      paymentMethod === "bank" 
                        ? "border-[var(--dc-accent)] bg-[var(--dc-accent-dim)]" 
                        : "border-[var(--dc-border)] bg-[var(--dc-surface)] hover:border-[var(--dc-border-strong)]"
                    )}
                  >
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--dc-accent)] shrink-0">
                      {paymentMethod === "bank" && <div className="h-2.5 w-2.5 rounded-full bg-[var(--dc-accent)]" />}
                    </div>
                    <div>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="bank" 
                        checked={paymentMethod === "bank"} 
                        onChange={() => setPaymentMethod("bank")} 
                        className="sr-only" 
                      />
                      <span className="block font-semibold text-[var(--dc-text)] mb-1 flex items-center gap-2">
                        Bank Transfer <CreditCard size={16} className="text-[var(--dc-text-muted)]" />
                      </span>
                      <span className="text-xs text-[var(--dc-text-muted)] leading-relaxed block">
                        Direct transfer to our business account. Details provided on WhatsApp.
                      </span>
                    </div>
                  </label>
                </div>
              </section>

            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-[calc(var(--dc-header-height)+2rem)] rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-6 shadow-xl overflow-hidden">
                <h2 className="font-display text-lg font-bold text-[var(--dc-text)] mb-6 pb-4 border-b border-[var(--dc-border)]">
                  Order Summary
                </h2>

                {/* Items Mini List */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-[var(--dc-radius-md)] bg-[var(--dc-bg)] border border-[var(--dc-border)] overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0].src}
                            alt={item.product.title}
                            fill
                            className="object-contain p-1 dark:mix-blend-screen"
                          />
                        )}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--dc-accent)] text-[8px] font-bold text-[var(--dc-accent-text)]">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--dc-text)] line-clamp-2 leading-tight mb-1">
                          {item.product.title}
                        </p>
                        <p className="text-[11px] text-[var(--dc-text-muted)] font-medium">
                          {formatPrice(item.priceAtAddition * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-sm mb-6 pt-4 border-t border-[var(--dc-border)]">
                  <div className="flex justify-between items-center text-[var(--dc-text-muted)]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[var(--dc-text)] tabular-nums">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[var(--dc-text-muted)]">
                    <span>Estimated Shipping</span>
                    <span>
                      {isFreeShipping ? (
                        <span className="font-bold text-[var(--dc-accent)] uppercase tracking-wider text-xs">Free</span>
                      ) : (
                        <span className="font-medium text-[var(--dc-text)] tabular-nums">{formatPrice(shippingCost)}</span>
                      )}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-[var(--dc-border)] flex justify-between items-baseline">
                    <span className="font-display font-bold text-base text-[var(--dc-text)]">
                      Total
                    </span>
                    <span className="font-display text-2xl font-bold text-[var(--dc-accent)] tabular-nums">
                      {formatPrice(estimatedTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-full gap-2 shadow-[var(--dc-shadow-accent)]"
                  isLoading={isSubmitting}
                >
                  <Lock size={16} className="text-white/80" />
                  Place Order
                </Button>

                <p className="text-[10px] text-center text-[var(--dc-text-subtle)] mt-4 leading-relaxed px-4">
                  By placing your order, you agree to our Terms of Service. A representative will contact you via WhatsApp to verify your details.
                </p>

                {/* Reassurance Badges */}
                <div className="mt-6 pt-5 border-t border-[var(--dc-border)] space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[var(--dc-text-muted)] font-medium">
                    <ShieldCheck size={16} className="text-[var(--dc-accent)] shrink-0" />
                    <span>Secure Checkout Handoff</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--dc-text-muted)] font-medium">
                    <Truck size={16} className="text-[var(--dc-accent)] shrink-0" />
                    <span>Fast Nationwide Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </PageShell>
      <SiteFooter />
    </>
  );
}
