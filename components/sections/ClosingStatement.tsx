"use client";

import * as React from "react";
import Link from "next/link";
import { Container, Section } from "../primitives/Container";

/* ─────────────────────────────────────────────────────────
   CLOSING STATEMENT
   The last thing before the footer: one line, set large.
───────────────────────────────────────────────────────── */

export function ClosingStatement() {
    return (
        <Section className="bg-[var(--dc-bg-elevated)] border-t border-[var(--dc-border)]">
            <Container className="relative z-10">
                <p className="font-display font-bold text-[var(--dc-text)] text-[clamp(2rem,6vw,5rem)] leading-[1.02] tracking-[-0.035em] max-w-[18ch]">
                    Built in Rawalpindi. Tested before it ships.
                </p>

                <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
                    <Link
                        href="/build-pc"
                        className="inline-flex items-baseline text-lg text-[var(--dc-text)] border-b border-[var(--dc-text)] pb-1 hover:text-[var(--dc-accent)] hover:border-[var(--dc-accent)] transition-colors duration-[var(--dc-duration-fast)]"
                    >
                        Start a build
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-flex items-baseline text-lg text-[var(--dc-text-muted)] border-b border-transparent pb-1 hover:text-[var(--dc-text)] hover:border-[var(--dc-border)] transition-colors duration-[var(--dc-duration-fast)]"
                    >
                        Visit the shop
                    </Link>
                </div>
            </Container>
        </Section>
    );
}