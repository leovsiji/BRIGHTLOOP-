import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CUSTOMER_PAGE_TITLES = {
  '/customer': 'My Dashboard',
  '/customer/plans': 'Available Subscription Plans',
  '/customer/subscriptions': 'My Subscriptions',
  '/customer/invoices': 'Invoices & Billing',
  '/customer/payments': 'Payment Methods & History',
  '/customer/support': 'Support & Help Desk',
  '/customer/settings': 'Account Settings',
};

export const CustomerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const currentTitle = CUSTOMER_PAGE_TITLES[location.pathname] || 'Customer Portal';

  const displayName = user?.name || user?.email || 'Customer';
  const company = user?.company_name || user?.company || '';

  return (
    <div className="min-h-screen flex bg-[#FFFDF7]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={currentTitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="bg-emerald-50/60 border-b border-emerald-200/50 px-4 py-2 text-xs text-emerald-900 flex items-center gap-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            <strong>Customer Portal:</strong> Authenticated as{' '}
            <span className="font-semibold">
              {displayName}{company ? ` (${company})` : ''}
            </span>
            . Data isolated to your account.
          </span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;

