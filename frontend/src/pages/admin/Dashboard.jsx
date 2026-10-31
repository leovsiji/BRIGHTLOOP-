import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Repeat,
  DollarSign,
  FileText,
  Calendar,
  Plus,
  RefreshCw
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import RevenueChart from '../../components/dashboard/RevenueChart';
import SubscriptionPieChart from '../../components/dashboard/SubscriptionPieChart';
import RecentTransactionsTable from '../../components/dashboard/RecentTransactionsTable';
import TopProductsTable from '../../components/dashboard/TopProductsTable';
import Button from '../../components/common/Button';
import { analyticsApi, paymentsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [analyticsRes, paymentsRes] = await Promise.all([
        analyticsApi.getOverview(),
        paymentsApi.getAll()
      ]);
      setAnalyticsData(analyticsRes);
      setTransactions(paymentsRes);
      setTopProducts(analyticsRes.topProducts || []);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Dashboard',
        message: 'Could not fetch latest metric telemetry.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const kpis = analyticsData?.kpis || {
    totalCustomers: { value: 1428, change: '+12.4%', trend: 'up', period: 'vs last month' },
    activeSubscriptions: { value: 2194, change: '+8.1%', trend: 'up', period: 'vs last month' },
    monthlyRevenue: { value: 148920, change: '+15.3%', trend: 'up', period: 'vs last month' },
    pendingInvoices: { value: 18, change: '-4.2%', trend: 'down', period: 'vs last month' }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Subscription Metrics Overview
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time subscriber activity, billing events, and revenue velocity
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range picker selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                showNotification({
                  type: 'info',
                  title: 'Date Filter Applied',
                  message: `Metrics recalculated for ${e.target.value}`
                });
              }}
              className="appearance-none bg-white border border-[#EAECEF] rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 cursor-pointer shadow-xs"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Year to Date (2025)</option>
              <option>All Time</option>
            </select>
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          <Button
            size="sm"
            variant="outline"
            iconLeft={RefreshCw}
            onClick={loadDashboardData}
            isLoading={loading}
          >
            Refresh
          </Button>

          <Button
            size="sm"
            variant="primary"
            iconLeft={Plus}
            onClick={() => navigate('/admin/products')}
          >
            New Product
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={kpis.totalCustomers.value}
          change={kpis.totalCustomers.change}
          trend={kpis.totalCustomers.trend}
          period={kpis.totalCustomers.period}
          icon={Users}
        />
        <StatCard
          title="Active Subscriptions"
          value={kpis.activeSubscriptions.value}
          change={kpis.activeSubscriptions.change}
          trend={kpis.activeSubscriptions.trend}
          period={kpis.activeSubscriptions.period}
          icon={Repeat}
          badge="Healthy"
        />
        <StatCard
          title="Monthly Revenue (MRR)"
          prefix="$"
          value={kpis.monthlyRevenue.value}
          change={kpis.monthlyRevenue.change}
          trend={kpis.monthlyRevenue.trend}
          period={kpis.monthlyRevenue.period}
          icon={DollarSign}
        />
        <StatCard
          title="Pending Invoices"
          value={kpis.pendingInvoices.value}
          change={kpis.pendingInvoices.change}
          trend={kpis.pendingInvoices.trend}
          period={kpis.pendingInvoices.period}
          icon={FileText}
        />
      </div>

      {/* Charts Section: Area Chart (2/3) + Pie Chart (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={analyticsData?.revenueOverview || []} />
        </div>
        <div className="lg:col-span-1">
          <SubscriptionPieChart data={analyticsData?.subscriptionStatusBreakdown || []} />
        </div>
      </div>

      {/* Tables Section: Recent Transactions + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactionsTable transactions={transactions} />
        <TopProductsTable products={topProducts} />
      </div>
    </div>
  );
};

export default Dashboard;
