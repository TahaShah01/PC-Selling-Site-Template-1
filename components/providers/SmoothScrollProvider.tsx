"use client";

import * as React from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "../../lib/gsap";

/* ─────────────────────────────────────────────────────────
   SMOOTH SCROLL PROVIDER — Phase 0 rewrite + mobile fix

   Everything below the "MOBILE FIX" comment is unchanged from
   the existing rewrite (Lenis through gsap.ticker, scrollerProxy,
   lock via lenis.stop()). The one addition:

   MOBILE FIX — ScrollTrigger.config({ ignoreMobileResize: true })
   On phones, the address bar hiding/showing as you scroll fires
   a `resize` event, because the visible viewport height actually
   changes. ScrollTrigger's default reaction to any resize is to
   recalculate every pinned section's start/end — which, mid-pin,
   causes a visible jump or jitter. This is the documented GSAP
   fix: ignore resizes that are only a mobile viewport-height
   wobble, not a real layout change. Without it, every pinned
   section (Manifesto, BuildSequence, the desktop HorizontalShowcase)
   can stutter the first time a phone's browser chrome collapses
   mid-scroll.
───────────────────────────────────────────────────────── */

type Ctx = {
  lenis: Lenis | null;
  scrollTo: (target: string | number, opts?: { offset?: number; duration?: number }) => void;
};

const LenisContext = React.createContext<Ctx>({
  lenis: null,
  scrollTo: () => { },
});

export const useLenis = () => React.useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = React.useRef<Lenis | null>(null);
  const [lenis, setLenis] = React.useState<Lenis | null>(null);

  React.useEffect(() => {
    if (reduced) return;

    // MOBILE FIX — see header comment.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const instance = new Lenis({
      duration: 1.15,
      // expo-out — matches EASE.out so scroll and animation share a feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1.0,
    });

    lenisRef.current = instance;
    setLenis(instance);

    // ── Wire Lenis through GSAP's ticker for perfect sync ──
    gsap.ticker.lagSmoothing(0);
    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);

    // ── Proxy ScrollTrigger to Lenis's virtual position ──
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          instance.scrollTo(value, { immediate: true });
        }
        return instance.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: "transform",
    });

    instance.on("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", () => instance.scrollTo(instance.scroll, { immediate: true }));
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(onTick);
      ScrollTrigger.scrollerProxy(document.body, undefined as unknown as ScrollTrigger.ScrollerProxyVars);
      ScrollTrigger.removeEventListener("refresh", () => { });
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reduced]);

  const scrollTo = React.useCallback(
    (target: string | number, opts?: { offset?: number; duration?: number }) => {
      const instance = lenisRef.current;
      if (instance) {
        instance.scrollTo(target as number, { offset: opts?.offset ?? 0, duration: opts?.duration ?? 1.4 });
      } else if (typeof target === "string") {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    []
  );

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

/* ─── Lock / unlock scroll (preloader, mobile nav, modals) ─── */
export function useScrollLock(locked: boolean) {
  const { lenis } = useLenis();

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (locked) {
      lenis?.stop();
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        lenis?.start();
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  }, [locked, lenis]);
}