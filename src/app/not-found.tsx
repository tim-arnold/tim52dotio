import Link from 'next/link';
import Image from 'next/image';
import styles from './not-found.module.scss';

export default function NotFound() {
    return (
        <div className={styles.notFound}>
            <div className={styles.cowContainer}>
                <Image
                    src="/images/cow-fullwidth.webp"
                    alt="A disappointed cow from County Kerry, Ireland, judging your navigation skills"
                    width={800}
                    height={533}
                    className={styles.cow}
                    unoptimized
                />
            </div>
            <div className={styles.content}>
                <h1>Page Not Found</h1>
                <p>Sorry, but the page you were trying to find does not exist.</p>

                <p>I am terribly sorry for how that may make you feel, but imagine how the page feels! It was just
                    sitting there, minding its own business, absolutely certain of exactly one single thing:
                    <em>that it was a real page</em>. Now you&apos;ve come along and just flipped the whole damn table over. What
                    now?</p>

                <p>I hope you&apos;re proud of yourself, Curtis.</p>

                <p>Were I you, I&apos;d head to the <Link href="/">homepage</Link>. It is, after all, only one of two
                    pages. The second being the <Link href="/portfolio">portfolio</Link>.</p>

                <p>Honestly, I&apos;m not even sure how you got here.</p>
            </div>
        </div>
    );
}