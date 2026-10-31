import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = ''
}) => {
  return (
    <div className={`relative min-w-[220px] ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#EAECEF] bg-white pl-9 pr-8 py-1.5 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(''))}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

