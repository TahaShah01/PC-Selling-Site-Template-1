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
    href: "/processors",
    children: [
      { label: "Processors (CPU)", href: "/processors" },
      { label: "Motherboards", href: "/motherboards" },
      { label: "Graphics Cards", href: "/graphics-cards" },
      { label: "RAM", href: "/ram" },
      { label: "Storage", href: "/storage" },
      { label: "Power Supplies", href: "/power-supplies" },
      { label: "Cooling", href: "/cooling" },
    ],
  },
  {
    label: "Peripherals",
    href: "/monitors",
    children: [
      { label: "Monitors", href: "/monitors" },
      { label: "Keyboards", href: "/keyboards" },
      { label: "Mice", href: "/mice" },
      { label: "Headsets", href: "/headsets" },
      { label: "Controllers", href: "/controllers" },
      { label: "Racing Wheels", href: "/racing-wheels" },
      { label: "Chairs", href: "/chairs" },
      { label: "Cases", href: "/cases" },
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
];

export const FOOTER_NAV = {
  shop: {
    title: "Shop",
    items: [
      { label: "Gaming PCs", href: "/gaming-pcs" },
      { label: "Components", href: "/shop" },
      { label: "Peripherals", href: "/monitors" },
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
