import React from 'react'
import userIcon from '../../../../assets/profile.svg'
import moreVertIcon from '../../../../assets/morevert.svg'

const UserProfileBlock = () => {
  return (
    <div className='flex items-center justify-between w-full p-2 rounded-xl text-text-primary hover:bg-surface-hover/60 cursor-pointer group transition-all duration-200 select-none'>
      
      <div className='flex items-center gap-3 flex-1 min-w-0'>
        <img
          src={userIcon}
          alt="user-avatar"
          className='w-9 h-9 rounded-full object-contain dark:invert'
        />

        <div className='flex flex-col min-w-0 leading-tight'>
          <p className='font-semibold text-[14px] tracking-wide truncate'>
            Nilesh Nehe
          </p>
          <p className='font-medium text-[12px] text-text-muted mt-0.5'>
            Free
          </p>
        </div>
      </div>

      <div className='p-1 rounded-md hover:bg-border/40 transition-colors opacity-70 group-hover:opacity-100 flex items-center justify-center'>
        <img
          src={moreVertIcon}
          alt="more-option"
          className='w-4 h-4 dark:invert object-contain'
        />
      </div>

    </div>
  )
}

export default UserProfileBlock