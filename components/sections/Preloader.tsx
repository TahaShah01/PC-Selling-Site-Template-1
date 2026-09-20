"use client";

import * as React from "react";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    animate,
    useReducedMotion,
} from "framer-motion";
import { EASE } from "../../lib/motion/Motion";
import { useScrollLock } from "../providers/SmoothScrollProvider";

/* ─────────────────────────────────────────────────────────
   PRELOADER — "POWER ON"

   Sequence (first visit):
   1. Dark screen covers the page (z-[9998])
   2. Wordmark unmasks upward (mask reveal)
   3. Counter animates 000 → 100 over 2.1 s
   4. After counter: setVisible(false) triggers exit
   5. Four volt-panel columns wipe upward (staggered, ~1 s)
   6. AnimatePresence.onExitComplete fires → onDone() → Hero enters
   
   Sequence (session already booted):
   1. Preloader is NOT shown at all (skips to step 6 immediately)
   2. Hero entrance handles itself via the ready prop
   
   KEY FIX: onDone() is called ONLY via onExitComplete — after
   the exit animation fully completes. Previously it was called
   at the same time as setVisible(false), causing the Hero to
   start animating while the preloader panels were still wiping
   upward. Now the handoff is frame-perfect.
───────────────────────────────────────────────────────── */

const PANELS = 4;

export function Preloader({ onDone }: { onDone?: () => void }) {
    const reduced = useReducedMotion();
    
    // Determine upfront if we should show the preloader at all.
    // On server this is always true (no sessionStorage), client overrides in useEffect.
    const [visible, setVisible] = React.useState(true);
    const [booted, setBooted] = React.useState(false);
    
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
    const barScale = useTransform(count, [0, 100], [0, 1]);

    useScrollLock(visible && !booted);

    React.useEffect(() => {
        // Check session on client mount
        const alreadyBooted = Boolean(sessionStorage.getItem("dc-booted"));
        
        // Reduced motion OR already seen: skip preloader, call onDone directly
        if (reduced || alreadyBooted) {
            setBooted(true);
            setVisible(false);
            // Small delay so Hero's initial state renders before animating in
            const t = setTimeout(() => onDone?.(), 50);
            return () => clearTimeout(t);
        }

        // First visit: run the full power-on sequence.
        const controls = animate(count, 100, {
            duration: 2.1,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => {
                sessionStorage.setItem("dc-booted", "1");
                // Flag onExitComplete to call onDone after panels finish wiping
                shouldCallOnExitComplete.current = true;
                // Wait a beat so the user sees 100 before the wipe
                setTimeout(() => setVisible(false), 380);
            },
        });

        return () => controls.stop();
    }, [count, reduced]);
    // NOTE: onDone is intentionally NOT in the dependency array — it is called
    // via onExitComplete on AnimatePresence below, not inside this effect.

    // This ref is set to true only in the first-visit path, so onExitComplete
    // only calls onDone after the full panel wipe has completed.
    const shouldCallOnExitComplete = React.useRef(false);

    return (
        <AnimatePresence onExitComplete={() => {
            if (shouldCallOnExitComplete.current) {
                onDone?.();
            }
        }}>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-[9998] flex flex-col justify-between bg-[var(--dc-bg)] px-6 py-8 sm:px-10 sm:py-12"
                    exit={{ transition: { staggerChildren: 0.06 } }}
                >
                    {/* Wipe panels — exit upward staggered */}
                    <div className="absolute inset-0 flex" aria-hidden="true">
                        {Array.from({ length: PANELS }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="h-full flex-1 bg-[var(--dc-bg)]"
                                initial={{ y: "0%" }}
                                exit={{ y: "-100%" }}
                                transition={{ duration: 0.9, ease: EASE.inOut, delay: i * 0.07 }}
                            />
                        ))}
                    </div>

                    {/* Top row */}
                    <div className="relative z-10 flex items-start justify-between">
                        <motion.span
                            className="text-xs text-[var(--dc-text-subtle)]"
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        >
                            Daddu Charger — Rawalpindi
                        </motion.span>
                        <motion.span
                            className="text-xs text-[var(--dc-text-subtle)]"
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        >
                            Booting store
                        </motion.span>
                    </div>

                    {/* Wordmark + progress bar */}
                    <div className="relative z-10">
                        <div className="overflow-hidden">
                            <motion.p
                                initial={{ y: "110%" }}
                                animate={{ y: "0%" }}
                                exit={{ y: "-110%", transition: { duration: 0.6, ease: EASE.in } }}
                                transition={{ duration: 1, ease: EASE.out, delay: 0.15 }}
                                className="font-display font-bold text-[var(--dc-text)] text-[clamp(2.5rem,11vw,9rem)] leading-[0.88] tracking-[-0.05em]"
                            >
                                daddu<span className="text-[var(--dc-accent)]">charger</span>
                            </motion.p>
                        </div>

                        {/* Progress bar */}
                        <motion.div
                            className="mt-8 h-px w-full bg-[var(--dc-border)]"
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        >
                            <motion.div
                                className="h-px w-full bg-[var(--dc-accent)] origin-left"
                                style={{ scaleX: barScale }}
                            />
                        </motion.div>
                    </div>

                    {/* Bottom row */}
                    <div className="relative z-10 flex items-end justify-between">
                        <motion.span
                            className="text-xs text-[var(--dc-text-subtle)] max-w-[24ch] leading-relaxed"
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        >
                            Genuine parts. Assembled, stress-tested, benchmarked.
                        </motion.span>
                        <motion.span
                            className="font-display font-bold tabular-nums text-[var(--dc-accent)] text-[clamp(2rem,7vw,5rem)] leading-none"
                            exit={{ opacity: 0, y: 16, transition: { duration: 0.3 } }}
                        >
                            {rounded}
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}