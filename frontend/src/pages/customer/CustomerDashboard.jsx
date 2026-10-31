import React, { useState, useEffect, useCallback } from 'react';
import {
  Repeat,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight,
  CreditCard,
  FileText,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { customerPortalApi, subscriptionsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const CustomerDashboard = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [subs, setSubs] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [prof, userSubs] = await Promise.all([
        customerPortalApi.getProfile(),
        subscriptionsApi.getCustomerSubscriptions('cust-001')
      ]);
      setProfile(prof);
      setSubs(userSubs);
    } catch {
      showNotification({
        type: 'error',
        title: 'Load Failed',
        message: 'Could not fetch customer account information.'
      });
    }
  }, [showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeSub = subs.find((s) => s.status === 'Active') || subs[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#172033] tracking-tight">
              Welcome back, {profile?.name || 'Sarah'}
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#FFF1C2] text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              Acme Corp
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Here is your subscription summary, active seats, and upcoming renewal billing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            iconLeft={FileText}
            onClick={() => navigate('/customer/invoices')}
          >
            Invoices
          </Button>
          <Button
            size="sm"
            variant="primary"
            iconLeft={Sparkles}
            onClick={() => navigate('/customer/plans')}
          >
            Browse Plans
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Subscriptions"
          value={profile?.activeSubscriptionsCount || subs.filter((s) => s.status === 'Active').length}
          trend="up"
          period="Running without interruption"
          icon={Repeat}
          badge="Healthy"
        />
        <StatCard
          title="Total Spent"
          prefix="$"
          value={profile?.totalSpent || 4890}
          trend="up"
          period="Lifetime billings settled"
          icon={DollarSign}
        />
        <StatCard
          title="Next Payment"
          prefix="$"
          value={profile?.nextPaymentAmount || 89.00}
          trend="up"
          period={`Due ${profile?.nextPaymentDate || 'Nov 15, 2025'}`}
          icon={Calendar}
        />
        <StatCard
          title="Total Plan Savings"
          prefix="$"
          value={profile?.totalSavings || 450}
          trend="up"
          period="Annual commitment discount"
          icon={Sparkles}
        />
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Subscription Highlight Card (2/3) */}
        <div className="lg:col-span-2 bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#EAECEF] mb-4">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
                  Current Primary Plan
                </span>
                <h3 className="text-lg font-bold text-[#172033] mt-0.5">
                  {activeSub?.planName || 'Enterprise Scale'}
                </h3>
              </div>
              <Badge status={activeSub?.status || 'Active'} size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-3 bg-[#FFFDF7] rounded-lg border border-[#EAECEF]">
                <span className="text-[#64748B] text-[11px] block">Billing Cycle</span>
                <span className="font-bold text-[#172033] text-sm">
                  ${activeSub?.amount?.toFixed(2)} / {activeSub?.billingCycle?.toLowerCase()}
                </span>
              </div>
              <div className="p-3 bg-[#FFFDF7] rounded-lg border border-[#EAECEF]">
                <span className="text-[#64748B] text-[11px] block">Next Renewal Date</span>
                <span className="font-bold text-[#172033] text-sm font-mono">
                  {activeSub?.nextBillingDate || '2026-01-15'}
                </span>
              </div>
              <div className="p-3 bg-[#FFFDF7] rounded-lg border border-[#EAECEF]">
                <span className="text-[#64748B] text-[11px] block">Provisioned Seats</span>
                <span className="font-bold text-[#172033] text-sm">
                  {activeSub?.seats || 50} Team Seats
                </span>
              </div>
            </div>

            {/* Recently Used Features / Products */}
            <div>
              <h4 className="text-xs font-semibold text-[#172033] uppercase tracking-wider mb-3">
                Active Entitlements & Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#EAECEF] bg-[#FFFDF7]/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[#172033]">High Availability Cloud Sync</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#EAECEF] bg-[#FFFDF7]/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[#172033]">SAML / Okta Single Sign-On</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#EAECEF] bg-[#FFFDF7]/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[#172033]">Unlimited Telemetry Event Pipes</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#EAECEF] bg-[#FFFDF7]/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[#172033]">15-minute Dedicated SLA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#EAECEF] flex items-center justify-between">
            <span className="text-xs text-[#64748B]">
              Auto-renew active with default payment method
            </span>
            <Link
              to="/customer/subscriptions"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 group"
            >
              <span>Manage subscription</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Quick Actions & Upcoming Payments (1/3) */}
        <div className="space-y-6">
          {/* Upcoming Payments Schedule */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-semibold text-[#172033] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Upcoming Charges</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-[#EAECEF] bg-[#FFFDF7] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#172033]">PulseAnalytics Growth</p>
                  <p className="text-[11px] text-[#64748B] font-mono">Nov 15, 2025</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#172033] font-mono">$89.00</span>
                  <span className="block text-[10px] text-amber-700 font-medium">Scheduled</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#EAECEF] bg-[#FFFDF7] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#172033]">Enterprise Annual</p>
                  <p className="text-[11px] text-[#64748B] font-mono">Jan 15, 2026</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#172033] font-mono">$1,590.00</span>
                  <span className="block text-[10px] text-slate-500">Annual Renewal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-2">
            <h3 className="text-sm font-semibold text-[#172033] mb-3">
              Quick Shortcuts
            </h3>

            <Link
              to="/customer/plans"
              className="flex items-center justify-between p-2.5 rounded-lg border border-[#EAECEF] hover:bg-[#FFFDF7] text-xs font-medium text-[#172033] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Upgrade / Add Seats</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/customer/payments"
              className="flex items-center justify-between p-2.5 rounded-lg border border-[#EAECEF] hover:bg-[#FFFDF7] text-xs font-medium text-[#172033] transition-colors"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Update Payment Card</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              to="/customer/support"
              className="flex items-center justify-between p-2.5 rounded-lg border border-[#EAECEF] hover:bg-[#FFFDF7] text-xs font-medium text-[#172033] transition-colors"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Contact Concierge Support</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
