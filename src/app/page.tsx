// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import styles from '../styles/components/page.module.scss';
import ParallaxSection from '../components/ParallaxSection';
import ParallaxElement from '../components/ParallaxElement';
import StaggeredFeatures from '../components/StaggeredFeatures';
import Link from 'next/link';

export default function Home() {
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
                            <p>My current role is <strong>&ldquo;Fractional Director of Technology&rdquo;</strong> — which is a fancy way of saying
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
                            <div className={styles.featureCard}>
                                <h3>Technology Leadership &amp; Strategy</h3>
                                <ul>
                                    <li>Overall direction of web tech initiatives</li>
                                    <li>Technology roadmap development</li>
                                    <li>Budget planning and resource allocation</li>
                                    <li>Vendor evaluation and selection</li>
                                    <li>Internal technical audits</li>
                                </ul>
                                <p><em>Translation: I make the big tech decisions so you don&apos;t have to.</em></p>
                            </div>

                            <div className={styles.featureCard}>
                                <h3>Team Management &amp; Development</h3>
                                <ul>
                                    <li>Managing development teams (Junior Developers all the way up to Tech Leads and Directors)</li>
                                    <li>Hiring and vetting technical talent</li>
                                    <li>Performance management with empathy</li>
                                    <li>Process improvement and team culture building</li>
                                    <li>Training and professional development</li>
                                </ul>
                                <p><em>Because good people deserve good management, not just &ldquo;figuring it out.&rdquo;</em></p>
                            </div>

                            <div className={styles.featureCard}>
                                <h3>Business Development &amp; Sales Support</h3>
                                <ul>
                                    <li>Technical sales pursuit support</li>
                                    <li>Proposal writing and technical scoping</li>
                                    <li>Client consultation on technical requirements</li>
                                    <li>Competitive analysis and positioning</li>
                                </ul>
                                <p><em>I can talk to clients without making them wish they&apos;d never asked about &ldquo;the tech stuff.&rdquo;</em></p>
                            </div>

                            <div className={styles.featureCard}>
                                <h3>Web Development &amp; Technical Execution</h3>
                                <ul>
                                    <li>Full-stack web development (25+ years experience)</li>
                                    <li>Accessibility and performance optimization</li>
                                    <li>CMS implementation and customization</li>
                                    <li>Modern frontend frameworks and tools</li>
                                    <li>Server administration and DevOps</li>
                                </ul>
                                <p><em>I still write code because I actually like it, and I&apos;m pretty good at it too.</em></p>
                            </div>

                            <div className={styles.featureCard}>
                                <h3>Systems Administration &amp; Operations</h3>
                                <ul>
                                    <li>Google Workspace administration</li>
                                    <li>Task tracking tools (Jira, Monday.com, etc.)</li>
                                    <li>Version control systems (GitLab, GitHub)</li>
                                    <li>Security audits and compliance</li>
                                    <li>Backup and disaster recovery planning</li>
                                </ul>
                                <p><em>The boring but essential stuff that keeps everything running smoothly.</em></p>
                            </div>

                            <div className={styles.featureCard}>
                                <h3>Progressive Nonprofit Specialization</h3>
                                <ul>
                                    <li>Deep understanding of nonprofit organizational culture</li>
                                    <li>Experience with progressive political campaigns and advocacy</li>
                                    <li>Sensitivity to budget constraints and mission alignment</li>
                                    <li>Knowledge of nonprofit-specific compliance requirements</li>
                                    <li>Understanding of accessibility as a social justice issue</li>
                                </ul>
                                <p><em>I get it. Your mission matters more than the latest JavaScript framework.</em></p>
                            </div>
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