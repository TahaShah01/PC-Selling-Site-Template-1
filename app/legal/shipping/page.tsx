import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell, RevealSection } from "@/components/sections/PageHero";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "Shipping Policy | Daddu Charger",
  description: "Information about shipping times, couriers, and delivery tracking for Daddu Charger orders.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Legal"
          headline={["Shipping", "Policy"]}
          body="How we deliver your premium hardware safely and on time."
          size="sm"
        />

        <RevealSection className="dc-container-narrow py-16">
          <div className="prose dark:prose-invert prose-lg prose-p:text-[var(--dc-text-muted)] prose-p:leading-relaxed prose-headings:text-[var(--dc-text)] prose-a:text-[var(--dc-accent)] max-w-none">
            <p className="text-sm uppercase tracking-wider text-[var(--dc-text-subtle)] mb-8">
              Last Updated: [PLACEHOLDER - CONFIRM WITH CLIENT]
            </p>

            <h2>1. Shipping Locations</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] We ship nationwide across Pakistan. Deliveries within {BUSINESS.city} are handled by our in-house team, while nationwide deliveries are dispatched via insured premium courier partners.
            </p>

            <h2>2. Processing Times</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] 
              <ul>
                <li><strong>Individual Components:</strong> Processed and dispatched within 1-2 business days.</li>
                <li><strong>Custom PC Builds:</strong> Require 3-5 business days for assembly, stress testing, and quality assurance before dispatch.</li>
              </ul>
            </p>

            <h2>3. Transit Times</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] Once dispatched, delivery typically takes:
              <ul>
                <li>Major Cities (Karachi, Lahore, Islamabad): 2-3 business days.</li>
                <li>Other Locations: 3-5 business days.</li>
              </ul>
            </p>
            
            <h2>4. Safe Transit Packaging</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] All custom PCs are packed with extreme care. We use Instapak expanding foam inside the chassis to secure heavy components like Graphics Cards and CPU coolers, preventing damage during transit. The system is then double-boxed with heavy-duty edge protectors.
            </p>
            
            <div className="mt-12 p-6 bg-[var(--dc-surface-2)] rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)]">
              <h3 className="mt-0 text-xl font-bold">Order Status</h3>
              <p className="mb-0">
                You will receive a tracking number via email and SMS once your order is dispatched. For direct updates, reach out to us on WhatsApp.
              </p>
            </div>
          </div>
        </RevealSection>
      </PageShell>
      <SiteFooter />
    </>
  );
}
