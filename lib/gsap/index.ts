/**
 * GSAP REGISTRY
 * Single source of truth for GSAP plugin registration.
 * Import `gsap` and `ScrollTrigger` from here — never from
 * "gsap" and "gsap/ScrollTrigger" directly — to guarantee
 * plugins are only registered once.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register all plugins once at module load time.
// Safe to call multiple times — GSAP deduplicates internally.
gsap.registerPlugin(ScrollTrigger);

// Site-wide defaults — matches our EASE.out bezier curve.
gsap.defaults({
  ease: "expo.out",
  duration: 0.9,
});

export { gsap, ScrollTrigger };
