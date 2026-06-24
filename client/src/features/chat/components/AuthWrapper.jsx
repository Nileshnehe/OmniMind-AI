import React, { useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

/**
 * AuthWrapper — Mounted once at the app root.
 * Sole responsibility: trigger the session check (getMeThunk) on startup.
 *
 * It intentionally does NOT render a skeleton or block rendering.
 * Loading state is handled by each route guard individually:
 *   - ProtectedRoute shows a skeleton while isCheckingSession is true.
 *   - PublicRoute renders nothing (null) while checking, which resolves instantly.
 */
const AuthWrapper = ({ children }) => {
  const { checkSession } = useAuth();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Always render children immediately — route guards manage their own loading states.
  return children;
};

export default AuthWrapper;