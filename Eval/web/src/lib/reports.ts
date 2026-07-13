import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// src/lib → src → web → repo root
const REPO_ROOT = join(__dirname, '..', '..', '..');
const CLIENTS_DIR = join(REPO_ROOT, 'clients');

export const AUDIT_LABELS: Record<string, string> = {
  'seo-audit': 'SEO',
  'technology-audit': 'Technology',
  'wordpress-audit': 'WordPress', // legacy: noble-reach predates rename
  'performance-audit': 'Performance',
  'accessibility-audit': 'Accessibility',
  'analytics-audit': 'Analytics',
  'security-audit': 'Security',
};

export const AUDIT_ORDER = ['seo-audit', 'technology-audit', 'wordpress-audit', 'performance-audit', 'accessibility-audit', 'analytics-audit', 'security-audit'];

// What each audit type covers and the general sources/tools behind it. Shown on the
// client landing page — deliberately general since exact tool availability varies by client.
// Don't name a specific third-party data vendor (e.g. SEMrush) here unless every client
// actually had that data — use AUDIT_DESCRIPTIONS_BY_CLIENT for client-specific sourcing.
export const AUDIT_DESCRIPTIONS: Record<string, string> = {
  'seo-audit': 'Combines automated crawl and keyword data (DataForSEO) with manual review of on-page content and site structure, plus Google Search Console and Analytics data once connected.',
  'technology-audit': 'An inventory of the current technology stack, CMS, plugins, and third-party integrations, built from front-end inspection and — where available — direct access to the codebase.',
  'wordpress-audit': 'A review of the WordPress installation itself — theme, plugins, custom code, and configuration — built from CMS admin access and codebase inspection.',
  'performance-audit': 'Page speed and Core Web Vitals findings from Lighthouse and DataForSEO on-page data, with fixes ranked by impact on load time.',
  'accessibility-audit': 'Automated accessibility scanning against WCAG 2.1 AA criteria, combined with manual keyboard and screen-reader spot checks.',
  'analytics-audit': 'A review of Google Analytics 4 tracking accuracy and data quality, so future decisions can be based on reliable numbers.',
  'security-audit': 'A review of the site\'s security posture — headers, dependencies, and known CMS vulnerabilities.',
};

// Per-client overrides for AUDIT_DESCRIPTIONS, for cases where a client's sourcing
// genuinely differs from the general case (e.g. mycgma supplied their own SEMrush audit).
const AUDIT_DESCRIPTIONS_BY_CLIENT: Record<string, Partial<Record<string, string>>> = {
  mycgma: {
    'seo-audit': 'Combines automated crawl and keyword data (DataForSEO) with a SEMrush audit and Scope of Work the client provided, plus manual review of on-page content and site structure.',
  },
};

export function getAuditDescription(client: string, auditType: string): string {
  return AUDIT_DESCRIPTIONS_BY_CLIENT[client]?.[auditType] ?? AUDIT_DESCRIPTIONS[auditType] ?? '';
}

// One-line, client-facing descriptions keyed by report filename (without .md or retest- prefix).
// Covers the report-naming conventions used across clients in this repo; unlisted reports
// simply show their title with no description.
const REPORT_DESCRIPTIONS: Record<string, string> = {
  '01-technical-baseline': 'A snapshot of technical SEO health — indexing status, site speed, structured data, and crawl issues — captured before any changes are made.',
  '02-strategic-baseline': 'Keyword rankings, competitive positioning, and content strategy findings that inform what to preserve and what to improve.',
  '03-consolidated-findings': 'Reconciles findings across every data source into one list, flagging where sources agree, conflict, or add new information.',
  '03-redesign-risk-register': 'Everything that must be preserved, redirected, or fixed during the rebuild so the redesign doesn\'t break existing SEO equity.',
  '03-remediation-priorities': 'A prioritized, actionable list of fixes ranked by impact and effort.',
  '04-remediation-priorities': 'A prioritized, actionable list of fixes ranked by impact, effort, and who needs to do the work.',
  'technology-audit-report': 'An inventory of the current technology stack, plugins, and integrations to inform migration and rebuild planning.',
  'wordpress-audit-report': 'A review of the WordPress installation ahead of a rebuild — theme, plugins, custom code, and configuration.',
  'accessibility-audit-report': 'An automated and manual review of the site against WCAG 2.1 AA accessibility criteria.',
  'performance-audit-report': 'The original baseline measurements, before any fixes were made.',
  'performance-retest-report': 'Re-runs the same tests against the fixed pages to confirm the improvements held.',
  'analytics-audit-report': 'A review of Google Analytics tracking accuracy and data quality ahead of a redesign.',
  'security-audit-report': 'A review of the site\'s security posture — headers, dependencies, and known CMS vulnerabilities.',
  'brand-refresh-feasibility': 'An assessment of what a brand refresh would require given the current technical foundation.',
};

const COMPARISON_DESCRIPTION = 'Documents what changed since the previous audit round — what was fixed, what wasn\'t, and what\'s new.';

export function getReportDescription(baseSlug: string, isComparison: boolean): string {
  if (isComparison) return COMPARISON_DESCRIPTION;
  return REPORT_DESCRIPTIONS[baseSlug] ?? '';
}

