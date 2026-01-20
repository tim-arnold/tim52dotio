// src/app/page.tsx
import styles from '../styles/components/page.module.scss';
import ParallaxSection from '../components/ParallaxSection';
import ParallaxElement from '../components/ParallaxElement';
import StaggeredFeatures from '../components/StaggeredFeatures';
import Link from 'next/link';
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
                {/* Main Overview */}
                <ParallaxSection
                    id="what-i-do"
                    backgroundColor="var(--primary)"
                    height="auto"
                    minHeight="100vh"
                    className={styles.aboutSection}
                    role="region"
                    aria-labelledby="overview-heading"
                >
                    <div className={styles.aboutContent}>
                        <ParallaxElement speed={0.3} direction="right" className={styles.aboutText}>
                            <h2 id="overview-heading">Web Developer and Tech Leader</h2>

                            <Image
                                src="/images/tim-and-the-wall-square.webp"
                                alt="Tim Arnold"
                                width={250}
                                height={250}
                                className={styles.profileImage}
                                unoptimized
                            />
                            <p>
                                I help progressive nonprofit organizations wrangle technology without losing their
                                minds (or their values).
                            </p>
                            <p>
                                After 25+ years building websites and leading tech teams at agencies serving nonprofits,
                                I know what actually works and what&apos;s just going to waste your time and money.
                            </p>
                            <p>Whether you need someone to lead your tech team, build your website, architect a solution,
                            or just figure out why nothing works the way it&apos;s supposed to&mdash;I can help.
                            Available for fractional leadership, project-based work, or ongoing consulting.</p>
                        </ParallaxElement>
                    </div>
                    <ParallaxElement speed={0.6}>
                        <div className={styles.heroCtas}>
                            <Link href="#ask-ai" className="button">Ask about me</Link>
                        </div>
                    </ParallaxElement>
                </ParallaxSection>

                {/* AI Interface Section */}
                <ParallaxSection
                    id="ask-ai"
                    speed={0.3}
                    height="auto"
                    minHeight="100vh"
                    className={styles.aiSection}
                    role="region"
                    aria-labelledby="ai-heading"
                >
                    <div className={styles.aiContent}>
                        <ParallaxElement speed={0.3}>
                            <h2 id="ai-heading">Am I the Right Fit?</h2>
                            <p className={styles.aiIntro}>
                                Ask my AI assistant anything about my background,
                                or paste a job description for an honest assessment.
                            </p>
                        </ParallaxElement>
                        <ParallaxElement speed={0.1}>
                            <AIInterface />
                        </ParallaxElement>
                    </div>
                </ParallaxSection>

                {/* Detailed Services */}
                <ParallaxSection
                    id="services-detail"
                    speed={0.3}
                    height="auto"
                    minHeight="100vh"
                    className={styles.featuresSection}
                    role="region"
                    aria-labelledby="services-detail-heading"
                >
                    <div className={styles.featuresContent}>
                        <ParallaxElement speed={-0.3} amplify={1.5}>
                            <h2 id="services-detail-heading">How I Can Help Your Organization</h2>
                        </ParallaxElement>

                        <StaggeredFeatures className={styles.featuresList}>
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
                        </StaggeredFeatures>
                    </div>
                </ParallaxSection>

                {/* Contact/CTA Section */}
<ParallaxSection
                    id="contact"
                    backgroundColor="var(--primary)"
                    height="100vh"
                    className={styles.contactSection}
                    role="region"
                    aria-labelledby="contact-heading"
                >
                    <div className={styles.contactContent}>
                        <ParallaxElement speed={0.3}>
                            <h2 id="contact-heading">Ready to Stop Wrestling with Technology?</h2>
                        </ParallaxElement>

                        <ParallaxElement speed={0.5}>
                            <div className={styles.contactText}>
                                <p>Whether you need someone to lead your tech team, build your website, or just figure out why nothing works the way it&apos;s supposed to, I&apos;m here to help.</p>
                                <p><strong>Currently available for fractional or project-based work.</strong> <Link href="/portfolio">See my work</Link>.</p>
                                <div className={styles.contactLinks}>
                                    <Link href="#footer" className="button">Get In Touch</Link>
                                </div>
                            </div>
                        </ParallaxElement>
                    </div>
                </ParallaxSection>

            </main>
        </div>
    );
}