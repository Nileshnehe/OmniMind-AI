import React from 'react'
import userIcon from '../../../../assets/profile.svg'
import moreVertIcon from '../../../../assets/morevert.svg'

const UserProfileBlock = ({ isOpen }) => {
  return (
    <div className={`flex items-center w-full p-2 rounded-xl text-text-primary hover:bg-surface-hover/60 cursor-pointer group transition-all duration-200 select-none
      ${isOpen ? 'justify-between' : 'justify-center'}
    `}>
      
      {/* Left Row: Avatar + Info */}
      <div className='flex items-center gap-3 min-w-0 flex-1'>
        <img 
          src={userIcon} 
          alt="user" 
          className='w-9 h-9 rounded-full object-contain dark:invert flex-shrink-0' 
        />

        {/*   TEXT BLOCK: Only renders when sidebar is fully open */}
        {isOpen && (
          <div className='flex flex-col min-w-0 leading-tight text-left pr-1'>
            <p className='font-semibold text-[14px] tracking-wide truncate w-full'>
              Nilesh Nehe
            </p>
            <p className='font-medium text-[12px] text-text-muted mt-0.5'>
              Free
            </p>
          </div>
        )}
      </div>

      {/* Right Side Menu Icon: Only renders when open */}
      {isOpen && (
        <div className='p-1 rounded-md hover:bg-border/40 transition-colors opacity-70 group-hover:opacity-100 flex items-center justify-center flex-shrink-0'>
          <img 
            src={moreVertIcon} 
            alt="more" 
            className='w-4 h-4 dark:invert object-contain' 
          />
        </div>
      )}

    </div>
  )
}

export default UserProfileBlock