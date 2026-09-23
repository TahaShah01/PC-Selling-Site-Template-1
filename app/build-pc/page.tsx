"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, RefreshCcw, Trash2, Cpu, Gpu, Server, Database, Box, Fan, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell } from "@/components/sections/PageHero";
import { Button } from "@/components/primitives/Button";
import { formatPrice } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/data/products";
import { COMPATIBILITY_ENGINE } from "@/lib/compatibility/engine";
import { useCartStore } from "@/lib/store/cart";
import { useScrollLock } from "@/components/providers/SmoothScrollProvider";

type BuilderCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  productCategory: string;
  required: boolean;
};

const CATEGORIES: BuilderCategory[] = [
  { id: "cpu", name: "Processor", icon: <Cpu size={20} />, productCategory: "processors", required: true },
  { id: "motherboard", name: "Motherboard", icon: <Box size={20} />, productCategory: "motherboards", required: true },
  { id: "ram", name: "Memory", icon: <Server size={20} />, productCategory: "ram", required: true },
  { id: "gpu", name: "Graphics Card", icon: <Gpu size={20} />, productCategory: "graphics-cards", required: true },
  { id: "storage", name: "Storage", icon: <Database size={20} />, productCategory: "storage", required: true },
  { id: "cooler", name: "CPU Cooler", icon: <Fan size={20} />, productCategory: "cooling", required: true },
  { id: "psu", name: "Power Supply", icon: <Zap size={20} />, productCategory: "power-supplies", required: true },
  { id: "case", name: "Case", icon: <Box size={20} />, productCategory: "cases", required: true },
];

