import React from 'react';

/**
 * TypingIndicator
 *
 * WhatsApp / iMessage style — 3 dots that bounce in a staggered wave.
 * Show this inside an AI chat bubble whenever `isAgentTyping === true`.
 *
 * Usage:
 *   import TypingIndicator from './TypingIndicator';
 *   {isAgentTyping && <TypingIndicator />}
 */
const TypingIndicator = () => {
  return (
    <div className='mr-auto flex flex-col max-w-[80%]'>

      {/* AI label */}
      <p className='font-bold text-[11px] uppercase tracking-wider mb-1.5 text-text-muted'>
        OmniMind AI
      </p>

      {/* Bubble */}
      <div className='
        bg-bg-card dark:bg-[#161722]
        border border-border dark:border-[#2D3042]
        rounded-xl rounded-bl-none
        px-4 py-3
        flex items-center gap-1.5
        w-fit
      '>
        {/* Dot 1 */}
        <span
          className='w-2 h-2 rounded-full bg-blue-400 block'
          style={{
            animation: 'typingBounce 1.2s ease-in-out infinite',
            animationDelay: '0ms',
          }}
        />
        {/* Dot 2 */}
        <span
          className='w-2 h-2 rounded-full bg-blue-400 block'
          style={{
            animation: 'typingBounce 1.2s ease-in-out infinite',
            animationDelay: '200ms',
          }}
        />
        {/* Dot 3 */}
        <span
          className='w-2 h-2 rounded-full bg-blue-400 block'
          style={{
            animation: 'typingBounce 1.2s ease-in-out infinite',
            animationDelay: '400ms',
          }}
        />
      </div>

      {/* Keyframes — scoped inside this component */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.35;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
