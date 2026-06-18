import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ children }) => {

  const { isAuthenticated, isCheckingSession, loading } = useAuth();

  if (isCheckingSession || loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace /> 
  }

  return children
}

export default ProtectedRoute
