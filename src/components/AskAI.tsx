'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from '../styles/components/AskAI.module.scss';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AskAIProps {
  className?: string;
}

const SUGGESTED_QUESTIONS = [
  "Tell me about Tim's WordPress expertise",
  "What's Tim's experience with AI development?",
  "How has Tim led tech teams at agencies?",
];

const HEADER_HEIGHT = 80; // Account for sticky header

export default function AskAI({ className }: AskAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollContainerToTop = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - HEADER_HEIGHT;
      window.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, []);

  // Scroll the chat pane to show the latest message at the top
  const scrollChatToLastMessage = useCallback(() => {
    if (chatContainerRef.current && lastMessageRef.current) {
      const container = chatContainerRef.current;
      const lastMessage = lastMessageRef.current;
      // Calculate position relative to the scroll container
      const containerRect = container.getBoundingClientRect();
      const messageRect = lastMessage.getBoundingClientRect();
      const scrollOffset = messageRect.top - containerRect.top + container.scrollTop;
      // Scroll with a small padding from top
      container.scrollTo({
        top: Math.max(0, scrollOffset - 16),
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollContainerToTop();
      // Small delay to let the DOM update before scrolling chat pane
      setTimeout(scrollChatToLastMessage, 100);
    }
  }, [messages, scrollContainerToTop, scrollChatToLastMessage]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div ref={containerRef} className={`${styles.askAI} ${className || ''}`}>
      <div ref={chatContainerRef} className={styles.chatContainer}>
        {messages.length === 0 ? (
          <div className={styles.welcome}>
            <p>What would you like to know?</p>
            <div className={styles.suggestedQuestions}>
              <p className={styles.suggestedLabel}>Try asking:</p>
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  className={styles.suggestedButton}
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              return (
                <div
                  key={index}
                  ref={isLastMessage ? lastMessageRef : null}
                  className={`${styles.message} ${styles[message.role]}`}
                >
                  <div className={styles.messageContent} style={{ textAlign: 'left' }}>
                    {message.content}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <span className={styles.typing}>Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={isLoading}
          aria-label="Ask a question about Tim"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send message"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}