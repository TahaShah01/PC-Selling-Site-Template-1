"use client";

import * as React from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";
import { SPRING, EASE } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   CURSOR — Phase 8 fix

   Fix #15: removed mix-blend-mode: difference which made
   the dot near-invisible on --dc-bg (#080808).
   Default mode now uses volt color at 70% opacity — reads
   clearly on both dark backgrounds and light text areas.
   Hover mode: larger ring with volt border, low-opacity fill.
   View/label mode: solid volt fill (unchanged, correct).
───────────────────────────────────────────────────────── */

type Mode = "default" | "hover" | "view" | "label" | "hidden";

type CursorApi = {
    set: (mode: Mode, label?: string) => void;
    reset: () => void;
};

const CursorContext = React.createContext<CursorApi>({ set: () => { }, reset: () => { } });
export const useCursor = () => React.useContext(CursorContext);

export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = React.useState<Mode>("default");
    const [label, setLabel] = React.useState("");

    const api = React.useMemo<CursorApi>(
        () => ({
            set: (m, l = "") => { setMode(m); setLabel(l); },
            reset: () => { setMode("default"); setLabel(""); },
        }),
        []
    );

    return (
        <CursorContext.Provider value={api}>
            {children}
            <Cursor mode={mode} label={label} />
        </CursorContext.Provider>
    );
}

const SIZES: Record<Mode, number> = {
    default: 10,
    hover: 52,
    view: 92,
    label: 84,
    hidden: 0,
};

// Background colors per mode — uses theme tokens for light and dark compatibility
const BG_COLORS: Record<Mode, string> = {
    default: "var(--dc-accent)",
    hover: "var(--dc-accent-dim)",
    view: "var(--dc-accent)",
    label: "var(--dc-accent)",
    hidden: "transparent",
};

const BORDER_COLORS: Record<Mode, string> = {
    default: "rgba(0, 0, 0, 0.15)",
    hover: "var(--dc-accent)",
    view: "transparent",
    label: "transparent",
    hidden: "transparent",
};

function Cursor({ mode, label }: { mode: Mode; label: string }) {
    const reduced = useReducedMotion();
    const [enabled, setEnabled] = React.useState(false);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const sx = useSpring(x, SPRING.cursor);
    const sy = useSpring(y, SPRING.cursor);

    React.useEffect(() => {
        const mq = window.matchMedia("(pointer: fine)");
        const apply = () => setEnabled(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    React.useEffect(() => {
        if (!enabled) return;
        const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
    }, [enabled, x, y]);

    if (!enabled || reduced) return null;

    const size = SIZES[mode];
    const isRich = mode === "view" || mode === "label";

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:flex items-center justify-center rounded-full"
            style={{
                x: sx,
                y: sy,
                translateX: "-50%",
                translateY: "-50%",
                // No mix-blend-mode — solid volt color reads on dark and light backgrounds
                border: `1.5px solid ${BORDER_COLORS[mode]}`,
            }}
            animate={{
                width: size,
                height: size,
                backgroundColor: BG_COLORS[mode],
            }}
            transition={{ duration: 0.4, ease: EASE.out }}
        >
            <AnimatePresence mode="wait">
                {isRich && (
                    <motion.span
                        key={label || mode}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap"
                        style={{ color: "var(--dc-accent-text)" }}
                    >
                        {label || "View"}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
}