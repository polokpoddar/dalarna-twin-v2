import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dalarna Digital Twin v2 | Regional Intelligence Platform",
  description:
    "AI-powered digital twin for Dalarna County, Sweden. Real-time monitoring, simulation and risk analysis across 6 official data sources.",
  keywords: "Dalarna, digital twin, Sweden, SCB, SMHI, Trafikverket, risk analysis, simulation",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
