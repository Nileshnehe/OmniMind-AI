import React, { useState, useEffect, useRef } from 'react'
import userIcon from '../../../../assets/profile.svg'
import moreVertIcon from '../../../../assets/morevert.svg'
import UserDropdownMenu from './UserDropdownMenu'
import { Sun, Moon } from 'lucide-react'


const UserProfileBlock = ({ isOpen, user, onLogoutTrigger }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && document.documentElement.classList.contains('dark'))) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = (e) => {
    e.stopPropagation();
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className='relative w-full' ref={menuRef}>
      
      {/* 1. THE DROPDOWN MENU */}
      {isMenuOpen && isOpen && (
        <UserDropdownMenu 
          user={user} 
          onLogout={() => {
            setIsMenuOpen(false); 
            onLogoutTrigger();    
          }}
        />
      )}

      {/* 🟢 NOTE: Modal ab yahan render nahi hoga, wo Sidebar sambhal raha hai */}

      {/* Profile Row Main Layer layout */}
      <div className={`flex items-center w-full p-2 rounded-xl text-text-primary hover:bg-surface-hover/60 cursor-pointer group transition-all duration-200 select-none
        ${isOpen ? 'justify-between' : 'justify-center'}
      `}>
        
        <div className='flex items-center gap-3 min-w-0 flex-1'>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-blue-600 text-white flex-shrink-0 shadow-sm">
            {user?.username && user.username !== 'Loading...' ? user.username.charAt(0).toUpperCase() : '?'}
          </div>
          {isOpen && (
            <div className='flex flex-col min-w-0 leading-tight text-left pr-1'>
              <p className='font-semibold text-[14px] tracking-wide truncate w-full capitalize text-text-primary'>
                {user?.username ? user.username : "Loading..."}
              </p>
              <p className='font-medium text-[12px] text-text-muted mt-0.5'>Free</p>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="flex items-center gap-1">
            <div
              onClick={toggleTheme}
              className="group/theme relative w-8 h-8 rounded-md hover:bg-border/40 transition-colors flex items-center justify-center cursor-pointer flex-shrink-0 text-text-primary"
            >
              <div className="transition-all duration-300">
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </div>
              
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-text-primary bg-bg-card border border-border rounded-md opacity-0 group-hover/theme:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              </span>
            </div>

            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`w-8 h-8 rounded-md transition-colors flex items-center justify-center flex-shrink-0
                ${isMenuOpen ? 'bg-border/60 opacity-100' : 'hover:bg-border/40 opacity-70 group-hover:opacity-100'}
              `}
            >
              <img src={moreVertIcon} alt="more" className='w-4 h-4 dark:invert object-contain' />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default UserProfileBlock