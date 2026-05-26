import React, { useState } from 'react'


const RecentActivity = ({ title, icon, isOpen, children }) => {
  
  
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className='flex flex-col w-full my-2 pr-2'>

      {/* Header Area */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center text-text-muted hover:bg-surface-hover/60 hover:text-text-primary rounded-lg cursor-pointer group transition-all duration-200 h-9
          ${isOpen ? 'justify-between pl-2 pr-1' : 'justify-center pl-0 pr-0'}
        `}
      >
      
        {isOpen ? (
          <span className='text-[13px] font-semibold tracking-wide text-text-secondary uppercase truncate'>
            {title}
          </span>
        ) : (
          <div className='w-1.5 h-1.5 rounded-full bg-text-muted/40' />
        )}

        {/* Arrow Icon */}
        {isOpen && icon && (
          <img
            src={icon}
            alt="arrow"
            className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 dark:invert transition-transform duration-300 object-contain ${
              isExpanded ? 'rotate-0' : '-rotate-90'
            }`}
          />
        )}
      </div>

      {/* Chats Containeri*/}
      <div
        className={`flex flex-col gap-1 mt-1 overflow-hidden transition-all duration-300 ${
          isExpanded && isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        {children}
      </div>
    
    </div>
  )
}

export default RecentActivity