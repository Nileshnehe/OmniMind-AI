import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import RecentChat from './RecentChat';

const SearchChats = ({ isOpen, onClose, chats, onChatSelect, handleDeleteChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Allow Ctrl+Shift+K to focus input even if modal is already open
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const chatList = Object.values(chats || {});
  const filteredChats = searchQuery
    ? chatList.filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chatList;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] rounded-xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-5 border-b border-border dark:border-[#2D3042]">
          <Search className="w-7 h-7 text-text-muted mr-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-text-primary text-xl font-medium outline-none placeholder:text-text-muted"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-3 max-h-[60vh] overflow-y-auto omnimind-scroller bg-bg-page/50 dark:bg-[#0D0E15]/50">
          {searchQuery && filteredChats.length === 0 ? (
            <div className="py-12 text-center text-text-muted text-lg">
              No chats found matching "{searchQuery}"
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {!searchQuery && chatList.length > 0 && (
                <div className="px-4 py-3 text-sm font-semibold text-text-muted uppercase tracking-wider">
                  Recent
                </div>
              )}
              {filteredChats.map(chat => (
                <RecentChat
                  key={chat.id}
                  chatId={chat.id}
                  title={chat.title}
                  createdAt={chat.createdAt || chat.lastUpdated}
                  onClick={() => {
                    onChatSelect(chat.id);
                    onClose();
                  }}
                  onDelete={(id) => handleDeleteChat(id)}
                  showDate={true}

                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchChats;
