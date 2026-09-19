import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";
import { ProductCard } from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";

export const metadata: Metadata = {
  title: "Pre-Built Gaming PCs | Daddu Charger",
  description: "Shop high-performance, ready-to-ship gaming PCs assembled by experts at Daddu Charger.",
};

export default function GamingPCsPage() {
  // Let's just mock some pre-built PCs by taking some high-end components
  const products = MOCK_PRODUCTS.slice(0, 3); // using existing products as placeholders

  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen">
        <Section className="pb-12">
          <Container>
            {/* Header */}
            <div className="mb-12 max-w-3xl">
              <p className="dc-eyebrow mb-3 text-[var(--dc-accent)]">Ready to Game</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight text-[var(--dc-text)]">
                Pre-Built Gaming PCs
              </h1>
              <p className="text-lg text-[var(--dc-text-muted)] leading-relaxed mb-8">
                Skip the build time. Our pre-built systems are expertly assembled, rigorously tested, and ready to ship. From 1080p esports rigs to 4K behemoths, find your perfect match.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight size={18} />} asChild>
                  <Link href="/build-pc">Customize Your Own Instead</Link>
                </Button>
              </div>
            </div>

            {/* Empty State / Placeholder */}
            <div className="bg-[var(--dc-surface-2)] border border-[var(--dc-border-dashed)] rounded-[var(--dc-radius-2xl)] p-12 text-center">
              <h3 className="text-xl font-display font-bold text-[var(--dc-text)] mb-3">
                New inventory dropping soon.
              </h3>
              <p className="text-[var(--dc-text-muted)] max-w-md mx-auto">
                We are currently assembling a new lineup of pre-built systems. In the meantime, use our PC Builder to spec exactly what you need.
              </p>
            </div>
            
            {/* (Optional) we could render products here if we added PC mock data */}
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
