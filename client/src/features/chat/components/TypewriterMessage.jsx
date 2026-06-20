import React, { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

/**
 * TypewriterMessage
 *
 * Streams text character by character, then switches to full MarkdownRenderer
 * once typing is complete so formatting renders perfectly.
 *
 * WHY this pattern?
 *   Parsing markdown on a partial string causes flickering (e.g. an unclosed
 *   **bold** splits into raw asterisks mid-animation). The best practice is:
 *     Phase 1 – Stream raw text (plain, no markdown parsing)
 *     Phase 2 – Swap to MarkdownRenderer once the full string is ready
 *
 * Props:
 *   text    – the full AI response string
 *   speed   – ms per character (default 15)
 *   animate – false = skip animation, go straight to MarkdownRenderer
 */
const TypewriterMessage = ({ text = '', speed = 15, animate = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // No animation → jump straight to markdown render
    if (!animate) {
      setDisplayedText(text);
      setIsDone(true);
      return;
    }

    // Reset for new message
    setDisplayedText('');
    setIsDone(false);
    indexRef.current = 0;

    if (!text) return;

    const interval = setInterval(() => {
      const i = indexRef.current;
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        indexRef.current += 1;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, animate, speed]);

  // ── Phase 2: typing done → full markdown ──────────────────────
  if (isDone) {
    return <MarkdownRenderer content={text} />;
  }

  // ── Phase 1: streaming raw text (no markdown parsing yet) ─────
  return (
    <span className='whitespace-pre-wrap break-words'>
      {displayedText}
      {/* Blinking cursor while streaming */}
      <span
        className='inline-block w-[2px] h-[1em] bg-current ml-[2px] align-middle rounded-sm'
        style={{ animation: 'cursorBlink 0.7s step-end infinite' }}
      />
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export default TypewriterMessage;
