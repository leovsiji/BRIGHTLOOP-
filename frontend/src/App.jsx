import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLogin from './pages/admin/AdminLogin';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Plans from './pages/admin/Plans';
import Subscriptions from './pages/admin/Subscriptions';
import Customers from './pages/admin/Customers';
import Invoices from './pages/admin/Invoices';
import Payments from './pages/admin/Payments';
import Discounts from './pages/admin/Discounts';
import Analytics from './pages/admin/Analytics';
import StaffManagement from './pages/admin/StaffManagement';
import TaxBilling from './pages/admin/TaxBilling';
import QuotationTemplates from './pages/admin/QuotationTemplates';
import Settings from './pages/admin/Settings';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AvailablePlans from './pages/customer/AvailablePlans';
import MySubscriptions from './pages/customer/MySubscriptions';
import CustomerInvoices from './pages/customer/CustomerInvoices';
import CustomerPayments from './pages/customer/CustomerPayments';
import CustomerSupport from './pages/customer/CustomerSupport';
import AccountSettings from './pages/customer/AccountSettings';

const RootRedirect = () => {
  const { actualRole, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (actualRole === 'admin' || actualRole === 'staff') return <Navigate to="/admin" replace />;
  return <Navigate to="/customer" replace />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            {/* Root Route Redirect */}
            <Route path="/" element={<RootRedirect />} />

            {/* Authentication Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="/auth/login" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Admin Login (standalone, no layout wrapper) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Dashboard Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="plans" element={<Plans />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="customers" element={<Customers />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="payments" element={<Payments />} />
              <Route path="discounts" element={<Discounts />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="tax-billing" element={<TaxBilling />} />
              <Route path="quotations" element={<QuotationTemplates />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Customer Portal Routes */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerDashboard />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="plans" element={<AvailablePlans />} />
              <Route path="subscriptions" element={<MySubscriptions />} />
              <Route path="invoices" element={<CustomerInvoices />} />
              <Route path="payments" element={<CustomerPayments />} />
              <Route path="support" element={<CustomerSupport />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
