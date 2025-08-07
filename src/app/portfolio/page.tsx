'use client';

import Image from 'next/image';
import Navigation from '../../components/Navigation';
import styles from './portfolio.module.scss';

interface Project {
  id: string;
  title: string;
  url: string;
  screenshot: string;
  screenshotPosition?: string;
  description: string;
  tags: {
    role: string[];
    tech: string[];
    company: string;
  };
}

const projects: Project[] = [
  {
    id: 'ocean-conservancy',
    title: 'Ocean Conservancy - Shark Week',
    url: 'https://oceanconservancy.org/sharkweek',
    screenshot: '/images/portfolio/ocean-conservancy-shark-week.jpg',
    screenshotPosition: 'center center',
    description: 'Landing page which was part of a comprehensive digital campaign for Ocean Conservancy and Discovery\'s Shark Week, focusing on marine conservation education and awareness. The page features interactive elements, educational content, and donation pathways to support shark conservation efforts.',
    tags: {
      role: ['Front End', 'Full Stack'],
      tech: ['HTML', 'SCSS', 'JavaScript', 'GSAP'],
      company: 'Outright'
    }
  },
  {
    id: 'smoking-gun',
    title: 'The Smoking Gun',
    url: 'https://smokinggun.org/',
    screenshot: '/images/portfolio/smoking-gun.jpg',
    screenshotPosition: 'top left',
    description: 'The Smoking Gun is an online resource committed to exposing the gun industry\'s role in our gun violence epidemic today through news stories, in-depth research, profiles on firearm manufacturers and suppliers, data, and more.',
    tags: {
      role: ['Front End'],
      tech: ['WordPress', 'PHP', 'SCSS', 'JavaScript'],
      company: 'Allegiance Group + Pursuant'
    }
  },
  {
    id: 'league-women-voters',
    title: 'League of Women Voters',
    url: 'https://www.lwv.org/',
    screenshot: '/images/portfolio/lwv.jpg',
    screenshotPosition: 'top left',
    description: 'The national website for the League of Women Voters, featuring voter education resources, advocacy tools, and membership management. The site serves as a hub for democratic participation and civic engagement across the United States.',
    tags: {
      role: ['Front End'],
      tech: ['Drupal', 'PHP', 'SCSS', 'JavaScript'],
      company: 'Allegiance Group + Pursuant'
    }
  },
  {
    id: 'truth-campaign',
    title: 'Truth Campaign',
    url: 'https://www.thetruth.com/',
    screenshotPosition: 'top center',
    screenshot: '/images/portfolio/truth-campaign.jpg',
    description: 'The Truth Campaign\'s digital platform focusing on smoking and vaping prevention education for young adults. Features engaging interactive content, social media integration, and educational resources designed to prevent tobacco and nicotine use among teens and young adults.',
    tags: {
      role: ['Front End'],
      tech: ['Drupal', 'PHP', 'SCSS', 'JavaScript'],
      company: 'Allegiance Group + Pursuant'
    }
  },
  {
    id: 'avac',
    title: 'AVAC - Global Advocacy for HIV Prevention',
    url: 'https://avac.org/',
    screenshot: '/images/portfolio/avac.jpg',
    screenshotPosition: 'top center',
    description: 'AVAC\'s website serves as a comprehensive resource for HIV prevention advocacy, research, and global health initiatives. The platform features extensive research databases, advocacy tools, and educational materials for healthcare professionals and advocates worldwide.',
    tags: {
      role: ['Front End'],
      tech: ['WordPress', 'PHP', 'SCSS', 'JavaScript'],
      company: 'Allegiance Group + Pursuant'
    }
  },
  {
    id: 'mildred-fox-arnold',
    title: 'Mildred Fox Arnold',
    url: 'https://mildredfoxarnold.com',
    screenshot: '/images/portfolio/mildred-fox-arnold.jpg',
    description: 'A personal website showcasing the artistic work and creative endeavors of Mildred Fox Arnold. The site features a clean, gallery-focused design that highlights artwork, projects, and personal achievements with an emphasis on visual presentation and user experience.',
    tags: {
      role: ['Full Stack', 'Design'],
      tech: ['WordPress', 'Bricks Theme'],
      company: 'Tim52.io'
    }
  },
  {
    id: 'tim52-io',
    title: 'tim52.io',
    url: 'https://tim52.io',
    screenshot: '/images/portfolio/tim52-io.jpg',
    screenshotPosition: 'center right',
    description: 'The very website you\'re viewing right now! A modern Next.js site featuring parallax animations, responsive design, and this self-aware portfolio page. Built with TypeScript, SCSS modules, and a healthy dose of recursive humor. Yes, this entry is describing itself. No, this isn\'t getting weird at all.',
    tags: {
      role: ['Full Stack', 'Design', 'Herding', 'Milking'],
      tech: ['Next.js', 'TypeScript', 'SCSS', 'React'],
      company: 'Tim52.io'
    }
  },
  {
    id: 'covid-banking',
    title: 'COVID Banking Relief',
    url: 'https://covidbanking.joinbankon.org/',
    screenshot: '/images/portfolio/covid-banking.jpg',
    description: 'A static HTML resource site providing critical banking relief information during the COVID-19 pandemic. The site served as an informational hub for individuals and businesses seeking financial assistance and banking guidance during the crisis.',
    tags: {
      role: ['Front End'],
      tech: ['HTML', 'CSS', 'JavaScript'],
      company: 'Allegiance Group + Pursuant'
    }
  }
];

