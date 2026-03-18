import styles from './code-samples.module.scss';
import DemoCard from './DemoCard';

const GITHUB_REPO = 'https://github.com/tim-arnold/code-samples';

const demos = [
  {
    title: 'GitHub Actions Workflows',
    description:
        'A collection of CI/CD, backup, migration, and disaster recovery workflows for GitHub Actions. Covers automated deployments, scheduled backups, cross-environment migration, and recovery procedures.',
    features: [
      'CI/CD pipelines for automated build and deployment',
      'Scheduled backup workflows for data protection',
      'Cross-environment migration automation',
      'Disaster recovery procedures and rollback workflows',
    ],
    tags: ['YAML', 'GitHub Actions', 'CI/CD', 'DevOps'],
    zipUrl: `${GITHUB_REPO}/raw/main/github-actions.zip`,
    githubUrl: `${GITHUB_REPO}/tree/main/github-actions`,
  },
  {
    title: 'WordPress Theme Pages',
    description:
      'Custom team member single and archive templates for a WordPress theme. The single view displays a hero image, credentials, bio, and social links. The archive page renders a card grid grouped by ACF category with defined section ordering.',
    features: [
      'Prev/next navigation using menu_order for custom sort',
      'Archive grouped by ACF category with defined section order',
      'Handles legacy single-select and current checkbox ACF formats',
      'Social links for Facebook, LinkedIn, Instagram, YouTube, X, Bluesky',
    ],
    tags: ['PHP', 'WordPress', 'ACF', 'Custom Post Types'],
    zipUrl: `${GITHUB_REPO}/raw/main/wp-theme-pages.zip`,
    githubUrl: `${GITHUB_REPO}/tree/main/wp-theme-pages`,
  },
  {
    title: 'WordPress Custom Blocks',
    description:
      'Two custom Gutenberg blocks built with Advanced Custom Fields and registered via block.json. A tabbed logo grid for portfolio companies and an interlocking card grid with staggered layout and hover states.',
    features: [
      'Keyboard-navigable tabs with ARIA roles for screen readers',
      'CSS Grid staggered layout using a repeating 6-card pattern',
      'AJAX "View more" loads additional cards without page reload',
      'XSS prevention via escapeHtml() for dynamically inserted content',
    ],
    tags: ['PHP', 'JavaScript', 'WordPress', 'ACF', 'Gutenberg'],
    zipUrl: `${GITHUB_REPO}/raw/main/wp-custom-blocks.zip`,
    githubUrl: `${GITHUB_REPO}/tree/main/wp-custom-blocks`,
  },
  {
    title: 'WordPress Custom Plugin',
    description:
      'A WordPress plugin for managing global call-to-action sections. Provides a rich ACF-based interface for configuring up to 5 CTAs with priority ordering, color schemes, and per-page visibility controls.',
    features: [
      'Up to 5 CTAs with priority-based display ordering',
      'Per-page toggle to show/hide CTA color schemes',
      'Accessible markup with ARIA labels and screen reader support',
      'Override styles with theme CSS or reposition with hooks',
    ],
    tags: ['PHP', 'WordPress', 'ACF', 'Plugin Development'],
    zipUrl: `${GITHUB_REPO}/raw/main/wp-custom-plugin.zip`,
    githubUrl: `${GITHUB_REPO}/tree/main/wp-custom-plugin`,
  },
];

export default function DemoCodePage() {
  return (
    <main className={styles.demoCode} id="main-content">
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Code Samples</h1>
          <p className={styles.subtitle}>
            A collection of code samples from recent projects, available for download.
            These demonstrate WordPress theme development, custom Gutenberg blocks,
            plugin architecture, and GitHub Actions CI/CD workflows. Downloadable zip archives
            contain README.md files with more detailed descriptions.
          </p>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            View all samples on GitHub &rarr;
          </a>
        </header>

        <div className={styles.grid}>
          {demos.map((demo) => (
            <DemoCard key={demo.title} {...demo} />
          ))}
        </div>
      </div>
    </main>
  );
}
