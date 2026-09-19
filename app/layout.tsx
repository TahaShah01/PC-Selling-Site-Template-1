import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

/* ─────────────────────────────────────────────────────────
   FONTS
───────────────────────────────────────────────────────── */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/* ─────────────────────────────────────────────────────────
   METADATA
───────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Daddu Charger — Pakistan's Premium Gaming PC Store",
    template: "%s | Daddu Charger",
  },
  description:
    "Rawalpindi's premier destination for custom-built gaming PCs, high-performance components, and gaming peripherals. Expert builds, genuine parts, best prices in Pakistan.",
  metadataBase: new URL("https://dadducharger.com"),
  keywords: [
    "gaming PC Pakistan",
    "custom gaming PC Rawalpindi",
    "gaming computer build Pakistan",
    "PC components Pakistan",
    "gaming peripherals Pakistan",
    "Daddu Charger",
    "gaming store Rawalpindi",
    "RTX GPU Pakistan",
    "Intel AMD processor Pakistan",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://dadducharger.com",
    siteName: "Daddu Charger",
    title: "Daddu Charger — Pakistan's Premium Gaming PC Store",
    description:
      "Rawalpindi's premier destination for custom-built gaming PCs and premium hardware.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daddu Charger — Premium Gaming PC Store, Rawalpindi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daddu Charger — Pakistan's Premium Gaming PC Store",
    description:
      "Custom gaming PCs, premium components, best prices in Pakistan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

/* ─────────────────────────────────────────────────────────
   ROOT LAYOUT
───────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
