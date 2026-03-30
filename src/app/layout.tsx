import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-host-grotesk",
});

export const metadata: Metadata = {
  title: "Descubre el estado de tu sistema nervioso | Instituto Epigenético",
  description:
    "Una evaluación de 3 minutos calibrada con más de 25.000 evaluaciones reales. Tu resultado es personal, confidencial y tuyo.",
  icons: {
    icon: "/favicon.svg",
  },
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
    images: [
      {
        url: "/Estado.png",
        width: 1200,
        height: 630,
        alt: "Descubre el estado de tu sistema nervioso",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Descubre el estado de tu sistema nervioso",
    description:
      "Una evaluación de 3 minutos calibrada con más de 25.000 evaluaciones reales.",
    images: ["/Estado.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={hostGrotesk.variable}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
