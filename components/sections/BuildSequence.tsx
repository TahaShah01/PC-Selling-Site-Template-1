"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import {
    Gamepad2,
    Monitor,
    Wallet,
    CircuitBoard,
    Cpu,
    MemoryStick,
    ShieldCheck,
    Check,
    Activity,
    Thermometer,
    Gauge,
    Timer,
    CheckCircle2,
    type LucideIcon,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   BUILD SEQUENCE — Phase 5

   Everything on ONE scrub timeline, not React state fired by
   a boolean. Cards, rows, checklist ticks and counted-up
   numbers are all `.bs-item` / `.bs-count` elements tagged
   with data-step / data-order, positioned on the same
   ScrollTrigger-scrubbed timeline that drives the pin and the
   text cross-fade. Scroll up mid-count and the number counts
   back down — it's reading your scroll position, not playing
   a clip.

   React state (`active`, `progress`) exists only for what
   actually needs a re-render: aria-hidden, pointer-events,
   the step readout, the rail position. It never drives an
   animation.
───────────────────────────────────────────────────────── */

type StepId = "spec" | "source" | "assemble" | "burnin";

type Step = {
    num: string;
    title: string;
    body: string;
    tags: string[];
    sceneId: StepId;
};

const STEPS: Step[] = [
    {
        num: "01",
        title: "Spec",
        body: "Tell us the games, the resolution and the number. We turn that into a parts list — no upsells, no filler.",
        tags: ["Budget", "Resolution", "Game list", "CPU tier", "GPU tier"],
        sceneId: "spec",
    },
    {
        num: "02",
        title: "Source",
        body: "Every part ordered genuine, with the manufacturer's warranty attached. Out of stock means we say so — not a quiet swap.",
        tags: ["Genuine only", "In stock", "Manufacturer warranty", "No substitutions"],
        sceneId: "source",
    },
    {
        num: "03",
        title: "Assemble",
        body: "Cables routed, airflow planned, BIOS and fan curves dialled in by hand. Not templated, not rushed.",
        tags: ["Cable management", "Airflow plan", "BIOS tuning", "Fan curves"],
        sceneId: "assemble",
    },
    {
        num: "04",
        title: "Burn in",
        body: "Two days under load. Temperatures, stability, real benchmarks — logged before the case ever closes.",
        tags: ["Prime95", "FurMark", "Game benchmarks", "Thermal logs"],
        sceneId: "burnin",
    },
];

const SEG = 1 / STEPS.length;

export function BuildSequence() {
    const reduced = useReducedMotion();

    if (reduced) return <StaticBuildList />;

    return <ScrubbedBuildSequence />;
}

/* ─────────────────────────────────────────────────────────
   Scroll-scrubbed version
───────────────────────────────────────────────────────── */

