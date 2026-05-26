import React from 'react'
import RecentActivity from './RecentActivity'
import RecentChat from './RecentChat'

import toggleIcon from '../../../../assets/sideNavigation.svg'
import newChatIcon from '../../../../assets/rename.svg'
import downArrowIcon from '../../../../assets/arrowdown.svg'
import searchIcon from '../../../../assets/search.svg'
import moreVertIcon from '../../../../assets/morevert.svg'
import UserProfileBlock from './UserProfileBlock'

const Sidebar = () => {
  return (
    <div className='h-screen w-80 bg-bg-card flex flex-col py-4 pl-4 pr-2 border-r border-border select-none transition-colors duration-200'>

      {/* Sidebar Top */}
      <div className='flex flex-col flex-shrink-0 mb-4'>
        {/* Logo + Toggle */}
        <div className='text-text-primary font-bold flex justify-between items-center mb-5 h-10 pr-2 leading-6'>
          <span className='hover:bg-surface-hover px-2 py-1.5 rounded-lg cursor-pointer transition-all tracking-wide '>
            OmniMind AI
          </span>
          <img
            src={toggleIcon}
            alt="toggle-icon"
            className='hover:bg-text-muted/10 p-2 w-9 h-9 rounded-lg cursor-e-resize dark:invert opacity-80 hover:opacity-100 transition-all duration-200' 
          />
        </div>

        {/* Navigation Menu */}
        <div className='flex flex-col gap-1.5 pl-1 pr-2'>
          <button className='flex items-center gap-3.5 h-11 px-3 w-full bg-surface-hover/50 hover:bg-surface-hover text-text-primary rounded-lg cursor-pointer transition-all duration-200 text-[14px] font-medium group'>
            <img 
              src={newChatIcon}
              alt="new-chat"
              className='w-4 h-4 dark:invert opacity-70 group-hover:opacity-100 transition-opacity object-contain' 
            />
            <span>New Chat</span>
          </button>

          <button className='flex items-center gap-3.5 h-11 px-3 w-full hover:bg-surface-hover text-text-primary rounded-lg cursor-pointer transition-all duration-200 text-[14px] font-medium group'>
            <img
              src={searchIcon}
              alt="search"
              className='w-4 h-4 dark:invert opacity-70 group-hover:opacity-100 transition-opacity object-contain' 
            />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* 🟢 MIDDLE CONTAINER: SEPARATED & CLEAN */}
      <div className='flex-1 overflow-y-auto pr-1 mt-2 omnimind-scroller'>
        <RecentActivity title='Recent' icon={downArrowIcon}>
          <RecentChat title="Logo Design for OmniMind AI" icon={moreVertIcon} />
          <RecentChat title="AI Tool Name Ideas" icon={moreVertIcon} />
          <RecentChat title="Logo Design for OmniMind AI" icon={moreVertIcon} />
          <RecentChat title="AI Tool Name Ideas" icon={moreVertIcon} />
          <RecentChat title="Logo Design for OmniMind AI" icon={moreVertIcon} />
          <RecentChat title="AI Tool Name Ideas" icon={moreVertIcon} />
          <RecentChat title="Logo Design for OmniMind AI" icon={moreVertIcon} />
          <RecentChat title="AI Tool Name Ideas" icon={moreVertIcon} />
          <RecentChat title="Logo Design for OmniMind AI" icon={moreVertIcon} />
          <RecentChat title="AI Tool Name Ideas" icon={moreVertIcon} />
          <RecentChat title="Logo Design for OmniMind AI" icon={moreVertIcon} />
          <RecentChat title="AI Tool Name Ideas" icon={moreVertIcon} />
        </RecentActivity>
      </div>

      {/* Sidebar Bottom */}
      <div className='mt-auto pt-2 border-t border-border/40 flex-shrink-0 pr-2'>
        <UserProfileBlock />
      </div>

    </div>
  )
}

export default Sidebar