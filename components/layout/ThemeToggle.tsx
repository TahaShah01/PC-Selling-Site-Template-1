"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCursor } from "@/components/motion/Cursor";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const cursor = useCursor();

  // Until mounted on client, render a placeholder with identical dimensions to prevent hydration layout shift
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--dc-text-muted)] transition-colors",
          className
        )}
      >
        <span className="h-4 w-4 rounded-full border border-[var(--dc-border)]" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onMouseEnter={() => cursor.set("hover")}
      onMouseLeave={cursor.reset}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dc-accent)]",
        showLabel
          ? "px-3.5 py-2 border border-[var(--dc-border)] bg-[var(--dc-surface)] text-[var(--dc-text)] hover:border-[var(--dc-accent)]"
          : "h-10 w-10 justify-center text-[var(--dc-text-muted)] hover:text-[var(--dc-text)] hover:bg-[var(--dc-surface-2)]",
        className
      )}
    >
      <div className="relative flex h-5 w-5 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center text-[var(--dc-accent)]"
            >
              <Moon size={18} strokeWidth={2.2} />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center text-[var(--dc-accent)]"
            >
              <Sun size={18} strokeWidth={2.2} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--dc-text)]">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