function ScrubbedBuildSequence() {
    const sectionRef = React.useRef<HTMLElement>(null);
    const pinRef = React.useRef<HTMLDivElement>(null);
    const [active, setActive] = React.useState(0);
    const [progress, setProgress] = React.useState(0);

    useGSAP(
        () => {
            if (!sectionRef.current || !pinRef.current) return;

            const textPanels = gsap.utils.toArray<HTMLElement>(".bs-text");
            const scenePanels = gsap.utils.toArray<HTMLElement>(".bs-scene");
            const items = gsap.utils.toArray<HTMLElement>(".bs-item");
            const counters = gsap.utils.toArray<HTMLElement>(".bs-count");

            gsap.set(textPanels.slice(1), { autoAlpha: 0, x: -20, filter: "blur(6px)" });
            gsap.set(textPanels[0], { autoAlpha: 1, x: 0, filter: "blur(0px)" });
            gsap.set(scenePanels.slice(1), { autoAlpha: 0, scale: 0.97 });
            gsap.set(scenePanels[0], { autoAlpha: 1, scale: 1 });
            gsap.set(items, { autoAlpha: 0, y: 14 });
            counters.forEach((el) => {
                el.textContent = "0" + (el.dataset.suffix ?? "");
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%",
                    pin: pinRef.current,
                    scrub: 1.2,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        setProgress(self.progress);
                        setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
                    },
                },
            });

            // Text + scene cross-fade at each step boundary
            STEPS.forEach((_, i) => {
                if (i === 0) return;
                const t = i * SEG;
                tl.to(textPanels[i - 1], { autoAlpha: 0, x: 20, filter: "blur(6px)", duration: 0.06 }, t - 0.05)
                    .to(textPanels[i], { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.08 }, t - 0.03)
                    .to(scenePanels[i - 1], { autoAlpha: 0, scale: 0.97, duration: 0.06 }, t - 0.05)
                    .to(scenePanels[i], { autoAlpha: 1, scale: 1, duration: 0.08 }, t - 0.03);
            });

            // Every card / row / checklist tick fades in inside its own
            // step's slice of the timeline — reversible, because it's
            // just a tween position, not a mount.
            items.forEach((el) => {
                const step = Number(el.dataset.step);
                const order = Number(el.dataset.order ?? 0);
                const start = step * SEG + 0.03 + order * 0.02;
                tl.to(el, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, start);
            });

            // Numbers count from 0 to their target, scrubbed — scroll
            // back mid-count and the value counts back down with you.
            counters.forEach((el) => {
                const step = Number(el.dataset.step);
                const to = Number(el.dataset.to);
                const suffix = el.dataset.suffix ?? "";
                const start = step * SEG + 0.08;
                const proxy = { v: 0 };
                tl.to(
                    proxy,
                    {
                        v: to,
                        duration: 0.16,
                        ease: "power1.out",
                        onUpdate: () => {
                            el.textContent = Math.round(proxy.v).toLocaleString() + suffix;
                        },
                    },
                    start
                );
            });

            return () => {
                tl.kill();
            };
        },
        { scope: sectionRef }
    );

    const stepAccent = active === 3 ? "var(--dc-accent-2)" : "var(--dc-accent)";

    return (
        <section
            ref={sectionRef}
            className="relative z-10 bg-[var(--dc-bg-elevated)]"
            style={{ height: "400vh", isolation: "isolate" }}
            aria-label="How we build"
        >
            <div ref={pinRef} className="relative will-change-transform" style={{ "--step-accent": stepAccent } as React.CSSProperties}>
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 transition-[background] duration-700"
                    style={{
                        background:
                            "radial-gradient(55rem 45rem at 72% 50%, color-mix(in srgb, var(--step-accent) 9%, transparent), transparent 70%)",
                    }}
                />

                <div className="dc-container relative grid h-screen items-center gap-8 py-24 lg:grid-cols-12 lg:py-0">
                    {/* ── TEXT COLUMN ── */}
                    <div className="relative z-20 lg:col-span-5">
                        <div className="mb-8 flex items-center gap-4">
                            <span className="text-xs text-[var(--dc-text-subtle)]">How we build</span>
                            <span className="h-px flex-1 bg-[var(--dc-border)]" />
                            <span className="font-display text-xs tabular-nums text-[var(--step-accent)]">
                                {String(active + 1).padStart(2, "0")}/{String(STEPS.length).padStart(2, "0")}
                            </span>
                        </div>

                        <div className="relative h-[21rem]">
                            {STEPS.map((step, i) => (
                                <div key={step.num} className="bs-text absolute inset-0" aria-hidden={i !== active}>
                                    <p className="font-display text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-[-0.04em] tabular-nums text-[var(--step-accent)]">
                                        {step.num}
                                    </p>
                                    <h2 className="mt-3 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--dc-text)]">
                                        {step.title}
                                    </h2>
                                    <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-[var(--dc-text-muted)]">
                                        {step.body}
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-1.5">
                                        {step.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] px-2.5 py-1 text-[11px] uppercase tracking-wide text-[var(--dc-text-subtle)]"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Rail — thicker, with a scrubber knob riding the exact progress value */}
                        <div className="relative mt-8 h-1 rounded-full bg-[var(--dc-border)]">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-[var(--step-accent)] transition-[background] duration-700"
                                style={{ width: `${Math.min(1, progress) * 100}%` }}
                            />
                            <div
                                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--step-accent)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--step-accent)_20%,transparent)] transition-[background] duration-700"
                                style={{ left: `${Math.min(1, progress) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* ── SCENE COLUMN ── */}
                    <div className="relative h-[54vh] lg:col-span-7 lg:h-[76vh]">
                        {/* Ambient watermark numeral */}
                        <p
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[16rem] font-bold leading-none tracking-[-0.06em] text-[var(--dc-text)] opacity-[0.035]"
                        >
                            {STEPS[active].num}
                        </p>

                        {STEPS.map((step, i) => (
                            <div
                                key={step.sceneId}
                                className="bs-scene absolute inset-0"
                                aria-hidden={i !== active}
                                style={{ pointerEvents: i === active ? "auto" : "none" }}
                            >
                                <Stage stepIndex={i} sceneId={step.sceneId} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Scene frame ─── */
function Stage({ stepIndex, sceneId }: { stepIndex: number; sceneId: StepId }) {
    const scenes: Record<StepId, React.ReactNode> = {
        spec: <SpecScene stepIndex={stepIndex} />,
        source: <SourceScene stepIndex={stepIndex} />,
        assemble: <AssembleScene stepIndex={stepIndex} />,
        burnin: <BurninScene stepIndex={stepIndex} />,
    };

    return (
        <div className="relative h-full w-full overflow-hidden rounded-[var(--dc-radius-2xl)] border border-[var(--dc-border)] bg-[var(--dc-surface)]">
            {scenes[sceneId]}
        </div>
    );
}

/* ──── 01 · SPEC ──── */
function SpecScene({ stepIndex }: { stepIndex: number }) {
    const cards: { label: string; value: string; icon: LucideIcon }[] = [
        { label: "Game target", value: "Valorant / CS2", icon: Gamepad2 },
        { label: "Resolution", value: "1440p @ 165 Hz", icon: Monitor },
        { label: "Budget", value: "PKR 585,000", icon: Wallet },
        { label: "GPU", value: "RTX 4070 Super", icon: CircuitBoard },
        { label: "CPU", value: "Ryzen 7 7800X3D", icon: Cpu },
        { label: "RAM", value: "32 GB DDR5", icon: MemoryStick },
    ];
    return (
        <div className="absolute inset-0 flex flex-col justify-center p-6 lg:p-8">
            <p className="mb-5 text-xs uppercase tracking-[0.12em] text-[var(--dc-accent)]">Spec sheet</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {cards.map((card, i) => (
                    <div
                        key={card.label}
                        className="bs-item group rounded-[var(--dc-radius-lg)] border border-[var(--dc-border)] bg-[var(--dc-surface-2)] p-3 transition-colors duration-300 hover:border-[var(--dc-accent)]/40"
                        data-step={stepIndex}
                        data-order={i}
                    >
                        <card.icon size={16} className="text-[var(--dc-accent)]" />
                        <p className="mt-1.5 text-[10px] text-[var(--dc-text-subtle)]">{card.label}</p>
                        <p className="mt-0.5 text-xs font-semibold leading-snug text-[var(--dc-text)]">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ──── 02 · SOURCE ──── */
function SourceScene({ stepIndex }: { stepIndex: number }) {
    const parts = [
        { name: "RTX 4070 Super", brand: "ASUS TUF" },
        { name: "Ryzen 7 7800X3D", brand: "AMD" },
        { name: "32 GB DDR5-6000", brand: "G.Skill Trident Z5" },
        { name: "2 TB NVMe Gen 4", brand: "Samsung 990 Pro" },
    ];
    return (
        <div className="absolute inset-0 flex flex-col justify-center p-6 lg:p-8">
            <p className="mb-5 text-xs uppercase tracking-[0.12em] text-[var(--dc-accent)]">Parts verification</p>
            <div className="space-y-3">
                {parts.map((part, i) => (
                    <div
                        key={part.name}
                        className="bs-item flex items-center justify-between rounded-[var(--dc-radius-lg)] border border-[var(--dc-border)] bg-[var(--dc-surface-2)] p-3"
                        data-step={stepIndex}
                        data-order={i}
                    >
                        <div>
                            <p className="text-sm font-semibold text-[var(--dc-text)]">{part.name}</p>
                            <p className="text-xs text-[var(--dc-text-subtle)]">{part.brand}</p>
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-[var(--dc-accent)]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--dc-accent)]">
                            <Check size={11} /> Genuine
                        </span>
                    </div>
                ))}
                <div
                    className="bs-item flex items-center gap-2 rounded-[var(--dc-radius-lg)] border border-[var(--dc-accent)]/20 bg-[var(--dc-accent-dim)] p-3"
                    data-step={stepIndex}
                    data-order={parts.length}
                >
                    <ShieldCheck size={16} className="text-[var(--dc-accent)]" />
                    <p className="text-xs text-[var(--dc-text-muted)]">Every part carries manufacturer warranty.</p>
                </div>
            </div>
        </div>
    );
}

/* ──── 03 · ASSEMBLE ──── */
function AssembleScene({ stepIndex }: { stepIndex: number }) {
    const steps = [
        { label: "Case prepped, airflow mapped", done: true },
        { label: "Motherboard + CPU seated", done: true },
        { label: "RAM & NVMe installed", done: true },
        { label: "GPU mounted, cables routed", done: true },
        { label: "PSU wired + managed", done: false },
        { label: "BIOS tuned, fan curves set", done: false },
    ];
    const pct = Math.round((steps.filter((s) => s.done).length / steps.length) * 100);

    return (
        <div className="absolute inset-0 flex flex-col justify-center p-6 lg:p-8">
            <p className="mb-5 text-xs uppercase tracking-[0.12em] text-[var(--dc-accent)]">Build checklist</p>
            <div className="space-y-3">
                {steps.map((step, i) => (
                    <div
                        key={step.label}
                        className="bs-item flex items-center gap-3"
                        data-step={stepIndex}
                        data-order={i}
                    >
                        <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${step.done
                                ? "border-[var(--dc-accent)] bg-[var(--dc-accent)] text-[var(--dc-accent-text)]"
                                : "border-[var(--dc-border)] text-transparent"
                                }`}
                        >
                            <Check size={12} strokeWidth={3} />
                        </span>
                        <span className={`text-sm ${step.done ? "text-[var(--dc-text)]" : "text-[var(--dc-text-subtle)]"}`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-5" data-step={stepIndex} data-order={steps.length}>
                <div className="mb-1.5 flex justify-between text-xs text-[var(--dc-text-subtle)]">
                    <span>Build progress</span>
                    <span className="bs-count tabular-nums" data-step={stepIndex} data-to={pct} data-suffix="%">
                        0%
                    </span>
                </div>
                <div className="relative h-1.5 w-full rounded-full bg-[var(--dc-surface-3)]">
                    <div
                        className="bs-item absolute inset-y-0 left-0 rounded-full bg-[var(--dc-accent)]"
                        data-step={stepIndex}
                        data-order={steps.length + 1}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

/* ──── 04 · BURN IN ──── */
function BurninScene({ stepIndex }: { stepIndex: number }) {
    const metrics = [
        { label: "CPU temp", to: 72, suffix: "°C", note: "< 85°C", icon: Thermometer },
        { label: "GPU temp", to: 68, suffix: "°C", note: "< 83°C", icon: Thermometer },
        { label: "3DMark", to: 21480, suffix: "", note: "Ref 21,000", icon: Gauge },
        { label: "Stability", to: 48, suffix: "h", note: "Zero errors", icon: Timer },
    ];
    return (
        <div className="absolute inset-0 flex flex-col justify-center p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--dc-accent-2)] opacity-60" />
                    <Activity size={10} className="relative text-[var(--dc-accent-2)]" />
                </span>
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--dc-accent-2)]">Stress test — 48h run</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {metrics.map((m, i) => (
                    <div
                        key={m.label}
                        className="bs-item rounded-[var(--dc-radius-lg)] border border-[var(--dc-border)] bg-[var(--dc-surface-2)] p-4"
                        data-step={stepIndex}
                        data-order={i}
                    >
                        <m.icon size={14} className="mb-1.5 text-[var(--dc-text-subtle)]" />
                        <p className="text-[10px] text-[var(--dc-text-subtle)]">{m.label}</p>
                        <p
                            className="bs-count mt-1 font-display text-xl font-bold tracking-[-0.02em] text-[var(--dc-text)]"
                            data-step={stepIndex}
                            data-to={m.to}
                            data-suffix={m.suffix}
                        >
                            0{m.suffix}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#22C55E]">{m.note} ✓</p>
                    </div>
                ))}
            </div>

            <div
                className="bs-item mt-4 flex items-center gap-2 rounded-[var(--dc-radius-lg)] border border-[#22C55E]/20 bg-[#22C55E]/10 p-3"
                data-step={stepIndex}
                data-order={metrics.length}
            >
                <CheckCircle2 size={14} className="shrink-0 text-[#22C55E]" />
                <p className="text-xs font-medium text-[#22C55E]">All benchmarks passed. Machine ready to ship.</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   Reduced-motion fallback — plain stacked list, normal
   document flow, no pin, no absolute-positioned panels.
   (The scrubbed version's panels only get their visibility
   set by GSAP; skipping straight to that markup here would
   leave all four stacked on top of each other at full
   opacity, which is what the previous version did.)
───────────────────────────────────────────────────────── */

function StaticBuildList() {
    return (
        <section className="relative z-10 bg-[var(--dc-bg-elevated)] py-20" aria-label="How we build">
            <div className="dc-container">
                <p className="mb-10 text-xs text-[var(--dc-text-subtle)]">How we build</p>
                <div className="grid gap-10 sm:grid-cols-2">
                    {STEPS.map((step) => (
                        <div key={step.num} className="border-t border-[var(--dc-border)] pt-6">
                            <p className="font-display text-2xl font-bold tabular-nums text-[var(--dc-accent)]">{step.num}</p>
                            <h3 className="mt-2 font-display text-xl font-bold text-[var(--dc-text)]">{step.title}</h3>
                            <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-[var(--dc-text-muted)]">{step.body}</p>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {step.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-[var(--dc-border)] bg-[var(--dc-surface)] px-2.5 py-1 text-[11px] uppercase tracking-wide text-[var(--dc-text-subtle)]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}