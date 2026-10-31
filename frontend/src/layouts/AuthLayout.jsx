import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#FFF1C2]">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#FBBF24] flex items-center justify-center font-bold text-[#172033] shadow-xs">
            <span className="text-lg tracking-tighter">BL</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#172033]">
            BRIGHT<span className="text-amber-500">LOOP</span>
          </span>
        </Link>
        <p className="text-xs text-[#64748B]">
          Enterprise Subscription & Recurring Billing Architecture
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-[#EAECEF] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-[#64748B]">
          Protected by SOC2 Type II compliance • Powered by Django REST Framework
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;

