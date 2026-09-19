"use client";

import * as React from "react";

/* ─────────────────────────────────────────────────────────
   GRID GUIDE
   Fixed hairline column grid with numbered gutters — the
   structural signature of the layout. Purely decorative.
───────────────────────────────────────────────────────── */

export function GridGuide({ columns = 12 }: { columns?: number }) {
    const cols = React.useMemo(
        () => Array.from({ length: columns }, (_, i) => i + 1),
        [columns]
    );

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
            aria-hidden="true"
        >
            <div className="dc-container h-full">
                <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                    {cols.map((n) => (
                        <div
                            key={n}
                            className="relative h-full border-l border-[var(--dc-border)]/40 last:border-r"
                        >
                            <span className="absolute top-[calc(var(--dc-header-height)+0.75rem)] left-2 text-[10px] tabular-nums text-[var(--dc-text-subtle)]/35 leading-none">
                                {n}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}