import { createBrowserRouter } from 'react-router'
import Register from '../features/auth/pages/Register'
import Dashboard from '../features/chat/layout/Dashboard'
import Login from '../features/auth/pages/Login'
import PricingPlans from '../features/chat/components/PricingPage'
import ProtectedRoute from './ProtectedRoute'

export const routes = createBrowserRouter([

    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/price',
        element: <PricingPlans />
    },
    {
        // 🟢 FIX: Ab user direct URL par /dashboard likhega toh bhi crash nahi hoga!
        path: '/dashboard', 
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