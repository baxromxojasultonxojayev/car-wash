import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../lib/auth';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'super_admin' ? '/organizations' : '/kiosks';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
