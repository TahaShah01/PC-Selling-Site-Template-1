import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow accessing Next.js dev server & HMR WebSocket from local network IPs
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.100.40",
    "192.168.100.40:3000",
    "192.168.*",
  ],
  images: {
    qualities: [75, 90, 95],
    remotePatterns: [
      { protocol: "https", hostname: "dlcdnwebimgs.asus.com" },
      { protocol: "https", hostname: "www.intel.com" },
      { protocol: "https", hostname: "lian-li.com" },
      { protocol: "https", hostname: "cwsmgmt.corsair.com" },
      { protocol: "https", hostname: "www.gskill.com" },
      { protocol: "https", hostname: "images.samsung.com" },
    ],
  },
  /* ─────────────────────────────────────────────────────────
     REDIRECTS FROM OLD SHOPIFY ROUTES
     These preserve SEO rankings for high-value pages.
  ───────────────────────────────────────────────────────── */
  async redirects() {
    return [
      {
        source: '/pages/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/pages/faqs',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/collections',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/collections/cpu-liquid-cooler',
        destination: '/components/cooling',
        permanent: true,
      },
      {
        source: '/collections/cpu-liquid-coolers',
        destination: '/components/cooling',
        permanent: true,
      },
      {
        source: '/collections/gaming-case',
        destination: '/gaming/cases',
        permanent: true,
      },
      {
        source: '/collections/gaming-chairs',
        destination: '/gaming/chairs',
        permanent: true,
      },
      {
        source: '/collections/gaming-controllers',
        destination: '/gaming/controllers',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
