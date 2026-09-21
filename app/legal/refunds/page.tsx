import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell, RevealSection } from "@/components/sections/PageHero";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "Refund Policy | Daddu Charger",
  description: "Daddu Charger's return and refund policy for custom PCs and components.",
};

export default function RefundsPolicyPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Legal"
          headline={["Refund", "Policy"]}
          body="Our policies regarding returns, refunds, and order cancellations."
          size="sm"
        />

        <RevealSection className="dc-container-narrow py-16">
          <div className="prose dark:prose-invert prose-lg prose-p:text-[var(--dc-text-muted)] prose-p:leading-relaxed prose-headings:text-[var(--dc-text)] prose-a:text-[var(--dc-accent)] max-w-none">
            <p className="text-sm uppercase tracking-wider text-[var(--dc-text-subtle)] mb-8">
              Last Updated: [PLACEHOLDER - CONFIRM WITH CLIENT]
            </p>

            <h2>1. Order Cancellations</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] You may cancel your order within {BUSINESS.returnWindow} hours of placement without any penalty. Once a custom PC build has commenced assembly (usually within 24 hours), cancellations may be subject to a restocking fee to cover unboxing and testing labor.
            </p>

            <h2>2. Returns on Components</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] Unopened, factory-sealed components can be returned within 7 days of delivery. The customer is responsible for return shipping costs. Opened components are generally not eligible for return unless defective out of the box (DOA).
            </p>

            <h2>3. Custom PC Returns</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] Because custom PCs are built to order, we do not accept returns for "change of mind". If your system arrives damaged or defective, our support team will repair or replace the affected components under our warranty policy.
            </p>
            
            <h2>4. Refund Processing</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] Approved refunds are processed back to the original payment method. Depending on your bank, it may take 5-10 business days for the funds to appear in your account.
            </p>
            
            <div className="mt-12 p-6 bg-[var(--dc-surface-2)] rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)]">
              <h3 className="mt-0 text-xl font-bold">Need to request a return?</h3>
              <p className="mb-0">
                Contact our support team at <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or via WhatsApp with your order number.
              </p>
            </div>
          </div>
        </RevealSection>
      </PageShell>
      <SiteFooter />
    </>
  );
}
