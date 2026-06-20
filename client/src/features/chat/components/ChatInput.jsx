import React from 'react'
import { useState } from 'react'

import sendIcon from '../../../assets/send.svg'

const ChatInput = ({ onSendMessage }) => {

  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!text.trim()) return

    onSendMessage(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit}
      className='w-full max-w-3xl mx-auto mb-6 px-4 flex-shrink-0'
    >
      <div className='flex items-center bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] rounded-b-xl px-4 py-3 focus-within:border-text-muted transition-all duration-200'>
        <input
          type="text"
          placeholder='Ask me what you want'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className='flex-1 bg-transparent text-text-primary text-[15px] outline-none placeholder:text-text-muted/60'
        />

        <button
          type="submit"
          className={`py-2 px-1 rounded-lg transition-all duration-200 ${text.trim() ? 'bg-text-primary/10  cursor-pointer opacity-100' : 'opacity-40 cursor-not-allowed'
            }`}
        >
          <img src={sendIcon} alt="send"
            className='w-4 h-4 dark:invert' />
        </button>
      </div>
      <span className='flex items-center justify-center text-text-primary/60 text-[12px]'>OmniMind AI can make mistakes. Check important info.</span>

    </form>
  )
}

export default ChatInput