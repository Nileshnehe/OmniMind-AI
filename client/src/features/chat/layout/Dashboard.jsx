import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Copy, Check, Pencil } from 'lucide-react';
import Sidebar from '../workspace/components/Sidebar';
import ChatInput from '../components/ChatInput';
import TypewriterMessage from '../components/TypewriterMessage';
import TypingIndicator from '../components/TypingIndicator';
import { useChat } from '../hooks/useChat';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userProfile] = useState({ username: 'Loading...' });

  // ── Interaction States ───────────────────────────────────────────
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editContent, setEditContent] = useState('');

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

  // ── Message Actions ──────────────────────────────────────────────
  const handleCopy = useCallback((index, content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(index);
    setTimeout(() => setCopiedMessageId(null), 2000);
  }, []);

  const handleEditClick = useCallback((index, content) => {
    setEditingMessageIndex(index);
    setEditContent(content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMessageIndex(null);
    setEditContent('');
  }, []);

  const handleUpdateMessage = useCallback((index, newContent) => {
    console.log("Update message", index, newContent);
    // Add logic here to update message via API / Redux if implemented
    handleCancelEdit();
  }, [handleCancelEdit]);

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
                <h1 className='text-3xl font-bold text-text-primary'>Where knowledge begins</h1>
                <p className='text-text-muted text-[15px] mt-1'>Ask OmniMind anything...</p>
              </div>
            ) : (
              <>
                {/* ── Message Bubbles ────────────────────────────────── */}
                {messages.map((message, index) => {
                  const isLastUserMessage = message.role === 'user' && index === messages.map(m => m.role).lastIndexOf('user');

                  return (
                  <div
                    key={index}
                    className={`flex flex-col text-[15px] leading-relaxed
                      ${message.role === 'user'
                        ? 'group relative ml-auto max-w-[80%] w-fit'
                        : 'group relative mr-auto text-text-primary w-full py-3'
                      }`}
                  >
                    {message.role === 'user' ? (
                      editingMessageIndex === index ? (
                        <div className="flex flex-col gap-2 w-full min-w-[300px] mb-4">
                          <textarea
                            className="w-full min-h-[100px] p-3 rounded-2xl bg-surface-hover/50 dark:bg-surface/50 border border-border dark:border-[#2D3042] text-text-primary focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={handleCancelEdit} className="px-4 py-2 rounded-full text-sm font-medium text-text-muted hover:bg-surface-hover transition-colors">Cancel</button>
                            <button 
                              onClick={() => handleUpdateMessage(index, editContent)}
                              disabled={!editContent.trim()}
                              className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-surface-hover text-text-primary p-3.5 rounded-xl rounded-br-none flex flex-col">
                            <p className='font-bold text-[11px] uppercase tracking-wider mb-1 text-text-muted'>
                              You
                            </p>
                            <p className='whitespace-pre-wrap break-words leading-relaxed'>
                              {message.content}
                            </p>
                          </div>
                          
                          {/* User Hover Actions */}
                          <div className="absolute -bottom-9 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-page dark:bg-[#0D0E15] p-1 rounded-lg border border-border dark:border-[#2D3042] shadow-sm z-10">
                            {isLastUserMessage && (
                              <button onClick={() => handleEditClick(index, message.content)} className="p-1.5 hover:bg-surface-hover rounded-md text-text-muted hover:text-text-primary transition-colors" title="Edit message">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => handleCopy(index, message.content)} className="p-1.5 hover:bg-surface-hover rounded-md text-text-muted hover:text-text-primary transition-colors" title="Copy text">
                              {copiedMessageId === index ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </>
                      )
                    ) : (
                      <>
                        <p className='font-bold text-[11px] uppercase tracking-wider mb-1 text-text-muted'>
                          OmniMind AI
                        </p>
                        <TypewriterMessage
                          text={message.content}
                          speed={10}
                          // animate only for freshly generated responses, never for history
                          animate={message.isNew && message.role !== 'user'}
                          onTyping={scrollToBottom}
                        />
                        
                        {/* AI Actions */}
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleCopy(index, message.content)} className="p-1.5 hover:bg-surface-hover rounded-full text-text-muted hover:text-text-primary transition-colors" title="Copy text">
                            {copiedMessageId === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  );
                })}

                {/* ── TypingIndicator: 3 bouncing dots while AI thinks ── */}
                {(isAgentTyping || isLoading) && <TypingIndicator />}

                {/* Dummy div to scroll into view */}
                <div ref={messagesEndRef} />
              </>
            )}

          </div>
        </div>

        <ChatInput onSendMessage={handleSend} isLoading={isLoading || isAgentTyping} />
      </div>

    </div>
  );
};

export default Dashboard;