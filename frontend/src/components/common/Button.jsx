import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-[#FBBF24] hover:bg-[#F59E0B] text-[#172033] shadow-xs active:scale-[0.99] border border-amber-400 font-semibold',
    secondary: 'bg-[#FFFDF7] hover:bg-[#FFF1C2]/60 text-[#172033] border border-[#EAECEF] hover:border-amber-300 shadow-xs',
    outline: 'bg-white hover:bg-slate-50 text-[#172033] border border-[#EAECEF] shadow-xs',
    soft: 'bg-[#FFF1C2] hover:bg-[#FDE68A] text-[#172033] border border-amber-200',
    danger: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs',
    dangerOutline: 'bg-white hover:bg-rose-50 text-[#DC2626] border border-rose-200',
    ghost: 'bg-transparent hover:bg-slate-100 text-[#64748B] hover:text-[#172033]'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : IconLeft ? (
        <IconLeft className="w-4 h-4 shrink-0" />
      ) : null}

      <span>{children}</span>

      {!isLoading && IconRight && (
        <IconRight className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};

export default Button;

