import React from 'react';
import DashboardLayout from './features/chat/layout/Dashboard';
import Sidebar from './features/chat/workspace/components/Sidebar';

function App() {
  return (
    <DashboardLayout>
      <Sidebar></Sidebar>
      
    </DashboardLayout>
  );
}

export default App;