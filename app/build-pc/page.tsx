"use client";

import * as React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";
import { Cpu, Server, CircuitBoard, Zap, HardDrive, MemoryStick, Box, Wind, Check, X } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { MOCK_PRODUCTS } from "@/data/products";
import type { Product } from "@/types";

// Categories mapped to the mock data 'category' values
const BUILDER_CATEGORIES = [
  { id: "cpu", slug: "processors", name: "Processor (CPU)", icon: CircuitBoard, required: true },
  { id: "motherboard", slug: "motherboards", name: "Motherboard", icon: Server, required: true },
  { id: "memory", slug: "ram", name: "Memory (RAM)", icon: MemoryStick, required: true },
  { id: "gpu", slug: "graphics-cards", name: "Graphics Card (GPU)", icon: Cpu, required: false },
  { id: "storage", slug: "storage", name: "Storage", icon: HardDrive, required: true },
  { id: "cooling", slug: "cooling", name: "CPU Cooler", icon: Wind, required: true },
  { id: "power", slug: "power-supplies", name: "Power Supply", icon: Zap, required: true },
  { id: "case", slug: "cases", name: "Case", icon: Box, required: true },
];

export default function PCBuilderPage() {
  const [selectedParts, setSelectedParts] = React.useState<Record<string, Product>>({});
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  
  const { addToCart, setIsOpen } = useCartStore();

  const total = Object.values(selectedParts).reduce(
    (acc, part) => acc + (part?.priceSale ?? part?.priceRegular ?? 0), 0
  );

  // Helper to determine if a product is compatible with currently selected parts
  const isCompatible = (product: Product, categorySlug: string) => {
    // Basic socket compatibility between CPU and Motherboard
    if (categorySlug === "motherboards" && selectedParts["cpu"]) {
      const cpuSocket = selectedParts["cpu"].specs?.["Socket"];
      const moboSocket = product.specs?.["Socket"];
      if (cpuSocket && moboSocket && !moboSocket.includes(cpuSocket)) {
        return false;
      }
    }
    if (categorySlug === "processors" && selectedParts["motherboard"]) {
      const moboSocket = selectedParts["motherboard"].specs?.["Socket"];
      const cpuSocket = product.specs?.["Socket"];
      if (cpuSocket && moboSocket && !moboSocket.includes(cpuSocket)) {
        return false;
      }
    }
    return true;
  };

  const handleSelectPart = (categoryId: string, product: Product) => {
    setSelectedParts(prev => ({ ...prev, [categoryId]: product }));
    setActiveCategory(null);
  };

  const handleRemovePart = (categoryId: string) => {
    setSelectedParts(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  const handleAddBuildToCart = () => {
    Object.values(selectedParts).forEach(part => {
      addToCart(part, 1);
    });
    setIsOpen(true);
  };

  // Get products for the active modal category
  const activeCategoryDef = BUILDER_CATEGORIES.find(c => c.id === activeCategory);
  const availableProducts = activeCategoryDef 
    ? MOCK_PRODUCTS.filter(p => p.category === activeCategoryDef.slug) 
    : [];

  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen relative">
        <Section className="pb-8">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--dc-border)] pb-8 mb-8">
              <div>
                <p className="dc-eyebrow mb-2">Interactive Tool</p>
                <h1 className="text-4xl font-display font-bold text-[var(--dc-text)] mb-3">
                  Custom PC Builder
                </h1>
                <p className="text-[var(--dc-text-muted)] max-w-2xl">
                  Select compatible parts to build your dream PC. Our system filters out incompatible components automatically.
                </p>
              </div>
              <div className="bg-[var(--dc-surface-2)] p-6 rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] min-w-[240px] shrink-0">
                <p className="text-sm text-[var(--dc-text-subtle)] font-medium mb-1">Estimated Total</p>
                <p className="text-3xl font-bold text-[var(--dc-text)]">{formatPrice(total)}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 relative">
              {/* Builder Steps */}
              <div className="lg:col-span-2 space-y-4">
                {BUILDER_CATEGORIES.map((category) => {
                  const selectedProduct = selectedParts[category.id];
                  
                  return (
                    <div key={category.id} className="bg-[var(--dc-card)] border border-[var(--dc-border)] rounded-[var(--dc-radius-xl)] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-[var(--dc-border-accent)]">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[var(--dc-radius-lg)] bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-text-muted)] shrink-0">
                          <category.icon size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--dc-text)] flex items-center gap-2">
                            {category.name}
                            {category.required && <span className="text-[10px] uppercase tracking-wider bg-[var(--dc-surface-2)] text-[var(--dc-text-subtle)] px-2 py-0.5 rounded-full">Required</span>}
                          </h3>
                          {selectedProduct ? (
                            <p className="text-sm text-[var(--dc-accent)] mt-1 font-medium">{selectedProduct.title}</p>
                          ) : (
                            <p className="text-sm text-[var(--dc-text-subtle)] mt-1">Please select a component</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                        {selectedProduct && (
                          <span className="font-semibold text-sm">{formatPrice(selectedProduct.priceSale ?? selectedProduct.priceRegular)}</span>
                        )}
                        {selectedProduct ? (
                           <div className="flex gap-2">
                             <Button variant="secondary" size="sm" onClick={() => setActiveCategory(category.id)}>
                               Change
                             </Button>
                             <button onClick={() => handleRemovePart(category.id)} className="w-9 h-9 flex items-center justify-center rounded-[var(--dc-radius-md)] border border-[var(--dc-border)] text-[var(--dc-text-muted)] hover:text-[var(--dc-danger)] hover:border-[var(--dc-danger)] transition-colors">
                               <X size={16} />
                             </button>
                           </div>
                        ) : (
                          <Button variant="primary" size="sm" onClick={() => setActiveCategory(category.id)}>
                            Choose
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Build Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-[calc(var(--dc-header-height)+2rem)] bg-[var(--dc-card)] border border-[var(--dc-border)] rounded-[var(--dc-radius-2xl)] p-6">
                  <h3 className="text-xl font-bold mb-6">Build Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--dc-text-muted)]">Components</span>
                      <span className="text-[var(--dc-text)]">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--dc-text-muted)]">Assembly & Testing</span>
                      <span className="text-[var(--dc-success)]">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-[var(--dc-border)] pt-4 mb-6">
                    <div className="flex justify-between items-end">
                      <span className="font-semibold text-[var(--dc-text)]">Total</span>
                      <span className="text-2xl font-bold text-[var(--dc-text)]">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full" 
                    disabled={total === 0}
                    onClick={handleAddBuildToCart}
                  >
                    Add Build to Cart
                  </Button>
                  
                  <p className="text-xs text-center text-[var(--dc-text-subtle)] mt-4">
                    All custom builds include a 1-year service warranty and extensive stress testing before dispatch.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      {/* ─── SELECTION MODAL ─── */}
      {activeCategory && (
        <div className="fixed inset-0 z-[var(--dc-z-modal)] bg-[var(--dc-overlay)] backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-[var(--dc-surface)] w-full max-w-4xl max-h-[90vh] rounded-[var(--dc-radius-2xl)] shadow-2xl border border-[var(--dc-border)] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--dc-border)] shrink-0">
              <h2 className="text-2xl font-bold font-display">
                Select {activeCategoryDef?.name}
              </h2>
              <button 
                onClick={() => setActiveCategory(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--dc-surface-2)] text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content / Products Grid */}
            <div className="flex-1 overflow-y-auto p-6">
               {availableProducts.length === 0 ? (
                 <p className="text-center text-[var(--dc-text-muted)] py-12">No products found in this category.</p>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {availableProducts.map(product => {
                     const compatible = isCompatible(product, activeCategoryDef!.slug);
                     
                     return (
                       <div 
                         key={product.id}
                         className={`p-4 rounded-[var(--dc-radius-xl)] border flex flex-col gap-3 transition-colors ${
                           compatible 
                            ? "border-[var(--dc-border)] hover:border-[var(--dc-border-accent)] bg-[var(--dc-card)]" 
                            : "border-[var(--dc-border-dashed)] opacity-50 grayscale cursor-not-allowed"
                         }`}
                       >
                         <div>
                           <p className="text-[10px] uppercase font-bold text-[var(--dc-text-subtle)] mb-1">{product.brand}</p>
                           <h4 className="font-medium text-sm line-clamp-2">{product.title}</h4>
                         </div>
                         
                         {/* Optional basic specs for quick view */}
                         {product.specs && Object.keys(product.specs).length > 0 && (
                           <div className="text-xs text-[var(--dc-text-muted)] space-y-0.5">
                             {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
                               <p key={k}><span className="text-[var(--dc-text-subtle)]">{k}:</span> {v}</p>
                             ))}
                           </div>
                         )}
                         
                         <div className="mt-auto flex items-center justify-between pt-3 border-t border-[var(--dc-border)]">
                           <span className="font-bold text-sm">{formatPrice(product.priceSale ?? product.priceRegular)}</span>
                           {compatible ? (
                             <Button size="sm" onClick={() => handleSelectPart(activeCategory, product)}>
                               Select
                             </Button>
                           ) : (
                             <span className="text-xs text-[var(--dc-danger)] font-medium bg-[rgba(239,68,68,0.1)] px-2 py-1 rounded">Incompatible</span>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}
