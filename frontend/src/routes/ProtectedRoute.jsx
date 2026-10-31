import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If specific role required and user doesn't match
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin' : '/customer'} replace />;
  }

  return children;
};

export default ProtectedRoute;

