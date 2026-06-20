import React, { useState, useEffect } from 'react'
import Sidebar from '../workspace/components/Sidebar'
import ChatInput from '../components/ChatInput'
import { useChat } from '../hooks/useChat'
import TypewriterMessage from '../components/TypewriterMessage'

/* ─── Gemini-style Thinking Dots ──────────────────────────────── */
const ThinkingDots = () => (
  <div className='bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] mr-auto px-5 py-4 rounded-xl rounded-bl-none max-w-[80%] flex flex-col gap-2 animate-fadeIn'>
    {/* Label */}
    <p className='font-bold text-[11px] uppercase tracking-wider text-text-muted'>OmniMind AI</p>

    {/* Generating line */}
    <div className='flex items-center gap-2'>
      <span className='text-[13px] text-text-muted italic'>Generating answer</span>
      {/* Three bouncing dots */}
      <span className='flex items-end gap-[3px] h-4'>
        <span className='w-[5px] h-[5px] rounded-full bg-blue-400 block'
          style={{ animation: 'bounce-dot 1.2s ease-in-out infinite', animationDelay: '0ms' }} />
        <span className='w-[5px] h-[5px] rounded-full bg-blue-400 block'
          style={{ animation: 'bounce-dot 1.2s ease-in-out infinite', animationDelay: '200ms' }} />
        <span className='w-[5px] h-[5px] rounded-full bg-blue-400 block'
          style={{ animation: 'bounce-dot 1.2s ease-in-out infinite', animationDelay: '400ms' }} />
      </span>
    </div>
  </div>
)

/* ─── Dashboard ───────────────────────────────────────────────── */
const Dashboard = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [userProfile] = useState({ username: 'Loading...' })

  const {
    messages,
    isAgentTyping,
    handleSendMessage,
    handleGetChats,
  } = useChat()

  useEffect(() => {
    handleGetChats()
  }, [handleGetChats])

  // Index of the last AI message — only this one gets typewriter animation
  const lastAiIndex = messages.reduce((last, msg, i) =>
    msg.role !== 'user' ? i : last, -1)

  return (
    <div className='h-screen w-full flex bg-bg-page dark:bg-[#0D0E15] overflow-hidden relative transition-colors duration-200'>

      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} user={userProfile} />

      <div className='flex-1 h-full w-full flex flex-col relative bg-bg-page dark:bg-[#0D0E15] transition-all duration-300'>
        <div className='flex-1 w-full p-6 mx-auto flex flex-col gap-4 overflow-y-auto omnimind-scrollbar'>

          {/* Welcome screen */}
          {messages.length === 0 && !isAgentTyping ? (
            <div className='m-auto text-center select-none'>
              <h1 className='text-3xl font-bold'>Where knowledge begins</h1>
              <p className='text-text-muted text-[15px] mt-1'>Ask OmniMind anything...</p>
            </div>
          ) : (
            <>
              {/* Message bubbles */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[80%] p-3.5 rounded-xl text-[15px] leading-relaxed animate-fadeIn
                    ${message.role === 'user'
                      ? 'bg-surface-hover ml-auto text-text-primary rounded-br-none'
                      : 'bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] mr-auto text-text-primary rounded-bl-none'}
                  `}
                >
                  <p className='font-bold text-[11px] uppercase tracking-wider mb-1 text-text-muted'>
                    {message.role === 'user' ? 'You' : 'OmniMind AI'}
                  </p>
                  <p className='whitespace-pre-wrap break-words leading-relaxed'>
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      <TypewriterMessage
                        text={message.content}
                        speed={18}
                        // Only the very last AI message gets the animation
                        animate={index === lastAiIndex && !isAgentTyping}
                      />
                    )}
                  </p>
                </div>
              ))}

              {/* Phase 1: Gemini-style "Generating answer..." dots */}
              {isAgentTyping && <ThinkingDots />}
            </>
          )}

        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out both;
        }
      `}</style>

    </div>
  )
}

export default Dashboard