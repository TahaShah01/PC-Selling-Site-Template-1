/* ─────────────────────────────────────────────────────────
   DADDU CHARGER — CATEGORY DATA
   See /docs/ROUTES.md for route reference.
───────────────────────────────────────────────────────── */

export interface Category {
  id: string;
  title: string;
  shortTitle: string;
  href: string;
  description: string;
  icon: string; // Lucide icon name or custom SVG path
  gradient?: string; // Background gradient for category cards
  productCount?: number;
  featured?: boolean;
  shopifyHandle?: string; // Original Shopify collection handle
}

export const CATEGORIES: Category[] = [
  {
    id: "gaming-pcs",
    title: "Custom Gaming PCs",
    shortTitle: "Gaming PCs",
    href: "/gaming-pcs",
    description:
      "Expert-assembled, tested, and tuned. Every build is crafted for your specific needs.",
    icon: "Monitor",
    gradient: "from-violet-900 to-purple-900",
    featured: true,
  },
  {
    id: "graphics-cards",
    title: "Graphics Cards",
    shortTitle: "GPUs",
    href: "/components/graphics-cards",
    description: "RTX 40 Series, RX 7000 Series, and more.",
    icon: "Cpu",
    gradient: "from-green-900 to-emerald-900",
    shopifyHandle: "graphics-cards",
    featured: true,
  },
  {
    id: "processors",
    title: "Processors",
    shortTitle: "CPUs",
    href: "/components/processors",
    description: "Intel Core Ultra and AMD Ryzen CPUs.",
    icon: "CircuitBoard",
    gradient: "from-blue-900 to-sky-900",
    shopifyHandle: "processors",
    featured: true,
  },
  {
    id: "motherboards",
    title: "Motherboards",
    shortTitle: "Motherboards",
    href: "/components/motherboards",
    description: "ATX, mATX, and ITX boards for every build.",
    icon: "Server",
    gradient: "from-slate-800 to-zinc-900",
    shopifyHandle: "motherboards",
  },
  {
    id: "ram",
    title: "RAM / Memory",
    shortTitle: "RAM",
    href: "/components/ram",
    description: "DDR5 and DDR4 kits from 16GB to 128GB.",
    icon: "MemoryStick",
    gradient: "from-indigo-900 to-blue-900",
    shopifyHandle: "ram",
  },
  {
    id: "storage",
    title: "Storage",
    shortTitle: "Storage",
    href: "/components/storage",
    description: "NVMe SSDs, SATA SSDs, and HDDs.",
    icon: "HardDrive",
    gradient: "from-amber-900 to-orange-900",
    shopifyHandle: "storage",
  },
  {
    id: "power-supplies",
    title: "Power Supplies",
    shortTitle: "PSUs",
    href: "/components/power-supplies",
    description: "80+ Gold, Platinum, and Titanium certified PSUs.",
    icon: "Zap",
    gradient: "from-yellow-900 to-amber-900",
    shopifyHandle: "power-supplies",
  },
  {
    id: "cooling",
    title: "Cooling",
    shortTitle: "Cooling",
    href: "/components/cooling",
    description: "Air coolers and AIO liquid coolers.",
    icon: "Wind",
    gradient: "from-cyan-900 to-teal-900",
    shopifyHandle: "cpu-liquid-coolers", // merged collection
    featured: true,
  },
  {
    id: "monitors",
    title: "Gaming Monitors",
    shortTitle: "Monitors",
    href: "/gaming/monitors",
    description: "4K, 1440p, 1080p — high refresh rate gaming displays.",
    icon: "Monitor",
    gradient: "from-rose-900 to-red-900",
    shopifyHandle: "monitors",
    featured: true,
  },
  {
    id: "keyboards",
    title: "Gaming Keyboards",
    shortTitle: "Keyboards",
    href: "/gaming/keyboards",
    description: "Mechanical, optical, and membrane gaming keyboards.",
    icon: "Keyboard",
    gradient: "from-purple-900 to-violet-900",
    shopifyHandle: "gaming-keyboard",
  },
  {
    id: "mice",
    title: "Gaming Mice",
    shortTitle: "Mice",
    href: "/gaming/mice",
    description: "Precision gaming mice for every grip style.",
    icon: "Mouse",
    gradient: "from-fuchsia-900 to-pink-900",
    shopifyHandle: "gaming-mice",
  },
  {
    id: "headsets",
    title: "Gaming Headsets",
    shortTitle: "Headsets",
    href: "/gaming/headsets",
    description: "Immersive audio for competitive and casual play.",
    icon: "Headphones",
    gradient: "from-teal-900 to-green-900",
    shopifyHandle: "gaming-headsets",
  },
  {
    id: "controllers",
    title: "Game Controllers",
    shortTitle: "Controllers",
    href: "/gaming/controllers",
    description: "PC, PlayStation, and Xbox controllers.",
    icon: "Gamepad2",
    gradient: "from-blue-900 to-indigo-900",
    shopifyHandle: "gaming-controllers",
  },
  {
    id: "cases",
    title: "PC Cases",
    shortTitle: "Cases",
    href: "/gaming/cases",
    description: "Mini, mid-tower, and full-tower gaming chassis.",
    icon: "Box",
    gradient: "from-zinc-800 to-stone-900",
    shopifyHandle: "gaming-case",
    productCount: 58,
  },
  {
    id: "chairs",
    title: "Gaming Chairs",
    shortTitle: "Chairs",
    href: "/gaming/chairs",
    description: "Ergonomic chairs for marathon sessions.",
    icon: "Armchair",
    gradient: "from-red-900 to-rose-900",
    shopifyHandle: "gaming-chairs",
    productCount: 9,
  },
  {
    id: "racing-wheels",
    title: "Racing Wheels & Sim",
    shortTitle: "Racing",
    href: "/gaming/racing-wheels",
    description: "Sim racing wheels, pedals, and cockpits.",
    icon: "SteeringWheel",
    gradient: "from-orange-900 to-red-900",
    shopifyHandle: "racing-wheels",
  },
];

/** Featured categories for homepage category grid */
export const FEATURED_CATEGORIES = CATEGORIES.filter((c) => c.featured);
