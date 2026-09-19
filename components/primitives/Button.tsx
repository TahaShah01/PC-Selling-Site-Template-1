"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

/* ─────────────────────────────────────────────────────────
   BUTTON PRIMITIVE
   A fully accessible, design-token-driven button component.
───────────────────────────────────────────────────────── */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--dc-accent)] text-[var(--dc-accent-text)]",
    "font-semibold",
    "hover:bg-[var(--dc-accent-hover)] hover:scale-[1.02]",
    "focus-visible:ring-2 focus-visible:ring-[var(--dc-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dc-bg)]",
    "shadow-[0_0_0_0_rgba(200,255,0,0)] hover:shadow-[var(--dc-shadow-accent)]",
  ].join(" "),
  secondary: [
    "bg-transparent text-[var(--dc-text)]",
    "border border-[var(--dc-border-strong)]",
    "font-medium",
    "hover:border-[var(--dc-accent)] hover:text-[var(--dc-accent)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--dc-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dc-bg)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--dc-text-muted)]",
    "font-medium",
    "hover:bg-[var(--dc-surface)] hover:text-[var(--dc-text)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--dc-border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dc-bg)]",
  ].join(" "),
  danger: [
    "bg-[var(--dc-accent-2)] text-[var(--dc-accent-text)]",
    "font-semibold",
    "hover:bg-[var(--dc-accent-2-hover)] hover:scale-[1.02]",
    "focus-visible:ring-2 focus-visible:ring-[var(--dc-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dc-bg)]",
  ].join(" "),
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm rounded-[var(--dc-radius-md)] gap-1.5",
  md: "h-10 px-4 text-sm rounded-[var(--dc-radius-md)] gap-2",
  lg: "h-12 px-6 text-base rounded-[var(--dc-radius-lg)] gap-2",
  xl: "h-14 px-8 text-base rounded-[var(--dc-radius-lg)] gap-3",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild, // Destructure to prevent spreading to DOM
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        className={cn(
          // Base
          "inline-flex items-center justify-center",
          "whitespace-nowrap",
          "transition-all",
          "duration-[var(--dc-duration-fast)]",
          "ease-[var(--dc-ease-out)]",
          "select-none",
          // Disabled
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          // Variant
          VARIANT_CLASSES[variant],
          // Size
          SIZE_CLASSES[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
