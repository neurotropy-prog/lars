import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Inter_Tight, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-inter-tight",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Descubre el estado de tu sistema nervioso | Instituto Epigenético",
  description:
    "Un diagnóstico de 3 minutos calibrado con más de 25.000 evaluaciones reales. Tu resultado es personal, confidencial y tuyo.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Descubre el estado de tu sistema nervioso",
    description:
      "Un diagnóstico de 3 minutos calibrado con más de 25.000 evaluaciones reales.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a252c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${inter.variable} ${interTight.variable} ${cormorantGaramond.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
