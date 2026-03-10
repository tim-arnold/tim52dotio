// src/app/page.tsx
import styles from '../styles/components/page.module.scss';
import Image from 'next/image';

import { getServiceCards } from '@/lib/sanity.queries';
import ConsoleMessage from '../components/ConsoleMessage';
import AIInterface from '../components/AIInterface';

export default async function Home() {
    const serviceCards = await getServiceCards();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Tim Arnold',
        jobTitle: 'Web Developer and Tech Leader',
        description: 'Experienced web developer and tech leader with 25+ years building websites for nonprofits and agencies',
        url: 'https://tim52.io',
        image: 'https://tim52.io/images/tim-and-the-wall-square.webp',
        sameAs: [
            'https://linkedin.com/in/timarnold/',
            'https://instagram.com/tim52pics/',
            'https://bsky.app/profile/tim52.bsky.social',
            'https://weareoutright.com/'
        ],
        knowsAbout: [
            'Web Development',
            'Frontend Development',
            'Full Stack Development',
            'Team Leadership',
            'Accessibility',
            'Performance Optimization',
            'Nonprofit Technology',
            'Agency Management'
        ],
        worksFor: {
            '@type': 'Organization',
            name: 'Outright',
            url: 'https://weareoutright.com'
        }
    };

    return (
        <div className={styles.page}>
            <ConsoleMessage />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main id="main-content">

                {/* Hero */}
                <section className={styles.hero} aria-labelledby="hero-heading">
                    <div className="container">
                        <h1 id="hero-heading" className={styles.heroHeading}>Web Developer &amp; Tech Leader</h1>
                        <div className={styles.heroBody}>
                            <p className={styles.heroLead}>
                                I help nonprofits make technology work for them.
                                25 years working at, and leading tech teams, at agencies taught me what succeeds and
                                what just burns budget. Available for fractional leadership, project
                                work, or consulting.
                            </p>
                            <Image
                                src="/images/tim-and-the-wall-square.webp"
                                alt="Tim Arnold"
                                width={200}
                                height={200}
                                className={styles.profileImage}
                                unoptimized
                            />
                        </div>
                    </div>
                </section>

                {/* AI Interface */}
                <section id="ask-ai" className={styles.aiSection} aria-labelledby="ai-heading">
                    <div className="container">
                        <div className={styles.sectionColumns}>
                            <div className={styles.sectionLabel}>
                                <h2 id="ai-heading">Am I the Right Fit?</h2>
                                <p>Ask my AI assistant anything about my background, or paste a job description for an honest assessment.</p>
                            </div>
                            <AIInterface />
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section id="services" className={styles.servicesSection} aria-labelledby="services-heading">
                    <div className="container">
                        <div className={styles.sectionColumns}>
                            <div className={styles.sectionLabel}>
                                <h2 id="services-heading">How I Can Help</h2>
                            </div>
                            <div className={styles.featuresList}>
                                {serviceCards.map((card) => (
                                    <div key={card._id} className={styles.featureCard}>
                                        <h3>{card.title}</h3>
                                        <ul>
                                            {card.bulletPoints.map((point, index) => (
                                                <li key={index}>{point}</li>
                                            ))}
                                        </ul>
                                        <p><em>{card.tagline}</em></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>


            </main>
        </div>
    );
}
