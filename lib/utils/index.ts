import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely.
 * Use this instead of string interpolation for conditional classes.
 * 
 * @example cn("base-class", condition && "conditional-class")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price in PKR.
 * 
 * @example formatPrice(25000) → "Rs. 25,000"
 */
export function formatPrice(
  amount: number,
  options: {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { currency = "PKR", minimumFractionDigits = 0, maximumFractionDigits = 0 } = options;
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    currencyDisplay: "symbol",
  }).format(amount);
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

/**
 * Wait for a given number of milliseconds.
 * Useful for animation sequencing.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
