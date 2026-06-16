import React, { useState } from 'react'
import userIcon from '../../../../assets/profile.svg'
import moreVertIcon from '../../../../assets/morevert.svg'
import UserDropdownMenu from './UserDropdownMenu'


const UserProfileBlock = ({ isOpen, user, onLogoutTrigger }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='relative w-full'>
      
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
          <img src={userIcon} alt="user" className='w-9 h-9 rounded-full object-contain dark:invert flex-shrink-0' />
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
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`p-1 rounded-md transition-colors flex items-center justify-center flex-shrink-0
              ${isMenuOpen ? 'bg-border/60 opacity-100' : 'hover:bg-border/40 opacity-70 group-hover:opacity-100'}
            `}
          >
            <img src={moreVertIcon} alt="more" className='w-4 h-4 dark:invert object-contain' />
          </div>
        )}

      </div>
    </div>
  )
}

export default UserProfileBlock