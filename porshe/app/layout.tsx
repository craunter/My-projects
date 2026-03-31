import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Porsche 911 Turbo S — Timeless Precision",
  description:
    "Experience the Porsche 911 Turbo S. 640 HP, 3.8L Twin-Turbo Flat-Six, 0–100 km/h in 2.7 seconds. Configure yours today.",
  keywords: ["Porsche", "911 Turbo S", "luxury car", "sports car"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable}`}
    >
      <body className="bg-porsche-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
