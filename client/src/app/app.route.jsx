import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router'
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { PageSkeletonLoader } from '../features/chat/components/PageSkeletonLoader';

// 🚀 1. Static imports hata kar Lazy Loading apply ki
const Login = lazy(() => import('../features/auth/pages/Login'));
const Register = lazy(() => import('../features/auth/pages/Register'));
const Dashboard = lazy(() => import('../features/chat/layout/Dashboard'));
const PricingPlans = lazy(() => import('../features/chat/components/PricingPage'));


// 🛠️ 3. Helper function banaya taaki code clean rahe (baar-baar Suspense na likhna pade)
const withSuspense = (Component) => (
    <Suspense fallback={<PageSkeletonLoader />}>
        <Component />
    </Suspense>
);

export const routes = createBrowserRouter([
    {
        path: '/login',
        element: (
            <PublicRoute>
                {withSuspense(Login)}
            </PublicRoute>
        )
    },
    {
        path: '/register',
        element: (
            <PublicRoute>
                {withSuspense(Register)}
            </PublicRoute>
        )
    },
    {
        path: '/price',
        element: withSuspense(PricingPlans)
    },
    // Base dashboard (no active chat)
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                {withSuspense(Dashboard)}
            </ProtectedRoute>
        ),
    },
    // Dynamic chat route 
    {
        path: '/chat/:chatId',
        element: (
            <ProtectedRoute>
                {withSuspense(Dashboard)}
            </ProtectedRoute>
        ),
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                {withSuspense(Dashboard)}
            </ProtectedRoute>
        ),
    }
]);