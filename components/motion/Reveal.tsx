"use client";

import * as React from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useScroll,
    useTransform,
    useReducedMotion,
    type MotionValue,
} from "framer-motion";
import { SPRING, EASE, DUR, inViewOnce } from "../../lib/motion/Motion";

/* ─────────────────────────────────────────────────────────
   1. MAGNETIC
   Element leans toward the pointer inside a radius.
───────────────────────────────────────────────────────── */

export function Magnetic({
    children,
    strength = 0.35,
    className,
}: {
    children: React.ReactNode;
    strength?: number;
    className?: string;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, SPRING.magnet);
    const sy = useSpring(y, SPRING.magnet);

    const onMove = (e: React.PointerEvent) => {
        if (reduced || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onPointerMove={onMove}
            onPointerLeave={reset}
            style={{ x: sx, y: sy }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────
   2. CHAR REVEAL
   Splits into characters, each masked and rotated up.
   Accessible: the real string stays in an sr-only node.
───────────────────────────────────────────────────────── */

export function CharReveal({
    text,
    className,
    delay = 0,
    stagger = 0.028,
    as: Tag = "span",
}: {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
    as?: React.ElementType;
}) {
    const reduced = useReducedMotion();
    const words = text.split(" ");

    if (reduced) return <Tag className={className}>{text}</Tag>;

    let index = -1;

    return (
        <Tag className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true" className="inline-block">
                {words.map((word, w) => (
                    <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
                        {Array.from(word).map((char, c) => {
                            index += 1;
                            return (
                                <span key={`${char}-${c}`} className="inline-block overflow-hidden align-bottom">
                                    <motion.span
                                        className="inline-block"
                                        initial={{ y: "110%", rotate: 4 }}
                                        whileInView={{ y: "0%", rotate: 0 }}
                                        viewport={inViewOnce}
                                        transition={{
                                            duration: DUR.reveal,
                                            ease: EASE.out,
                                            delay: delay + index * stagger,
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                </span>
                            );
                        })}
                        {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
                    </span>
                ))}
            </span>
        </Tag>
    );
}

/* ─────────────────────────────────────────────────────────
   3. LINE MASK
   For multi-line display type. Each child = one line.
───────────────────────────────────────────────────────── */

export function LineMask({
    lines,
    className,
    lineClassName,
    delay = 0,
}: {
    lines: string[];
    className?: string;
    lineClassName?: string;
    delay?: number;
}) {
    const reduced = useReducedMotion();

    return (
        <span className={className}>
            {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                    <motion.span
                        className={`block ${lineClassName ?? ""}`}
                        initial={reduced ? undefined : { y: "110%" }}
                        whileInView={reduced ? undefined : { y: "0%" }}
                        viewport={inViewOnce}
                        transition={{ duration: DUR.reveal, ease: EASE.out, delay: delay + i * 0.09 }}
                    >
                        {line}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

/* ─────────────────────────────────────────────────────────
   4. SCROLL WORD FILL
   Paragraph whose words light up as it passes through the
   viewport. Scroll position drives opacity per word.
───────────────────────────────────────────────────────── */

export function ScrollWordFill({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    const ref = React.useRef<HTMLParagraphElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.85", "end 0.45"],
    });

    const words = text.split(" ");

    if (reduced) {
        return (
            <p ref={ref} className={className}>
                {text}
            </p>
        );
    }

    return (
        <p ref={ref} className={className}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {words.map((word, i) => {
                    const start = i / words.length;
                    const end = (i + 1.6) / words.length;
                    return (
                        <FillWord key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
                            {word}
                        </FillWord>
                    );
                })}
            </span>
        </p>
    );
}

function FillWord({
    children,
    progress,
    range,
}: {
    children: string;
    progress: MotionValue<number>;
    range: [number, number];
}) {
    const opacity = useTransform(progress, range, [0.16, 1]);
    const y = useTransform(progress, range, [8, 0]);
    return (
        <motion.span style={{ opacity, y }} className="inline-block mr-[0.28em]">
            {children}
        </motion.span>
    );
}

/* ─────────────────────────────────────────────────────────
   5. PARALLAX
   Wraps anything and offsets it against scroll.
───────────────────────────────────────────────────────── */

export function Parallax({
    children,
    distance = 90,
    className,
}: {
    children: React.ReactNode;
    distance?: number;
    className?: string;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
    const y = useSpring(raw, SPRING.scroll);

    return (
        <div ref={ref} className={className}>
            <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
        </div>
    );
}