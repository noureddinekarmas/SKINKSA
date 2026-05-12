import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import PixelScripts from "@/components/tracking/PixelScripts";
import Providers from "@/components/Providers";
import { getSiteUrl } from "@/lib/site";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "SKINKSA | سيروم العناية بالبشرة الفاخر",
  description:
    "سيروم ببتيد النحاس الأزرق من SKINKSA - عناية فاخرة للبشرة مع الدفع عند الاستلام داخل السعودية",
  openGraph: {
    title: "SKINKSA | سيروم العناية بالبشرة الفاخر",
    description: "سيروم ببتيد النحاس الأزرق - عناية علمية فاخرة مع دفع عند الاستلام",
    url: getSiteUrl(),
    siteName: "SKINKSA",
    locale: "ar_SA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexArabic.variable} ${inter.variable}`}>
      <body
        className="font-sans antialiased"
        style={{ fontFamily: "var(--font-arabic), var(--font-inter), sans-serif" }}
      >
        <Providers>
          <Header />
          <CartDrawer />
          {children}
          <Footer />
          <PixelScripts />
        </Providers>
      </body>
    </html>
  );
}
