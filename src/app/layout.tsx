import type { Metadata, Viewport } from "next";
import { Lora, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lora",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
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
    "Una evaluación de 3 minutos calibrada con más de 25.000 evaluaciones reales. Tu resultado es personal, confidencial y tuyo.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Descubre el estado de tu sistema nervioso",
    description:
      "Una evaluación de 3 minutos calibrada con más de 25.000 evaluaciones reales.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFBEF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${lora.variable} ${inter.variable} ${cormorantGaramond.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
