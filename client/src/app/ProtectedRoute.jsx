import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

// Skeleton shown while session check is in progress on protected routes.
// Mirrors the dashboard layout so there's no jarring flash or blank screen.
const DashboardSkeleton = () => (
  <div className="flex h-screen w-full bg-bg-page dark:bg-[#0D0E15]">
    {/* Sidebar skeleton */}
    <div className="w-64 h-full border-r border-border/40 p-4 hidden md:flex flex-col gap-4 animate-pulse">
      <div className="h-10 w-full bg-surface-hover/60 rounded-xl" />
      <div className="h-6 w-3/4 bg-surface-hover/60 rounded-md mt-6" />
      <div className="h-6 w-1/2 bg-surface-hover/60 rounded-md mt-2" />
      <div className="h-6 w-2/3 bg-surface-hover/60 rounded-md mt-2" />
    </div>

    {/* Main content skeleton */}
    <div className="flex-1 h-full flex flex-col p-6 animate-pulse">
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <div className="h-10 w-64 bg-surface-hover/60 rounded-lg" />
        <div className="h-6 w-48 bg-surface-hover/40 rounded-md" />
      </div>
      <div className="h-14 w-full max-w-3xl mx-auto bg-surface-hover/60 rounded-2xl mb-4" />
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingSession } = useAuth();

  // Show skeleton while the session check (getMeThunk) is in flight
  if (isCheckingSession) {
    return <DashboardSkeleton />;
  }

  // Session resolved but not authenticated — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