// Reports use inconsistent date labels/formats across clients: "**Date:**",
// "**Audit date:**", "**Prepared:**" (but not "Prepared by:", which names a person,
// not a date), in ISO, "Month D, YYYY", or bare "Month YYYY" form.
function extractDateLabel(content: string): string | null {
  const match = content.match(/^>?\s*\*\*(?:Audit date|Date|Prepared)\s*:?\*\*\s*(.+?)\s*$/im);
  return match ? match[1].trim() : null;
}

function normalizeDate(raw: string): string {
  const trimmed = raw.replace(/\*+$/, '').trim();

  let m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  m = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (m) {
    const d = new Date(`${m[1]} ${m[2]}, ${m[3]}`);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }

  m = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (m) {
    const d = new Date(`${m[1]} 1, ${m[2]}`);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
  }

  return trimmed;
}

// Fallback for the handful of reports with no date line at all: use the date the
// file was first committed, so there's still something to show.
function getGitFirstCommitDate(absPath: string): string | null {
  try {
    const rel = relative(REPO_ROOT, absPath);
    const out = execFileSync(
      'git',
      ['log', '--follow', '--diff-filter=A', '--format=%ad', '--date=short', '--', rel],
      { cwd: REPO_ROOT, encoding: 'utf-8' }
    ).trim();
    const commits = out.split('\n').filter(Boolean);
    const earliest = commits[commits.length - 1];
    return earliest ? normalizeDate(earliest) : null;
  } catch {
    return null;
  }
}

function getReportDate(content: string, absPath: string): string | null {
  const label = extractDateLabel(content);
  if (label) return normalizeDate(label);
  return getGitFirstCommitDate(absPath);
}

export interface Report {
  client: string;
  clientName: string;
  slug: string;
  baseSlug: string;
  title: string;
  auditType: string;
  content: string;
  run: number;           // 0 = initial, 1 = retest-1, 2 = retest-2, etc.
  isComparison: boolean; // true for 00-comparison.md files
  date: string | null;   // when the report was performed, or null if undeterminable
}

export function getClients(): string[] {
  if (!existsSync(CLIENTS_DIR)) return [];
  return readdirSync(CLIENTS_DIR).filter((d: string) => {
    const fullPath = join(CLIENTS_DIR, d);
    return !d.startsWith('.') && statSync(fullPath).isDirectory();
  });
}

export function getClientName(client: string): string {
  const claudePath = join(CLIENTS_DIR, client, 'CLAUDE.md');
  if (!existsSync(claudePath)) return formatSlug(client);
  const content = readFileSync(claudePath, 'utf-8');
  // First line is like: # Noble Reach Foundation — Pre-Redesign Audit
  const match = content.match(/^#\s+(.+?)\s+[—–-]/m);
  return match ? match[1].trim() : formatSlug(client);
}

// Pulls the "## Project" paragraph out of a client's CLAUDE.md — the one place each
// client already has a short, accurate summary of the engagement (URL + goal).
export function getClientProjectIntro(client: string): string {
  const claudePath = join(CLIENTS_DIR, client, 'CLAUDE.md');
  if (!existsSync(claudePath)) return '';
  const content = readFileSync(claudePath, 'utf-8');
  const match = content.match(/^## Project\s*\n\n([\s\S]*?)(?=\n##|\n---|\n*$)/m);
  return match ? match[1].trim() : '';
}

export function getClientReports(client: string): Report[] {
  const reports: Report[] = [];
  const clientName = getClientName(client);
  const clientDir = join(CLIENTS_DIR, client);

  for (const auditType of AUDIT_ORDER) {
    const auditDir = join(clientDir, auditType);
    if (!existsSync(auditDir)) continue;

    // Collect all runs: run 0 (initial) + any retest-N dirs
    const runs: Array<{ run: number; reportsDir: string }> = [];

    const initialReportsDir = join(auditDir, 'reports');
    if (existsSync(initialReportsDir)) {
      runs.push({ run: 0, reportsDir: initialReportsDir });
    }

    // Detect retest-N subdirectories, sorted numerically
    const retestDirs = readdirSync(auditDir)
      .filter((d: string) => /^retest-\d+$/.test(d))
      .sort((a: string, b: string) => {
        const na = parseInt(a.replace('retest-', ''), 10);
        const nb = parseInt(b.replace('retest-', ''), 10);
        return na - nb;
      });

    for (const retestDir of retestDirs) {
      const run = parseInt(retestDir.replace('retest-', ''), 10);
      const reportsDir = join(auditDir, retestDir, 'reports');
      if (existsSync(reportsDir)) {
        runs.push({ run, reportsDir });
      }
    }

    for (const { run, reportsDir } of runs) {
      const files = readdirSync(reportsDir)
        .filter((f: string) => f.endsWith('.md') && !f.toLowerCase().startsWith('readme'))
        .sort();

      for (const file of files) {
        const filePath = join(reportsDir, file);
        const content = readFileSync(filePath, 'utf-8');
        const title = extractTitle(content) || formatSlug(file.replace('.md', ''));
        const baseSlug = file.replace('.md', '');
        const slug = run === 0 ? baseSlug : `retest-${run}-${baseSlug}`;
        const isComparison = /^00-comparison/i.test(file);
        const date = getReportDate(content, filePath);
        reports.push({ client, clientName, slug, baseSlug, title, auditType, content, run, isComparison, date });
      }
    }
  }

  return reports;
}

export function getAllReports(): Report[] {
  return getClients().flatMap(client => getClientReports(client));
}

function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function formatSlug(slug: string): string {
  return slug
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
