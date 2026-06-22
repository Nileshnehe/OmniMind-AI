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
    <div className='mr-auto flex flex-col w-full'>
      {/* AI label */}
      <p className='font-bold text-[11px] uppercase tracking-wider mb-1.5 text-text-muted'>
        OmniMind AI
      </p>

      {/* Bubble */}
      <div className='
        bg-bg-card dark:bg-[#161722]
        border border-border dark:border-[#2D3042]
        rounded-xl rounded-bl-none
        px-4 py-3.5
        flex items-center gap-1.5
        w-fit
      '>
        {/* Dot 1 */}
        <span className='w-2 h-2 rounded-full bg-text-muted block animate-bounce [animation-delay:-0.3s]' />
        {/* Dot 2 */}
        <span className='w-2 h-2 rounded-full bg-text-muted block animate-bounce [animation-delay:-0.15s]' />
        {/* Dot 3 */}
        <span className='w-2 h-2 rounded-full bg-text-muted block animate-bounce' />
      </div>
    </div>
  );
};

export default TypingIndicator;
