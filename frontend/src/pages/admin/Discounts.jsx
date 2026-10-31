import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  ToggleLeft,
  ToggleRight,
  Copy
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { discountsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

// Compute today's date outside the component so it is stable across renders
const todayStr = new Date().toISOString().split('T')[0];

const INITIAL_FORM = {
  code: '',
  name: '',
  type: 'percentage',
  value: '',
  minPurchase: '',
  usageLimit: 100,
  validFrom: todayStr,
  validUntil: '2026-12-31',
  description: ''
};

export const Discounts = () => {
  const { showNotification } = useNotification();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const loadDiscounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await discountsApi.getAll();
      setDiscounts(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Discounts',
        message: 'Could not fetch active discount campaigns.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadDiscounts();
  }, [loadDiscounts]);

  const handleOpenAdd = () => {
    setFormData({
      code: `DISC${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      type: 'percentage',
      value: '',
      minPurchase: '0',
      usageLimit: 500,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '2026-12-31',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleToggle = async (id, e) => {
    e?.stopPropagation();
    try {
      const updated = await discountsApi.toggleStatus(id);
      showNotification({
        type: 'info',
        title: 'Status Updated',
        message: `Discount ${updated.code} is now ${updated.status}.`
      });
      loadDiscounts();
    } catch {
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not toggle coupon status.'
      });
    }
  };

  const handleCopyCode = (code, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(code);
    showNotification({
      type: 'success',
      title: 'Copied Code',
      message: `Promo code "${code}" copied to clipboard.`
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.value) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Coupon code, name and value are required.'
      });
      return;
    }

    try {
      await discountsApi.create({
        ...formData,
        value: parseFloat(formData.value),
        minPurchase: parseFloat(formData.minPurchase || 0),
        usageLimit: parseInt(formData.usageLimit, 10) || 100
      });
      showNotification({
        type: 'success',
        title: 'Discount Created',
        message: `Coupon code "${formData.code}" is ready to use.`
      });
      setIsModalOpen(false);
      loadDiscounts();
    } catch {
      showNotification({
        type: 'error',
        title: 'Create Failed',
        message: 'Could not create discount coupon.'
      });
    }
  };

  const columns = [
    {
      header: 'Promo Code',
      field: 'code',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-amber-950 bg-[#FFF1C2] px-2.5 py-0.5 rounded border border-amber-300">
            {val}
          </span>
          <button
            onClick={(e) => handleCopyCode(val, e)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="Copy promo code"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    },
    {
      header: 'Campaign Name',
      field: 'name',
      sortable: true,
      render: (val) => (
        <div>
          <span className="font-semibold text-[#172033] block">{val}</span>
          <span className="text-[11px] text-[#64748B]">{row.description}</span>
        </div>
      )
    },
    {
      header: 'Benefit Value',
      field: 'value',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-[#172033] font-mono">
          {row.type === 'percentage' ? `${val}% OFF` : `$${parseFloat(val).toFixed(2)} OFF`}
        </span>
      )
    },
    {
      header: 'Min. Order',
      field: 'minPurchase',
      sortable: true,
      render: (val) => (
        <span className="text-slate-600 font-mono">
          ${parseFloat(val || 0).toFixed(2)}
        </span>
      )
    },
    {
      header: 'Redemptions',
      key: 'usage',
      render: (_, row) => (
        <div className="w-28">
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="font-semibold text-[#172033]">{row.usageCount}</span>
            <span className="text-slate-400">/ {row.usageLimit}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#FBBF24] h-full rounded-full"
              style={{ width: `${Math.min(100, Math.round((row.usageCount / row.usageLimit) * 100))}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: 'Validity Period',
      key: 'validity',
      render: (_, row) => (
        <span className="text-[11px] text-slate-500 font-mono">
          {row.validFrom} → {row.validUntil}
        </span>
      )
    },
    {
      header: 'Status',
      field: 'status',
      sortable: true,
      render: (val) => <Badge status={val} size="sm" />
    },
    {
      header: 'Active State',
      key: 'toggle',
      align: 'right',
      render: (_, row) => (
        <button
          onClick={(e) => handleToggle(row.id, e)}
          className={`p-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
            row.status === 'Active'
              ? 'text-emerald-700 hover:bg-emerald-50'
              : 'text-slate-400 hover:bg-slate-100'
          }`}
          title={row.status === 'Active' ? 'Disable discount' : 'Enable discount'}
        >
          {row.status === 'Active' ? (
            <ToggleRight className="w-5 h-5 text-emerald-600" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-slate-400" />
          )}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Discounts & Coupons
          </h2>
          <p className="text-xs text-[#64748B]">
            Promotional codes, percentage price reductions, and usage threshold gates
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={Plus}
          onClick={handleOpenAdd}
        >
          Create Discount
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={discounts}
        isLoading={loading}
        searchPlaceholder="Search coupon code or campaign name..."
        filterOptions={[
          { label: 'Active', value: 'Active' },
          { label: 'Expired', value: 'Expired' },
          { label: 'Disabled', value: 'Disabled' }
        ]}
      />

      {/* Add Discount Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Coupon"
        description="Configure discount rate, expiration date, and redemption limits."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              Create Coupon
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Promo Code"
              placeholder="e.g. FLASH25"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
            />
            <Input
              label="Campaign Name"
              placeholder="e.g. Spring Growth Campaign"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Discount Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { label: 'Percentage (%)', value: 'percentage' },
                { label: 'Fixed Amount ($)', value: 'fixed' }
              ]}
              required
            />
            <Input
              label={formData.type === 'percentage' ? 'Percent Off (%)' : 'Amount Off ($)'}
              type="number"
              step="0.01"
              placeholder={formData.type === 'percentage' ? '20' : '50.00'}
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              required
            />
            <Input
              label="Min. Purchase ($)"
              type="number"
              placeholder="100.00"
              value={formData.minPurchase}
              onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Max Usage Limit"
              type="number"
              placeholder="500"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            />
            <Input
              label="Valid From"
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            />
            <Input
              label="Valid Until"
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </div>

          <Input
            label="Internal Description / Note"
            placeholder="Available for verified SaaS teams upon sign up..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Discounts;
