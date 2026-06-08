import { createBrowserRouter } from 'react-router'
import Register from '../features/auth/pages/Register'
import Sidebar from '../features/chat/workspace/components/Sidebar'
import Dashboard from '../features/chat/layout/Dashboard'
import { Children } from 'react'
import Login from '../features/auth/pages/Login'
import PricingPlans from '../../../../Users/nilesh/Downloads/PricingPlans'

export const routes = createBrowserRouter([

    {
        path: '/login',
        element: <Login />
    }
    , {
        path: '/register',
        element: <Register />

    },
    {
        path: '/price',
        element: <PricingPlans />
    },
    {
        path: '/',
        element: <Dashboard />,
    }
])