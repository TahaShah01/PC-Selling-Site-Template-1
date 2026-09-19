"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, MapPin, Cpu, Headphones, Star } from "lucide-react";
import { Container, Section } from "../primitives/Container";
import { BUSINESS } from "../../data/business";

/* ─────────────────────────────────────────────────────────
   WHY DADDU CHARGER SECTION
   Trust signals and brand differentiators.
───────────────────────────────────────────────────────── */

const TRUST_SIGNALS = [
  {
    icon: Cpu,
    title: "Expert Builds",
    description:
      "Every PC is assembled, tested, and benchmarked by experienced technicians before leaving our workshop.",
  },
  {
    icon: CheckCircle2,
    title: "Genuine Parts Only",
    description:
      "We stock authentic, manufacturer-warranted components. Zero counterfeit. Zero compromise.",
  },
  {
    icon: MapPin,
    title: "Based in Rawalpindi",
    description:
      "Local store, local support. Walk in, speak to an expert, and see your build come to life.",
  },
  {
    icon: Headphones,
    title: "After-Sale Support",
    description:
      "We don't disappear after the sale. Contact us via WhatsApp for technical help anytime.",
  },
  {
    icon: Star,
    title: "Best Prices in Pakistan",
    description:
      "Competitive pricing on every product category — no hidden fees, no inflated margins.",
  },
];

export function TrustSection() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section>
      <Container ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="dc-eyebrow mb-3">Why Us</p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-display font-bold text-[var(--dc-text)] leading-tight tracking-tight">
            The Daddu Charger{" "}
            <span className="text-[var(--dc-accent)]">Difference</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TRUST_SIGNALS.map((signal, i) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.1 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group p-6 rounded-[var(--dc-radius-2xl)] bg-[var(--dc-card)] border border-[var(--dc-border)] hover:border-[var(--dc-border-accent)] transition-all duration-[var(--dc-duration-normal)] hover:shadow-[var(--dc-shadow-accent)] relative overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(200,255,0,0.04)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--dc-duration-normal)]" aria-hidden="true" />

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-[var(--dc-radius-lg)] bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-text-subtle)] group-hover:text-[var(--dc-accent)] group-hover:bg-[var(--dc-accent-dim)] transition-all duration-[var(--dc-duration-normal)] mb-4">
                  <signal.icon size={18} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--dc-text)] mb-2">
                  {signal.title}
                </h3>
                <p className="text-xs text-[var(--dc-text-subtle)] leading-relaxed">
                  {signal.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* City badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] text-xs text-[var(--dc-text-subtle)]">
            <MapPin size={12} className="text-[var(--dc-accent)]" />
            <span>
              Serving gamers across Pakistan from {BUSINESS.city}
            </span>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
