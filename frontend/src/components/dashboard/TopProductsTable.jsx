import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';

export const TopProductsTable = ({ products = [] }) => {
  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="p-5 border-b border-[#EAECEF] flex items-center justify-between bg-[#FFFDF7]/40">
        <div>
          <h3 className="text-base font-semibold text-[#172033]">
            Top Performing Products
          </h3>
          <p className="text-xs text-[#64748B]">
            Subscription volume and revenue drivers
          </p>
        </div>
        <Link
          to="/admin/products"
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 group"
        >
          <span>Manage products</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="p-4 space-y-4">
        {products.map((item) => (
          <div key={item.name} className="flex flex-col gap-1.5 p-3 rounded-lg border border-[#EAECEF] hover:border-amber-200 transition-colors bg-[#FFFDF7]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFF1C2]/60 flex items-center justify-center text-amber-800">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#172033]">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    {item.subscribers.toLocaleString()} active subscribers
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#172033]">
                  {item.revenue}
                </span>
                <span className="block text-[10px] font-semibold text-emerald-600">
                  {item.growth}
                </span>
              </div>
            </div>

            {/* Share progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#FBBF24] h-full rounded-full"
                style={{ width: `${item.share}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsTable;

