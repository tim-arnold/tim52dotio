'use client';

import { useState } from 'react';
import styles from '../styles/components/FitAssessment.module.scss';

interface FitVerdict {
  verdict: 'strong_fit' | 'worth_conversation' | 'probably_not';
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
}

interface FitAssessmentProps {
  className?: string;
}

const VERDICT_CONFIG = {
  strong_fit: {
    label: 'Strong Fit',
    emoji: '✓',
    className: 'strongFit',
  },
  worth_conversation: {
    label: 'Worth a Conversation',
    emoji: '?',
    className: 'worthConversation',
  },
  probably_not: {
    label: 'Probably Not the Right Fit',
    emoji: '✗',
    className: 'probablyNot',
  },
};

export default function FitAssessment({ className }: FitAssessmentProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [assessment, setAssessment] = useState<FitVerdict | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setError('Please paste a complete job description (at least 50 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAssessment(null);

    try {
      const response = await fetch('/api/fit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze job description');
      }

      setAssessment(data.assessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setAssessment(null);
    setError(null);
  };

  const verdictConfig = assessment ? VERDICT_CONFIG[assessment.verdict] : null;

  return (
    <div className={`${styles.fitAssessment} ${className || ''}`}>
      <div className={styles.header}>
        <h3>Fit Assessment</h3>
        <p>Paste a job description and AI will give you an honest assessment of whether Tim might be the right fit. Tim never sees what you submit.</p>
      </div>

      {!assessment ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            disabled={isLoading}
            rows={10}
            aria-label="Job description"
          />

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !jobDescription.trim()}
            className={styles.submitButton}
          >
            {isLoading ? 'Analyzing...' : 'Assess Fit'}
          </button>
        </form>
      ) : (
        <div className={styles.result}>
          <div className={`${styles.verdict} ${styles[verdictConfig?.className || '']}`}>
            <span className={styles.verdictEmoji}>{verdictConfig?.emoji}</span>
            <span className={styles.verdictLabel}>{verdictConfig?.label}</span>
          </div>

          <div className={styles.summary}>
            <p>{assessment.summary}</p>
          </div>

          {assessment.strengths.length > 0 && (
            <div className={styles.section}>
              <h4>Where I&apos;d Add Value</h4>
              <ul>
                {assessment.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}

          {assessment.gaps.length > 0 && (
            <div className={styles.section}>
              <h4>Gaps to Consider</h4>
              <ul>
                {assessment.gaps.map((gap, index) => (
                  <li key={index}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.recommendation}>
            <h4>Recommendation</h4>
            <p>{assessment.recommendation}</p>
          </div>

          <button
            onClick={handleReset}
            className={styles.resetButton}
          >
            Try Another Role
          </button>
        </div>
      )}
    </div>
  );
}
