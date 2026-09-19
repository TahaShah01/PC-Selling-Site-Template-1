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
   A POST screen for the site: counter races to 100, the
   wordmark unmasks, then four volt panels wipe upward and
   hand off to the hero. Runs once per session.
───────────────────────────────────────────────────────── */

const PANELS = 4;

export function Preloader({ onDone }: { onDone?: () => void }) {
    const reduced = useReducedMotion();
    const [visible, setVisible] = React.useState(true);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
    const barScale = useTransform(count, [0, 100], [0, 1]);

    useScrollLock(visible);

    React.useEffect(() => {
        if (reduced) {
            setVisible(false);
            onDone?.();
            return;
        }

        if (sessionStorage.getItem("dc-booted")) {
            setVisible(false);
            onDone?.();
            return;
        }

        const controls = animate(count, 100, {
            duration: 2.1,
            ease: [0.16, 1, 0.3, 1],
            onComplete: () => {
                sessionStorage.setItem("dc-booted", "1");
                setTimeout(() => {
                    setVisible(false);
                    onDone?.();
                }, 420);
            },
        });

        return () => controls.stop();
    }, [count, onDone, reduced]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-0 z-[9998] flex flex-col justify-between bg-[var(--dc-bg)] px-6 py-8 sm:px-10 sm:py-12"
                    exit={{ transition: { staggerChildren: 0.06 } }}
                >
                    {/* Wipe panels */}
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

                    <div className="relative z-10 flex items-start justify-between">
                        <motion.span
                            className="text-xs text-[var(--dc-text-subtle)]"
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        >
                            Daddu Charger — Rawalpindi
                        </motion.span>
                        <motion.span
                            className="text-xs text-[var(--dc-text-subtle)]"
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        >
                            Booting store
                        </motion.span>
                    </div>

                    <div className="relative z-10">
                        <div className="overflow-hidden">
                            <motion.p
                                initial={{ y: "110%" }}
                                animate={{ y: "0%" }}
                                exit={{ y: "-110%" }}
                                transition={{ duration: 1, ease: EASE.out, delay: 0.15 }}
                                className="font-display font-bold text-[var(--dc-text)] text-[clamp(2.5rem,11vw,9rem)] leading-[0.88] tracking-[-0.05em]"
                            >
                                daddu<span className="text-[var(--dc-accent)]">charger</span>
                            </motion.p>
                        </div>

                        {/* Progress rule */}
                        <motion.div
                            className="mt-8 h-px w-full bg-[var(--dc-border)] origin-left"
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        >
                            <motion.div
                                className="h-px w-full bg-[var(--dc-accent)] origin-left"
                                style={{ scaleX: barScale }}
                            />
                        </motion.div>
                    </div>

                    <div className="relative z-10 flex items-end justify-between">
                        <motion.span
                            className="text-xs text-[var(--dc-text-subtle)] max-w-[24ch] leading-relaxed"
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        >
                            Genuine parts. Assembled, stress-tested, benchmarked.
                        </motion.span>
                        <motion.span
                            className="font-display font-bold tabular-nums text-[var(--dc-accent)] text-[clamp(2rem,7vw,5rem)] leading-none"
                            exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}
                        >
                            {rounded}
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}