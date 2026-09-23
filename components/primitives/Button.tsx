"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";

/* ─────────────────────────────────────────────────────────
   BUTTON PRIMITIVE
   A fully accessible, design-token-driven button component.
   Supports both native button actions and anchor links.
───────────────────────────────────────────────────────── */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "dc-btn-primary",
  secondary: "dc-btn-secondary",
  ghost: "dc-btn-ghost",
  danger: "dc-btn-danger",
};

export const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-3 text-sm rounded-[var(--dc-radius-md)] gap-1.5",
  md: "min-h-[42px] px-4 text-sm rounded-[var(--dc-radius-md)] gap-2",
  lg: "min-h-[48px] px-6 text-base rounded-[var(--dc-radius-lg)] gap-2",
  xl: "min-h-[54px] px-8 text-base rounded-[var(--dc-radius-lg)] gap-3",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap transition-all duration-[var(--dc-duration-fast)] ease-[var(--dc-ease-out)] select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );
}

export interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  disabled?: boolean;
}

export type ButtonProps = BaseButtonProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

const Button = React.forwardRef<HTMLElement, ButtonProps>(
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
      asChild,
      href,
      ...props
    },
    ref
  ) => {
    const classes = buttonVariants({ variant, size, className });

    const content = (
      <>
        {isLoading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </>
    );

    if (href) {
      const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
      if (isExternal) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={classes}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        className={classes}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
