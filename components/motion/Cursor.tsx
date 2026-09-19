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
   CURSOR
   A single volt dot that reacts to what is under it.

   Usage anywhere in the tree:
     const cursor = useCursor();
     <div onMouseEnter={() => cursor.set("view")} ... />
     <div onMouseEnter={() => cursor.set("label", "Drag")} ... />
     onMouseLeave={cursor.reset}
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
            set: (m, l = "") => {
                setMode(m);
                setLabel(l);
            },
            reset: () => {
                setMode("default");
                setLabel("");
            },
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
    default: 12,
    hover: 56,
    view: 92,
    label: 84,
    hidden: 0,
};

function Cursor({ mode, label }: { mode: Mode; label: string }) {
    const reduced = useReducedMotion();
    const [enabled, setEnabled] = React.useState(false);

    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const sx = useSpring(x, SPRING.cursor);
    const sy = useSpring(y, SPRING.cursor);

    React.useEffect(() => {
        // Pointer-fine only: never show a fake cursor on touch.
        const mq = window.matchMedia("(pointer: fine)");
        const apply = () => setEnabled(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    React.useEffect(() => {
        if (!enabled) return;
        const move = (e: PointerEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };
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
                mixBlendMode: isRich ? "normal" : "difference",
            }}
            animate={{
                width: size,
                height: size,
                backgroundColor: isRich ? "var(--dc-accent)" : "#ffffff",
            }}
            transition={{ duration: 0.45, ease: EASE.out }}
        >
            <AnimatePresence mode="wait">
                {isRich && (
                    <motion.span
                        key={label || mode}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--dc-accent-text)] whitespace-nowrap"
                    >
                        {label || "View"}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
}