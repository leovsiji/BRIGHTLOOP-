import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There is currently no data to display for this view or filter criteria.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-[#FFFDF7]/60 rounded-xl border border-dashed border-[#EAECEF] ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#FFF1C2]/60 flex items-center justify-center mb-3 text-amber-700">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-[#172033] mb-1">
        {title}
      </h4>
      <p className="text-xs text-[#64748B] max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

