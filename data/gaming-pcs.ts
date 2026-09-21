/* ─────────────────────────────────────────────────────────
   DADDU CHARGER — GAMING PC BUILDS DATA
   Pre-built / featured build definitions for /gaming-pcs
   and the FeaturedBuilds homepage section.
───────────────────────────────────────────────────────── */

export interface GamingPC {
  slug: string;
  name: string;
  tagline: string;
  tier: "1080p" | "1440p" | "4K" | "Workstation" | "Budget";
  target: string; // e.g. "1440p / high refresh"
  spec: string;   // One-line spec summary
  price: string;  // Formatted PKR price
  priceRaw: number;
  image: string;
  gallery?: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  badge?: string; // e.g. "Best Seller", "New"
  components: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    motherboard: string;
    cooling: string;
    psu: string;
    case: string;
  };
  benchmarks?: {
    game: string;
    resolution: string;
    fps: string;
  }[];
  highlights: string[];
}

export const GAMING_PCS: GamingPC[] = [
  {
    slug: "volt-4070",
    name: "Volt 4070",
    tagline: "The 1440p champion.",
    tier: "1440p",
    target: "1440p / high refresh",
    spec: "Ryzen 7 7800X3D · RTX 4070 Super · 32GB DDR5 · 2TB NVMe",
    price: "PKR 585,000",
    priceRaw: 585000,
    image: "/hero-pc.jpg",
    isAvailable: true,
    isFeatured: true,
    badge: "Best Seller",
    components: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "ASUS TUF RTX 4070 Super OC 12GB",
      ram: "G.Skill Trident Z5 32GB DDR5-6000",
      storage: "Samsung 990 Pro 2TB NVMe Gen 4",
      motherboard: "ASUS ROG Strix X670E-F Gaming",
      cooling: "DeepCool Assassin IV",
      psu: "Corsair RM850x 850W 80+ Gold",
      case: "Lian Li O11 Dynamic EVO",
    },
    benchmarks: [
      { game: "Cyberpunk 2077", resolution: "1440p Ultra RT", fps: "82 avg" },
      { game: "Valorant", resolution: "1440p Max", fps: "320+ avg" },
      { game: "CS2", resolution: "1440p Max", fps: "280+ avg" },
    ],
    highlights: [
      "AMD Ryzen 7 7800X3D — best gaming CPU on the market",
      "RTX 4070 Super handles any 1440p game at ultra settings",
      "32GB DDR5-6000 for future-proof headroom",
      "2TB NVMe Gen 4 — space for your whole library",
      "48-hour burn-in before dispatch",
    ],
  },
  {
    slug: "apex-4090",
    name: "Apex 4090",
    tagline: "No compromises. Not one.",
    tier: "4K",
    target: "4K / ultra settings",
    spec: "Core i9-14900K · RTX 4090 · 64GB DDR5 · 4TB NVMe",
    price: "PKR 1,250,000",
    priceRaw: 1250000,
    image: "/hero-pc.jpg",
    isAvailable: true,
    isFeatured: true,
    badge: "Flagship",
    components: {
      cpu: "Intel Core i9-14900K",
      gpu: "ASUS ROG Strix RTX 4090 OC 24GB",
      ram: "G.Skill Trident Z5 64GB DDR5-7200",
      storage: "Samsung 990 Pro 4TB NVMe Gen 4",
      motherboard: "ASUS ROG Maximus Z790 Apex",
      cooling: "NZXT Kraken 360 AIO",
      psu: "Corsair HX1200i 1200W 80+ Platinum",
      case: "Lian Li O11 Dynamic XL",
    },
    benchmarks: [
      { game: "Cyberpunk 2077", resolution: "4K Ultra PT", fps: "68 avg" },
      { game: "Microsoft Flight Sim", resolution: "4K Ultra", fps: "75 avg" },
      { game: "Hogwarts Legacy", resolution: "4K Max RT", fps: "95 avg" },
    ],
    highlights: [
      "RTX 4090 — the fastest consumer GPU ever made",
      "Core i9-14900K for content creation & streaming",
      "64GB DDR5 — ready for AI workloads",
      "NZXT Kraken 360 keeps temps under 75°C under load",
      "Custom cable management, RGB sync included",
    ],
  },
  {
    slug: "compact-itx",
    name: "Compact ITX",
    tagline: "Small case. Big frames.",
    tier: "1440p",
    target: "Small form factor",
    spec: "Core i5-14600K · RTX 4060 Ti · 32GB DDR5 · 1TB NVMe",
    price: "PKR 395,000",
    priceRaw: 395000,
    image: "/category_grid_bg_1789821288197.jpg",
    isAvailable: true,
    isFeatured: true,
    components: {
      cpu: "Intel Core i5-14600K",
      gpu: "MSI RTX 4060 Ti Gaming X 16GB",
      ram: "Corsair Vengeance DDR5 32GB 5600MHz",
      storage: "WD Black SN850X 1TB NVMe Gen 4",
      motherboard: "ASUS ROG Strix B760-I Gaming WiFi",
      cooling: "Thermalright AXP120-X67",
      psu: "Corsair SF750 750W 80+ Platinum SFX",
      case: "NZXT H1",
    },
    benchmarks: [
      { game: "Valorant", resolution: "1080p Max", fps: "400+ avg" },
      { game: "Elden Ring", resolution: "1440p Ultra", fps: "88 avg" },
      { game: "Fortnite", resolution: "1440p Competitive", fps: "240+ avg" },
    ],
    highlights: [
      "Mini-ITX form factor — fits anywhere on your desk",
      "RTX 4060 Ti with 16GB VRAM for 1440p gaming",
      "Near-silent operation with tuned fan curves",
      "Takes up less space than a gaming laptop stand",
    ],
  },
  {
    slug: "pro-creator",
    name: "Pro Creator",
    tagline: "Built for the ones who make.",
    tier: "Workstation",
    target: "Content creation / streaming",
    spec: "Ryzen 9 7950X · RTX 4080 Super · 96GB DDR5 · 8TB NVMe",
    price: "PKR 1,050,000",
    priceRaw: 1050000,
    image: "/circuit-bg.jpg",
    isAvailable: true,
    isFeatured: false,
    badge: "Creator",
    components: {
      cpu: "AMD Ryzen 9 7950X",
      gpu: "MSI RTX 4080 Super Gaming X Trio",
      ram: "G.Skill Trident Z5 96GB DDR5-6000 (3×32GB)",
      storage: "2× Samsung 990 Pro 4TB NVMe Gen 4",
      motherboard: "ASUS ProArt X670E Creator WiFi",
      cooling: "Corsair H150i Elite Capellix 360",
      psu: "Corsair HX1000i 1000W 80+ Platinum",
      case: "Fractal Design Define 7 XL",
    },
    benchmarks: [
      { game: "DaVinci Resolve 4K Export", resolution: "4K H.265", fps: "3× realtime" },
      { game: "Blender BMW Render", resolution: "GPU + CPU", fps: "38 seconds" },
      { game: "Adobe Premiere Pro", resolution: "8K ProRes", fps: "Smooth playback" },
    ],
    highlights: [
      "Ryzen 9 7950X — 16 cores for rendering, streaming & multitasking",
      "96GB DDR5 for large project files and virtual machines",
      "RTX 4080 Super for GPU rendering acceleration",
      "8TB NVMe storage across two drives",
    ],
  },
  {
    slug: "entry-fps",
    name: "Entry FPS",
    tagline: "Competitive frames. Honest price.",
    tier: "Budget",
    target: "1080p competitive",
    spec: "Core i3-13100F · RTX 3060 · 16GB DDR4 · 512GB NVMe",
    price: "PKR 175,000",
    priceRaw: 175000,
    image: "/hero-pc.jpg",
    isAvailable: true,
    isFeatured: false,
    components: {
      cpu: "Intel Core i3-13100F",
      gpu: "MSI RTX 3060 Ventus 2X 12GB",
      ram: "Kingston Fury Beast 16GB DDR4-3200",
      storage: "WD Green SN350 512GB NVMe",
      motherboard: "Gigabyte B660M DS3H",
      cooling: "DeepCool AK400",
      psu: "Corsair CV650 650W 80+ Bronze",
      case: "Phanteks Eclipse P300A Mesh",
    },
    benchmarks: [
      { game: "Valorant", resolution: "1080p Max", fps: "240+ avg" },
      { game: "CS2", resolution: "1080p Max", fps: "200+ avg" },
      { game: "Fortnite", resolution: "1080p Competitive", fps: "144+ avg" },
    ],
    highlights: [
      "Designed for esports at 1080p — hits 144Hz+ on every major title",
      "No RGB tax — budget goes to performance",
      "Upgradeable: GPU and RAM both have headroom to grow",
      "Free assembly, testing, and Windows installation",
    ],
  },
  {
    slug: "cafe-ten",
    name: "Café Ten",
    tagline: "Built for the café. Priced per unit.",
    tier: "Budget",
    target: "Gaming café fitout",
    spec: "Core i3-13100F · RTX 3050 · 16GB DDR4 · 512GB NVMe",
    price: "From PKR 165,000 / unit",
    priceRaw: 165000,
    image: "/circuit-bg.jpg",
    isAvailable: true,
    isFeatured: true,
    badge: "Bulk",
    components: {
      cpu: "Intel Core i3-13100F",
      gpu: "MSI RTX 3050 Ventus 2X 8GB",
      ram: "Kingston Fury 16GB DDR4-3200",
      storage: "Kingston NV2 512GB NVMe",
      motherboard: "Gigabyte B660M DS3H",
      cooling: "Stock cooler",
      psu: "Corsair CV550 550W 80+ Bronze",
      case: "Phanteks P300A",
    },
    benchmarks: [
      { game: "Valorant", resolution: "1080p High", fps: "180+ avg" },
      { game: "Fortnite", resolution: "1080p Competitive", fps: "120+ avg" },
      { game: "GTA V", resolution: "1080p Very High", fps: "80+ avg" },
    ],
    highlights: [
      "Pricing for 10+ unit orders — contact us for bulk rates",
      "Identical parts across every unit for easy maintenance",
      "Pre-installed Windows + all drivers configured",
      "1-year service warranty on every unit",
    ],
  },
];

/** Featured builds for homepage FeaturedBuilds section */
export const FEATURED_BUILDS = GAMING_PCS.filter((b) => b.isFeatured);
