import React, { useState, useRef, useEffect } from 'react'

import sendIcon from '../../../assets/send.svg'

const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to allow shrinking
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }

  // Adjust height whenever text changes (especially for clearing the input)
  useEffect(() => {
    adjustHeight();
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (!text.trim()) return

    onSendMessage(text)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit}
      className='w-full max-w-3xl mx-auto mb-6 px-4 flex-shrink-0 flex flex-col'
    >
      <div className='flex items-end bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] rounded-2xl px-4 py-2.5 focus-within:border-text-muted transition-all duration-200'>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder='Ask me what you want'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className='flex-1 bg-transparent text-text-primary text-[15px] outline-none placeholder:text-text-muted/60 resize-none max-h-60 overflow-y-auto omnimind-scrollbar py-1.5 leading-relaxed'
          style={{ minHeight: '24px' }}
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className={`py-2 px-2 ml-2 rounded-lg transition-all duration-200 mb-0.5 ${text.trim() ? 'bg-text-primary/10 cursor-pointer opacity-100 hover:bg-text-primary/20' : 'opacity-40 cursor-not-allowed'
            }`}
        >
          <img src={sendIcon} alt="send"
            className='w-4 h-4 dark:invert' />
        </button>
      </div>
      <span className='flex items-center justify-center text-text-primary/60 text-[12px] mt-3'>OmniMind AI can make mistakes. Check important info.</span>

    </form>
  )
}

export default ChatInput