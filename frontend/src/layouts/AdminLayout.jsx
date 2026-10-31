import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Database } from 'lucide-react';

const PAGE_TITLES = {
  '/admin': 'Overview Dashboard',
  '/admin/products': 'Products Management',
  '/admin/plans': 'Subscription Plans',
  '/admin/subscriptions': 'Customer Subscriptions',
  '/admin/customers': 'Customers Directory',
  '/admin/invoices': 'Invoices & Billing',
  '/admin/payments': 'Payments & Transactions',
  '/admin/discounts': 'Discounts & Coupons',
  '/admin/analytics': 'Revenue Analytics',
  '/admin/staff': 'Staff & Roles',
  '/admin/tax-billing': 'Tax & Billing Settings',
  '/admin/quotations': 'Quotation Templates',
  '/admin/settings': 'System Settings',
};

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const currentTitle = PAGE_TITLES[location.pathname] || 'Admin Console';

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

        {/* Backend Ready Banner */}
        {!bannerDismissed && (
          <div className="bg-[#FFF1C2]/60 border-b border-amber-200/70 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                <strong className="font-semibold">Backend Ready:</strong> Centralized Axios API service is connected and ready for Django REST Framework. Demonstrating with full interactive mock data.
              </span>
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-amber-800 hover:text-amber-950 font-medium text-[11px] underline cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
