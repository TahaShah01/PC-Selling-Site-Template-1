import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, Russo_One } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ThemeProvider, themeInitScript } from "@/components/providers/ThemeProvider";

/* ─────────────────────────────────────────────────────────
   FONTS

   Russo One is new: a single-weight (400, it has no other
   cuts) bold geometric display face — the font Google's own
   metadata tags "Esports/Gaming" — added specifically for the
   "GAMING STORE" wordmark beside the logo. Space Grotesk and
   Inter are untouched; this doesn't replace either, it's a
   third variable used in exactly one place (see .dc-wordmark
   in globals.css).
───────────────────────────────────────────────────────── */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const russoOne = Russo_One({
  variable: "--font-esports",
  subsets: ["latin"],
  weight: "400",
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
  viewportFit: "cover",
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
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${russoOne.variable}`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}