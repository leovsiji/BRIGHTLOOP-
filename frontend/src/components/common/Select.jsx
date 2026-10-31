import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  className = '',
  required = false,
  id,
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-[#172033] mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] transition-colors disabled:bg-slate-50 disabled:text-slate-500 cursor-pointer ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-[#EAECEF]'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Select;

