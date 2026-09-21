import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell, RevealSection } from "@/components/sections/PageHero";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "Terms of Service | Daddu Charger",
  description: "Terms and conditions for using the Daddu Charger website and services.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Legal"
          headline={["Terms of", "Service"]}
          body="The rules and guidelines for using our website and purchasing our products."
          size="sm"
        />

        <RevealSection className="dc-container-narrow py-16">
          <div className="prose dark:prose-invert prose-lg prose-p:text-[var(--dc-text-muted)] prose-p:leading-relaxed prose-headings:text-[var(--dc-text)] prose-a:text-[var(--dc-accent)] max-w-none">
            <p className="text-sm uppercase tracking-wider text-[var(--dc-text-subtle)] mb-8">
              Last Updated: [PLACEHOLDER - CONFIRM WITH CLIENT]
            </p>

            <h2>1. General Conditions</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions, including those additional terms and conditions and policies referenced herein. These Terms of Service apply to all users of the site.
            </p>

            <h2>2. Product Accuracy & Pricing</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] We strive to ensure all pricing and specifications are accurate. However, hardware markets are volatile and pricing can change without notice. In the event a product is listed at an incorrect price due to a typographical error or an error in pricing information received from our suppliers, we reserve the right to refuse or cancel any orders placed for that product.
            </p>

            <h2>3. Warranties</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] All products carry their respective manufacturer's warranties unless stated otherwise. Daddu Charger provides a 1-year service warranty on all custom pre-built systems, which covers labor for diagnosis and replacement of defective parts. This does not cover software issues, user-inflicted physical damage, or damage from power surges.
            </p>
            
            <h2>4. Limitation of Liability</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] In no case shall Daddu Charger, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind arising from your use of any of the service or any products procured using the service.
            </p>
            
            <div className="mt-12 p-6 bg-[var(--dc-surface-2)] rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)]">
              <h3 className="mt-0 text-xl font-bold">Questions?</h3>
              <p className="mb-0">
                If you have any questions regarding our terms of service, please contact us at <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
              </p>
            </div>
          </div>
        </RevealSection>
      </PageShell>
      <SiteFooter />
    </>
  );
}
