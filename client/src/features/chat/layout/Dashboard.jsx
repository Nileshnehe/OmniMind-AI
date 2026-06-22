import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import Sidebar from '../workspace/components/Sidebar';
import ChatInput from '../components/ChatInput';
import TypewriterMessage from '../components/TypewriterMessage';
import TypingIndicator from '../components/TypingIndicator';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userProfile] = useState({ username: 'Loading...' });

  // ── URL params & navigation ──────────────────────────────────────
  // chatId comes from the URL: /chat/:chatId
  // undefined when on /dashboard or / (no active chat)
  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();

  const {
    messages,
    isLoading,
    isAgentTyping,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  } = useChat();

  // ── Step 1: Fetch sidebar chat list on mount ─────────────────────
  useEffect(() => {
    handleGetChats();
  }, [handleGetChats]);

  // ── Step 2: Hydrate messages from URL on reload ──────────────────
  // When the page refreshes on /chat/:chatId, Redux is empty.
  // This effect reads the chatId from the URL and calls handleOpenChat
  // to fetch and load the messages from the backend automatically.
  useEffect(() => {
    if (urlChatId) {
      handleOpenChat(urlChatId);
    }
  }, [urlChatId]); // Only re-run if the URL chatId changes

  // ── Step 3: Chat selection handler — syncs URL + Redux ──────────
  // Called from Sidebar when user clicks a chat.
  // 1. Updates the URL to /chat/:chatId (persists on reload)
  // 2. Calls handleOpenChat to set Redux state + fetch messages
  const handleChatSelect = useCallback((chatId) => {
    navigate(`/chat/${chatId}`);   // URL update
    handleOpenChat(chatId);         // Redux hydration
  }, [navigate, handleOpenChat]);

  // ── Wrap handleSendMessage to sync URL after new chat creation ───
  const handleSend = useCallback(async (messageText) => {
    const finalChatId = await handleSendMessage(messageText);
    // If a brand new chat was created, update the URL so refresh works
    if (finalChatId && !urlChatId) {
      navigate(`/chat/${finalChatId}`, { replace: true });
    }
  }, [handleSendMessage, navigate, urlChatId]);

  // ── Auto-scroll setup ────────────────────────────────────────────
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  // Trigger auto-scroll on new messages or when agent typing status changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isAgentTyping, scrollToBottom]);

  return (
    <div className='h-screen w-full flex bg-bg-page dark:bg-[#0D0E15] overflow-hidden relative transition-colors duration-200'>

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        user={userProfile}
        onChatSelect={handleChatSelect}
      />

      <div className='flex-1 h-full w-full flex flex-col relative bg-bg-page dark:bg-[#0D0E15] transition-all duration-300'>

        {/* Outermost container with scrollbar on the far right */}
        <div className='flex-1 w-full overflow-y-auto omnimind-scrollbar pt-6'>

          {/* Centered inner content container (matches ChatInput max-w-3xl) */}
          <div className='w-full max-w-3xl mx-auto px-4 flex flex-col gap-4 min-h-full pb-4'>

            {/* ── Welcome Screen ───────────────────────────────────────── */}
            {messages.length === 0 && !isAgentTyping ? (
              <div className='m-auto text-center select-none'>
                <h1 className='text-3xl font-bold'>Where knowledge begins</h1>
                <p className='text-text-muted text-[15px] mt-1'>Ask OmniMind anything...</p>
              </div>
            ) : (
              <>
                {/* ── Message Bubbles ────────────────────────────────── */}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex flex-col p-3.5 rounded-xl text-[15px] leading-relaxed
                      ${message.role === 'user'
                        ? 'bg-surface-hover ml-auto text-text-primary rounded-br-none max-w-[80%] w-fit'
                        : 'bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] mr-auto text-text-primary rounded-bl-none w-full'
                      }`}
                  >
                    <p className='font-bold text-[11px] uppercase tracking-wider mb-1 text-text-muted'>
                      {message.role === 'user' ? 'You' : 'OmniMind AI'}
                    </p>

                    {message.role === 'user' ? (
                      <p className='whitespace-pre-wrap break-words leading-relaxed'>
                        {message.content}
                      </p>
                    ) : (
                      <TypewriterMessage
                        text={message.content}
                        speed={10}
                        // animate only for freshly generated responses, never for history
                        animate={message.isNew && message.role !== 'user'}
                        onTyping={scrollToBottom}
                      />
                    )}
                  </div>
                ))}

                {/* ── TypingIndicator: 3 bouncing dots while AI thinks ── */}
                {(isAgentTyping || isLoading) && <TypingIndicator />}

                {/* Dummy div to scroll into view */}
                <div ref={messagesEndRef} />
              </>
            )}

          </div>
        </div>

        <ChatInput onSendMessage={handleSend} />
      </div>

    </div>
  );
};

export default Dashboard;