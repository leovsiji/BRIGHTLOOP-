import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import SearchInput from './common/SearchInput';
import EmptyState from './common/EmptyState';
import Pagination from './common/Pagination';

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  searchable = true,
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  onFilterChange,
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching your request.',
  pageSize = 8,
  actions = null,
  title = null,
  onRowClick = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Search computation
  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return false;
          return String(val).toLowerCase().includes(term);
        })
      );
    }

    // Custom dropdown filter (e.g. status)
    if (activeFilter) {
      result = result.filter((row) => {
        return (
          row.status === activeFilter ||
          row.type === activeFilter ||
          row.billingCycle === activeFilter ||
          row.role === activeFilter
        );
      });
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        return sortDirection === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, searchTerm, activeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Table Toolbar */}
      {(searchable || filterOptions.length > 0 || actions || title) && (
        <div className="p-4 border-b border-[#EAECEF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFDF7]/40">
          <div className="flex items-center gap-3">
            {title && (
              <h3 className="text-sm font-semibold text-[#172033] mr-2">
                {title}
              </h3>
            )}
            {searchable && (
              <SearchInput
                value={searchTerm}
                onChange={(val) => {
                  setSearchTerm(val);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
              />
            )}

            {filterOptions.length > 0 && (
              <div className="relative">
                <select
                  value={activeFilter}
                  onChange={(e) => {
                    setActiveFilter(e.target.value);
                    setCurrentPage(1);
                    if (onFilterChange) onFilterChange(e.target.value);
                  }}
                  className="appearance-none rounded-lg border border-[#EAECEF] bg-white pl-3 pr-8 py-1.5 text-xs text-[#172033] focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  {filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EAECEF] bg-[#FFFDF7]/80 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key || col.field}
                  onClick={() => col.sortable && handleSort(col.field || col.key)}
                  className={`px-4 py-3 ${
                    col.sortable ? 'cursor-pointer select-none hover:text-[#172033]' : ''
                  } ${col.align === 'right' ? 'text-right' : ''} ${
                    col.align === 'center' ? 'text-center' : ''
                  } ${col.className || ''}`}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${
                      col.align === 'right' ? 'justify-end' : ''
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAECEF] text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="inline-flex items-center gap-2 text-slate-500">
                    <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Loading data records...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row[keyField] || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors hover:bg-[#FFFDF7] ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => {
                    const cellVal = row[col.field || col.key];
                    return (
                      <td
                        key={col.key || col.field}
                        className={`px-4 py-3.5 text-[#172033] ${
                          col.align === 'right' ? 'text-right' : ''
                        } ${col.align === 'center' ? 'text-center' : ''} ${
                          col.className || ''
                        }`}
                      >
                        {col.render ? col.render(cellVal, row) : cellVal ?? '—'}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default DataTable;

