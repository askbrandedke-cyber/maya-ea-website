import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL, brand } from "@/content/brand";
import { allowIndexing, staticRoutes } from "@/content/site";
import { JsonLd, organizationJsonLd } from "@/lib/jsonld";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileBar } from "@/components/site/MobileBar";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.woff2", weight: "400" },
    { path: "./fonts/poppins-500.woff2", weight: "500" },
    { path: "./fonts/poppins-600.woff2", weight: "600" },
    { path: "./fonts/poppins-700.woff2", weight: "700" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const home = staticRoutes[0];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${brand.name} | ${home.title}`, template: `%s | ${brand.name}` },
  description: home.description,
  applicationName: brand.name,
  openGraph: { type: "website", siteName: brand.name, locale: "en_GB" },
  twitter: { card: "summary_large_image", site: "@mayaearwd" },
  // Proposal builds stay out of search results until Maya approves go-live (SITEMAP.md §1.5).
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: brand.colours.ink,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh pb-16 md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-chef focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileBar />
        </MotionProvider>
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
