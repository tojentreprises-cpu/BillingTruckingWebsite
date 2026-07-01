import type { Metadata, Viewport } from "next";
import { Archivo, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import "./horizontal.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Billing Trucking Inc. — Refrigerated & Produce Freight · Turlock, CA",
  description:
    "Billing Trucking Inc. — temperature-controlled produce and food-grade freight out of Turlock, California. Family-run reefer fleet serving the West since 2003.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0708",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
