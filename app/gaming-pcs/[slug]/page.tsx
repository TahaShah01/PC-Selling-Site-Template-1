"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ShieldCheck, Truck, ArrowLeft, Cpu, Gpu, Server, Box, Fan, Database, MonitorPlay, Zap } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageShell } from "@/components/sections/PageHero";
import { GAMING_PCS } from "@/data/gaming-pcs";
import { Button } from "@/components/primitives/Button";
import { formatPrice } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../../lib/gsap";

export default function GamingPCDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const pc = GAMING_PCS.find((b) => b.slug === slug);
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (!pc) notFound();

  useGSAP(
    () => {
      if (!containerRef.current || reduced) return;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });

      tl.fromTo(
        ".pc-hero-image",
        { opacity: 0, scale: 0.9, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "expo.out" }
      )
      .fromTo(
        ".pc-info-item",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.6"
      )
      .fromTo(
        ".pc-spec-row",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power1.out" },
        "-=0.4"
      );
    },
    { scope: containerRef, dependencies: [reduced] }
  );

  return (
    <>
      <SiteHeader />
      <PageShell>
        <div ref={containerRef} className="dc-container pt-8 pb-24">
          
          <Link 
            href="/gaming-pcs" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dc-text-muted)] hover:text-[var(--dc-accent)] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Gaming PCs
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Image with cinematic entrance */}
            <div className="pc-hero-image relative aspect-[4/5] lg:aspect-[3/4] w-full rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] overflow-hidden flex items-center justify-center p-12">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,0,0.1),transparent_70%)] opacity-50"
              />
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {pc.badge && (
                  <span className="bg-[var(--dc-accent)] text-[var(--dc-accent-text)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_10px_rgba(200,255,0,0.3)]">
                    {pc.badge}
                  </span>
                )}
                <span className="bg-[var(--dc-surface-2)] text-[var(--dc-text)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[var(--dc-border)]">
                  {pc.tier}
                </span>
              </div>
              <Image
                src={pc.image}
                alt={pc.name}
                fill
                className="object-cover dark:mix-blend-screen"
                priority
              />
            </div>

            {/* Right: Info and Specs */}
            <div className="flex flex-col">
              <div className="pc-info-item">
                <p className="dc-eyebrow mb-2">Pre-Built System</p>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--dc-text)] mb-3">
                  {pc.name}
                </h1>
                <p className="text-xl text-[var(--dc-text-muted)] mb-8">
                  {pc.tagline}
                </p>
              </div>

              <div className="pc-info-item flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[var(--dc-border)] mb-8">
                <div>
                  <p className="text-sm font-medium text-[var(--dc-text-subtle)] uppercase tracking-wider mb-2">Price</p>
                  <p className="text-4xl font-display font-bold text-[var(--dc-accent)]">{pc.price}</p>
                </div>
                <div className="flex gap-3">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto min-w-[200px]">
                    Configure & Buy
                  </Button>
                </div>
              </div>

              {/* Specs Table */}
              <div className="mb-10">
                <h3 className="pc-info-item text-lg font-semibold text-[var(--dc-text)] mb-6">System Specifications</h3>
                <div className="divide-y divide-[var(--dc-border)]">
                  <SpecRow label="Processor" value={pc.components.cpu} icon={<Cpu size={16} />} />
                  <SpecRow label="Graphics Card" value={pc.components.gpu} icon={<MonitorPlay size={16} />} />
                  <SpecRow label="Memory" value={pc.components.ram} icon={<Server size={16} />} />
                  <SpecRow label="Storage" value={pc.components.storage} icon={<Database size={16} />} />
                  <SpecRow label="Motherboard" value={pc.components.motherboard} icon={<Box size={16} />} />
                  <SpecRow label="Cooling" value={pc.components.cooling} icon={<Fan size={16} />} />
                  <SpecRow label="Power Supply" value={pc.components.psu} icon={<Zap size={16} />} />
                  <SpecRow label="Case" value={pc.components.case} icon={<Box size={16} />} />
                </div>
              </div>

              {/* Benchmarks (if available) */}
              {pc.benchmarks && pc.benchmarks.length > 0 && (
                <div className="mb-10 pc-info-item">
                   <h3 className="text-lg font-semibold text-[var(--dc-text)] mb-4">Performance</h3>
                   <div className="grid sm:grid-cols-3 gap-4">
                     {pc.benchmarks.map((bench, i) => (
                       <div key={i} className="bg-[var(--dc-surface-2)] border border-[var(--dc-border)] rounded-[var(--dc-radius-lg)] p-4 text-center">
                         <p className="text-[10px] font-bold uppercase text-[var(--dc-text-subtle)] mb-1">{bench.game}</p>
                         <p className="text-xl font-display font-bold text-[var(--dc-text)] mb-1">{bench.fps}</p>
                         <p className="text-[10px] text-[var(--dc-text-muted)]">{bench.resolution}</p>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {/* Trust Signals */}
              <div className="pc-info-item grid grid-cols-2 gap-4 py-6 border-y border-[var(--dc-border)]">
                <div className="flex items-center gap-3 text-sm text-[var(--dc-text-muted)]">
                  <ShieldCheck size={20} className="text-[var(--dc-accent)]" />
                  <span>1-Year Build Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--dc-text-muted)]">
                  <Truck size={20} className="text-[var(--dc-accent)]" />
                  <span>Nationwide Shipping</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </PageShell>
      <SiteFooter />
    </>
  );
}

function SpecRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="pc-spec-row flex flex-col sm:flex-row sm:items-center py-4 gap-2 sm:gap-6">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--dc-text-subtle)] sm:w-1/3 shrink-0">
        <span className="text-[var(--dc-border-strong)]">{icon}</span>
        {label}
      </div>
      <div className="text-sm text-[var(--dc-text)] font-medium">
        {value}
      </div>
    </div>
  );
}
