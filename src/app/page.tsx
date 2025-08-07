// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import styles from '../styles/components/page.module.scss';
import ParallaxSection from '../components/ParallaxSection';
import ParallaxElement from '../components/ParallaxElement';
import StaggeredFeatures from '../components/StaggeredFeatures';
import FadeImageTransition from '../components/FadeImageTransition';
import GSAPSplitText from '../components/GSAPSplitText';
import StickyBackground from '../components/StickyBackground';
import Link from 'next/link';
import { smoothScrollToTop } from '../utils/smoothScroll';
import { useTransitionNavigation } from '../hooks/useTransitionNavigation';

export default function Home() {
    const { navigate } = useTransitionNavigation();
    
    const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        smoothScrollToTop(1500); // 1.5 seconds for smooth scroll to top
    };

    const handlePortfolioClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        navigate('/portfolio');
    };

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
                {/* Hero Section */}
                <ParallaxSection
                id="hero"
                speed={0}  // No background parallax
                horizontalSpeed={0}  // No horizontal movement
                height="100vh"
                minHeight="70vh"
                className={styles.heroSection}
                role="banner"
                aria-labelledby="hero-heading"
            >
                {/* Sticky cow background that stays fixed until text is near top */}
                <StickyBackground 
                    src="/images/cow-fullwidth.webp"
                    alt="Cow in County Kerry, Ireland"
                    objectPosition="center right"
                    stickyUntilElement="#findme"
                    className={styles.heroCow}
                />
                
                <div className={styles.heroContent}>
                    <ParallaxElement speed={2.2} direction="up">
                        <GSAPSplitText 
                            tag="h1" 
                            id="hero-heading"
                            speed={1.5}
                            stagger={0.02}
                            direction="up"
                        >
                            Welcome to tim52.io
                        </GSAPSplitText>
                        <p>It is website with Tim (but first: a cow).</p>
                        <div className={styles.heroCtas}>
                            <Link href="#hello" className="button" aria-describedby="hero-heading">Doink</Link>
                        </div>
                    </ParallaxElement>
                </div>
            </ParallaxSection>

            {/* About Section */}
                <ParallaxSection
                    id="hello"
                    backgroundColor="var(--background-dark)"
                    height="auto"
                    minHeight="100vh"
                    className={styles.aboutSection}
                    role="region"
                    aria-labelledby="about-heading"
                >
                    <div className={styles.aboutContent}>
                        <ParallaxElement speed={0.3} direction="right" className={styles.aboutText}>
                            <h2 id="about-heading">Hello, I am Tim <small>(he/him)</small></h2>
                            <p>
                                I have been building websites and managing the teams that build websites —
                                mainly at agencies serving non-profit organizations — since 1998. It doesn&#39;t feel that long.</p>
                            <p>
                                <em>I dunno, time is an illusion.</em>
                            </p>
                            <p>Check out this <a href="/portfolio" onClick={handlePortfolioClick}>portfolio of my work</a>.</p>
                            <p>
                                Before that I mostly served delicious coffee drinks to make ends meet
                                while I was playing drums for a bunch of bands in <a href="https://rawheadrex.bandcamp.com/album/tang-o-the-void" target="_blank" rel="noopener noreferrer" aria-label="Rawhead Rex band album on Bandcamp - opens in new window">Eugene</a> (which is in <a href="https://youtu.be/Eo8FmXeuS0A?si=jghw6fvf2gh9Z3fs" target="_blank" rel="noopener noreferrer" aria-label="Oregon reference on YouTube - opens in new window">Oregon</a>), <a href="https://bestkissersintheworld.com/" target="_blank" rel="noopener noreferrer" aria-label="Best Kissers in the World band website - opens in new window">Seattle</a> (duh), and <a href="https://open.spotify.com/album/2dU05NqgZNleqtvpMe8jXO?si=GtpmjeB9SV-hqBm2aHJcPA" target="_blank" rel="noopener noreferrer" aria-label="Cincinnati band album on Spotify - opens in new window">Cincinnati</a> (don&#39;t worry about it).</p>
                            <p>
                                <em>Ohio is also an illusion.</em>
                            </p>
                        </ParallaxElement>

                        {/* In the About Section of page.tsx */}
                        <div className={styles.aboutImage}>
                            <ParallaxElement
                                speed={0.5}
                                direction="left"
                                rotate={true}
                                rotationRange={10}
                                rotationOffset={20}
                                reverseRotation={true}
                            >
                                <FadeImageTransition
                                    image1={{
                                        src: "/images/tim-yelling.webp",
                                        alt: "A very excited young Tim, shouting at the top of his lungs. Photographed by his fathner.",
                                        blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                    }}
                                    image2={{
                                        src: "/images/tim-and-the-wall-square.webp",
                                        alt: "A significantly older Tim who never yells. Photographed by himself."
                                    }}
                                    width={300}
                                    height={300}
                                    className={styles.floatingImage}
                                />
                            </ParallaxElement>
                        </div>

                    </div>
                    <ParallaxElement speed={0.6}>
                        <div className={styles.heroCtas}>
                            <Link href="#cactus" className="button" aria-label="Continue to I am a Cactus section">Ka-Doink</Link>
                        </div>
                    </ParallaxElement>
                </ParallaxSection>

            {/* Features Section */}
            <ParallaxSection
                id="cactus"
                speed={0.3}
                height="auto"
                minHeight="100vh"
                backgroundColor="var(--background-dark)"
                className={styles.featuresSection}
                role="region"
                aria-labelledby="cactus-heading"
            >
                <div className={styles.featuresContent}>
                    <ParallaxElement speed={-0.3} amplify={1.5}>
                        <h2 id="cactus-heading">I am a Cactus</h2>
                    </ParallaxElement>

                    {/* Replace the featuresList div with the StaggeredFeatures component */}
                    <StaggeredFeatures className={styles.featuresList}>
                        {/* Remove the ParallaxElement wrappers from each card */}
                        <div className={styles.featureCard}>
                            <p><strong>My partner</strong> of nearly 30 years and I live with our two dogs in Maryland.
                                She is a therapist and I&apos;m currently in the market for one.</p>
                            <p><em>Am I an illusion?</em></p>
                        </div>

                        <div className={styles.featureCard}>
                            <p><strong>The two kids</strong> are out in the world making lives of their own.</p>
                            <p><em>We delight in seeing them do their things and assure you that both kids are quite real.</em></p>
                        </div>

                        <div className={styles.featureCard}>
                            <p><strong>The photo of the cow</strong> was taken by me in <a href={"https://maps.app.goo.gl/S14myK6WuNNFC1bF8"}>County Kerry, Ireland</a> in July 2023.</p>
                            <p><em>Cows are an illusion and this illusory cow would like you to move along, thank you very much!</em></p>
                        </div>
                    </StaggeredFeatures>
                </div>
                <ParallaxElement speed={0.6}>
                    <div className={styles.heroCtas}>
                        <Link href="#findme" className="button" aria-label="Continue to Where to Find Me section">Dink</Link>
                    </div>
                </ParallaxElement>
            </ParallaxSection>

            {/* Contact Section */}
            <ParallaxSection
                id="findme"
                backgroundColor="var(--primary)"
                height="100vh"
                className={styles.contactSection}
                role="region"
                aria-labelledby="contact-heading"
            >
                <div className={styles.contactContent}>
                    <ParallaxElement speed={0.3}>
                        <h2 id="contact-heading">Where to Find Me</h2>
                    </ParallaxElement>

                    <ParallaxElement speed={0.5}>
                        <div className={styles.socialLinks}>
                            {/* External links with accessibility indicators */}
                            <a href="https://weareoutright.com/" target="_blank" rel="noopener noreferrer" aria-label="Outright work website - opens in new window">Outright (work) <span aria-hidden="true">↗</span></a>
                            <a href="https://instagram.com/tim52pics/" target="_blank" rel="noopener noreferrer" aria-label="Tim's Instagram profile - opens in new window">Instagram (a bit) <span aria-hidden="true">↗</span></a>
                            <a href="https://linkedin.com/in/timarnold/" target="_blank" rel="noopener noreferrer" aria-label="Tim Arnold's LinkedIn profile - opens in new window">LinkedIn (professionally) <span aria-hidden="true">↗</span></a>
                            <a href="https://bsky.app/profile/tim52.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Tim's Bluesky profile - opens in new window">Bluesky (blue moon) <span aria-hidden="true">↗</span></a>
                            <a href="https://twit.social/@tim52" target="_blank" rel="noopener noreferrer" aria-label="Tim's Mastodon profile - opens in new window">Mastodon (long ago) <span aria-hidden="true">↗</span></a>
                            <a href="https://tiktok.com/@tim5.2" target="_blank" rel="noopener noreferrer" aria-label="Tim's TikTok profile - opens in new window">TikTok (no time) <span aria-hidden="true">↗</span></a>
                            <a href="https://insurmountableopportunities.com/" target="_blank" rel="noopener noreferrer" aria-label="Tim's old blog - opens in new window">Old Blog (blog?) <span aria-hidden="true">↗</span></a>
                        </div>
                    </ParallaxElement>
                </div>

                <ParallaxElement speed={0.6}>
                    <div className={styles.heroCtas}>
                        <Link href="#" className="button button-up" aria-label="Return to top of page" onClick={handleScrollToTop}>Woosh</Link>
                    </div>
                </ParallaxElement>
            </ParallaxSection>

            </main>
        </div>
    );
}