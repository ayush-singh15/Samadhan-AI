import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    // Redirect to the user's own dashboard instead of /403
    const home =
      role === 'GOVERNMENT' || role === 'ADMIN'
        ? '/admin'
        : role === 'UNIVERSITY'
        ? '/university'
        : role === 'INDUSTRY'
        ? '/industry'
        : '/citizen';
    return <Navigate to={home} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
