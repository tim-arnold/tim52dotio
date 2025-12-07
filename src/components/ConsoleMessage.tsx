'use client';

import { useEffect } from 'react';

export default function ConsoleMessage() {
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
    }, []);

    return null; // This component doesn't render anything
}