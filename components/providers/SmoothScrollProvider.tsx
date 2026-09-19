"use client";

import * as React from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   SMOOTH SCROLL
   Lenis drives the scroll position; every scroll-linked
   animation on the site reads from it. Disabled entirely
   when the OS asks for reduced motion.

   npm i lenis
───────────────────────────────────────────────────────── */

type Ctx = { lenis: Lenis | null; scrollTo: (target: string | number) => void };

const LenisContext = React.createContext<Ctx>({ lenis: null, scrollTo: () => { } });

export const useLenis = () => React.useContext(LenisContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = React.useState<Lenis | null>(null);

  React.useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.15,
      // expo-out — matches EASE.out so scroll and animation share a feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    setLenis(instance);

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  const scrollTo = React.useCallback(
    (target: string | number) => {
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      else if (typeof target === "string") {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis]
  );

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

/* ─── Lock / unlock scroll (cart drawer, mobile nav, preloader) ─── */
export function useScrollLock(locked: boolean) {
  const { lenis } = useLenis();

  React.useEffect(() => {
    if (locked) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [locked, lenis]);
}