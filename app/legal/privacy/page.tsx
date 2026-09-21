import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell, RevealSection } from "@/components/sections/PageHero";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "Privacy Policy | Daddu Charger",
  description: "Learn how Daddu Charger collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Legal"
          headline={["Privacy", "Policy"]}
          body="How we collect, use, and protect your personal information."
          size="sm"
        />

        <RevealSection className="dc-container-narrow py-16">
          <div className="prose dark:prose-invert prose-lg prose-p:text-[var(--dc-text-muted)] prose-p:leading-relaxed prose-headings:text-[var(--dc-text)] prose-a:text-[var(--dc-accent)] max-w-none">
            <p className="text-sm uppercase tracking-wider text-[var(--dc-text-subtle)] mb-8">
              Last Updated: [PLACEHOLDER - CONFIRM WITH CLIENT]
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, delivery notes, and other information you choose to provide.
            </p>

            <h2>2. Use of Information</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] We may use the information we collect about you to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support, and authenticate users.
            </p>

            <h2>3. Sharing of Information</h2>
            <p>
              [PLACEHOLDER - CONFIRM WITH CLIENT] We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: With third party service providers; With the general public if you submit content in a public forum; With third parties with whom you choose to let us share information.
            </p>
            
            <div className="mt-12 p-6 bg-[var(--dc-surface-2)] rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)]">
              <h3 className="mt-0 text-xl font-bold">Questions about your privacy?</h3>
              <p className="mb-0">
                Contact our data protection team at <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              </p>
            </div>
          </div>
        </RevealSection>
      </PageShell>
      <SiteFooter />
    </>
  );
}
