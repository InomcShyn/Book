import PATH from '@/configs/paths/PATH';
import useAuth from '@/features/Auth/useAuth'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({children}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={PATH.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;