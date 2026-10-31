import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  change,
  trend = 'up',
  period = 'vs last month',
  icon: Icon,
  prefix = '',
  suffix = '',
  className = '',
  badge = null
}) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <div
      className={`relative bg-white border border-[#EAECEF] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200 hover:shadow-md hover:border-amber-200/80 group ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF1C2] text-amber-900 border border-amber-300/50">
              {badge}
            </span>
          )}
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-[#FFFDF7] border border-[#EAECEF] flex items-center justify-center text-[#172033] group-hover:bg-[#FFF1C2] group-hover:text-amber-900 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-xl font-semibold text-[#64748B]">{prefix}</span>}
        <h2 className="text-2xl font-bold tracking-tight text-[#172033]">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h2>
        {suffix && <span className="text-xs font-medium text-[#64748B] ml-1">{suffix}</span>}
      </div>

      {(change || period) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : isNegative
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-slate-50 text-slate-600'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : isNegative ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {change}
            </span>
          )}
          {period && <span className="text-[#64748B]">{period}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;

