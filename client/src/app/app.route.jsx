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
        path: '/',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    }
])