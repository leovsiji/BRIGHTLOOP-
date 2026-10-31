import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const SubscriptionPieChart = ({ data = [] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-[#172033]">
          Subscription Health
        </h3>
        <p className="text-xs text-[#64748B]">
          Distribution by subscription lifecycle status
        </p>
      </div>

      <div className="relative h-60 w-full my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value, name) => [
                `${value.toLocaleString()} (${Math.round((value / total) * 100)}%)`,
                name
              ]}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#EAECEF',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-[#172033]">
            {total.toLocaleString()}
          </span>
          <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">
            Total Subs
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#EAECEF] text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg bg-[#FFFDF7]">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[#64748B]">{item.name}</span>
            </div>
            <span className="font-semibold text-[#172033]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPieChart;

