import React from 'react';
import DashboardLayout from './features/chat/layout/Dashboard';
import ChatInput from './features/chat/components/ChatInput';
import Sidebar from './features/chat/workspace/components/Sidebar';

function App() {
  return (
    <DashboardLayout>
      <Sidebar></Sidebar>
    </DashboardLayout>
  );
}

export default App;