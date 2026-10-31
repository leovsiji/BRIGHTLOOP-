import React from 'react';

const BADGE_VARIANTS = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  succeeded: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  trial: 'bg-amber-50 text-amber-800 border-[#FFF1C2]',
  past_due: 'bg-orange-50 text-orange-800 border-orange-200',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  canceled: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200', // backend uses double-l
  expired: 'bg-slate-100 text-slate-600 border-slate-200',   // backend status
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  refunded: 'bg-purple-50 text-purple-700 border-purple-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  suspended: 'bg-rose-50 text-rose-700 border-rose-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
  paused: 'bg-amber-50 text-amber-800 border-amber-200',
  inactive: 'bg-slate-100 text-slate-500 border-slate-200', // product is_active=false
  default: 'bg-slate-50 text-slate-700 border-[#EAECEF]'
};

export const Badge = ({
  children,
  variant,
  status,
  size = 'md',
  dot = true,
  className = ''
}) => {
  // Normalize variant key from status or variant
  const key = (status || variant || 'default').toLowerCase().replace(/\s+/g, '_');
  const style = BADGE_VARIANTS[key] || BADGE_VARIANTS.default;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${style} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            ['active', 'paid', 'succeeded'].includes(key)
              ? 'bg-emerald-500'
              : ['pending', 'trial', 'paused'].includes(key)
              ? 'bg-amber-500'
              : ['overdue', 'past_due', 'failed', 'suspended'].includes(key)
              ? 'bg-rose-500'
              : 'bg-slate-400'
          }`}
        />
      )}
      {children || status}
    </span>
  );
};

export default Badge;

