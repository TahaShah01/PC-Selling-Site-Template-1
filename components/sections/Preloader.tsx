"use client";

import * as React from "react";
import Image from "next/image";
import {
    motion,
    AnimatePresence,
    animate,
    useMotionValue,
    useTransform,
    useMotionValueEvent,
    useReducedMotion,
} from "framer-motion";

import { EASE } from "../../lib/motion/Motion";
import { useScrollLock } from "../providers/SmoothScrollProvider";

/* ─────────────────────────────────────────────────────────────
   DADDU CHARGER — CINEMATIC POWER-ON PRELOADER

   PERFORMANCE STRATEGY

   DESKTOP / LARGE TABLET
   • Dual grid
   • Background POWER ON typography
   • Scan line
   • Dual orbital rings
   • Animated logo grayscale / brightness
   • Large ambient glow
   • Brand energy sweep
   • 4-panel cinematic exit

   MOBILE
   • Single lightweight grid
   • No huge background typography
   • No scanline
   • No continuously animated CSS filter
   • No infinite orbital-ring rotations
   • Smaller blur surfaces
   • No expensive wordmark sweep
   • 3-panel faster exit
   • Counter updated directly through a ref rather than React state

   This keeps the same visual identity while significantly
   reducing mobile repaints and React reconciliations.
───────────────────────────────────────────────────────────── */

const DESKTOP_PANEL_COUNT = 4;
const MOBILE_PANEL_COUNT = 3;

const DESKTOP_BOOT_DURATION = 2.65;
const MOBILE_BOOT_DURATION = 2.1;

function getBootStatus(progress: number) {
    if (progress < 12) return "INITIALIZING SYSTEM";
    if (progress < 28) return "CHECKING COMPONENTS";
    if (progress < 46) return "LOADING HARDWARE";
    if (progress < 64) return "CALIBRATING SYSTEM";
    if (progress < 82) return "SYNCING PERFORMANCE";
    if (progress < 97) return "POWERING GAMING STORE";

    return "SYSTEM READY";
}

/* ─────────────────────────────────────────────────────────────
   RESPONSIVE PERFORMANCE DETECTION

   null = viewport not evaluated yet.

   While null we deliberately behave like mobile, meaning the
   expensive desktop decoration is NOT rendered during the
   initial hydration frame.
───────────────────────────────────────────────────────────── */

function useMobilePerformanceMode() {
    const [isMobile, setIsMobile] = React.useState<boolean | null>(
        null
    );

    React.useEffect(() => {
        const media = window.matchMedia("(max-width: 767px)");

        const update = () => {
            setIsMobile(media.matches);
        };

        update();

        media.addEventListener("change", update);

        return () => {
            media.removeEventListener("change", update);
        };
    }, []);

    return isMobile;
}

