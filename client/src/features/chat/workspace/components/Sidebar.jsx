import { useNavigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import RecentActivity from './RecentActivity';
import RecentChat from './RecentChat';
import UserProfileBlock from './UserProfileBlock';
import LogoutModal from './LogoutModal';
import SearchChats from './SearchChats';
import { useAuth } from '../../../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { useDispatch } from 'react-redux';
import { setCurrentChatId } from '../../../../store/slices/chat.slice';
import { Plus } from 'lucide-react';

import toggleIcon from '../../../../assets/sideNavigation.svg';
import downArrowIcon from '../../../../assets/arrowdown.svg';
import searchIcon from '../../../../assets/search.svg';


const Sidebar = ({ isOpen, onToggle, onChatSelect }) => {
  const { logout, user } = useAuth();
  const { chats, handleDeleteChat } = useChat();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  // Single source of truth: which chat's options menu is currently open.
  // Setting a new id auto-closes the previously open one.
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // New Chat Shortcut
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        dispatch(setCurrentChatId(null));
        navigate('/dashboard');
      }
      // Search Shortcut
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, navigate]);

  // Actual confirm logout handler
  const handleConfirmLogout = async () => {
    await logout(); // Redux aur backend clean karega
    setIsLogoutModalOpen(false); // Modal close karega
    navigate('/login')
  };

  return (
    <div className={`h-screen bg-bg-card dark:bg-[#161722] flex flex-col py-4 px-2 border-r border-border dark:border-[#2D3042] select-none transition-all duration-300 ease-in-out items-center
      ${isOpen ? 'w-80' : 'w-16'}
    `}>

      {/* Sidebar Top */}
      <div className='flex flex-col flex-shrink-0 mb-4 w-full items-center'>
        {/* Logo + Toggle Section */}
        <div className={`text-text-primary font-bold flex items-center mb-5 h-10 w-full leading-6 
          ${isOpen ? 'justify-between pr-2 pl-2' : 'justify-center'}
        `}>
          {isOpen && (
            <span className='hover:bg-surface-hover px-2 py-1.5 rounded-lg cursor-pointer transition-all tracking-wide truncate'>
              OmniMind AI
            </span>
          )}

          <img
            onClick={onToggle}
            src={toggleIcon}
            alt="toggle-icon"
            className='hover:bg-text-muted/10 dark:hover:bg-surface-hover/30 p-2 w-9 h-9 rounded-lg cursor-pointer dark:invert opacity-80 hover:opacity-100 transition-all duration-200 flex-shrink-0'
          />
        </div>

        {/* Navigation Menu */}
        <div className='flex flex-col gap-1.5 px-1 w-full items-center'>
          {/* Button 1: New Chat */}
          <button
            onClick={() => {
              dispatch(setCurrentChatId(null));
              navigate('/dashboard');
            }}
            className={`relative flex items-center h-11 text-text-primary rounded-lg cursor-pointer transition-all duration-200 text-[14px] font-medium group w-full flex-shrink-0
              ${isOpen ? 'px-3 gap-3.5 justify-start bg-surface-hover/50 hover:bg-surface-hover' : 'p-0 justify-center hover:bg-surface-hover/80'}
            `}>
            <Plus className='w-5 h-5 min-w-[20px] min-h-[20px] opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0' />
            {isOpen && <span className='truncate animate-fade-in'>New Chat</span>}

            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-bg-card border border-border text-text-primary text-[12px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-50">
              Ctrl+Shift+O
            </div>
          </button>

          {/* Button 2: Search */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className={`relative flex items-center h-11 text-text-primary rounded-lg cursor-pointer transition-all duration-200 text-[14px] font-medium group w-full flex-shrink-0
            ${isOpen ? 'px-3 gap-3.5 justify-start hover:bg-surface-hover' : 'p-0 justify-center hover:bg-surface-hover/80'}
          `}>
            <img src={searchIcon} alt="search" className='w-5 h-5 min-w-[20px] min-h-[20px] dark:invert opacity-70 group-hover:opacity-100 transition-opacity object-contain flex-shrink-0' />
            {isOpen && <span className='truncate animate-fade-in'>Search</span>}

            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-bg-card border border-border text-text-primary text-[12px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-50">
              Ctrl+Shift+K
            </div>
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto pr-1 mt-2 omnimind-scroller w-full ${isOpen ? 'block' : 'hidden'}`}>
        <RecentActivity title='Recent' icon={downArrowIcon} isOpen={isOpen}>
          {Object.values(chats).map((chat) => (
            <RecentChat
              key={chat.id}
              chatId={chat.id}
              title={chat.title}
              createdAt={chat.createdAt || chat.lastUpdated}
              onClick={() => {
                setActiveDropdownId(null); // Close any open menu on chat open
                onChatSelect?.(chat.id);
              }}
              isMenuOpen={activeDropdownId === chat.id}
              onMenuToggle={() =>
                // Toggle: if already open close it; if closed open it (closing any other)
                setActiveDropdownId(prev => prev === chat.id ? null : chat.id)
              }
              onMenuClose={() => setActiveDropdownId(null)}
              onDelete={(id) => handleDeleteChat(id)}
              onRename={(id) => console.log('Rename', id)} // wire up rename when ready
            />
          ))}
        </RecentActivity>
      </div>

      {/* Sidebar Bottom */}
      <div className='mt-auto pt-2 border-t border-border/40 flex-shrink-0 w-full px-1'>

        <UserProfileBlock
          isOpen={isOpen}
          user={user}
          onLogoutTrigger={() => setIsLogoutModalOpen(true)}
        />
      </div>


      {isLogoutModalOpen && (
        <LogoutModal
          user={user}
          onConfirm={handleConfirmLogout}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}

      <SearchChats
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        chats={chats}
        onChatSelect={onChatSelect}
        handleDeleteChat={handleDeleteChat}
      />
    </div>
  )
}

export default Sidebar;