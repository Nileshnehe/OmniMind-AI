import React, { useState } from 'react'
import Sidebar from '../workspace/components/Sidebar'
import toggleIcon from '../../../assets/sideNavigation.svg'
import ChatInput from '../components/ChatInput'
import { authServices } from '../../auth/services/auth.service'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import API from '../../../services/api'


const Dashboard = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [userProfile, setUserProfile] = useState({ username: "Loading..." })
  const navigate = useNavigate()

  const [input, setInput] = useState('')

  const {user, isAuthenticate} = useAuth()
  const handleSendMessage = (userMessage) => {

    const updateMessage = [...messages, { sender: 'user', text: userMessage }];
    setMessages(updateMessage);

    setTimeout(() => {
      setMessages([...updateMessage, { sender: 'ai', text: `This is a smart response from OmniMind AI for: "${userMessage}"` }])
    }, 1000)
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const response = await API.get('/auth/me');

        console.log("=== DASHBOARD API RESPONSE RAW ===", response.data);

        
        if (response.data && response.data.success) {
          
          setUserProfile(response.data.data || response.data.user);
        }
      } catch (err) {
        console.error("Profile payload session failure:", err);
        
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className='h-screen w-full flex bg-bg-page dark:bg-[#0D0E15] overflow-hidden relative transition-colors duration-200'

    >

      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} user={userProfile} />

      <div className='flex-1 h-full w-full flex flex-col relative bg-bg-page dark:bg-[#0D0E15] transition-all duration-300 '>
        <div className=' flex-1 w-full p-6  mx-auto flex flex-col gap-4 overflow-y-auto omnimind-scrollbar'>

          {/* 1: welcome note */}
          {messages.length === 0 ? (
            <div className='m-auto text-center select-auto'>
              <h1 className='text-3xl font-bold'>Where knowledge begins</h1>
              <p className='text-text-muted text-[15px]'>Ask OmniMind anything...</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col max-w-[80%] p-3.5 rounded-xl text-[15px] leading-relaxed
                  ${msg.sender === 'user'
                    ? 'bg-surface-hover ml-auto text-text-primary rounded-br-none'
                    : 'bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] mr-auto text-text-primary rounded-bl-none'}
                `}
              >
                <p className='font-bold text-[11px] uppercase tracking-wider mb-1 text-text-muted'>
                  {msg.sender === 'user' ? 'You' : 'OmniMind AI'}
                </p>
                <p>{msg.text}</p>
              </div>
            ))
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage}></ChatInput>
      </div>
    </div>
  )
}

export default Dashboard