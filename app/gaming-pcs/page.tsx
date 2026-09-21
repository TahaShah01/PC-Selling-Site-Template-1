"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info, Check, MonitorPlay, Zap, ShieldCheck } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageHero, PageShell, RevealSection } from "@/components/sections/PageHero";
import { GAMING_PCS } from "@/data/gaming-pcs";

export default function GamingPCsPage() {
  const [activeTier, setActiveTier] = React.useState<string>("All");
  const reduced = useReducedMotion();
  const gridRef = React.useRef<HTMLDivElement>(null);

  const tiers = ["All", "1080p", "1440p", "4K", "Workstation", "Budget"];

  const filteredBuilds = React.useMemo(() => {
    if (activeTier === "All") return GAMING_PCS;
    return GAMING_PCS.filter(pc => pc.tier === activeTier);
  }, [activeTier]);

  useGSAP(
    () => {
      if (!gridRef.current || reduced) return;
      
      const cards = gsap.utils.toArray<HTMLElement>(".pc-card", gridRef.current);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          }
        }
      );
    },
    { scope: gridRef, dependencies: [filteredBuilds, reduced] }
  );

  return (
    <>
      <SiteHeader />
      <PageShell>
        <PageHero
          eyebrow="Pre-Built Systems"
          headline={["Ready to", "Dominate"]}
          body="Expertly curated and professionally assembled systems. Tested for 48 hours. Ready to plug and play."
        />

        <div className="dc-container py-16 lg:py-24">
          
          {/* Tier Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-[var(--dc-duration-fast)] ${
                  activeTier === tier
                    ? "bg-[var(--dc-accent)] text-[var(--dc-accent-text)]"
                    : "bg-[var(--dc-surface)] text-[var(--dc-text-muted)] border border-[var(--dc-border)] hover:border-[var(--dc-accent)] hover:text-[var(--dc-text)]"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Builds Grid — 3-column responsive layout with compact card sizing */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuilds.map((pc) => (
              <Link 
                key={pc.slug} 
                href={`/gaming-pcs/${pc.slug}`}
                className="pc-card group relative flex flex-col rounded-[var(--dc-radius-xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)] overflow-hidden transition-all duration-[var(--dc-duration-normal)] hover:border-[var(--dc-accent)] hover:shadow-lg"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--dc-surface-2)]">
                  {/* Ambient Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,0,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                    {pc.badge && (
                      <span className="bg-[var(--dc-accent)] text-[var(--dc-accent-text)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {pc.badge}
                      </span>
                    )}
                    <span className="bg-[var(--dc-bg)]/80 backdrop-blur-sm border border-[var(--dc-border)] text-[var(--dc-text)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {pc.tier}
                    </span>
                  </div>

                  <Image 
                    src={pc.image} 
                    alt={pc.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[var(--dc-ease-out)] group-hover:scale-105 dark:mix-blend-screen" 
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-5 sm:p-6 relative z-10 bg-gradient-to-b from-transparent to-[var(--dc-surface)]">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div>
                      <h2 className="text-xl font-display font-bold text-[var(--dc-text)] mb-0.5 group-hover:text-[var(--dc-accent)] transition-colors">{pc.name}</h2>
                      <p className="text-xs text-[var(--dc-text-muted)] line-clamp-1">{pc.tagline}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--dc-text-subtle)]">Price</p>
                      <p className="text-base sm:text-lg font-display font-bold text-[var(--dc-text)]">{pc.price}</p>
                    </div>
                  </div>

                  {/* Spec Highlight */}
                  <div className="bg-[var(--dc-surface-2)] border border-[var(--dc-border)] rounded-[var(--dc-radius-md)] p-3 mb-4">
                    <p className="text-xs font-medium text-[var(--dc-text)] line-clamp-2 leading-relaxed">{pc.spec}</p>
                  </div>

                  {/* Highlights List */}
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {pc.highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[var(--dc-text-muted)]">
                        <Check size={14} className="text-[var(--dc-accent)] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--dc-border)]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--dc-text-subtle)] group-hover:text-[var(--dc-accent)] transition-colors">
                      View Full Specs
                    </span>
                    <ArrowRight size={14} className="text-[var(--dc-text-subtle)] group-hover:text-[var(--dc-accent)] transition-colors group-hover:translate-x-1.5 duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredBuilds.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[var(--dc-text-muted)]">No builds found in this tier.</p>
            </div>
          )}

        </div>
      </PageShell>
      <SiteFooter />
    </>
  );
}
