"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell, RevealSection } from "@/components/sections/PageHero";
import { EASE } from "@/lib/motion/Motion";

const FAQ_DATA = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does a custom PC take to build?",
        a: "Our standard assembly time is 3-5 business days. This includes professional cable management, BIOS updates, OS installation, and a rigorous 48-hour burn-in stress test to ensure every component performs flawlessly under load."
      },
      {
        q: "Do you ship nationwide?",
        a: "Yes, we ship across all major cities in Pakistan. Custom PCs are packed using Instapak expanding foam to secure heavy components like graphics cards during transit, ensuring your system arrives exactly as it left our workshop."
      },
      {
        q: "Can I pick up my order locally?",
        a: "Yes! Local pickup is available at our Rawalpindi workshop. Select 'Local Pickup' during checkout and we'll notify you when your order is ready."
      }
    ]
  },
  {
    category: "Warranty & Support",
    items: [
      {
        q: "What is your warranty policy on custom PCs?",
        a: "Every custom PC built by Daddu Charger comes with a 1-year service warranty covering labor and diagnostics. The individual components carry their full manufacturer warranties (typically 1-3 years depending on the part). If a part fails, we handle the RMA process for you."
      },
      {
        q: "Do you provide after-sales support?",
        a: "Absolutely. We provide lifetime technical support via WhatsApp for all systems we build. Whether you need help with a driver update or have a question about upgrading years down the line, we're here to help."
      }
    ]
  },
  {
    category: "Hardware & Customization",
    items: [
      {
        q: "Can I customize one of your pre-built systems?",
        a: "Yes, our pre-configured builds in the 'Gaming PCs' section act as a starting point. If you want to add more storage, change the case, or upgrade the GPU, just contact us before ordering."
      },
      {
        q: "Do you use used or refurbished parts?",
        a: "No. Unless explicitly stated in a specific 'Clearance' or 'Refurbished' section, every component we sell and use in our builds is 100% brand new, factory-sealed, and sourced from authorized local distributors."
      }
    ]
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = React.useState(FAQ_DATA[0].category);
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const currentCategoryData = FAQ_DATA.find(c => c.category === activeCategory);

  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Support"
          headline={["Frequently", "Asked Questions"]}
          body="Everything you need to know about our builds, shipping, and warranty policies."
          size="sm"
        />

        <div className="dc-container py-16 lg:py-24 max-w-4xl">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-12">
            {FAQ_DATA.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-[var(--dc-duration-fast)] ${
                  activeCategory === cat.category
                    ? "bg-[var(--dc-text)] text-[var(--dc-bg)]"
                    : "bg-[var(--dc-surface)] text-[var(--dc-text-muted)] border border-[var(--dc-border)] hover:border-[var(--dc-accent)] hover:text-[var(--dc-text)]"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <RevealSection delay={0.1}>
            <div className="divide-y divide-[var(--dc-border)] border-y border-[var(--dc-border)]">
              {currentCategoryData?.items.map((item, i) => {
                const id = `${activeCategory}-${i}`;
                const isOpen = openItems[id] || false;
                
                return (
                  <div key={id} className="py-2">
                    <button
                      onClick={() => toggleItem(id)}
                      className="flex w-full items-center justify-between py-5 text-left group"
                    >
                      <span className={`text-lg font-display font-medium pr-8 transition-colors ${isOpen ? "text-[var(--dc-accent)]" : "text-[var(--dc-text)] group-hover:text-[var(--dc-accent)]"}`}>
                        {item.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: EASE.out }}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${isOpen ? "border-[var(--dc-accent)] text-[var(--dc-accent)] bg-[var(--dc-accent)]/10" : "border-[var(--dc-border)] text-[var(--dc-text-muted)] group-hover:border-[var(--dc-accent)] group-hover:text-[var(--dc-accent)]"}`}
                      >
                        <Plus size={16} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE.out }}
                          className="overflow-hidden"
                        >
                          <p className="pb-8 pt-2 text-[var(--dc-text-muted)] leading-relaxed max-w-3xl">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </RevealSection>
          
          {/* Still have questions block */}
          <RevealSection delay={0.2} className="mt-16 p-8 rounded-[var(--dc-radius-2xl)] bg-[var(--dc-surface-2)] border border-[var(--dc-border)] text-center">
            <h3 className="text-xl font-display font-bold mb-3">Still have questions?</h3>
            <p className="text-[var(--dc-text-muted)] mb-6">Our team is ready to help you build your dream rig.</p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--dc-text)] text-[var(--dc-bg)] font-bold hover:opacity-90 transition-opacity"
            >
              Contact Support
            </a>
          </RevealSection>
          
        </div>
      </PageShell>
      <SiteFooter />
    </>
  );
}
