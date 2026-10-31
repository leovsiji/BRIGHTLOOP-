import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Shield,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar, title = 'Dashboard' }) => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New subscription activated', desc: 'Sarah Jenkins upgraded to Enterprise Scale', time: '10m ago' },
    { id: 2, title: 'Invoice payment succeeded', desc: 'INV-2025-0891 ($1,590.00) settled via Visa', time: '1h ago' },
    { id: 3, title: 'Dunning alert resolved', desc: 'Card update received for Nordic Vibe Design', time: '3h ago' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#EAECEF] px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-[#172033] hover:bg-slate-100 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-[#172033] leading-none">
              {title}
            </h1>
          </div>
        </div>

        {/* Center/Search on desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subscriptions, customers, invoices (Cmd + K)..."
              className="w-full bg-[#FFFDF7] border border-[#EAECEF] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] transition-colors"
            />
          </div>
        </div>

        {/* Right: Role Switcher, Notifications, User Profile */}
        <div className="flex items-center gap-3">
          {/* Persona / Role Switcher Pill */}
          <div className="flex items-center bg-[#FFFDF7] border border-[#EAECEF] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => {
                switchRole('admin');
                navigate('/admin');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-[#FBBF24] text-[#172033] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
              title="Switch to Admin Interface"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button
              onClick={() => {
                switchRole('customer');
                navigate('/customer');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                role === 'customer'
                  ? 'bg-[#FBBF24] text-[#172033] shadow-xs font-semibold'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
              title="Switch to Customer Interface"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customer</span>
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-[#172033] hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white border border-[#EAECEF] rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EAECEF]">
                  <span className="text-xs font-semibold text-[#172033]">Notifications</span>
                  <span className="text-[10px] text-amber-700 bg-[#FFF1C2] px-1.5 py-0.5 rounded font-medium">3 unread</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg hover:bg-[#FFFDF7] transition-colors border border-transparent hover:border-[#EAECEF]">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#172033]">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-[#EAECEF]"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-[#172033] leading-tight">
                  {user?.name || 'Alexander Ward'}
                </p>
                <p className="text-[10px] text-[#64748B] capitalize">
                  {role} view
                </p>
              </div>
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white border border-[#EAECEF] rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-3 py-2 border-b border-[#EAECEF]">
                  <p className="font-semibold text-[#172033]">{user?.name}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => navigate(role === 'admin' ? '/admin/settings' : '/customer/settings')}
                    className="w-full text-left px-3 py-2 text-slate-600 hover:text-[#172033] hover:bg-[#FFFDF7] flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole(role === 'admin' ? 'customer' : 'admin');
                      navigate(role === 'admin' ? '/customer' : '/admin');
                    }}
                    className="w-full text-left px-3 py-2 text-slate-600 hover:text-[#172033] hover:bg-[#FFFDF7] flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch to {role === 'admin' ? 'Customer Portal' : 'Admin View'}</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#EAECEF]">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/auth/login');
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
