/* ─────────────────────────────────────────────────────────
   DADDU CHARGER — NAVIGATION DATA
   See /docs/ROUTES.md for route reference.
───────────────────────────────────────────────────────── */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  isHighlighted?: boolean; // Rendered with accent treatment
  badge?: string; // e.g. "New", "Sale"
}

export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Gaming PCs",
    href: "/gaming-pcs",
  },
  {
    label: "Components",
    href: "/components/processors",
    children: [
      { label: "Processors (CPU)", href: "/components/processors" },
      { label: "Motherboards", href: "/components/motherboards" },
      { label: "Graphics Cards", href: "/components/graphics-cards" },
      { label: "RAM", href: "/components/ram" },
      { label: "Storage", href: "/components/storage" },
      { label: "Power Supplies", href: "/components/power-supplies" },
      { label: "Cooling", href: "/components/cooling" },
    ],
  },
  {
    label: "Peripherals",
    href: "/gaming/monitors",
    children: [
      { label: "Monitors", href: "/gaming/monitors" },
      { label: "Keyboards", href: "/gaming/keyboards" },
      { label: "Mice", href: "/gaming/mice" },
      { label: "Headsets", href: "/gaming/headsets" },
      { label: "Controllers", href: "/gaming/controllers" },
      { label: "Racing Wheels", href: "/gaming/racing-wheels" },
      { label: "Chairs", href: "/gaming/chairs" },
      { label: "Cases", href: "/gaming/cases" },
    ],
  },
  {
    label: "Build Your PC",
    href: "/build-pc",
    isHighlighted: true,
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const FOOTER_NAV = {
  shop: {
    title: "Shop",
    items: [
      { label: "Gaming PCs", href: "/gaming-pcs" },
      { label: "Components", href: "/shop" },
      { label: "Peripherals", href: "/gaming/monitors" },
      { label: "New Arrivals", href: "/latest" },
      { label: "Sale", href: "/sale" },
    ],
  },
  company: {
    title: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Build Your PC", href: "/build-pc" },
    ],
  },
  legal: {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Refund Policy", href: "/legal/refunds" },
      { label: "Shipping Policy", href: "/legal/shipping" },
      { label: "Terms of Service", href: "/legal/terms" },
    ],
  },
};
