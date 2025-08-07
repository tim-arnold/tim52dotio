import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/webp" href="/images/tim-yelling.webp" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="tim52.io" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#c5cd57" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    document.documentElement.classList.add(savedTheme);
                    document.documentElement.setAttribute('data-theme', savedTheme);
                  } else {
                    // Default to browser preference
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    var theme = prefersDark ? 'dark' : 'light';
                    document.documentElement.classList.add(theme);
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {
                  // Fallback to light theme if anything fails
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <BodyClass />
      <ThemeProvider>
        <ErrorBoundary>
          <PageTransition>
            <Navigation />
            {children}
          </PageTransition>
          <footer className="footer">
            <ContactForm />
            <p>&copy; 2024 Tim Arnold. All rights reserved.</p>
          </footer>
        </ErrorBoundary>
      </ThemeProvider>
      </body>
      </html>
  );
}