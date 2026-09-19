/* ─────────────────────────────────────────────────────────
   MOTION SYSTEM
   One vocabulary for the whole site. Every section imports
   from here so the choreography feels authored, not random.
───────────────────────────────────────────────────────── */

export const EASE = {
    /** Main expo-out. Everything entering uses this. */
    out: [0.22, 1, 0.36, 1] as const,
    /** Sharper, for exits and wipes. */
    in: [0.7, 0, 0.84, 0] as const,
    /** Symmetrical, for pinned scroll transforms. */
    inOut: [0.76, 0, 0.24, 1] as const,
    /** Overshoot, for magnetic / spring-ish UI. */
    spring: [0.34, 1.56, 0.64, 1] as const,
};

export const DUR = {
    fast: 0.4,
    base: 0.7,
    slow: 1.1,
    reveal: 1.4,
};

/** Spring config used by cursor, magnetic elements, parallax. */
export const SPRING = {
    cursor: { stiffness: 380, damping: 32, mass: 0.6 },
    magnet: { stiffness: 220, damping: 18, mass: 0.35 },
    scroll: { stiffness: 90, damping: 26, mass: 0.4 },
};

/* ─── Stagger container ─── */
export const stagger = (amount = 0.06, delay = 0) => ({
    hidden: {},
    visible: {
        transition: { staggerChildren: amount, delayChildren: delay },
    },
});

/* ─── Mask reveal: child slides out of an overflow-hidden parent ─── */
export const maskChild = {
    hidden: { y: "115%", rotate: 3 },
    visible: {
        y: "0%",
        rotate: 0,
        transition: { duration: DUR.reveal, ease: EASE.out },
    },
};

/* ─── Clip-path wipe for images ─── */
export const wipe = {
    hidden: { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
    visible: {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        transition: { duration: 1.3, ease: EASE.out },
    },
};

/* ─── Blur-in for supporting copy ─── */
export const blurIn = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 18 },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: { duration: DUR.slow, ease: EASE.out },
    },
};

/** Viewport config used with whileInView so sections fire once, late. */
export const inViewOnce = { once: true, margin: "-12% 0px -12% 0px" } as const;