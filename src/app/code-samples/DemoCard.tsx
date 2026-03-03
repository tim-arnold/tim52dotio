'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './code-samples.module.scss';

interface DemoCardProps {
  title: string;
  description: string;
  features: string[];
  tags: string[];
  zipUrl: string;
  githubUrl: string;
  index: number;
}

export default function DemoCard({ title, description, features, tags, zipUrl, githubUrl, index }: DemoCardProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <article
      ref={elementRef}
      className={`${styles.card} ${isIntersecting ? styles.fadeIn : styles.fadeOut}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={styles.content}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <ul className={styles.features}>
          {features.map((feature) => (
            <li key={feature} className={styles.feature}>{feature}</li>
          ))}
        </ul>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          View on GitHub →
        </a>
        <a href={zipUrl} download className={styles.footerLink}>
          Download Zip →
        </a>
      </div>
    </article>
  );
}
