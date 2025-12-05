'use client';

import Image from 'next/image';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './portfolio.module.scss';

interface Project {
  _id: string;
  title: string;
  url: string;
  screenshot: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt: string;
  };
  screenshotPosition?: string;
  description: string;
  role: string[];
  tech: string[];
  company: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  screenshotUrl: string;
}

export default function ProjectCard({ project, index, screenshotUrl }: ProjectCardProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <>
      <link rel="prefetch" href={project.url} />
      <article
        ref={elementRef}
        key={project._id}
        className={`${styles.projectCard} ${isIntersecting ? styles.fadeIn : styles.fadeOut}`}
        style={{
          transitionDelay: `${index * 100}ms`
        }}
      >
        <div className={styles.imageContainer}>
          <Image
            src={screenshotUrl}
            alt={project.screenshot.alt}
            className={styles.screenshot}
            width={1200}
            height={675}
            unoptimized={true}
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
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
                {project.company === 'Outright' ? (
                  <a
                    href="https://weareoutright.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.tag} ${styles.companyTag} ${styles.companyLink}`}
                  >
                    {project.company}
                  </a>
                ) : project.company === 'Allegiance Group + Pursuant' ? (
                  <a
                    href="https://teamallegiance.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.tag} ${styles.companyTag} ${styles.companyLink}`}
                  >
                    {project.company}
                  </a>
                ) : (
                  <span className={`${styles.tag} ${styles.companyTag}`}>
                    {project.company}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.tagGroup}>
              <h3 className={styles.tagLabel}>Role:</h3>
              <div className={styles.tagList}>
                {project.role.map((role) => (
                  <span key={role} className={`${styles.tag} ${styles.roleTag}`}>
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.tagGroup}>
              <h3 className={styles.tagLabel}>Tech:</h3>
              <div className={styles.tagList}>
                {project.tech.map((tech) => (
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
    </>
  );
}