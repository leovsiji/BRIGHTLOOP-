import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * requiredRole: 'admin' | 'customer'
 *   'admin'    → allows actualRole === 'admin' OR actualRole === 'staff'
 *   'customer' → allows actualRole === 'customer' only
 *
 * Uses `actualRole` (from JWT) for access control, not `role` (which
 * may be locally switched for UI preview purposes).
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, actualRole, isLoading } = useAuth();

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
    return (
      <Navigate
        to={requiredRole === 'admin' ? '/admin/login' : '/auth/login'}
        replace
      />
    );
  }

  // Admin panel accepts both 'admin' and 'staff' roles
  const hasAccess =
    requiredRole === 'admin'
      ? actualRole === 'admin' || actualRole === 'staff'
      : actualRole === requiredRole;

  if (!hasAccess) {
    return (
      <Navigate
        to={actualRole === 'admin' || actualRole === 'staff' ? '/admin' : '/customer'}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
