import { getProjects } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity.client';
import styles from './portfolio.module.scss';
import ProjectCard from './ProjectCard';

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <main className={styles.portfolio} id="main-content">
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Professional Portfolio</h1>
          <p className={styles.subtitle}>
            Possessing a broad set of skills that comes from consulting for non-profit organizations for more than twenty years,
            this is a collection of websites I&apos;ve built over the years either alone or as part of a team.
          </p>
        </header>

        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              screenshotUrl={urlFor(project.screenshot).width(1200).url()}
            />
          ))}
        </div>
      </div>
    </main>
  );
}