export function Preloader({
    onRevealStart,
    onDone,
}: {
    onRevealStart?: () => void;
    onDone?: () => void;
}) {
    const reducedMotion = useReducedMotion();
    const isMobile = useMobilePerformanceMode();

    /*
     * Until viewport detection finishes we use the lightweight
     * path. This prevents a mobile phone from rendering all the
     * desktop effects for one frame.
     */
    const mobileOptimized = isMobile !== false;

    const [visible, setVisible] = React.useState(true);

    /*
     * React state only changes when the STATUS changes.
     *
     * We deliberately DO NOT store the animated counter here.
     */
    const [status, setStatus] = React.useState(
        "INITIALIZING SYSTEM"
    );

    const [ready, setReady] = React.useState(false);

    const count = useMotionValue(0);

    const counterRef =
        React.useRef<HTMLSpanElement | null>(null);

    const exitTimer =
        React.useRef<ReturnType<typeof setTimeout> | null>(
            null
        );

    const shouldCallOnExitComplete =
        React.useRef(false);

    const lastStatusRef = React.useRef(
        "INITIALIZING SYSTEM"
    );

    const readyRef = React.useRef(false);

    /*
     * Keep latest callback without putting onDone in the boot
     * animation dependency array.
     */
    const onRevealStartRef = React.useRef(onRevealStart);
    const onDoneRef = React.useRef(onDone);

    React.useEffect(() => {
        onRevealStartRef.current = onRevealStart;
    }, [onRevealStart]);

    React.useEffect(() => {
        onDoneRef.current = onDone;
    }, [onDone]);

    /* ─────────────────────────────────────────────────────────
       MOTION VALUES
    ───────────────────────────────────────────────────────── */

    const progressScale = useTransform(
        count,
        [0, 100],
        [0, 1]
    );

    const progressHead = useTransform(
        count,
        [0, 100],
        ["0%", "100%"]
    );

    const ringProgress = useTransform(
        count,
        [0, 100],
        [0.015, 1]
    );

    const logoOpacity = useTransform(
        count,
        [0, 8, 30, 100],
        [0.18, 0.35, 0.8, 1]
    );

    const logoScale = useTransform(
        count,
        [0, 25, 70, 100],
        [0.88, 0.94, 0.985, 1]
    );

    const glowOpacity = useTransform(
        count,
        [0, 25, 60, 85, 100],
        [0.05, 0.15, 0.32, 0.5, 0.3]
    );

    const energyScale = useTransform(
        count,
        [0, 100],
        [0.78, 1.12]
    );

    /*
     * This is desktop only.
     *
     * CSS filter interpolation can be relatively expensive on
     * mobile GPUs, so we do not apply it there.
     */
    const logoFilter = useTransform(
        count,
        [0, 35, 70, 100],
        [
            "grayscale(1) brightness(.45)",
            "grayscale(.65) brightness(.7)",
            "grayscale(.15) brightness(.95)",
            "grayscale(0) brightness(1.08)",
        ]
    );

    /* ─────────────────────────────────────────────────────────
       COUNTER / STATUS
  
       Critical optimization:
       Counter text changes directly in DOM rather than causing
       ~100 React component re-renders.
    ───────────────────────────────────────────────────────── */

    useMotionValueEvent(count, "change", (latest) => {
        const value = Math.min(
            100,
            Math.round(latest)
        );

        if (counterRef.current) {
            counterRef.current.textContent = String(
                value
            ).padStart(3, "0");
        }

        const nextStatus =
            getBootStatus(value);

        if (
            nextStatus !==
            lastStatusRef.current
        ) {
            lastStatusRef.current =
                nextStatus;

            setStatus(nextStatus);
        }

        if (
            value >= 97 &&
            !readyRef.current
        ) {
            readyRef.current = true;
            setReady(true);
        }
    });

    useScrollLock(visible);

    /* ─────────────────────────────────────────────────────────
       MAIN BOOT SEQUENCE
    ───────────────────────────────────────────────────────── */

    React.useEffect(() => {
        let alreadyBooted = false;

        try {
            alreadyBooted =
                sessionStorage.getItem(
                    "dc-booted"
                ) === "1";
        } catch {
            /*
             * Continue normally if storage is unavailable.
             */
        }

        /*
         * Reduced-motion users and repeat session visits do not need
         * to wait through the boot process again.
         */
        if (reducedMotion || alreadyBooted) {
            setVisible(false);

            const timer = window.setTimeout(() => {
                onRevealStartRef.current?.();
                onDoneRef.current?.();
            }, 40);

            return () => window.clearTimeout(timer);
        }

        const mobileDevice =
            window.matchMedia(
                "(max-width: 767px)"
            ).matches;

        const duration = mobileDevice
            ? MOBILE_BOOT_DURATION
            : DESKTOP_BOOT_DURATION;

        const controls = animate(
            count,
            100,
            {
                duration,

                ease: [0.16, 1, 0.3, 1],

                onComplete: () => {
                    try {
                        sessionStorage.setItem(
                            "dc-booted",
                            "1"
                        );
                    } catch {
                        /*
                         * Ignore storage errors.
                         */
                    }
                    /*
                     * Start the Hero WHILE the preloader still completely
                     * covers the screen.
                     *
                     * This gives the Hero timeline time to begin underneath
                     * us before the shutters reveal it.
                     */
                    onRevealStartRef.current?.();

                    shouldCallOnExitComplete.current = true;

                    /*
                     * Hero.tsx starts its headline around 0.25s and rig around
                     * 0.30s, so this delay deliberately gives it a hidden pre-roll.
                     *
                     * When the shutters start moving, the Hero underneath is
                     * already alive instead of sitting in its initial state.
                     */
                    exitTimer.current = setTimeout(
                        () => {
                            setVisible(false);
                        },
                        mobileDevice ? 320 : 500
                    );
                },
            }
        );

        return () => {
            controls.stop();

            if (exitTimer.current) {
                clearTimeout(
                    exitTimer.current
                );
            }
        };
    }, [count, reducedMotion]);

    const panelCount = mobileOptimized
        ? MOBILE_PANEL_COUNT
        : DESKTOP_PANEL_COUNT;

    return (
        <AnimatePresence
            mode="wait"
            onExitComplete={() => {
                if (
                    !shouldCallOnExitComplete.current
                ) {
                    return;
                }

                shouldCallOnExitComplete.current =
                    false;

                onDoneRef.current?.();
            }}
        >
            {visible && (
                <motion.div
                    key="daddu-preloader"
                    initial={false}
                    className="
                        fixed
                        inset-0
                        z-[9998]

                        overflow-hidden

                        bg-transparent
                        text-[var(--dc-text)]
                    ">
                    {/* ==================================================
              CINEMATIC EXIT PANELS
          ================================================== */}

                    <div
                        aria-hidden="true"
                        className="
              pointer-events-none

              absolute
              inset-0
              z-0

              flex
            "
                    >
                        {Array.from({
                            length: panelCount,
                        }).map(
                            (_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{
                                        y: 0,
                                    }}
                                    exit={{
                                        y: "-110%",

                                        transition: {
                                            duration: mobileOptimized
                                                ? 0.82
                                                : 1.08,

                                            ease: [0.76, 0, 0.24, 1],

                                            delay:
                                                index *
                                                (mobileOptimized
                                                    ? 0.055
                                                    : 0.075),
                                        },
                                    }}
                                    className="
                    relative

                    h-full
                    flex-1

                    transform-gpu

                    overflow-hidden

                    border-r
                    border-[var(--dc-border)]

                    bg-[var(--dc-bg)]

                    last:border-r-0
                  "
                                >
                                    {/* Glowing panel edge */}

                                    <motion.div
                                        aria-hidden="true"
                                        initial={{
                                            opacity: 0,
                                        }}
                                        exit={{
                                            opacity: [
                                                0,
                                                1,
                                                1,
                                                0,
                                            ],

                                            transition: {
                                                duration:
                                                    mobileOptimized
                                                        ? 0.68
                                                        : 0.95,

                                                delay:
                                                    index *
                                                    (mobileOptimized
                                                        ? 0.045
                                                        : 0.075),
                                            },
                                        }}
                                        className="
                      absolute
                      bottom-0
                      left-0

                      h-[2px]
                      w-full

                      bg-[var(--dc-accent)]

                      shadow-[var(--dc-shadow-accent)]
                    "
                                    />
                                </motion.div>
                            )
                        )}
                    </div>

                    {/* ==================================================
              PRIMARY GRID
          ================================================== */}

                    <motion.div
                        aria-hidden="true"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity:
                                mobileOptimized
                                    ? 0.035
                                    : 0.055,

                            transition: {
                                duration: 0.8,
                            },
                        }}
                        exit={{
                            opacity: 0,

                            transition: {
                                duration: 0.15,
                            },
                        }}
                        className="
              pointer-events-none

              absolute
              inset-0
              z-[1]
            "
                        style={{
                            backgroundImage: `
                linear-gradient(
                  var(--dc-accent) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  var(--dc-accent) 1px,
                  transparent 1px
                )
              `,

                            backgroundSize:
                                mobileOptimized
                                    ? "54px 54px"
                                    : "48px 48px",
                        }}
                    />

                    {/* ==================================================
              DESKTOP SECONDARY GRID
          ================================================== */}

                    {!mobileOptimized && (
                        <div
                            aria-hidden="true"
                            className="
                pointer-events-none

                absolute
                inset-0
                z-[1]

                opacity-[0.022]
              "
                            style={{
                                backgroundImage: `
                  linear-gradient(
                    rgba(255,255,255,.5) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    90deg,
                    rgba(255,255,255,.5) 1px,
                    transparent 1px
                  )
                `,

                                backgroundSize:
                                    "12px 12px",
                            }}
                        />
                    )}

                    {/* ==================================================
              VIGNETTE
          ================================================== */}

                    <motion.div
                        aria-hidden="true"
                        exit={{
                            opacity: 0,
                            transition: {
                                duration: 0.18,
                                ease: "easeOut",
                            },
                        }}
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            z-[2]
                        "
                        style={{
                            background: mobileOptimized
                                ? "radial-gradient(circle at 50% 48%, transparent 0%, rgba(0,0,0,.08) 48%, rgba(0,0,0,.62) 120%)"
                                : "radial-gradient(circle at 50% 48%, transparent 0%, rgba(0,0,0,.12) 45%, rgba(0,0,0,.72) 115%)",
                        }}
                    />

                    {/* ==================================================
              HUGE POWER ON — DESKTOP ONLY
          ================================================== */}

                    {!mobileOptimized && (
                        <motion.div
                            aria-hidden="true"
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 0.035,
                                scale: 1,

                                transition: {
                                    delay: 0.15,
                                    duration: 1.5,
                                    ease: EASE.out,
                                },
                            }}
                            exit={{
                                opacity: 0,
                                scale: 1.03,

                                transition: {
                                    duration: 0.3,
                                },
                            }}
                            className="
                pointer-events-none

                absolute
                left-1/2
                top-1/2
                z-[2]

                -translate-x-1/2
                -translate-y-1/2

                whitespace-nowrap

                font-display
                text-[clamp(5rem,18vw,18rem)]
                font-black
                uppercase

                leading-none
                tracking-[-0.08em]

                text-[var(--dc-text)]
              "
                        >
                            POWER ON
                        </motion.div>
                    )}

                    {/* ==================================================
              SCAN LINE — DESKTOP ONLY
          ================================================== */}

                    {!mobileOptimized && (
                        <motion.div
                            aria-hidden="true"
                            initial={{
                                top: "-4%",
                                opacity: 0,
                            }}
                            animate={{
                                top: [
                                    "-4%",
                                    "104%",
                                ],

                                opacity: [
                                    0,
                                    0.4,
                                    0,
                                ],
                            }}
                            transition={{
                                duration: 2.1,
                                delay: 0.25,
                                ease: "linear",
                            }}
                            className="
                pointer-events-none

                absolute
                inset-x-0
                z-[4]

                h-px
              "
                            style={{
                                background:
                                    "linear-gradient(90deg, transparent, var(--dc-accent), transparent)",

                                boxShadow:
                                    "0 0 20px var(--dc-accent-glow)",
                            }}
                        />
                    )}

                    {/* ==================================================
              CENTRAL AMBIENT ENERGY
          ================================================== */}

                    <motion.div
                        aria-hidden="true"
                        exit={{
                            opacity: 0,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                        className="
    pointer-events-none
    absolute
    inset-0
    z-[3]
  "
                    >
                        <motion.div
                            className={`
      absolute
      left-1/2
      top-1/2

      -translate-x-1/2
      -translate-y-1/2

      rounded-full
      bg-[var(--dc-accent)]

      ${mobileOptimized
                                    ? `
            h-[min(74vw,22rem)]
            w-[min(74vw,22rem)]
            blur-[26px]
          `
                                    : `
            h-[min(65vw,44rem)]
            w-[min(65vw,44rem)]
            blur-[88px]
          `
                                }
    `}
                            style={{
                                opacity: glowOpacity,
                                scale: energyScale,
                            }}
                        />
                    </motion.div>
                    {/* ==================================================
              TOP TELEMETRY
          ================================================== */}

                    <div
                        className="
              absolute
              inset-x-0
              top-0
              z-20

              flex
              items-start
              justify-between

              gap-4

              px-5
              pt-[max(1.4rem,env(safe-area-inset-top,0px))]

              sm:px-8

              lg:px-[var(--dc-gutter)]
              lg:pt-8
            "
                    >
                        {/* Brand status */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,

                                transition: {
                                    delay: 0.16,
                                    duration: 0.55,
                                    ease: EASE.out,
                                },
                            }}
                            exit={{
                                opacity: 0,
                                y: -6,

                                transition: {
                                    duration: 0.15,
                                },
                            }}
                        >
                            <div
                                className="
                  flex
                  items-center
                  gap-2

                  text-[10px]
                  font-semibold
                  uppercase

                  tracking-[0.16em]

                  text-[var(--dc-text-muted)]

                  sm:text-xs
                "
                            >
                                <span
                                    className="
                    h-1.5
                    w-1.5

                    rounded-full

                    bg-[var(--dc-accent)]

                    shadow-[var(--dc-shadow-accent)]
                  "
                                />

                                DADDU CHARGER
                            </div>

                            <p
                                className="
                  mt-1

                  hidden

                  text-[10px]
                  uppercase

                  tracking-[0.14em]

                  text-[var(--dc-text-subtle)]

                  sm:block
                "
                            >
                                PERFORMANCE GAMING HARDWARE
                            </p>
                        </motion.div>

                        {/* Power status */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,

                                transition: {
                                    delay: 0.22,
                                    duration: 0.55,
                                    ease: EASE.out,
                                },
                            }}
                            exit={{
                                opacity: 0,
                                y: -6,

                                transition: {
                                    duration: 0.15,
                                },
                            }}
                            className="
                text-right

                text-[10px]
                font-medium
                uppercase

                tracking-[0.14em]

                text-[var(--dc-text-subtle)]

                sm:text-xs
              "
                        >
                            <p>
                                POWER SEQUENCE
                            </p>

                            <div
                                className="
                  mt-1

                  flex
                  items-center
                  justify-end

                  gap-2

                  text-[var(--dc-accent)]
                "
                            >
                                <motion.span
                                    animate={{
                                        opacity: [
                                            0.3,
                                            1,
                                            0.3,
                                        ],

                                        scale: [
                                            0.9,
                                            1.1,
                                            0.9,
                                        ],
                                    }}
                                    transition={{
                                        repeat:
                                            Infinity,

                                        duration: 1.1,

                                        ease:
                                            "easeInOut",
                                    }}
                                    className="
                    h-1.5
                    w-1.5

                    rounded-full

                    bg-[var(--dc-accent)]
                  "
                                />

                                ONLINE
                            </div>
                        </motion.div>
                    </div>

                    {/* ==================================================
              CENTRAL BRAND LOCKUP
          ================================================== */}

                    <div
                        className="
              absolute
              inset-0
              z-10

              flex
              items-center
              justify-center

              px-5

              sm:px-8

              lg:px-[var(--dc-gutter)]
            "
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.965,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,

                                transition: {
                                    duration: 0.68,
                                    ease: EASE.out,
                                },
                            }}
                            exit={{
                                opacity: 0,
                                scale:
                                    mobileOptimized
                                        ? 1.01
                                        : 1.025,

                                transition: {
                                    duration:
                                        mobileOptimized
                                            ? 0.2
                                            : 0.28,
                                },
                            }}
                            className="
                relative

                flex
                w-full
                max-w-[1180px]

                transform-gpu

                flex-col
                items-center
                justify-center

                gap-1

                sm:gap-7

                lg:flex-row
                lg:gap-12
              "
                        >
                            {/* ==============================================
                  LOGO POWER CORE
              ============================================== */}

                            <div
                                className="
                  relative

                  flex
                  shrink-0
                  items-center
                  justify-center

                  h-[clamp(9rem,32vw,15rem)]
                  w-[clamp(9rem,32vw,15rem)]

                  sm:h-[clamp(11rem,27vw,17rem)]
                  sm:w-[clamp(11rem,27vw,17rem)]

                  lg:h-[clamp(13rem,20vw,19rem)]
                  lg:w-[clamp(13rem,20vw,19rem)]
                "
                            >
                                {/* Desktop outer orbit */}

                                {!mobileOptimized && (
                                    <motion.div
                                        aria-hidden="true"
                                        animate={{
                                            rotate: 360,
                                        }}
                                        transition={{
                                            repeat:
                                                Infinity,

                                            duration: 16,

                                            ease:
                                                "linear",
                                        }}
                                        className="
                      absolute
                      inset-[4%]

                      transform-gpu

                      rounded-full

                      border
                      border-dashed
                      border-[var(--dc-border-strong)]
                    "
                                    />
                                )}

                                {/* Desktop inner orbit */}

                                {!mobileOptimized && (
                                    <motion.div
                                        aria-hidden="true"
                                        animate={{
                                            rotate: -360,
                                        }}
                                        transition={{
                                            repeat:
                                                Infinity,

                                            duration: 10,

                                            ease:
                                                "linear",
                                        }}
                                        className="
                      absolute
                      inset-[13%]

                      transform-gpu

                      rounded-full

                      border
                      border-[var(--dc-border)]
                    "
                                    >
                                        <span
                                            className="
                        absolute
                        left-1/2
                        top-[-3px]

                        h-1.5
                        w-1.5

                        -translate-x-1/2

                        rounded-full

                        bg-[var(--dc-accent)]

                        shadow-[var(--dc-shadow-accent)]
                      "
                                        />
                                    </motion.div>
                                )}

                                {/* Main charge ring */}

                                <svg
                                    viewBox="0 0 200 200"
                                    aria-hidden="true"
                                    className="
                    absolute
                    inset-[8%]

                    h-[84%]
                    w-[84%]

                    -rotate-90
                  "
                                >
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="92"

                                        fill="none"

                                        stroke="var(--dc-border)"

                                        strokeWidth="1.5"
                                    />

                                    <motion.circle
                                        cx="100"
                                        cy="100"
                                        r="92"

                                        fill="none"

                                        stroke="var(--dc-accent)"

                                        strokeWidth={
                                            mobileOptimized
                                                ? 3
                                                : 2.5
                                        }

                                        strokeLinecap="round"

                                        style={{
                                            pathLength:
                                                ringProgress,
                                        }}
                                    />
                                </svg>

                                {/* Internal glow */}

                                <motion.div
                                    aria-hidden="true"
                                    className={`
                    absolute
                    inset-[20%]

                    rounded-full

                    bg-[var(--dc-accent)]

                    ${mobileOptimized
                                            ? "blur-xl"
                                            : "blur-3xl"
                                        }
                  `}
                                    style={{
                                        opacity:
                                            glowOpacity,
                                    }}
                                />

                                {/* Actual logo */}

                                <motion.div
                                    initial={{
                                        rotate: -3,
                                    }}
                                    animate={{
                                        rotate: 0,

                                        transition: {
                                            delay: 0.12,
                                            duration: 0.9,
                                            ease: EASE.out,
                                        },
                                    }}
                                    style={
                                        mobileOptimized
                                            ? {
                                                opacity:
                                                    logoOpacity,

                                                scale:
                                                    logoScale,
                                            }
                                            : {
                                                opacity:
                                                    logoOpacity,

                                                scale:
                                                    logoScale,

                                                filter:
                                                    logoFilter,
                                            }
                                    }
                                    className="
                    relative
                    z-10

                    flex
                    h-full
                    w-full

                    transform-gpu

                    items-center
                    justify-center
                  "
                                >
                                    <Image
                                        src="/logo.png"
                                        alt="Daddu Charger"

                                        width={700}
                                        height={700}

                                        priority

                                        className="
                      h-auto
                      w-[58%]

                      object-contain

                      drop-shadow-[0_10px_24px_rgba(0,0,0,.55)]

                      sm:w-[57%]
                      lg:w-[56%]
                    "
                                    />
                                </motion.div>
                            </div>

                            {/* ==============================================
                  GAMING STORE WORDMARK
              ============================================== */}

                            <div
                                className="
                  relative

                  flex
                  flex-col
                  items-center

                  text-center

                  lg:items-start
                  lg:text-left
                "
                            >
                                {/* Eyebrow */}

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        x: -14,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,

                                        transition: {
                                            delay: 0.32,
                                            duration: 0.58,
                                            ease: EASE.out,
                                        },
                                    }}
                                    exit={{
                                        opacity: 0,

                                        transition: {
                                            duration: 0.15,
                                        },
                                    }}
                                    className="
                    mb-3

                    flex
                    items-center
                    gap-3

                    text-[9px]
                    font-semibold
                    uppercase

                    tracking-[0.2em]

                    text-[var(--dc-text-subtle)]

                    sm:mb-4
                    sm:text-xs
                  "
                                >
                                    <span
                                        className="
                      h-px
                      w-7

                      bg-[var(--dc-accent)]

                      sm:w-8
                    "
                                    />

                                    HIGH PERFORMANCE HARDWARE
                                </motion.div>

                                {/* Text reveal */}

                                <div className="overflow-hidden">
                                    <motion.div
                                        initial={{
                                            y: "112%",
                                            skewY: 4,
                                        }}
                                        animate={{
                                            y: "0%",
                                            skewY: 0,

                                            transition: {
                                                delay: 0.22,
                                                duration: 0.85,
                                                ease: EASE.out,
                                            },
                                        }}
                                        exit={{
                                            y: "-110%",

                                            transition: {
                                                duration:
                                                    mobileOptimized
                                                        ? 0.27
                                                        : 0.4,

                                                ease:
                                                    EASE.in,
                                            },
                                        }}
                                        className="
                      flex
                      items-center

                      whitespace-nowrap

                      select-none
                    "
                                    >
                                        {/* GAMING */}

                                        <span
                                            className="
                        font-display

                        text-[clamp(2rem,10vw,4rem)]

                        font-black
                        uppercase

                        leading-[0.88]

                        tracking-[-0.03em]

                        text-[var(--dc-text)]

                        sm:text-[clamp(3rem,8vw,5.7rem)]

                        lg:text-[clamp(3.4rem,5.6vw,6.5rem)]
                      "
                                            style={{
                                                textShadow:
                                                    mobileOptimized
                                                        ? "0 3px 10px rgba(0,0,0,.45)"
                                                        : "0 4px 18px rgba(0,0,0,.65), 0 0 1px rgba(255,255,255,.4)",
                                            }}
                                        >
                                            GAMING
                                        </span>

                                        {/* Slash / Divider */}

                                        <motion.span
                                            aria-hidden="true"
                                            initial={{
                                                scaleY: 0,
                                            }}
                                            animate={{
                                                scaleY: 1,

                                                transition: {
                                                    delay: 0.68,
                                                    duration: 0.42,
                                                    ease: EASE.out,
                                                },
                                            }}
                                            className="
                        mx-[clamp(.55rem,2vw,1.4rem)]

                        h-[clamp(1.8rem,8vw,5rem)]
                        w-[clamp(2px,.25vw,4px)]

                        origin-center

                        -skew-x-[16deg]

                        bg-[var(--dc-accent)]

                        shadow-[var(--dc-shadow-accent)]
                      "
                                        />

                                        {/* STORE */}

                                        <span
                                            className="
                        relative

                        font-display

                        text-[clamp(2rem,10vw,4rem)]

                        font-black
                        italic
                        uppercase

                        leading-[0.88]

                        tracking-[-0.01em]

                        text-[var(--dc-accent)]

                        sm:text-[clamp(3rem,8vw,5.7rem)]

                        lg:text-[clamp(3.4rem,5.6vw,6.5rem)]
                      "
                                            style={{
                                                textShadow:
                                                    mobileOptimized
                                                        ? "0 0 12px var(--dc-accent-glow)"
                                                        : "0 0 20px var(--dc-accent-glow), 0 4px 18px rgba(0,0,0,.6)",
                                            }}
                                        >
                                            STORE

                                            <motion.span
                                                aria-hidden="true"
                                                initial={{
                                                    scaleX: 0,
                                                }}
                                                animate={{
                                                    scaleX: 1,

                                                    transition: {
                                                        delay: 0.82,
                                                        duration: 0.62,
                                                        ease: EASE.out,
                                                    },
                                                }}
                                                className="
                          absolute
                          -bottom-[0.14em]
                          left-0

                          h-[2px]
                          w-full

                          origin-left

                          bg-gradient-to-r
                          from-[var(--dc-accent)]
                          via-[var(--dc-accent)]
                          to-transparent

                          sm:h-[3px]
                        "
                                            />
                                        </span>
                                    </motion.div>
                                </div>

                                {/* Desktop-only orange sweep */}

                                {!mobileOptimized && (
                                    <motion.div
                                        aria-hidden="true"
                                        initial={{
                                            left: "-20%",
                                            opacity: 0,
                                        }}
                                        animate={{
                                            left: "115%",

                                            opacity: [
                                                0,
                                                0.5,
                                                0,
                                            ],
                                        }}
                                        transition={{
                                            delay: 0.78,
                                            duration: 1,
                                            ease: EASE.inOut,
                                        }}
                                        className="
                      pointer-events-none

                      absolute
                      bottom-[22%]
                      top-[16%]

                      w-[10%]

                      -skew-x-[18deg]

                      blur-lg
                    "
                                        style={{
                                            background:
                                                "linear-gradient(90deg, transparent, rgba(255,106,26,.5), transparent)",
                                        }}
                                    />
                                )}

                                {/* Dynamic status */}

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 8,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,

                                        transition: {
                                            delay: 0.54,
                                            duration: 0.5,
                                            ease: EASE.out,
                                        },
                                    }}
                                    exit={{
                                        opacity: 0,

                                        transition: {
                                            duration: 0.15,
                                        },
                                    }}
                                    className="
                    mt-5

                    flex
                    items-center

                    gap-3

                    sm:mt-7
                  "
                                >
                                    <motion.span
                                        animate={
                                            ready
                                                ? {
                                                    opacity: [
                                                        0.4,
                                                        1,
                                                        0.4,
                                                    ],

                                                    scale: [
                                                        0.9,
                                                        1.15,
                                                        0.9,
                                                    ],
                                                }
                                                : {
                                                    opacity: 1,
                                                    scale: 1,
                                                }
                                        }
                                        transition={{
                                            repeat:
                                                ready
                                                    ? Infinity
                                                    : 0,

                                            duration: 0.8,

                                            ease:
                                                "easeInOut",
                                        }}
                                        className="
                      h-2
                      w-2

                      rounded-full

                      bg-[var(--dc-accent)]

                      shadow-[var(--dc-shadow-accent)]
                    "
                                    />

                                    <AnimatePresence
                                        mode="wait"
                                        initial={false}
                                    >
                                        <motion.span
                                            key={status}
                                            initial={{
                                                opacity: 0,
                                                y: 4,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -4,
                                            }}
                                            transition={{
                                                duration: 0.16,
                                            }}
                                            className="
                        text-[9px]
                        font-semibold
                        uppercase

                        tracking-[0.16em]

                        text-[var(--dc-text-muted)]

                        sm:text-xs
                        sm:tracking-[0.19em]
                      "
                                        >
                                            {status}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ==================================================
              BOTTOM TELEMETRY / PROGRESS
          ================================================== */}

                    <div
                        className="
              absolute
              inset-x-0
              bottom-0
              z-20

              px-5

              pb-[max(1.4rem,env(safe-area-inset-bottom,0px))]

              sm:px-8

              lg:px-[var(--dc-gutter)]
              lg:pb-8
            "
                    >
                        <div
                            className="
                flex
                items-end
                justify-between

                gap-6
              "
                        >
                            {/* Desktop / tablet tagline */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 8,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,

                                    transition: {
                                        delay: 0.3,
                                        duration: 0.55,
                                        ease: EASE.out,
                                    },
                                }}
                                exit={{
                                    opacity: 0,

                                    transition: {
                                        duration: 0.15,
                                    },
                                }}
                                className="
                  hidden

                  max-w-[34ch]

                  text-xs
                  leading-relaxed

                  text-[var(--dc-text-subtle)]

                  sm:block
                "
                            >
                                Genuine components.
                                Precision assembled.
                                Stress-tested.
                                Benchmark verified.
                            </motion.div>

                            {/* Counter */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 12,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,

                                    transition: {
                                        delay: 0.24,
                                        duration: 0.58,
                                        ease: EASE.out,
                                    },
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -10,

                                    transition: {
                                        duration: 0.2,
                                    },
                                }}
                                className="
                  ml-auto

                  flex
                  items-start
                "
                            >
                                <span
                                    ref={counterRef}
                                    className="
                    font-display

                    text-[clamp(2.5rem,10vw,5.5rem)]

                    font-black

                    leading-[0.75]

                    tabular-nums

                    tracking-[-0.06em]

                    text-[var(--dc-accent)]
                  "
                                    style={{
                                        textShadow:
                                            mobileOptimized
                                                ? "0 0 12px var(--dc-accent-glow)"
                                                : "0 0 28px var(--dc-accent-glow)",
                                    }}
                                >
                                    000
                                </span>

                                <span
                                    className="
                    ml-1

                    font-display

                    text-sm
                    font-bold

                    text-[var(--dc-text-subtle)]

                    sm:text-lg
                  "
                                >
                                    %
                                </span>
                            </motion.div>
                        </div>

                        {/* Progress line */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scaleX: 0.95,
                            }}
                            animate={{
                                opacity: 1,
                                scaleX: 1,

                                transition: {
                                    delay: 0.18,
                                    duration: 0.55,
                                },
                            }}
                            exit={{
                                opacity: 0,

                                transition: {
                                    duration: 0.12,
                                },
                            }}
                            className="
                relative

                mt-5
                sm:mt-6

                h-[2px]
                w-full

                bg-[var(--dc-border)]
              "
                        >
                            {/* Filled progress */}

                            <motion.div
                                className="
                  absolute
                  inset-y-0
                  left-0

                  w-full

                  origin-left

                  bg-[var(--dc-accent)]

                  shadow-[var(--dc-shadow-accent)]
                "
                                style={{
                                    scaleX:
                                        progressScale,
                                }}
                            />

                            {/* Electrical progress head */}

                            <motion.div
                                aria-hidden="true"
                                className="
                  absolute
                  top-1/2

                  h-2
                  w-2

                  -translate-x-1/2
                  -translate-y-1/2

                  rounded-full

                  bg-[var(--dc-accent)]
                "
                                style={{
                                    left:
                                        progressHead,

                                    boxShadow:
                                        mobileOptimized
                                            ? "0 0 10px var(--dc-accent)"
                                            : "0 0 20px 4px var(--dc-accent-glow)",
                                }}
                            />
                        </motion.div>

                        {/* Progress divisions */}

                        {!mobileOptimized && (
                            <div
                                aria-hidden="true"
                                className="
                  mt-2

                  grid
                  grid-cols-10

                  gap-1
                "
                            >
                                {Array.from({
                                    length: 10,
                                }).map(
                                    (_, index) => (
                                        <span
                                            key={
                                                index
                                            }
                                            className="
                        h-px

                        bg-[var(--dc-border)]
                      "
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* ==================================================
              FINAL POWER FLASH
          ================================================== */}

                    <motion.div
                        aria-hidden="true"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 0,
                        }}
                        exit={{
                            opacity:
                                mobileOptimized
                                    ? [
                                        0,
                                        0.1,
                                        0,
                                    ]
                                    : [
                                        0,
                                        0.2,
                                        0,
                                    ],

                            transition: {
                                duration:
                                    mobileOptimized
                                        ? 0.3
                                        : 0.46,

                                times: [
                                    0,
                                    0.25,
                                    1,
                                ],
                            },
                        }}
                        className="
              pointer-events-none

              absolute
              inset-0
              z-30
            "
                        style={{
                            background:
                                "radial-gradient(circle at 50% 50%, var(--dc-accent), transparent 58%)",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}