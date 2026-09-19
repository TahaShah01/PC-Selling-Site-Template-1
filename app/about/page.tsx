import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container, Section } from "@/components/primitives/Container";
import { BUSINESS } from "@/data/business";
import { Cpu, Zap, ShieldCheck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn more about ${BUSINESS.name}, ${BUSINESS.tagline}`,
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[calc(var(--dc-header-height)+2rem)] min-h-screen">
        <Section className="pb-12">
          <Container className="max-w-4xl mx-auto text-center">
            <p className="dc-eyebrow mb-4">Our Story</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--dc-text)] mb-6">
              Driven by Performance. <br className="hidden md:block" />
              <span className="text-[var(--dc-accent)]">Built for Gamers.</span>
            </h1>
            <p className="text-lg text-[var(--dc-text-muted)] leading-relaxed">
              {BUSINESS.description}
            </p>
          </Container>
        </Section>

        {/* Core Values Grid */}
        <Section className="bg-[var(--dc-bg-elevated)] border-y border-[var(--dc-border)]">
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Cpu,
                  title: "Expert Craftsmanship",
                  desc: "Every PC is meticulously built by seasoned technicians with strict quality control.",
                },
                {
                  icon: ShieldCheck,
                  title: "Authentic Parts",
                  desc: "We only source 100% genuine components with official manufacturer warranties.",
                },
                {
                  icon: Zap,
                  title: "Uncompromised Performance",
                  desc: "Rigs are benchmarked and stress-tested to ensure peak framerates out of the box.",
                },
                {
                  icon: MapPin,
                  title: "Local Excellence",
                  desc: `Proudly serving the gaming community from our base in ${BUSINESS.city}, ${BUSINESS.country}.`,
                },
              ].map((value, i) => (
                <div key={i} className="p-6 rounded-[var(--dc-radius-2xl)] bg-[var(--dc-card)] border border-[var(--dc-border)] hover:border-[var(--dc-border-accent)] transition-colors duration-[var(--dc-duration-normal)]">
                  <div className="w-12 h-12 rounded-[var(--dc-radius-lg)] bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-accent)] mb-4">
                    <value.icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--dc-text)] mb-2">{value.title}</h3>
                  <p className="text-sm text-[var(--dc-text-subtle)] leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
        
        {/* Our Approach */}
        <Section>
          <Container className="max-w-4xl mx-auto">
             <div className="prose prose-invert prose-lg prose-p:text-[var(--dc-text-muted)] prose-p:leading-relaxed prose-headings:text-[var(--dc-text)] prose-a:text-[var(--dc-accent)] max-w-none">
              <h2>The Daddu Charger Standard</h2>
              <p>
                At Daddu Charger, we don't just sell parts; we engineer experiences. Whether you are building your first 1080p gaming rig or a top-tier 4K workstation for content creation, our philosophy remains the same: zero compromises on quality, stability, and aesthetics.
              </p>
              <p>
                We understand that a PC is an investment. That's why we guide our customers through the entire process, from component selection to post-purchase support, ensuring that every build is optimized, balanced, and ready to dominate the latest titles.
              </p>
             </div>
          </Container>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
