'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../styles/components/ContactForm.module.scss';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface ContactFormProps {
    className?: string;
}

declare global {
    interface Window {
        turnstile?: {
            render: (container: string | HTMLElement, options: {
                sitekey: string;
                callback?: (token: string) => void;
                'error-callback'?: () => void;
                theme?: 'light' | 'dark';
                size?: 'normal' | 'compact';
            }) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

export default function ContactForm({ className }: ContactFormProps) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const turnstileRef = useRef<HTMLDivElement>(null);
    const [turnstileWidgetId, setTurnstileWidgetId] = useState<string>('');

    useEffect(() => {
        // Wait for Turnstile to load and render widget
        const renderTurnstile = () => {
            if (window.turnstile && turnstileRef.current) {
                const widgetId = window.turnstile.render(turnstileRef.current, {
                    sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
                    callback: (token: string) => {
                        setTurnstileToken(token);
                    },
                    'error-callback': () => {
                        setTurnstileToken('');
                    },
                    theme: 'light',
                    size: 'normal'
                });
                setTurnstileWidgetId(widgetId);
            }
        };

        if (window.turnstile) {
            renderTurnstile();
        } else {
            // Wait for script to load
            const checkTurnstile = setInterval(() => {
                if (window.turnstile) {
                    renderTurnstile();
                    clearInterval(checkTurnstile);
                }
            }, 100);

            return () => clearInterval(checkTurnstile);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!turnstileToken) {
            alert('Please complete the verification challenge.');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    turnstileToken
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTurnstileToken('');
                // Reset Turnstile widget
                if (window.turnstile && turnstileWidgetId) {
                    window.turnstile.reset(turnstileWidgetId);
                }
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim() && turnstileToken;

    return (
        <div className={`${styles.contactForm} ${className || ''}`}>
            <h3>Get in Touch</h3>
            <p>Have a project in mind? Let&apos;s chat about it.</p>
            
            {submitStatus === 'success' && (
                <div className={styles.successMessage} role="alert">
                    Thanks for your message! I&apos;ll get back to you soon.
                </div>
            )}
            
            {submitStatus === 'error' && (
                <div className={styles.errorMessage} role="alert">
                    Something went wrong. Please try again or email me directly at tim@tim52.io
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className={styles.formGroup}>
                    <label htmlFor="name">
                        Name <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        aria-describedby="name-error"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">
                        Email <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        aria-describedby="email-error"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="message">
                        Message <span className={styles.required}>*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        rows={4}
                        aria-describedby="message-error"
                    />
                </div>

                <div className={styles.turnstileContainer}>
                    <div ref={turnstileRef}></div>
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}