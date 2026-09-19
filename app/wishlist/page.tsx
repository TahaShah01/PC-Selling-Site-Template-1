import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";
import type { Metadata } from "next";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";

export const metadata: Metadata = {
  title: "Your Wishlist | Daddu Charger",
};

export default function WishlistPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-[70vh] flex items-center justify-center">
        <Section className="w-full">
          <Container>
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 bg-[var(--dc-surface-2)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--dc-accent)]">
                <Heart size={32} />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4 text-[var(--dc-text)]">
                Your Wishlist is Empty
              </h1>
              <p className="text-[var(--dc-text-muted)] mb-8">
                Save your favorite PC components and pre-built rigs here to easily find them later.
              </p>
              <Button size="lg" variant="primary" asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
