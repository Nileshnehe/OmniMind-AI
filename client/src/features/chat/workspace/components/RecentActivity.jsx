import React, { useState } from 'react'

const RecentActivity = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='flex flex-col w-full my-2 pr-2'>

      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)} 
        className='flex items-center justify-between h-9 pl-2 pr-1 text-text-muted hover:bg-surface-hover/60 hover:text-text-primary rounded-lg cursor-pointer group transition-all duration-200'
      >
        <span className='text-[13px] font-semibold tracking-wide text-text-secondary uppercase'>
          {title}
        </span>

        {icon && (
          <img 
            src={icon} 
            alt="arrow"
            className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 dark:invert transition-transform duration-300 object-contain ${
              isOpen ? 'rotate-0' : '-rotate-90'
            }`}
          />
        )}
      </div>

      {/* Chats Container */}
      <div 
        className={`flex flex-col gap-1 mt-1 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default RecentActivity