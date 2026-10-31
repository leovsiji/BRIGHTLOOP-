import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#EAECEF] rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-[#172033] mb-1">{label} 2025</p>
        <div className="space-y-1">
          <p className="text-amber-600 font-medium flex items-center justify-between gap-4">
            <span>Revenue:</span>
            <span className="font-bold text-[#172033]">
              ${payload[0].value.toLocaleString()}
            </span>
          </p>
          {payload[1] && (
            <p className="text-slate-500 flex items-center justify-between gap-4">
              <span>Target:</span>
              <span className="font-medium">
                ${payload[1].value.toLocaleString()}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({ data = [] }) => {
  const [range, setRange] = useState('30d');

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-semibold text-[#172033]">
            Revenue Overview
          </h3>
          <p className="text-xs text-[#64748B]">
            Monthly recurring and expansion revenue performance
          </p>
        </div>

        {/* Date range selector */}
        <div className="inline-flex items-center p-1 bg-[#FFFDF7] border border-[#EAECEF] rounded-lg text-xs font-medium text-[#64748B]">
          {['7d', '30d', '90d', 'YTD'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                range === r
                  ? 'bg-white text-[#172033] shadow-xs font-semibold border border-[#EAECEF]'
                  : 'hover:text-[#172033]'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#D97706"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#94A3B8"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-[#EAECEF] flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
            <span className="font-medium text-[#172033]">Actual Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-slate-400" />
            <span>Target Benchmark</span>
          </div>
        </div>
        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          +15.3% Growth YoY
        </span>
      </div>
    </div>
  );
};

export default RevenueChart;

