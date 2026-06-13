import React from 'react'
import userIcon from '../../../../assets/profile.svg'
import moreVertIcon from '../../../../assets/morevert.svg'


import UserDropdownMenu from './UserDropdownMenu'
import { authServices } from '../../../auth/services/auth.service'
import LogoutModal from './LogoutModal'
import { useState } from 'react'
import { useNavigate } from 'react-router'


const UserProfileBlock = ({ isOpen, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // ⚡ Modal visible toggle control state parameters
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // 🚀 ACTIVE REAL LOGOUT DISPATCH PROCESS:
  const handleFinalLogout = async () => {
    try {
      const data = await authServices.logoutUser();
      if (data.success) {
        setIsLogoutModalOpen(false); // Modal close karo
        navigate('/login'); // Login panel redirect jump
      }
    } catch (err) {
      console.error("Logout validation crash track:", err);
      alert("Something went wrong during logout.");
    }
  };

  return (
    <div className='relative w-full'>
      
      {/* 1. THE DROPDOWN MENU */}
      {isMenuOpen && isOpen && (
        <UserDropdownMenu 
          user={user} 
          onLogout={() => {
            setIsMenuOpen(false); // Dropdown menu ko pehle band karo
            setIsLogoutModalOpen(true); // 🟢 STEP 3: Logout Modal popup trigger active karo!
          }}
        />
      )}

      {/* 2. THE CONFIRMATION POPUP MODAL SCREEN */}
      {isLogoutModalOpen && (
        <LogoutModal 
          user={user} // Pass complete profile token array metadata to access .email
          onConfirm={handleFinalLogout} // Yes trigger action logic execution
          onCancel={() => setIsLogoutModalOpen(false)} // No trigger collapse window
        />
      )}

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