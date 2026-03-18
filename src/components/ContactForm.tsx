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

// Generate a unique ID for this component instance
const TURNSTILE_CONTAINER_ID = 'turnstile-container-global';

export default function ContactForm({ className }: ContactFormProps) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const formRef = useRef<HTMLDivElement>(null);
    const turnstileRef = useRef<HTMLDivElement>(null);
    const [turnstileWidgetId, setTurnstileWidgetId] = useState<string>('');
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
    const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        const loadTurnstileScript = () => {
            if (document.querySelector('script[src*="turnstile"]')) return;
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
            script.async = true;
            document.head.appendChild(script);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadTurnstileScript();
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (formRef.current) observer.observe(formRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Wait for Turnstile to load and render widget
        const renderTurnstile = () => {
            if (window.turnstile && turnstileRef.current) {
                // Clear any existing widgets in this container
                turnstileRef.current.innerHTML = '';
                
                // Check if there are any existing Turnstile widgets globally and remove them
                const existingWidgets = document.querySelectorAll('[data-cf-turnstile-widget]');
                existingWidgets.forEach(widget => {
                    if (widget.parentNode) {
                        widget.parentNode.removeChild(widget);
                    }
                });
                
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

        // Cleanup function to remove widget on unmount
        return () => {
            // Clear any existing Turnstile widgets globally on cleanup
            const existingWidgets = document.querySelectorAll('[data-cf-turnstile-widget]');
            existingWidgets.forEach(widget => {
                if (widget.parentNode) {
                    widget.parentNode.removeChild(widget);
                }
            });
            
            // Clear the specific container
            const container = document.getElementById(TURNSTILE_CONTAINER_ID);
            if (container) {
                container.innerHTML = '';
            }
        };
    }, []); // Empty dependency array is intentional

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            case 'message':
                if (!value.trim()) return 'Message is required';
                if (value.trim().length < 10) return 'Message must be at least 10 characters';
                return '';
            default:
                return '';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate field if it's been touched
        if (touchedFields[name]) {
            const error = validateField(name, value);
            setFieldErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouchedFields(prev => ({
            ...prev,
            [name]: true
        }));

        const error = validateField(name, value);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const getFieldValidationClass = (fieldName: string): string => {
        if (!touchedFields[fieldName]) return '';
        const hasError = fieldErrors[fieldName];
        const hasValue = formData[fieldName as keyof ContactFormData]?.trim();
        
        if (hasError) return styles.error;
        if (hasValue) return styles.valid;
        return '';
    };

    const getValidationIcon = (fieldName: string): string => {
        if (!touchedFields[fieldName]) return '*';
        const hasError = fieldErrors[fieldName];
        const hasValue = formData[fieldName as keyof ContactFormData]?.trim();
        
        if (hasError) return '*';
        if (hasValue) return '✓';
        return '*';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate all fields
        const errors: {[key: string]: string} = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field as keyof ContactFormData]);
            if (error) errors[field] = error;
        });

        // Mark all fields as touched
        setTouchedFields({
            name: true,
            email: true,
            message: true
        });

        setFieldErrors(errors);

        // Check if there are validation errors
        if (Object.keys(errors).length > 0) {
            return;
        }
        
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
                setFieldErrors({});
                setTouchedFields({});
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
        <div ref={formRef} className={`${styles.contactForm} ${className || ''}`}>
            <div className={styles.formLayout}>
            <div className={styles.formLabel}>
                <h2>Ready to Stop Wrestling with Technology?</h2>
                <p>
                    Whether you need someone to lead your tech team, build your website,
                    or just figure out why nothing works the way it&apos;s supposed to —
                    I&apos;m here to help. Currently available for fractional or project-based work.
                </p>
            </div>
            <div className={styles.formContent}>
            
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
                        Name <span className={`${styles.required} ${getFieldValidationClass('name') === styles.valid ? styles.valid : ''}`}>
                            {getValidationIcon('name')}
                        </span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        required
                        disabled={isSubmitting}
                        className={getFieldValidationClass('name')}
                        aria-describedby={fieldErrors.name ? "name-error" : undefined}
                        aria-invalid={!!fieldErrors.name}
                    />
                    {fieldErrors.name && (
                        <div id="name-error" className={styles.errorText} role="alert">
                            {fieldErrors.name}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">
                        Email <span className={`${styles.required} ${getFieldValidationClass('email') === styles.valid ? styles.valid : ''}`}>
                            {getValidationIcon('email')}
                        </span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        required
                        disabled={isSubmitting}
                        className={getFieldValidationClass('email')}
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                        aria-invalid={!!fieldErrors.email}
                    />
                    {fieldErrors.email && (
                        <div id="email-error" className={styles.errorText} role="alert">
                            {fieldErrors.email}
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="message">
                        Message <span className={`${styles.required} ${getFieldValidationClass('message') === styles.valid ? styles.valid : ''}`}>
                            {getValidationIcon('message')}
                        </span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={handleFieldBlur}
                        required
                        disabled={isSubmitting}
                        rows={4}
                        className={getFieldValidationClass('message')}
                        aria-describedby={fieldErrors.message ? "message-error" : undefined}
                        aria-invalid={!!fieldErrors.message}
                    />
                    {fieldErrors.message && (
                        <div id="message-error" className={styles.errorText} role="alert">
                            {fieldErrors.message}
                        </div>
                    )}
                </div>

                <div className={styles.turnstileContainer}>
                    <div ref={turnstileRef} id={TURNSTILE_CONTAINER_ID}></div>
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
            </div>{/* formContent */}
            </div>{/* formLayout */}
        </div>
    );
}