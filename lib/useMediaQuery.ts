"use client";

import * as React from "react";

/* ─────────────────────────────────────────────────────────
   Starts `false` on the server and on first client render,
   then syncs to the real value in an effect. Anything gated
   on this (e.g. `useMediaQuery("(min-width: 1024px)")`) gets
   its narrower, safer mobile layout by default and only
   upgrades to the wider one once we've actually confirmed
   the viewport — no hydration mismatch, and never a flash of
   the wrong layout on a small screen.
───────────────────────────────────────────────────────── */

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = React.useState(false);

    React.useEffect(() => {
        const mql = window.matchMedia(query);
        const update = () => setMatches(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, [query]);

    return matches;
}