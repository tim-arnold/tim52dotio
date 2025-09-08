import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Services - Fractional Director of Technology",
  description: "Professional technology leadership services for progressive nonprofits. 25+ years experience managing development teams, technical strategy, web development, and systems administration.",
  keywords: ["fractional CTO", "technology leadership", "nonprofit technology", "web development", "team management", "technical strategy", "progressive nonprofit", "accessibility", "performance", "Tim Arnold"],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}