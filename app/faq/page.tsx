import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about our custom gaming PCs, shipping, and warranty policies.",
};

const FAQS = [
  {
    category: "Orders & Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit/debit cards, PayPal, and bank transfers. All transactions are securely processed in PKR.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or canceled within 2 hours of placement. Since custom PCs begin assembly quickly, changes after this window may not be possible.",
      },
      {
        q: "Do you offer financing or installment plans?",
        a: "Currently, we do not offer direct in-house financing. However, you may use credit card installment plans depending on your bank's policies.",
      }
    ]
  },
  {
    category: "Custom PC Builds",
    questions: [
      {
        q: "How long does it take to build and ship a custom PC?",
        a: "Standard build time is 3-5 business days. This includes professional assembly, stress testing, and benchmarking. Shipping takes an additional 2-4 days depending on your location in Pakistan.",
      },
      {
        q: "Do custom PCs come with an operating system installed?",
        a: "Yes, all custom rigs come with a trial version of Windows installed for testing. You can add a genuine Windows license during the configuration process.",
      },
      {
        q: "Can I request components that are not listed on your website?",
        a: "Yes! If you have a specific component in mind that isn't in our current catalog, please contact us via WhatsApp or Email, and we'll do our best to source it for your build.",
      }
    ]
  },
  {
    category: "Shipping & Warranty",
    questions: [
      {
        q: "Do you ship nationwide in Pakistan?",
        a: "Yes, we ship across Pakistan using secure, insured courier services to ensure your high-value components arrive safely.",
      },
      {
        q: "What is your warranty policy?",
        a: "All components carry their respective official manufacturer warranties. We also provide a 1-year Daddu Charger service warranty for labor and diagnostics on all custom builds.",
      },
      {
        q: "What happens if my PC arrives damaged?",
        a: "We pack all builds with extreme care (including internal expansion foam for GPUs). In the rare event of shipping damage, please document it immediately with photos and contact our support within 24 hours.",
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen">
        <Section className="pb-12">
          <Container className="max-w-4xl mx-auto text-center">
            <p className="dc-eyebrow mb-4">Support</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--dc-text)] mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-[var(--dc-text-muted)] leading-relaxed">
              Find answers to common questions about ordering, custom builds, and our policies.
            </p>
          </Container>
        </Section>

        <Section className="pt-0">
          <Container className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {FAQS.map((category, idx) => (
                <div key={idx} className="bg-[var(--dc-card)] border border-[var(--dc-border)] rounded-[var(--dc-radius-2xl)] p-8">
                  <h2 className="text-2xl font-bold text-[var(--dc-text)] mb-6 pb-4 border-b border-[var(--dc-border)]">
                    {category.category}
                  </h2>
                  <div className="space-y-6">
                    {category.questions.map((faq, fIdx) => (
                      <div key={fIdx}>
                        <h3 className="text-lg font-semibold text-[var(--dc-text)] mb-2">
                          {faq.q}
                        </h3>
                        <p className="text-[var(--dc-text-muted)] leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Still have questions? */}
            <div className="mt-12 text-center p-8 bg-[var(--dc-bg-elevated)] rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)]">
              <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
              <p className="text-[var(--dc-text-muted)] mb-6">
                Our team of PC experts is ready to help you out.
              </p>
              <a href="/contact" className="inline-flex items-center justify-center h-12 px-8 rounded-[var(--dc-radius-md)] bg-[var(--dc-accent)] text-[var(--dc-accent-text)] font-semibold hover:bg-[var(--dc-accent-hover)] transition-colors">
                Contact Support
              </a>
            </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
