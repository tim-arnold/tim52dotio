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
        image: 'https://tim52.io/images/tim52.webp',
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
                            <div className={styles.heroLead}>
                                <p><strong>I help non-profits make technology work for them.</strong></p>
                                <p>
                                    For the past 20+ years I&#39;ve been on the technical side of the nonprofit and advocacy world, first as a <strong>developer</strong> and then as <strong>Director</strong> and <strong>VP of Technology</strong> at digital agencies (<a href="https://web.archive.org/web/20200127142917/https://beaconfire-red.com/">Beaconfire</a> &amp; <a href="https://teamallegiance.com">Allegiance Group + Pursuant</a>) building websites, donor platforms, and advocacy tools for large nonprofit clients. Today I&#39;m <strong>Fractional Director of Technology</strong> at <a href="https://weareoutright.com">Outright</a>, where my work continues to be exclusively with nonprofit clients, bringing that same technical leadership to their teams on a fractional basis.
                                </p>
                                <p>
                                    Alongside that work, I&#39;m a <strong>board member</strong> and <strong>CTO</strong> of <a href="https://unruledmasses.org">Unruled Masses</a>, a nonprofit focused on civic engagement and government accountability. I architected and built our web platform from the ground up, leading our migration to <em>Next.js</em> and <em>Sanity CMS</em>, and sit on the board helping set the organization&#39;s technology strategy and direction as we scale.
                                </p>
                                <p>
                                    What ties all of this together is a belief that good technology should make it easier for people to <strong>organize</strong>, <strong>act</strong>, and <strong>hold power accountable</strong>, not harder. I like being the person who makes that infrastructure quietly work.
                                </p>
                            </div>

                            <Image
                                src="/images/tim52.webp"
                                alt="Tim Arnold"
                                width={388}
                                height={480}
                                className={styles.profileImage}
                                priority
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
