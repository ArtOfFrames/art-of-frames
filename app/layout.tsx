import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Art Of Frames | Premium Laser Cutting & Engraving",
  description: "Exquisite laser cut and engraved products. Custom designs, premium quality, and state-of-the-art craftsmanship.",
  keywords: ["laser cutting", "engraving", "art of frames", "custom gifts", "decor"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable}`} data-theme="dark" suppressHydrationWarning>
      <body 
        suppressHydrationWarning
        style={{ 
          '--font-main': 'var(--font-inter)',
          '--font-heading': 'var(--font-outfit)',
          '--font-elegant': 'var(--font-playfair)'
        } as React.CSSProperties}
      >
        <CartProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 80px)' }}>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
