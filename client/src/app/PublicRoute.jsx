import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isCheckingSession } = useAuth();

    if (isCheckingSession) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;