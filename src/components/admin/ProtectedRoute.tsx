import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireSuperAdmin = false 
}) => {
  const { state } = useSupabaseAuth();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!state.isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Require super admin but user is not super admin
  if (requireSuperAdmin && state.user?.role !== 'super_admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 