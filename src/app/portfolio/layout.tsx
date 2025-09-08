import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Portfolio - Web Development Projects",
  description: "Professional portfolio showcasing 8 web development projects for nonprofits and agencies including Ocean Conservancy, Truth Campaign, League of Women Voters, and more. Frontend, full-stack, and design work.",
  keywords: ["web development portfolio", "nonprofit websites", "frontend development", "full stack development", "Drupal", "WordPress", "Next.js", "accessibility", "responsive design"],
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}