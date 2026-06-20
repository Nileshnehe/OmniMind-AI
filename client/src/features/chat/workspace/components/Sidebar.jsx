import { useNavigate } from 'react-router';
import React, { useState } from 'react'; 
import RecentActivity from './RecentActivity';
import RecentChat from './RecentChat';
import UserProfileBlock from './UserProfileBlock';
import LogoutModal from './LogoutModal'; 
import { useAuth } from '../../../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';

import toggleIcon from '../../../../assets/sideNavigation.svg';
import newChatIcon from '../../../../assets/rename.svg';
import downArrowIcon from '../../../../assets/arrowdown.svg';
import searchIcon from '../../../../assets/search.svg';
import moreVertIcon from '../../../../assets/morevert.svg';


const Sidebar = ({ isOpen, onToggle, onChatSelect }) => { 
  const { logout, user } = useAuth(); 
  const { chats } = useChat();
  const navigate = useNavigate();
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
            onClick={() => navigate('/dashboard')}
            className={`flex items-center h-11 text-text-primary rounded-lg cursor-pointer transition-all duration-200 text-[14px] font-medium group w-full flex-shrink-0
              ${isOpen ? 'px-3 gap-3.5 justify-start bg-surface-hover/50 hover:bg-surface-hover' : 'p-0 justify-center hover:bg-surface-hover/80'}
            `}>
            <img src={newChatIcon} alt="new-chat" className='w-5 h-5 min-w-[20px] min-h-[20px] dark:invert opacity-70 group-hover:opacity-100 transition-opacity object-contain flex-shrink-0' />
            {isOpen && <span className='truncate animate-fade-in'>New Chat</span>}
          </button>

          {/* Button 2: Search */}
          <button className={`flex items-center h-11 text-text-primary rounded-lg cursor-pointer transition-all duration-200 text-[14px] font-medium group w-full flex-shrink-0
            ${isOpen ? 'px-3 gap-3.5 justify-start hover:bg-surface-hover' : 'p-0 justify-center hover:bg-surface-hover/80'}
          `}>
            <img src={searchIcon} alt="search" className='w-5 h-5 min-w-[20px] min-h-[20px] dark:invert opacity-70 group-hover:opacity-100 transition-opacity object-contain flex-shrink-0' />
            {isOpen && <span className='truncate animate-fade-in'>Search</span>}
          </button>
        </div>
      </div>

      {/* MIDDLE CONTAINER: SCROLLER */}
      <div className={`flex-1 overflow-y-auto pr-1 mt-2 omnimind-scroller w-full ${isOpen ? 'block' : 'hidden'}`}>
        <RecentActivity title='Recent' icon={downArrowIcon} isOpen={isOpen}>
          {/* Render actual chats from Redux */}
          {Object.values(chats).map((chat) => (
            <RecentChat
              key={chat.id}
              title={chat.title}
              icon={moreVertIcon}
              onClick={() => onChatSelect && onChatSelect(chat.id)}
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

    </div>
  )
}

export default Sidebar;