/* ─────────────────────────────────────────────────────────
   DADDU CHARGER — CORE TYPE DEFINITIONS
───────────────────────────────────────────────────────── */

/* ──────────────────── PRODUCT ──────────────────── */

export type ProductCondition = "new" | "used" | "refurbished";

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;

  // Pricing
  priceRegular: number; // PKR
  priceSale?: number; // PKR
  currency: "PKR";

  // Media
  images: ProductImage[];

  // Specifications (dynamic per category)
  specs: Record<string, string>;
  highlights: string[];

  // Status
  inStock: boolean;
  stockCount?: number;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  condition: ProductCondition;

  // Content
  description: string;

  // Metadata
  tags: string[];
  sku?: string;
  shopifyId?: string;
  shopifyHandle?: string;
  publishedAt: string;
}

/* ──────────────────── BUILDS ──────────────────── */

export type BuildTier = "entry" | "mid" | "high" | "extreme";
export type BuildUseCase = "gaming" | "streaming" | "creation" | "workstation";

export interface FeaturedBuild {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tier: BuildTier;
  useCase: BuildUseCase;
  priceFrom: number; // PKR
  image: ProductImage;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    case?: string;
    cooling?: string;
  };
  highlights: string[];
  tags: string[];
  isAvailable: boolean;
}

/* ──────────────────── CART ──────────────────── */

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  priceAtAddition: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

/* ──────────────────── NAVIGATION ──────────────────── */

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface NavItem extends NavLink {
  children?: NavLink[];
  isHighlighted?: boolean;
  badge?: string;
}

/* ──────────────────── PAGE PROPS ──────────────────── */

export interface PageParams<T = Record<string, string>> {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export interface LayoutProps<T = Record<string, string>> {
  children: React.ReactNode;
  params?: Promise<T>;
}
