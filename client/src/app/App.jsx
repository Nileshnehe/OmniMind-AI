import React from 'react';
import DashboardLayout from '../features/chat/layout/Dashboard';
import Sidebar from '../features/chat/workspace/components/Sidebar';
import { RouterProvider } from 'react-router';
import { routes } from './app.route';

function App() {
  return (

    <>
    <RouterProvider router={routes} />
    </>
  );
}

export default App;