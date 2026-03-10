import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "../styles/globals/globals.scss";
import ErrorBoundary from "../components/ErrorBoundary";
import ContactForm from "../components/ContactForm";
import Navigation from "../components/Navigation";
import PageTransition from "../components/PageTransition";
import { ThemeProvider } from "../contexts/ThemeContext";
import BodyClass from "../components/BodyClass";

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
  title: {
    default: "Tim Arnold - Web Developer & Tech Leader | tim52.io",
    template: "%s | Tim Arnold - tim52.io"
  },
  description: "Experienced web developer and tech leader specializing in accessibility, performance, and team management. 25+ years building websites for nonprofits and agencies.",
  keywords: ["web developer", "frontend developer", "full stack developer", "tech leader", "accessibility", "performance", "nonprofit web development", "agency work", "Tim Arnold"],
  authors: [{ name: "Tim Arnold", url: "https://tim52.io" }],
  creator: "Tim Arnold",
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Tim Arnold - Web Developer & Tech Leader",
    description: "Experienced web developer and tech leader specializing in accessibility, performance, and team management. 25+ years building websites for nonprofits and agencies.",
    url: siteUrl,
    siteName: "Tim Arnold - tim52.io",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tim Arnold - Web Developer and Tech Leader",
      },
    ],
  },
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Tim Arnold - Web Developer & Tech Leader",
    description: "Experienced web developer and tech leader specializing in accessibility, performance, and team management. 25+ years building websites for nonprofits and agencies.",
    images: ["/images/og-image.jpg"],
    creator: "@tim52pics",
  },
  // Additional metadata
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/images/tim-yelling.webp", type: "image/webp" },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#c5cd57",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "tim52.io",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#c5cd57",
  },
};

export const viewport = "width=device-width, initial-scale=1, viewport-fit=cover";

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <BodyClass />
      <ThemeProvider>
        <ErrorBoundary>
          <PageTransition>
            <Navigation data-component="navigation" />
            {children}
          </PageTransition>
          <footer id="footer" className="footer">
            <div className="container">
              <ContactForm />
              <p>&copy; 2024 Tim Arnold. All rights reserved.</p>
            </div>
          </footer>
        </ErrorBoundary>
      </ThemeProvider>
      </body>
      </html>
  );
}