import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Repeat,
  Users,
  FileText,
  CreditCard,
  Percent,
  BarChart3,
  UserCheck,
  Receipt,
  FileCheck2,
  Settings,
  HelpCircle,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ADMIN_LINKS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/plans', label: 'Plans', icon: Layers },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: Repeat, badge: 'Active' },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/invoices', label: 'Invoices', icon: FileText },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/discounts', label: 'Discounts', icon: Percent },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/staff', label: 'Staff Management', icon: UserCheck },
  { to: '/admin/tax-billing', label: 'Tax & Billing', icon: Receipt },
  { to: '/admin/quotations', label: 'Quotation Templates', icon: FileCheck2 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const CUSTOMER_LINKS = [
  { to: '/customer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/customer/plans', label: 'Available Plans', icon: Sparkles },
  { to: '/customer/subscriptions', label: 'My Subscriptions', icon: Repeat },
  { to: '/customer/invoices', label: 'Invoices', icon: FileText },
  { to: '/customer/payments', label: 'Payments', icon: CreditCard },
  { to: '/customer/support', label: 'Support', icon: HelpCircle },
  { to: '/customer/settings', label: 'Account Settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const links = role === 'admin' ? ADMIN_LINKS : CUSTOMER_LINKS;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#172033]/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#EAECEF] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-6 border-b border-[#EAECEF] flex items-center justify-between">
            <Link to={role === 'admin' ? '/admin' : '/customer'} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FBBF24] flex items-center justify-center text-[#172033] shadow-xs font-bold">
                <span className="text-base tracking-tighter">BL</span>
              </div>
              <div className="leading-tight">
                <span className="text-sm font-bold tracking-tight text-[#172033] block">
                  BRIGHT<span className="text-amber-500">LOOP</span>
                </span>
                <span className="text-[10px] font-medium text-[#64748B] tracking-wider uppercase">
                  {role === 'admin' ? 'Admin Suite' : 'Customer Portal'}
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 overflow-y-auto max-h-[calc(100vh-140px)]">
            <p className="px-3 pb-2 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              {role === 'admin' ? 'Management' : 'My Account'}
            </p>

            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-[#FFF1C2] text-[#172033] font-semibold shadow-xs'
                          : 'text-[#64748B] hover:text-[#172033] hover:bg-[#FFFDF7]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? 'text-[#172033]'
                                : 'text-slate-400 group-hover:text-[#172033]'
                            }`}
                          />
                          <span>{link.label}</span>
                        </div>

                        {link.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              isActive
                                ? 'bg-amber-300/60 text-amber-950'
                                : 'bg-[#FFFDF7] text-slate-500 border border-[#EAECEF]'
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer / System status badge */}
        <div className="p-4 border-t border-[#EAECEF] bg-[#FFFDF7]/60">
          <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[#172033]">Django REST API</span>
            <span className="ml-auto text-[10px] font-mono text-slate-400">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

