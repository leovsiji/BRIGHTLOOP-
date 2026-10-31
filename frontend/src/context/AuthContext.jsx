import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi, tokenStorage } from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider
 *
 * Uses real JWT authentication via the Django REST Framework backend.
 *
 * `role` is the currently displayed role (can be switched locally for
 * demo/admin purposes). `actualRole` is always the real role from the
 * JWT token and is used for security decisions.
 *
 * `switchRole` is a local UI helper that lets an admin browse the
 * customer portal view. It does NOT change backend permissions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [token, setToken] = useState(() => tokenStorage.getAccess());
  const [isLoading, setIsLoading] = useState(true);

  // Local-only role override for UI navigation (admin can browse customer view)
  const [viewRole, setViewRole] = useState(() => tokenStorage.getUser()?.role || null);

  // On mount, verify the stored token is still valid
  useEffect(() => {
    const verify = async () => {
      if (!tokenStorage.getAccess()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        setUser(me);
        setViewRole(me.role);
        tokenStorage.set(tokenStorage.getAccess(), tokenStorage.getRefresh(), me);
      } catch {
        // Token invalid / expired (interceptor handles refresh).
        // If refresh also fails the interceptor redirects to /auth/login.
        setUser(null);
        setToken(null);
        setViewRole(null);
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  /**
   * Login — POST /api/accounts/login/ → GET /api/accounts/me/
   * Returns the user object from /me/
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const me = await authApi.login(credentials);
      setUser(me);
      setToken(tokenStorage.getAccess());
      setViewRole(me.role);
      return me;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register — POST /api/accounts/register/
   * Fields: email, password, first_name, last_name, company_name (optional)
   * Does NOT auto-login — caller navigates to /auth/login after.
   */
  const register = useCallback(async (data) => {
    setIsLoading(true);
    try {
      return await authApi.register(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * updateProfile — PATCH /api/accounts/me/
   */
  const updateProfile = useCallback(async (updates) => {
    const updated = await authApi.updateMe(updates);
    setUser(updated);
    tokenStorage.set(tokenStorage.getAccess(), tokenStorage.getRefresh(), updated);
    return updated;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setToken(null);
    setViewRole(null);
  }, []);

  /**
   * switchRole — local UI view toggle only.
   * Allows an admin to browse the customer portal UI.
   * Does NOT change backend permissions or JWT claims.
   */
  const switchRole = useCallback((newRole) => {
    setViewRole(newRole);
  }, []);

  // The actual role from the JWT (used for security/access control)
  const actualRole = user?.role || null;

  // The displayed role (can be toggled locally by switchRole)
  const role = viewRole || actualRole;

  // User display name — backend returns first_name + last_name
  const displayUser = user
    ? {
        ...user,
        name: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user: displayUser,
        actualRole,
        role,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
