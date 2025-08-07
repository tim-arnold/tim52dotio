import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Portfolio - Web Development Projects",
  description: "Professional portfolio showcasing 8 web development projects for nonprofits and agencies including Ocean Conservancy, Truth Campaign, League of Women Voters, and more. Frontend, full-stack, and design work.",
  keywords: ["web development portfolio", "nonprofit websites", "frontend development", "full stack development", "Drupal", "WordPress", "Next.js", "accessibility", "responsive design"],
  openGraph: {
    title: "Tim Arnold - Web Development Portfolio",
    description: "Professional portfolio showcasing 8 web development projects for nonprofits and agencies including Ocean Conservancy, Truth Campaign, League of Women Voters, and more.",
    images: [
      {
        url: "/images/portfolio/ocean-conservancy-shark-week.jpg",
        width: 800,
        height: 600,
        alt: "Ocean Conservancy Shark Week website screenshot",
      },
    ],
  },
  twitter: {
    title: "Tim Arnold - Web Development Portfolio",
    description: "Professional portfolio showcasing 8 web development projects for nonprofits and agencies.",
    images: ["/images/portfolio/ocean-conservancy-shark-week.jpg"],
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}