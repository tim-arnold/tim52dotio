import styles from './code-samples.module.scss';

interface DemoCardProps {
  title: string;
  description: string;
  features: string[];
  tags: string[];
  zipUrl: string;
  githubUrl: string;
}

export default function DemoCard({ title, description, features, tags, zipUrl, githubUrl }: DemoCardProps) {
  return (
    <article className={styles.card}>
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
