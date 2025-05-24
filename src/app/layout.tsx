import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals/globals.scss";
import ErrorBoundary from "../components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define your production URL
const siteUrl = "https://tim52.io"; // Replace with your actual domain

export const metadata: Metadata = {
  title: "tim52.io is a cow",
  description: "A website that is about Tim. And a cow.",
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
  },

  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "tim52.io is a cow",
    description: "A website that is about Tim. And a cow.",
    url: siteUrl,
    siteName: "tim52.io",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "tim52.io - Tim and a cow",
      },
    ],
  },
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "tim52.io is a cow",
    description: "A website that is about Tim. And a cow.",
    images: ["/images/og-image.jpg"],
  },
  // Additional metadata
  other: {
    "theme-color": "#c5cd57",
  },
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="tim52.io" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#c5cd57" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      </body>
      </html>
  );
}