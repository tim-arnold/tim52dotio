// src/app/page.tsx
import styles from './page.module.css';
import Navigation from '../components/Navigation';
import ParallaxSection from '../components/ParallaxSection';
import ParallaxElement from '../components/ParallaxElement';
import StaggeredFeatures from '../components/StaggeredFeatures';
import Image from 'next/image';
import Link from 'next/link'; // Add this import

export default function Home() {
    return (
        <div className={styles.page}>
            <Navigation />

            {/* Hero Section */}
            {/* Hero Section */}
            <ParallaxSection
                id="hero"
                backgroundImage="/images/cow-fullwidth.webp"  // Use the cow-16-9.webp image
                backgroundPosition="center right"
                backgroundSize="cover"
                speed={0.5}
                horizontalSpeed={0.3}  // Add horizontal movement (positive value moves right)
                height="70vh"
                minHeight="70vh"
                className={styles.heroSection}
            >
                <div className={styles.heroContent}>
                    <ParallaxElement speed={0.2} direction="up">
                        <h1>Welcome to tim52.io</h1>
                    </ParallaxElement>

                    <ParallaxElement speed={0.4}>
                        <p>It is website with Tim (and a cow).</p>
                    </ParallaxElement>

                    <ParallaxElement speed={0.6}>
                        <div className={styles.heroCtas}>
                            <Link href="#hello" className="button">Doink</Link>
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
            >
                <div className={styles.aboutContent}>
                    <ParallaxElement speed={0.3} direction="right" className={styles.aboutText}>
                        <h2>Hello, I am Tim <small>(he/him)</small></h2>
                        <p>
                            I&apos;m a crotchety 50-something-year-old who has been building websites —
                            mostly for non-profit organizations — since 1998. It feels a lot longer
                            than that, if possible.</p>
                        <p><em>I dunno, time is an illusion</em>.
                        </p>
                        <p>
                            Before that I mostly served delicious coffee drinks to make ends meet
                            while I was playing drums for a bunch of bands in Eugene, Seattle,
                            and Cincinnati.</p>
                        <p><em>Ohio is also an illusion</em>.
                        </p>
                    </ParallaxElement>

                    <div className={styles.aboutImage}>
                        <ParallaxElement speed={0.5} direction="left">
                            <Image
                                src="/images/tim-yelling.webp"
                                alt="About our approach"
                                width={300}
                                height={300}
                                className={styles.floatingImage}
                            />
                        </ParallaxElement>
                    </div>

                </div>
                <ParallaxElement speed={0.6}>
                    <div className={styles.heroCtas}>
                        <Link href="#cactus" className="button">Ka-Doink</Link>
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
            >
                <div className={styles.featuresContent}>
                    <ParallaxElement speed={-0.3} amplify={1.5}>
                        <h2>I am a Cactus</h2>
                    </ParallaxElement>

                    {/* Replace the featuresList div with the StaggeredFeatures component */}
                    <StaggeredFeatures className={styles.featuresList}>
                        {/* Remove the ParallaxElement wrappers from each card */}
                        <div className={styles.featureCard}>
                            <p><strong>My partner</strong> of nearly 30 years and I live with our two dogs in Maryland.
                                She is a therapist and I&apos;m in the market for one.</p>
                            <p><em>Am I an illusion?</em></p>
                        </div>

                        <div className={styles.featureCard}>
                            <p><strong>The kids</strong> (of which there are two) have flown the coop and are building
                                lives of their own out in the world.</p>
                            <p><em>We delight in their company and assure you that both kids are quite real</em>.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <p><strong>The photo of the cow</strong> was taken by me in County Kerry,
                                Ireland in July 2023.</p>
                            <p><em>Cows are an illusion and this illusory cow
                                would like you to move along, thank you very much!</em></p>
                        </div>
                    </StaggeredFeatures>
                </div>
                <ParallaxElement speed={0.6}>
                    <div className={styles.heroCtas}>
                        <Link href="#findme" className="button">Dink</Link>
                    </div>
                </ParallaxElement>
            </ParallaxSection>

            {/* Contact Section */}
            <ParallaxSection
                id="findme"
                backgroundColor="var(--background)"
                height="100vh"
                className={styles.contactSection}
            >
                <div className={styles.contactContent}>
                    <ParallaxElement speed={0.3}>
                        <h2>Where to Find Me</h2>
                    </ParallaxElement>

                    <ParallaxElement speed={0.5}>
                        <div className={styles.socialLinks}>
                            {/* External links can remain as anchor tags */}
                            <a href="https://weareoutright.com/" target="_blank" rel="noopener noreferrer" aria-label="Outight">Outright (work)</a>
                            <a href="https://instagram.com/tim52pics/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
                            <a href="https://linkedin.com/in/timarnold/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
                            <a href="https://bsky.app/profile/tim52.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">Bluesky</a>
                            <a href="https://twit.social/@tim52" target="_blank" rel="noopener noreferrer" aria-label="Mastadon">Mastadon</a>
                            <a href="https://tiktok.com/@tim5.2" target="_blank" rel="noopener noreferrer" aria-label="TikTok">TikTok</a>
                            <a href="https://insurmountableopportunities.com/" target="_blank" rel="noopener noreferrer" aria-label="Old Blog">Old Blog</a>
                        </div>
                    </ParallaxElement>
                </div>

                <ParallaxElement speed={0.6}>
                    <div className={styles.heroCtas}>
                        <Link href="#top" className="button button-up">Woosh</Link>
                    </div>
                </ParallaxElement>
            </ParallaxSection>

            <footer className={styles.footer}>
                <p>© 2024 Tim Arnold. All rights reserved.</p>
            </footer>
        </div>
    );
}