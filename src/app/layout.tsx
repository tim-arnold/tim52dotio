import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals/globals.scss";

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

  // Open Graph metadata
  openGraph: {
    type: "website",
    title: "tim52.io is a cow",
    description: "A website that is about Tim. And a cow.",
    url: siteUrl,
    siteName: "tim52.io",
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`, // Use absolute URL with domain
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
    images: [`${siteUrl}/images/og-image.jpg`], // Use absolute URL with domain
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
      </body>
      </html>
  );
}