export default function PortfolioPage() {
  return (
    <>
      <Navigation />
      <main className={styles.portfolio} id="main-content">
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Professional Portfolio</h1>
            <p className={styles.subtitle}>
              A collection of websites I&apos;ve built or contributed to over the years
            </p>
          </header>

          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <article key={project.id} className={styles.projectCard}>
                <div className={styles.imageContainer}>
                  <Image 
                    src={project.screenshot} 
                    alt={`Screenshot of ${project.title}`}
                    className={styles.screenshot}
                    width={800}
                    height={600}
                    unoptimized={true}
                    style={{
                      objectPosition: project.screenshotPosition || 'top center'
                    }}
                  />
                  <div className={styles.overlay}>
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.viewSite}
                      aria-label={`Visit ${project.title} (opens in new window)`}
                    >
                      View Site
                    </a>
                  </div>
                </div>
                
                <div className={styles.content}>
                  <h2 className={styles.projectTitle}>{project.title}</h2>

                  <p className={styles.description}>{project.description}</p>
                  
                  <div className={styles.tags}>
                    <div className={styles.tagGroup}>
                      <h3 className={styles.tagLabel}>Agency:</h3>
                      <div className={styles.tagList}>
                        {project.tags.company === 'Outright' ? (
                          <a 
                            href="https://weareoutright.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${styles.tag} ${styles.companyTag} ${styles.companyLink}`}
                          >
                            {project.tags.company}
                          </a>
                        ) : project.tags.company === 'Allegiance Group + Pursuant' ? (
                          <a 
                            href="https://teamallegiance.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${styles.tag} ${styles.companyTag} ${styles.companyLink}`}
                          >
                            {project.tags.company}
                          </a>
                        ) : (
                          <span className={`${styles.tag} ${styles.companyTag}`}>
                            {project.tags.company}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.tagGroup}>
                      <h3 className={styles.tagLabel}>Role:</h3>
                      <div className={styles.tagList}>
                        {project.tags.role.map((role) => (
                          <span key={role} className={`${styles.tag} ${styles.roleTag}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.tagGroup}>
                      <h3 className={styles.tagLabel}>Tech:</h3>
                      <div className={styles.tagList}>
                        {project.tags.tech.map((tech) => (
                          <span key={tech} className={`${styles.tag} ${styles.techTag}`}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardFooter}>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    Visit {project.title} →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}