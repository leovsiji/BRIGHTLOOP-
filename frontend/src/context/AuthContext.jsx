import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';
import { MOCK_ADMIN_USER, MOCK_CURRENT_CUSTOMER } from '../services/mockData';

const AuthContext = createContext(null);

// Lazy initializer helpers — run once at component mount, not on every render
const getInitialUser = () => {
  const savedUser = localStorage.getItem('brightloop_user');
  if (savedUser) {
    try { return JSON.parse(savedUser); } catch { /* ignore */ }
  }
  return MOCK_ADMIN_USER;
};

const getInitialRole = () => {
  const savedUser = localStorage.getItem('brightloop_user');
  if (savedUser) {
    try { return JSON.parse(savedUser)?.role || 'admin'; } catch { /* ignore */ }
  }
  return 'admin';
};

const getInitialToken = () => {
  return localStorage.getItem('brightloop_token') || 'mock_session_active';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [role, setRole] = useState(getInitialRole);
  const [token, setToken] = useState(getInitialToken);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const { token: receivedToken, user: receivedUser } = await authApi.login(credentials);
      setUser(receivedUser);
      setRole(receivedUser.role || 'admin');
      setToken(receivedToken);
      return receivedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const { token: receivedToken, user: receivedUser } = await authApi.register(userData);
      setUser(receivedUser);
      setRole('customer');
      setToken(receivedToken);
      return receivedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
    setRole('customer');
  }, []);

  // Helper to switch between Admin & Customer personas
  const switchRole = useCallback((newRole) => {
    if (newRole === 'admin') {
      setUser(MOCK_ADMIN_USER);
      setRole('admin');
      localStorage.setItem('brightloop_user', JSON.stringify(MOCK_ADMIN_USER));
    } else {
      setUser(MOCK_CURRENT_CUSTOMER);
      setRole('customer');
      localStorage.setItem('brightloop_user', JSON.stringify(MOCK_CURRENT_CUSTOMER));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        register,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
