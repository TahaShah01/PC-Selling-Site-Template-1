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
/* ─────────────────────────────────────────────────────────
   PRELOADER — "POWER ON"
   Fail-safe implementation:
   - Safe sessionStorage handling (no crash in private/incognito)
   - Hard safety timeout (max 3.2s) ensures it NEVER hangs
   - Explicit onDone() backup if onExitComplete is throttled
   - Click-to-skip for instant manual dismiss
───────────────────────────────────────────────────────── */

const PANELS = 4;

function safeGetSession(key: string): string | null {
    try {
        return typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
    } catch {
        return null;
    }
}

function safeSetSession(key: string, val: string) {
    try {
        if (typeof window !== "undefined") sessionStorage.setItem(key, val);
    } catch {}
}

export function Preloader({ onDone }: { onDone?: () => void }) {
    const reduced = useReducedMotion();
    const [visible, setVisible] = React.useState(true);
    const [booted, setBooted] = React.useState(false);
    
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
    const barScale = useTransform(count, [0, 100], [0, 1]);

    const completedRef = React.useRef(false);

    const finish = React.useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;
        safeSetSession("dc-booted", "1");
        setBooted(true);
        setVisible(false);
        onDone?.();
    }, [onDone]);

    useScrollLock(visible && !booted);

    React.useEffect(() => {
        const alreadyBooted = Boolean(safeGetSession("dc-booted"));
        
        // Reduced motion or already seen: instant skip
        if (reduced || alreadyBooted) {
            finish();
            return;
        }

        // Hard safety timeout: under no circumstance will the preloader stay blocked > 3.2s
        const safetyTimeout = setTimeout(() => {
            finish();
        }, 3200);

        // Run animation sequence
        const controls = animate(count, 100, {
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => {
                safeSetSession("dc-booted", "1");
                // Brief pause so 100 is visible, then start wipe
                setTimeout(() => {
                    setVisible(false);
                    // Backup finish call in case onExitComplete fails to trigger
                    setTimeout(finish, 950);
                }, 300);
            },
        });

        return () => {
            controls.stop();
            clearTimeout(safetyTimeout);
        };
    }, [count, reduced, finish]);

    return (
        <AnimatePresence onExitComplete={finish}>
            {visible && (
                <motion.div
                    onClick={finish}
                    title="Click anywhere to skip"
                    className="fixed inset-0 z-[9998] flex flex-col justify-between overflow-hidden cursor-pointer px-6 py-8 sm:px-10 sm:py-12"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.85 } }}
                >
                    {/* Wipe panels — exit upward staggered */}
                    <div className="absolute inset-0 flex pointer-events-none" aria-hidden="true">
                        {Array.from({ length: PANELS }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="h-full flex-1 bg-[var(--dc-bg)]"
                                initial={{ y: "0%" }}
                                exit={{ y: "-100%" }}
                                transition={{ duration: 0.85, ease: EASE.inOut, delay: i * 0.06 }}
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
                            Booting store · <span className="underline opacity-60">Click to skip</span>
                        </motion.span>
                    </div>

                    {/* Wordmark + progress bar */}
                    <div className="relative z-10">
                        <div className="overflow-hidden">
                            <motion.p
                                initial={{ y: "110%" }}
                                animate={{ y: "0%" }}
                                exit={{ y: "-110%", transition: { duration: 0.5, ease: EASE.in } }}
                                transition={{ duration: 0.9, ease: EASE.out, delay: 0.1 }}
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