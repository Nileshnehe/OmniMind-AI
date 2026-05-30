import React, { useState } from 'react'
import Sidebar from '../workspace/components/Sidebar'
import toggleIcon from '../../../assets/sideNavigation.svg'
import ChatInput from '../components/ChatInput'
const Dashboard = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className='h-screen w-full flex bg-bg-page dark:bg-[#0D0E15] overflow-hidden relative transition-colors duration-200'>

       
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <ChatInput/>
    </div>
  )
}

export default Dashboard