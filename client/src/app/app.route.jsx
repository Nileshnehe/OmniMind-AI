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
    {

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