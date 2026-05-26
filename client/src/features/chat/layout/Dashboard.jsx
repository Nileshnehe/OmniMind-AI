import React, { useState } from 'react'
import Sidebar from '../workspace/components/Sidebar'
import toggleIcon from '../../../assets/sideNavigation.svg'
const Dashboard = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className='h-screen w-full flex bg-bg-page dark:bg-[#0D0E15] overflow-hidden relative transition-colors duration-200'>

      
        {/* <button
          onClick={() => setIsSidebarOpen(true)}
          className='absolute top-4 left-4 z-50 p-2 rounded-lg bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] cursor-pointer hover:bg-surface-hover dark:hover:bg-[#222436] shadow-sm transition-all duration-200'
          title="Open Sidebar"
        >
          <img src={toggleIcon}
            alt="open-sidebar"
            className='w-5 h-5 dark:invert opacity-80 hover:opacity-100 transition-opacity'
          />
        </button> */}
      

      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  )
}

export default Dashboard