"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, Wrench, Package, Headphones } from "lucide-react";
import { Button } from "../primitives/Button";
import { Container, Section } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   PC BUILDER CTA SECTION
   A large editorial callout for the PC Builder feature.
───────────────────────────────────────────────────────── */

const STEPS = [
  {
    icon: Zap,
    title: "Choose Your Parts",
    description: "Browse our catalog of genuine, tested components.",
  },
  {
    icon: Wrench,
    title: "We Build It",
    description: "Our technicians assemble and test every rig.",
  },
  {
    icon: Package,
    title: "Delivered Ready",
    description: "Fully assembled, tuned, and ready to game.",
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    description: "We're with you after every purchase.",
  },
];

export function BuilderCTA() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <Section className="bg-[var(--dc-bg-elevated)] relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-10"
        style={{ 
          backgroundImage: "url('/category_grid_bg_1789821288197.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: yParallax
        }}
        aria-hidden="true"
      />
      
      {/* Accent glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(200,255,0,0.06)_0%,transparent_70%)] pointer-events-none z-0"
        aria-hidden="true"
      />

      <Container ref={ref} className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="dc-eyebrow mb-4">PC Builder</p>
            <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-display font-bold text-[var(--dc-text)] leading-[1.05] tracking-tight mb-6">
              Your Dream Rig.
              <br />
              <span className="text-[var(--dc-accent)]">Configured.</span>
              <br />
              <span className="text-[var(--dc-text-muted)]">Crafted. Delivered.</span>
            </h2>
            <p className="text-lg text-[var(--dc-text-muted)] leading-relaxed max-w-lg mb-8">
              Use our interactive PC Builder to spec your ideal gaming machine —
              choose every component with real-time compatibility checking and
              live PKR pricing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/build-pc">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight size={18} />}>
                  Start Building
                </Button>
              </Link>
              <Link href="/gaming-pcs">
                <Button size="lg" variant="ghost">
                  Browse Ready Builds
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: Steps grid */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="p-5 rounded-[var(--dc-radius-xl)] bg-[var(--dc-card)] border border-[var(--dc-border)] hover:border-[var(--dc-border-accent)] transition-colors duration-[var(--dc-duration-normal)] group"
              >
                <div className="w-9 h-9 rounded-[var(--dc-radius-md)] bg-[var(--dc-surface)] flex items-center justify-center text-[var(--dc-text-subtle)] group-hover:text-[var(--dc-accent)] group-hover:bg-[var(--dc-accent-dim)] transition-all duration-[var(--dc-duration-normal)] mb-3">
                  <step.icon size={16} />
                </div>
                <p className="text-sm font-semibold text-[var(--dc-text)] mb-1.5">
                  {step.title}
                </p>
                <p className="text-xs text-[var(--dc-text-subtle)] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
