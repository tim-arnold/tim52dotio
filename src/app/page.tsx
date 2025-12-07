// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/components/page.module.scss';
import ParallaxSection from '../components/ParallaxSection';
import ParallaxElement from '../components/ParallaxElement';
import StaggeredFeatures from '../components/StaggeredFeatures';
import Link from 'next/link';
import Image from 'next/image';
import { getServiceCards, type ServiceCard } from '../lib/sanity.queries';

export default function Home() {
    const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);

    // Fetch service cards from Sanity
    useEffect(() => {
        getServiceCards().then(setServiceCards);
    }, []);

    // Fun console message for curious developers
    useEffect(() => {
        console.log(`
    🐄 Well hello there, fellow developer! 🐄

                   ^__^
                   (oo)\\_______
                   (__)\\       )\\/\\
                       ||----w |
                       ||     ||

    You found the secret cow! This means you're probably the kind
    of person who appreciates good code AND good humor.

    👋 I'm Tim Arnold - a web developer and tech leader with 25+ years
    of experience building websites for nonprofits and agencies.

    🚀 Looking for someone who can:
       • Build accessible, performant websites
       • Lead development teams with empathy and humor
       • Wrangle complex projects without losing their mind
       • Make your users (and your cows) happy

    📧 Let's chat about your next exciting web project!
       tim@tim52.io | https://tim52.io/portfolio

    P.S. - This cow was photographed in County Kerry, Ireland.
           She's available for consulting but charges in grass.
        `);
    }, []); // Empty dependency array ensures this only runs once

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
                            <h2 id="overview-heading">Fractional Director of Technology</h2>

                            <Image
                                src="/images/tim-and-the-wall-square.webp"
                                alt="Tim Arnold"
                                width={250}
                                height={250}
                                className={styles.profileImage}
                                unoptimized
                            />
                            <p>
                                I help progressive nonprofit organizations wrangle technology without losing their minds (or their values).
                            </p>
                            <p>
                                After 25+ years building websites and leading tech teams at agencies serving nonprofits,
                                I know what works, what doesn&apos;t, and what makes people want to throw their computers out the window.
                            </p>
                            <p>
                                <em>Spoiler alert: Usually it&apos;s the computers that are the problem, not the people.</em>
                            </p>
                            <p><strong>&ldquo;Fractional Director of Technology&rdquo;</strong> is a fancy way of saying
                            I do the tech leadership stuff without requiring you to pay for a full-time salary, benefits, and my questionable tea brewing habits (I sometimes put 2 or 3 bags in a cup to brew).</p>
                        </ParallaxElement>
                    </div>
                    <ParallaxElement speed={0.6}>
                        <div className={styles.heroCtas}>
                            <Link href="#services-detail" className="button">The Details</Link>
                        </div>
                    </ParallaxElement>
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
                    <ParallaxElement speed={0.6}>
                        <div className={styles.heroCtas}>
                            <Link href="#contact" className="button">Let&apos;s Work Together</Link>
                        </div>
                    </ParallaxElement>
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
                                <p><strong>Currently available for fractional or project-based work.</strong></p>
                                <div className={styles.contactLinks}>
                                    <Link href="#footer" className="button">Get In Touch</Link>
                                    <Link href="/portfolio" className="button secondary button-right">See My Work</Link>
                                </div>
                            </div>
                        </ParallaxElement>
                    </div>
                </ParallaxSection>

            </main>
        </div>
    );
}