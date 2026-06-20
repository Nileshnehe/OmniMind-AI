import React from 'react'

const RecentChat = ({ title, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='flex items-center justify-between h-9 pl-3 pr-2 rounded-lg text-text-primary hover:bg-surface-hover/50 cursor-pointer group transition-all duration-150 w-full'>

      {/* Chat Title */}
      <span className='text-[14px] font-medium tracking-wide truncate max-w-[190px] opacity-85 group-hover:opacity-100 transition-opacity'>
        {title}
      </span>

      {/* Right Side Options Menu */}
      {icon && (
        <button className='flex items-center justify-center p-1 rounded-md hover:bg-border/60 transition-all duration-150 opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0'>
          <img 
            src={icon}
            alt="options" 
            className='w-4 h-4 dark:invert opacity-60'
          />
        </button>
      )}

    </div>
  )
}

export default RecentChat