import * as React from "react";
import { cn } from "../../lib/utils";
import { formatPrice } from "../../lib/utils";

/* ─────────────────────────────────────────────────────────
   PRICE PRIMITIVE
   Displays product prices in PKR with optional sale treatment.
───────────────────────────────────────────────────────── */

interface PriceProps {
  regular: number;
  sale?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_MAP = {
  sm: { regular: "text-sm", original: "text-xs" },
  md: { regular: "text-base", original: "text-xs" },
  lg: { regular: "text-lg", original: "text-sm" },
  xl: { regular: "text-2xl", original: "text-sm" },
};

function Price({ regular, sale, size = "md", className }: PriceProps) {
  const isOnSale = typeof sale === "number" && sale < regular;
  const displayPrice = isOnSale ? sale! : regular;
  const { regular: sizeClass, original: originalSizeClass } = SIZE_MAP[size];

  return (
    <div className={cn("inline-flex items-baseline gap-2", className)}>
      {/* Current / sale price */}
      <span
        className={cn(
          "font-semibold",
          sizeClass,
          isOnSale
            ? "text-[var(--dc-accent)]"
            : "text-[var(--dc-text)]"
        )}
      >
        {formatPrice(displayPrice)}
      </span>

      {/* Original price (crossed out) */}
      {isOnSale && (
        <span
          className={cn(
            "line-through text-[var(--dc-text-subtle)] font-normal",
            originalSizeClass
          )}
        >
          {formatPrice(regular)}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BADGE PRIMITIVE
───────────────────────────────────────────────────────── */

type BadgeVariant = "accent" | "sale" | "new" | "stock" | "neutral";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  accent: "bg-[var(--dc-accent-dim)] text-[var(--dc-accent)] border-[var(--dc-border-accent)]",
  sale: "bg-[var(--dc-accent-dim)] text-[var(--dc-accent)] border-[var(--dc-border-accent)]",
  new: "bg-[var(--dc-accent-dim)] text-[var(--dc-accent)] border-[var(--dc-border-accent)]",
  stock: "bg-[rgba(34,197,94,0.12)] text-[var(--dc-success)] border-[rgba(34,197,94,0.3)]",
  neutral: "bg-[var(--dc-surface-2)] text-[var(--dc-text-muted)] border-[var(--dc-border)]",
};

function Badge({ variant = "neutral", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "px-2 py-0.5",
        "text-[0.6875rem] font-semibold uppercase tracking-wider",
        "rounded-[var(--dc-radius-sm)]",
        "border",
        BADGE_VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Price, Badge };
