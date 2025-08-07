import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
    name: string;
    email: string;
    message: string;
    turnstileToken: string;
}

async function verifyTurnstile(token: string): Promise<boolean> {
    const formData = new FormData();
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY || '');
    formData.append('response', token);

    try {
        const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        const outcome = await result.json();
        return outcome.success;
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, email, message, turnstileToken }: ContactFormData = await request.json();

        // Validate required fields
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Verify Turnstile token
        if (!turnstileToken) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            );
        }

        const isValidToken = await verifyTurnstile(turnstileToken);
        if (!isValidToken) {
            return NextResponse.json(
                { error: 'Verification failed' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Send email using Resend
        const emailData = {
            from: 'Contact Form <noreply@tim52.io>',
            to: ['tim@tim52.io'],
            subject: `New contact form message from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; margin: 1rem 0;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <hr>
                <p style="color: #666; font-size: 0.9em;">
                    This message was sent from the contact form at tim52.io
                </p>
            `,
            text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from the contact form at tim52.io
            `,
        };

        await resend.emails.send(emailData);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Contact form submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}