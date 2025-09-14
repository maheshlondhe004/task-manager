import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: ReactElement;
}

const AdminRoute = ({ children }: AdminRouteProps): ReactElement => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/tasks" replace />;
  }

  return children;
};

export default AdminRoute;
