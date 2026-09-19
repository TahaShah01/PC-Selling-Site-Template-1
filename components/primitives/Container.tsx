import * as React from "react";
import { cn } from "../../lib/utils";

/* ─────────────────────────────────────────────────────────
   CONTAINER PRIMITIVE
   Provides the design-token-driven layout containers.
───────────────────────────────────────────────────────── */

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "wide" | "narrow" | "full";
  as?: React.ElementType;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, variant = "default", as: Tag = "div", children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          variant === "default" && "dc-container",
          variant === "wide" && "dc-container-wide",
          variant === "narrow" && "dc-container-narrow",
          variant === "full" && "w-full px-[var(--dc-gutter)]",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Container.displayName = "Container";

/* ─────────────────────────────────────────────────────────
   SECTION PRIMITIVE
   Semantic <section> wrapper with consistent vertical padding.
───────────────────────────────────────────────────────── */

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article" | "aside";
  noPadding?: boolean;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, as: Tag = "section", noPadding = false, children, ...props }, ref) => {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Tag
        ref={ref as any}
        className={cn(!noPadding && "dc-section", className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Section.displayName = "Section";

export { Container, Section };
