"use client";

import * as React from "react";
import Image from "next/image";
import { Shield, Wrench, Zap, MonitorPlay } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell, RevealSection } from "@/components/sections/PageHero";
import { ScrollWordFill } from "@/components/motion/Reveal";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Our Story"
          headline={["We build rigs.", "We put our name", "on them."]}
          size="lg"
        />

        {/* The Manifesto */}
        <div className="dc-container py-20 lg:py-32">
          <div className="max-w-4xl mx-auto">
            <ScrollWordFill 
              text="Daddu Charger was founded with a single mission: to bring true enthusiast-grade hardware and meticulous craftsmanship to the Pakistani gaming community. We don't cut corners. We don't compromise on cooling. And we never use subpar power supplies. Every rig that leaves our workshop is built the exact same way we build our own machines—with obsession."
              className="text-2xl md:text-4xl lg:text-5xl font-display font-medium leading-tight text-[var(--dc-text)]"
            />
          </div>
        </div>

        {/* Stats Row */}
        <RevealSection className="border-y border-[var(--dc-border)] bg-[var(--dc-surface)]">
          <div className="dc-container py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-[var(--dc-border)]">
              <Stat value="2,500+" label="Custom Builds Delivered" />
              <Stat value="48h" label="Burn-in Stress Testing" />
              <Stat value="1st" label="Choice for Pro Gamers" />
              <Stat value="1Yr" label="Service Warranty" />
            </div>
          </div>
        </RevealSection>

        {/* Workshop Map Location */}
        <RevealSection className="py-24 overflow-hidden">
          <div className="dc-container">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Our Base of Operations</h2>
              <p className="text-[var(--dc-text-muted)] flex flex-col md:flex-row items-center justify-center gap-2">
                <Wrench size={16} className="text-[var(--dc-accent)]" />
                Royal Plaza, Basement (LG 04), 6th Road, Satellite Town, Rawalpindi
              </p>
            </div>
            
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[var(--dc-radius-2xl)] overflow-hidden border border-[var(--dc-border)] bg-[var(--dc-surface-2)] shadow-2xl group">
              {/* Overlay to prevent accidental scrolling on the map until hovered/clicked, and to add a subtle gradient */}
              <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
              
              <iframe
                src="https://maps.google.com/maps?q=Daddu+Charger+Gaming+Store,+Royal+Plaza,+6th+Road,+Rawalpindi,+Pakistan&t=m&z=16&output=embed&iwloc=near"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 dark:invert dark:hue-rotate-180 opacity-80 group-hover:opacity-100"
              />
            </div>
          </div>
        </RevealSection>

        {/* Values Grid */}
        <RevealSection className="dc-container py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Our Standards</h2>
            <p className="text-[var(--dc-text-muted)] max-w-2xl mx-auto text-lg">
              We hold ourselves to the highest standards in the industry. Because your frames depend on it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <ValueCard 
              icon={<Zap />}
              title="No Bottlenecks"
              desc="We pair components that make sense. No high-end GPUs choked by budget CPUs or slow memory."
            />
            <ValueCard 
              icon={<Shield />}
              title="Authorized Hardware"
              desc="We only source from official distributors. Every component is authentic and carries full local warranty support."
            />
            <ValueCard 
              icon={<Wrench />}
              title="Obsessive Cable Management"
              desc="Airflow matters. Aesthetics matter. Our cable runs are routed perfectly, even behind the motherboard tray where you can't see them."
            />
            <ValueCard 
              icon={<MonitorPlay />}
              title="Plug & Play Ready"
              desc="Windows installed, BIOS updated, XMP enabled, drivers loaded, and bloatware removed. Ready to game out of the box."
            />
          </div>
        </RevealSection>

        <ClosingCTA />
      </PageShell>
      <SiteFooter />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <span className="text-4xl md:text-5xl font-display font-bold text-[var(--dc-text)] mb-2">{value}</span>
      <span className="text-xs font-bold uppercase tracking-widest text-[var(--dc-text-subtle)]">{label}</span>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] group hover:border-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-normal)]">
      <div className="w-12 h-12 rounded-[var(--dc-radius-xl)] bg-[var(--dc-bg)] border border-[var(--dc-border)] flex items-center justify-center text-[var(--dc-text)] mb-6 group-hover:text-[var(--dc-accent)] group-hover:border-[var(--dc-accent)] transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--dc-text)] mb-3">{title}</h3>
      <p className="text-[var(--dc-text-muted)] leading-relaxed">{desc}</p>
    </div>
  );
}
