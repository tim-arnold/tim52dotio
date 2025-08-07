'use client';

import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/components/ThemeToggle.module.scss';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  
  // This will be null on the server and during hydration
  let theme, setTheme;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    setTheme = themeContext.setTheme;
  } catch {
    // ThemeProvider not available (SSR)
    theme = 'light';
    setTheme = () => {};
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server or during hydration mismatch
  if (!mounted) {
    return (
      <button
        className={styles.themeToggle}
        aria-label="Theme toggle (loading)"
        title="Theme toggle (loading)"
        type="button"
        disabled
      >
        <span className={styles.icon} aria-hidden="true">
          ☀️
        </span>
        <span className={styles.label}>
          Light
        </span>
      </button>
    );
  }

  const handleToggle = () => {
    // Simple toggle between light and dark
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getAriaLabel = () => {
    return theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  };

  const getIcon = () => {
    return theme === 'light' ? '☀️' : '🌙';
  };

  return (
    <button
      className={styles.themeToggle}
      onClick={handleToggle}
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
      type="button"
    >
      <span className={styles.icon} aria-hidden="true">
        {getIcon()}
      </span>
      <span className={styles.label}>
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}