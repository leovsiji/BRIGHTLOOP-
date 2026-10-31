import React, { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import StatCard from '../../components/StatCard';
import Button from '../../components/common/Button';
import { analyticsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const Analytics = () => {
  const { showNotification } = useNotification();
  const [data, setData] = useState(null);
  const [_loading, setLoading] = useState(true);
  const [range, setRange] = useState('30d');

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getOverview(range);
      setData(res);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Analytics',
        message: 'Could not fetch analytical metrics.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification, range]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const kpis = data?.kpis || {
    mrr: { value: 148920, change: '+15.3%', trend: 'up' },
    arr: { value: 1787040, change: '+18.7%', trend: 'up' },
    churnRate: { value: '1.42%', change: '-0.3%', trend: 'down' },
    arpu: { value: '$104.28', change: '+5.4%', trend: 'up' },
    ltv: { value: '$4,120', change: '+9.2%', trend: 'up' },
    nrr: { value: '114%', change: '+2.0%', trend: 'up' }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Revenue & Subscription Analytics
          </h2>
          <p className="text-xs text-[#64748B]">
            Deep financial telemetry: MRR, Net Retention, Cohort Churn, and LTV
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-white border border-[#EAECEF] rounded-lg p-1 text-xs">
            {['7d', '30d', '90d', '1y'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded font-medium cursor-pointer transition-all ${
                  range === r
                    ? 'bg-[#FFF1C2] text-[#172033] font-semibold shadow-xs'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            iconLeft={Download}
            onClick={() =>
              showNotification({
                type: 'success',
                title: 'Export Generated',
                message: 'Analytics CSV report queued for download.'
              })
            }
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="MRR"
          prefix="$"
          value={kpis.mrr.value}
          change={kpis.mrr.change}
          trend={kpis.mrr.trend}
          period=""
        />
        <StatCard
          title="ARR"
          prefix="$"
          value={kpis.arr.value}
          change={kpis.arr.change}
          trend={kpis.arr.trend}
          period=""
        />
        <StatCard
          title="Net Churn"
          value={kpis.churnRate.value}
          change={kpis.churnRate.change}
          trend="up"
          period=""
        />
        <StatCard
          title="ARPU"
          value={kpis.arpu.value}
          change={kpis.arpu.change}
          trend={kpis.arpu.trend}
          period=""
        />
        <StatCard
          title="Avg. LTV"
          value={kpis.ltv.value}
          change={kpis.ltv.change}
          trend={kpis.ltv.trend}
          period=""
        />
        <StatCard
          title="Net Retention"
          value={kpis.nrr.value}
          change={kpis.nrr.change}
          trend={kpis.nrr.trend}
          period=""
          badge="100%+"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Trend with Target */}
        <div className="bg-white border border-[#EAECEF] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#172033]">
              Recurring Revenue Velocity (MRR)
            </h3>
            <p className="text-xs text-[#64748B]">
              Historical MRR performance vs revenue targets
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueOverview || []}>
                <defs>
                  <linearGradient id="anaRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #EAECEF',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D97706"
                  strokeWidth={2}
                  fill="url(#anaRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#DC2626"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#EAECEF]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-[#172033]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Gross MRR
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-0.5 bg-rose-500" /> Infrastructure Cost
              </span>
            </div>
            <span className="font-semibold text-emerald-600">+15.3% Net Increase</span>
          </div>
        </div>

        {/* Customer Acquisition vs Churn */}
        <div className="bg-white border border-[#EAECEF] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#172033]">
              New Customers vs Churned Accounts
            </h3>
            <p className="text-xs text-[#64748B]">
              Net new subscriber addition against churn events
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.customerAcquisition || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #EAECEF',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Bar dataKey="newCustomers" name="New Subscriptions" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churned" name="Canceled / Churned" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#EAECEF]">
            <span>Net Monthly Customer Inflow:</span>
            <span className="font-bold text-[#172033] font-mono">+176 net new</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
