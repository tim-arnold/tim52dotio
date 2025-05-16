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

export const metadata: Metadata = {
  title: "tim52.io is a cow",
  description: "A website that is about Tim. And a cow.",

  // Open Graph metadata
  openGraph: {
    type: "website",
    title: "tim52.io is a cow",
    description: "A website that is about Tim. And a cow.",
    url: "https://tim52.io", // Update with your actual URL
    siteName: "tim52.io",
    images: [
      {
        url: "/images/og-image.jpg", // Update with your actual image path
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
    images: ["/images/og-image.jpg"], // Update with your actual image path
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