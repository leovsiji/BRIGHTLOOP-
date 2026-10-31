import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[#172033] mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
        )}

        <input
          id={inputId}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] transition-colors disabled:bg-slate-50 disabled:text-slate-500 ${
            Icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-[#EAECEF]'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;