export default function BuildPCPage() {
  const [selectedParts, setSelectedParts] = React.useState<Record<string, any>>({});
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const { addToCart, setIsOpen: setCartOpen } = useCartStore();
  
  // Real-time animated total
  const rawTotal = Object.values(selectedParts).reduce((sum, p) => sum + (p.priceSale ?? p.priceRegular), 0);
  const [displayTotal, setDisplayTotal] = React.useState(rawTotal);

  React.useEffect(() => {
    // Simple number interpolation for price
    let startTime: number;
    const startVal = displayTotal;
    const endVal = rawTotal;
    const duration = 500; // ms

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayTotal(Math.floor(startVal + (endVal - startVal) * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [rawTotal]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    // Re-run compatibility check when parts change
    setWarnings(COMPATIBILITY_ENGINE.check(selectedParts));
  }, [selectedParts]);

  const handleSelect = (categoryId: string, product: any) => {
    setSelectedParts(prev => ({ ...prev, [categoryId]: product }));
    setActiveCategory(null);
  };

  const handleRemove = (categoryId: string) => {
    setSelectedParts(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  const handleProceedToCheckout = () => {
    const parts = Object.values(selectedParts);
    if (parts.length === 0) return;
    parts.forEach(part => {
      addToCart(part, 1);
    });
    setCartOpen(true);
  };

  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Custom Configurator"
          headline={["Build Your", "Dream PC"]}
          body="Select components. We check compatibility automatically. We build, test, and ship it to you."
          size="sm"
        />

        <div className="dc-container py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left: The Builder Rows */}
            <div className="flex-1 space-y-4">
              {CATEGORIES.map((cat) => {
                const selected = selectedParts[cat.id];
                
                return (
                  <div 
                    key={cat.id} 
                    className={`rounded-[var(--dc-radius-xl)] border transition-colors duration-[var(--dc-duration-normal)] bg-[var(--dc-surface)] p-4 sm:p-6 ${
                      selected ? "border-[var(--dc-border-accent)]" : "border-[var(--dc-border)] hover:border-[var(--dc-border-strong)]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      
                      {/* Icon & Label */}
                      <div className="flex items-center gap-4 sm:w-48 shrink-0">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-[var(--dc-radius-lg)] border ${
                          selected ? "bg-[var(--dc-accent)]/10 border-[var(--dc-accent)]/30 text-[var(--dc-accent)]" : "bg-[var(--dc-bg)] border-[var(--dc-border)] text-[var(--dc-text-muted)]"
                        }`}>
                          {cat.icon}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--dc-text)]">{cat.name}</p>
                          {cat.required && <p className="text-[10px] uppercase tracking-wider text-[var(--dc-text-subtle)]">Required</p>}
                        </div>
                      </div>

                      {/* Selected Item OR Add Button */}
                      <div className="flex-1">
                        {selected ? (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-12 w-12 shrink-0 bg-[var(--dc-bg)] rounded-[var(--dc-radius-md)] border border-[var(--dc-border)] p-1 overflow-hidden">
                                {selected.images?.[0] && (
                                  <Image src={selected.images[0].src} alt={selected.title} fill className="object-contain p-1" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[var(--dc-text)] line-clamp-1">{selected.title}</p>
                                <p className="text-xs font-bold text-[var(--dc-accent)]">{formatPrice(selected.priceSale ?? selected.priceRegular)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                type="button"
                                onClick={() => setActiveCategory(cat.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--dc-border)] text-[var(--dc-text-subtle)] hover:border-[var(--dc-text)] hover:text-[var(--dc-text)] transition-colors"
                                title="Change component"
                                aria-label={`Change ${cat.name}`}
                              >
                                <RefreshCcw size={14} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleRemove(cat.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--dc-border)] text-[var(--dc-text-subtle)] hover:border-red-500 hover:text-red-500 transition-colors"
                                title="Remove component"
                                aria-label={`Remove ${cat.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveCategory(cat.id)}
                            className="flex w-full items-center justify-center gap-2 rounded-[var(--dc-radius-lg)] border border-[var(--dc-border-dashed)] bg-transparent py-4 text-sm font-medium text-[var(--dc-text-muted)] transition-colors hover:border-[var(--dc-accent)] hover:bg-[var(--dc-accent)]/5 hover:text-[var(--dc-accent)]"
                          >
                            <Plus size={16} /> Choose {cat.name}
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Summary Sticky Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="sticky top-[calc(var(--dc-header-height)+2rem)] rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface-2)] p-6">
                <h3 className="font-display text-xl font-bold mb-6">Build Summary</h3>
                
                <div className="flex items-end justify-between mb-8 pb-6 border-b border-[var(--dc-border)]">
                  <span className="text-sm font-medium text-[var(--dc-text-subtle)]">Total Price</span>
                  <span className="font-display text-3xl font-bold text-[var(--dc-accent)] tracking-tight">
                    {formatPrice(displayTotal)}
                  </span>
                </div>

                {warnings.length > 0 && (
                  <div className="mb-6 rounded-[var(--dc-radius-lg)] bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-xs font-bold uppercase text-red-500 mb-2 tracking-wider">Compatibility Warnings</p>
                    <ul className="space-y-1 text-sm text-red-400">
                      {warnings.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-red-500" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-[var(--dc-text-muted)]">
                    <Check size={16} className="text-[var(--dc-accent)]" /> Professional Assembly
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--dc-text-muted)]">
                    <Check size={16} className="text-[var(--dc-accent)]" /> Windows + Drivers Setup
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--dc-text-muted)]">
                    <Check size={16} className="text-[var(--dc-accent)]" /> 48-Hour Burn-in Test
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--dc-text-muted)]">
                    <Check size={16} className="text-[var(--dc-accent)]" /> 1-Year Service Warranty
                  </div>
                </div>

                <Button 
                  size="lg" 
                  variant="primary" 
                  className="w-full"
                  disabled={Object.keys(selectedParts).length < CATEGORIES.filter(c => c.required).length || warnings.length > 0}
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                {Object.keys(selectedParts).length < CATEGORIES.filter(c => c.required).length && (
                  <p className="text-center text-xs text-[var(--dc-text-subtle)] mt-4">
                    Select all required components to proceed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Summary Bar */}
        {Object.keys(selectedParts).length > 0 && (
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--dc-surface)] border-t border-[var(--dc-border)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--dc-text-subtle)] block">
                  {Object.keys(selectedParts).length} of {CATEGORIES.length} parts selected
                </span>
                <span className="font-display text-lg font-bold text-[var(--dc-accent)]">
                  {formatPrice(displayTotal)}
                </span>
              </div>
              <Button 
                size="sm" 
                variant="primary" 
                className="px-5 min-h-[38px] font-semibold"
                disabled={Object.keys(selectedParts).length < CATEGORIES.filter(c => c.required).length || warnings.length > 0}
                onClick={handleProceedToCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}

        {/* Selection Modal Overlay */}
        <AnimatePresence>
          {activeCategory && (
            <SelectionModal 
              category={CATEGORIES.find(c => c.id === activeCategory)!}
              onClose={() => setActiveCategory(null)}
              onSelect={(p) => handleSelect(activeCategory, p)}
            />
          )}
        </AnimatePresence>

      </PageShell>
      <SiteFooter />
    </>
  );
}

function SelectionModal({ 
  category, 
  onClose, 
  onSelect 
}: { 
  category: BuilderCategory; 
  onClose: () => void; 
  onSelect: (p: any) => void; 
}) {
  const products = MOCK_PRODUCTS.filter(p => p.category === category.productCategory);
  useScrollLock(true);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[var(--dc-z-modal)] flex items-center justify-center p-3 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[var(--dc-overlay)] backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-bg)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--dc-border)] bg-[var(--dc-surface)] p-4 sm:p-6">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--dc-text)]">Select {category.name}</h2>
            <p className="text-xs sm:text-sm text-[var(--dc-text-muted)]">{products.length} options available</p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close component selector"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--dc-border)] hover:bg-[var(--dc-surface-2)] transition-colors"
          >
            <Plus size={18} className="rotate-45" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <div 
                key={product.id}
                onClick={() => onSelect(product)}
                className="group cursor-pointer rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] p-3.5 sm:p-4 transition-all hover:border-[var(--dc-accent)]"
              >
                <div className="relative mb-3 aspect-[4/3] w-full rounded-[var(--dc-radius-lg)] bg-[var(--dc-bg)] p-3">
                  {product.images?.[0] && (
                    <Image src={product.images[0].src} alt={product.title} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--dc-text-subtle)] mb-1">{product.brand}</p>
                <p className="text-xs sm:text-sm font-semibold text-[var(--dc-text)] line-clamp-2 mb-2 group-hover:text-[var(--dc-accent)] transition-colors">{product.title}</p>
                <p className="text-base font-bold text-[var(--dc-accent)]">{formatPrice(product.priceSale ?? product.priceRegular)}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
