import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Code Samples - WordPress & GitHub Actions",
  description: "Downloadable code samples showcasing WordPress theme templates, custom Gutenberg blocks, plugin development, and GitHub Actions CI/CD workflows.",
  keywords: ["code samples", "WordPress theme", "Gutenberg blocks", "WordPress plugin", "GitHub Actions", "CI/CD", "ACF", "PHP", "YAML"],
};

export default function DemoCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
