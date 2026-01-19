'use client';

import { useState } from 'react';
import AskAI from './AskAI';
import FitAssessment from './FitAssessment';
import styles from '../styles/components/AIInterface.module.scss';

type Tab = 'chat' | 'fit';

interface AIInterfaceProps {
  className?: string;
  defaultTab?: Tab;
}

export default function AIInterface({ className, defaultTab = 'chat' }: AIInterfaceProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  return (
    <div className={`${styles.aiInterface} ${className || ''}`}>
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'chat'}
          aria-controls="chat-panel"
          className={`${styles.tab} ${activeTab === 'chat' ? styles.active : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Ask AI About Me
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'fit'}
          aria-controls="fit-panel"
          className={`${styles.tab} ${activeTab === 'fit' ? styles.active : ''}`}
          onClick={() => setActiveTab('fit')}
        >
          Fit Assessment
        </button>
      </div>

      <div className={styles.tabContent}>
        <div
          id="chat-panel"
          role="tabpanel"
          aria-labelledby="chat-tab"
          hidden={activeTab !== 'chat'}
        >
          {activeTab === 'chat' && <AskAI />}
        </div>
        <div
          id="fit-panel"
          role="tabpanel"
          aria-labelledby="fit-tab"
          hidden={activeTab !== 'fit'}
        >
          {activeTab === 'fit' && <FitAssessment />}
        </div>
      </div>
      <p className={styles.privacyNotice}>
        Your input is not stored. Content is processed through Anthropic&apos;s Claude API subject to their <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
      </p>
    </div>
  );
}