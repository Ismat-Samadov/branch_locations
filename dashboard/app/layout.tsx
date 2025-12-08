import type { Metadata, Viewport } from "next";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: "Bank Branch Network Dashboard - Azerbaijan",
  description: "Interactive map and analytics for 585 bank branches across 20 banks in Azerbaijan. View Bank of Baku and competitor locations.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bank Network AZ",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#667eea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bank Network AZ" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
