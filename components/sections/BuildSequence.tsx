"use client";

import * as React from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
    useReducedMotion,
    AnimatePresence,
    type MotionValue,
} from "framer-motion";
import { EASE } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   BUILD SEQUENCE  (the centrepiece)

   The section is 4 screens tall and pinned. As you scroll:
   • four part layers fly into place, one per step, and stay
   • the active step's text cross-fades in from the left
   • a vertical progress rail fills with the scroll
   • the step index ticks 01 → 04 in oversized type

   Layer art: transparent PNG/WebP cut-outs in /public/build/.
   Ask me and I'll swap in whatever filenames you have.
───────────────────────────────────────────────────────── */

type Step = {
    title: string;
    body: string;
    /** transparent cut-out for this stage */
    layer: string;
    /** where the layer flies in from */
    from: { x: number; y: number; rotate: number };
};

const STEPS: Step[] = [
    {
        title: "Spec",
        body: "We start from the games and the resolution you want, then work backwards to a parts list that hits it without wasting a rupee.",
        layer: "/build/01-case.png",
        from: { x: 0, y: 140, rotate: -6 },
    },
    {
        title: "Source",
        body: "Every component is ordered genuine with manufacturer warranty. If something is out of stock we tell you the wait instead of substituting quietly.",
        layer: "/build/02-board.png",
        from: { x: -180, y: 60, rotate: 8 },
    },
    {
        title: "Assemble",
        body: "Hand-built, cable-managed, BIOS and fan curves configured. Airflow planned around the parts you chose, not a generic template.",
        layer: "/build/03-gpu.png",
        from: { x: 200, y: 40, rotate: -10 },
    },
    {
        title: "Burn in",
        body: "48 hours of thermal and stability testing, then benchmarks in your games. You get the numbers before the machine leaves the shop.",
        layer: "/build/04-cooling.png",
        from: { x: 0, y: -160, rotate: 6 },
    },
];

export function BuildSequence() {
    const ref = React.useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const [active, setActive] = React.useState(0);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const next = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length));
        setActive(next);
    });

    const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const stageScale = useTransform(scrollYProgress, [0, 1], [0.94, 1.06]);
    const stageRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

    return (
        <section
            ref={ref}
            className="relative z-10 bg-[var(--dc-bg-elevated)]"
            style={{ height: `${STEPS.length * 100}vh` }}
            aria-label="How we build"
        >
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Ambient volt wash that intensifies with progress */}
                <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(50rem_40rem_at_65%_50%,rgba(200,255,0,0.10),transparent_70%)]"
                    style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.25, 1]) }}
                />

                <div className="dc-container relative h-full grid lg:grid-cols-12 gap-8 items-center">
                    {/* ── TEXT COLUMN ── */}
                    <div className="lg:col-span-5 relative z-20 pt-24 lg:pt-0">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-xs text-[var(--dc-text-subtle)]">How we build</span>
                            <span className="h-px flex-1 bg-[var(--dc-border)]" />
                        </div>

                        <div className="relative h-[16rem] sm:h-[18rem]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={STEPS[active].title}
                                    initial={{ opacity: 0, x: -28, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                                    transition={{ duration: 0.55, ease: EASE.out }}
                                    className="absolute inset-0"
                                >
                                    <p className="font-display font-bold text-[var(--dc-accent)] text-[clamp(3rem,7vw,6rem)] leading-none tabular-nums tracking-[-0.04em]">
                                        {String(active + 1).padStart(2, "0")}
                                    </p>
                                    <h2 className="mt-4 font-display font-bold text-[var(--dc-text)] text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.05] tracking-[-0.03em]">
                                        {STEPS[active].title}
                                    </h2>
                                    <p className="mt-5 max-w-[46ch] text-[var(--dc-text-muted)] leading-relaxed">
                                        {STEPS[active].body}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Progress rail */}
                        <div className="mt-10 flex items-center gap-4">
                            <div className="relative h-px flex-1 bg-[var(--dc-border)]">
                                <motion.div
                                    className="absolute inset-0 origin-left bg-[var(--dc-accent)]"
                                    style={{ scaleX: railScale }}
                                />
                            </div>
                            <span className="text-xs tabular-nums text-[var(--dc-text-subtle)]">
                                {String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                            </span>
                        </div>
                    </div>

                    {/* ── STAGE ── */}
                    <motion.div
                        className="lg:col-span-7 relative h-[46vh] lg:h-[78vh]"
                        style={reduced ? undefined : { scale: stageScale, rotate: stageRotate }}
                    >
                        {STEPS.map((step, i) => (
                            <Layer
                                key={step.layer}
                                step={step}
                                index={i}
                                total={STEPS.length}
                                progress={scrollYProgress}
                                reduced={!!reduced}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function Layer({
    step,
    index,
    total,
    progress,
    reduced,
}: {
    step: Step;
    index: number;
    total: number;
    progress: MotionValue<number>;
    reduced: boolean;
}) {
    // Each layer owns a slice of the scroll and settles inside it.
    const start = index / total;
    const end = start + 1 / total / 1.6;

    const opacity = useTransform(progress, [start, start + 0.02, end], [0, 0.4, 1]);
    const x = useTransform(progress, [start, end], [step.from.x, 0]);
    const y = useTransform(progress, [start, end], [step.from.y, 0]);
    const rotate = useTransform(progress, [start, end], [step.from.rotate, 0]);
    const blur = useTransform(progress, [start, end], ["blur(12px)", "blur(0px)"]);

    return (
        <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            style={
                reduced
                    ? { opacity: 1 }
                    : { opacity, x, y, rotate, filter: blur, zIndex: 10 + index }
            }
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={step.layer}
                alt=""
                className="h-full w-full object-contain object-center select-none"
                draggable={false}
            />
        </motion.div>
    );
}