"use client";

import * as React from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "../../lib/gsap";

/* ─────────────────────────────────────────────────────────
   SMOOTH SCROLL PROVIDER — Phase 0 rewrite

   Key change from the previous version:
   • Lenis now runs through gsap.ticker instead of its own
     requestAnimationFrame loop. This gives frame-perfect
     synchronisation between Lenis's virtual scroll position
     and GSAP ScrollTrigger — fixing the 1-2 frame lag that
     made all scroll-linked animations feel slightly off.
   • ScrollTrigger is pointed at Lenis via scrollerProxy so
     GSAP reads the virtual position, not native scrollTop.
   • useScrollLock no longer touches document.overflow —
     lenis.stop() is sufficient and avoids layout shifts.
   • scrollbar-gutter: stable in globals.css prevents the
     width jump when the scrollbar disappears on lock.
───────────────────────────────────────────────────────── */

type Ctx = {
  lenis: Lenis | null;
  scrollTo: (target: string | number, opts?: { offset?: number; duration?: number }) => void;
};

const LenisContext = React.createContext<Ctx>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenis = () => React.useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = React.useRef<Lenis | null>(null);
  const [lenis, setLenis] = React.useState<Lenis | null>(null);

  React.useEffect(() => {
    if (reduced) return;

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
    // GSAP's internal ticker runs at display refresh rate.
    // lagSmoothing(0) tells GSAP not to compress time when
    // the tab becomes visible again — prevents animation jumps.
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

    // Refresh ScrollTrigger after each Lenis scroll tick
    instance.on("scroll", ScrollTrigger.update);

    // Also refresh on resize
    ScrollTrigger.addEventListener("refresh", () => instance.scrollTo(instance.scroll, { immediate: true }));
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(onTick);
      ScrollTrigger.scrollerProxy(document.body, undefined as unknown as ScrollTrigger.ScrollerProxyVars);
      ScrollTrigger.removeEventListener("refresh", () => {});
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
    // Only lenis.stop() / start() — no overflow:hidden needed.
    // overflow:hidden on documentElement triggers a layout shift
    // (scrollbar disappears → content reflows to fill the gap).
    // Lenis prevents scroll events without touching layout.
    if (locked) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [locked, lenis]);
}