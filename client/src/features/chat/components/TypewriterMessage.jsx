import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { useFastTypewriter } from '../hooks/useFastTypewriter';

/**
 * TypewriterMessage
 *
 * Streams text in chunks, then switches to full MarkdownRenderer
 * once typing is complete so formatting renders perfectly.
 *
 * Props:
 *   text     – the full AI response string
 *   speed    – ms per tick (default 10)
 *   animate  – false = skip animation, go straight to MarkdownRenderer
 *   onTyping – callback triggered on every text update for auto-scrolling
 */
const TypewriterMessage = ({ text = '', speed = 10, animate = true, onTyping }) => {
  const { displayedText, isDone } = useFastTypewriter(text, speed, animate, onTyping);

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
        className='inline-block w-[2px] h-[1em] bg-current ml-[2px] align-middle rounded-sm animate-pulse'
      />
    </span>
  );
};

export default TypewriterMessage;
