import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard } from 'lucide-react';
import Badge from '../common/Badge';

export const RecentTransactionsTable = ({ transactions = [] }) => {
  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="p-5 border-b border-[#EAECEF] flex items-center justify-between bg-[#FFFDF7]/40">
        <div>
          <h3 className="text-base font-semibold text-[#172033]">
            Recent Transactions
          </h3>
          <p className="text-xs text-[#64748B]">
            Latest billing receipts and payment events
          </p>
        </div>
        <Link
          to="/admin/payments"
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 group"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#EAECEF] bg-[#FFFDF7]/60 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECEF]">
            {transactions.slice(0, 5).map((txn) => (
              <tr key={txn.id} className="hover:bg-[#FFFDF7] transition-colors">
                <td className="px-4 py-3 font-medium text-[#172033]">
                  {txn.customerName}
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                  {txn.invoiceNumber}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {txn.date.split(' ')[0]}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="inline-flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>{txn.cardBrand} •••• {txn.cardLast4}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge status={txn.status} size="sm" />
                </td>
                <td className="px-4 py-3 text-right font-semibold text-[#172033]">
                  ${txn.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;

