import { createBrowserRouter } from 'react-router'
import Register from '../features/auth/pages/Register'
import Dashboard from '../features/chat/layout/Dashboard'
import Login from '../features/auth/pages/Login'
import PricingPlans from '../features/chat/components/PricingPage'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

export const routes = createBrowserRouter([

    {
        path: '/login',
        element:
            <PublicRoute>
                <Login />
            </PublicRoute>
    },
    {
        path: '/register',
        element:
            <PublicRoute>
                <Register />
            </PublicRoute>
    },
    {
        path: '/price',
        element: <PricingPlans />
    },
    // Base dashboard (no active chat)
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    // Dynamic chat route — chatId from URL hydrates the chat on reload
    {
        path: '/chat/:chatId',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    }
])