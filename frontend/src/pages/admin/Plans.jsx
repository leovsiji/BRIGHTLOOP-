import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Archive
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { plansApi, productsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const Plans = () => {
  const { showNotification } = useNotification();
  const [plans, setPlans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    productId: '',
    billingCycle: 'Monthly',
    price: '',
    currency: 'USD',
    minimumQuantity: 1,
    trialPeriodDays: 14,
    availabilityStart: '2025-01-01',
    availabilityEnd: '2027-12-31',
    status: 'Active',
    featuresText: ''
  });

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const [plansData, prodsData] = await Promise.all([
        plansApi.getAll(),
        productsApi.getAll()
      ]);
      setPlans(plansData);
      setProducts(prodsData);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Plans',
        message: 'Could not fetch subscription plans.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleOpenAdd = () => {
    setSelectedPlan(null);
    setFormData({
      name: '',
      code: `PLN-${Math.floor(1000 + Math.random() * 9000)}`,
      description: '',
      productId: products[0]?.id || '',
      billingCycle: 'Monthly',
      price: '',
      currency: 'USD',
      minimumQuantity: 1,
      trialPeriodDays: 14,
      availabilityStart: new Date().toISOString().split('T')[0],
      availabilityEnd: '2027-12-31',
      status: 'Active',
      featuresText: 'Up to 10 team seats\n24/7 Priority support\nAutomatic billing & receipts'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan, e) => {
    e?.stopPropagation();
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      code: plan.code,
      description: plan.description,
      productId: plan.productId,
      billingCycle: plan.billingCycle,
      price: plan.price,
      currency: plan.currency || 'USD',
      minimumQuantity: plan.minimumQuantity || 1,
      trialPeriodDays: plan.trialPeriodDays ?? 14,
      availabilityStart: plan.availabilityStart || '2025-01-01',
      availabilityEnd: plan.availabilityEnd || '2027-12-31',
      status: plan.status,
      featuresText: (plan.features || []).join('\n')
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (plan, e) => {
    e?.stopPropagation();
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Plan name and price are required.'
      });
      return;
    }

    const linkedProd = products.find((p) => p.id === formData.productId);
    const parsedFeatures = formData.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      minimumQuantity: parseInt(formData.minimumQuantity, 10) || 1,
      trialPeriodDays: parseInt(formData.trialPeriodDays, 10) || 0,
      productName: linkedProd?.name || 'BrightCloud Suite',
      features: parsedFeatures
    };

    try {
      if (selectedPlan) {
        await plansApi.update(selectedPlan.id, payload);
        showNotification({
          type: 'success',
          title: 'Plan Updated',
          message: `${formData.name} was successfully updated.`
        });
      } else {
        await plansApi.create(payload);
        showNotification({
          type: 'success',
          title: 'Plan Created',
          message: `${formData.name} has been published.`
        });
      }
      setIsModalOpen(false);
      loadPlans();
    } catch {
      showNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Unable to save plan changes.'
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlan) return;
    try {
      await plansApi.delete(selectedPlan.id);
      showNotification({
        type: 'success',
        title: 'Plan Archived',
        message: `${selectedPlan.name} is now archived.`
      });
      setIsDeleteOpen(false);
      loadPlans();
    } catch {
      showNotification({
        type: 'error',
        title: 'Action Failed',
        message: 'Could not archive the plan.'
      });
    }
  };

  const columns = [
    {
      header: 'Plan Name',
      field: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-[#172033] block">{val}</span>
          <span className="text-[11px] text-[#64748B] font-mono">{row.code}</span>
        </div>
      )
    },
    {
      header: 'Product',
      field: 'productName',
      sortable: true,
      render: (val) => <span className="text-[#172033] font-medium">{val}</span>
    },
    {
      header: 'Billing Cycle',
      field: 'billingCycle',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFFDF7] border border-[#EAECEF] text-[#172033]">
          {val}
        </span>
      )
    },
    {
      header: 'Price',
      field: 'price',
      sortable: true,
      render: (val, row) => (
        <span className="font-semibold text-[#172033] font-mono">
          ${parseFloat(val).toFixed(2)} / {row.billingCycle?.toLowerCase()}
        </span>
      )
    },
    {
      header: 'Trial',
      field: 'trialPeriodDays',
      sortable: true,
      render: (val) => (
        <span className="text-slate-600">
          {val > 0 ? `${val} days` : 'None'}
        </span>
      )
    },
    {
      header: 'Validity Window',
      key: 'validity',
      render: (_, row) => (
        <span className="text-[11px] text-slate-500 font-mono">
          {row.availabilityStart} → {row.availabilityEnd}
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
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => handleOpenEdit(row, e)}
            className="p-1 rounded text-slate-400 hover:text-amber-700 hover:bg-amber-50"
            title="Edit Plan"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenDelete(row, e)}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Archive Plan"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Subscription Plans
          </h2>
          <p className="text-xs text-[#64748B]">
            Set up recurring pricing tiers, trial terms, and renewal cycles
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Grid / Table Toggle */}
          <div className="inline-flex items-center bg-white border border-[#EAECEF] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded font-medium ${
                viewMode === 'grid'
                  ? 'bg-[#FFF1C2] text-[#172033] font-semibold'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded font-medium ${
                viewMode === 'table'
                  ? 'bg-[#FFF1C2] text-[#172033] font-semibold'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              Table
            </button>
          </div>

          <Button
            variant="primary"
            iconLeft={Plus}
            onClick={handleOpenAdd}
          >
            Create Plan
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border rounded-xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                plan.popular
                  ? 'border-amber-400 shadow-md ring-1 ring-amber-400/50'
                  : 'border-[#EAECEF] hover:border-amber-200 shadow-xs'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FBBF24] text-[#172033] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs border border-amber-400">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-[#172033]">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-[#64748B] font-mono">
                      {plan.code} • {plan.productName}
                    </p>
                  </div>
                  <Badge status={plan.status} size="sm" />
                </div>

                <p className="text-xs text-[#64748B] mb-4 min-h-[36px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 my-3 pb-3 border-b border-[#EAECEF]">
                  <span className="text-3xl font-extrabold text-[#172033] font-mono">
                    ${plan.price}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium">
                    / {plan.billingCycle?.toLowerCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-semibold text-[#172033] uppercase tracking-wider">
                    Included Features
                  </p>
                  {(plan.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#172033]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAECEF] flex items-center justify-between text-xs">
                <span className="text-[#64748B] text-[11px]">
                  {plan.trialPeriodDays ? `${plan.trialPeriodDays}-day free trial` : 'Immediate billing'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleOpenEdit(plan, e)}
                    className="p-1.5 rounded-md border border-[#EAECEF] hover:bg-[#FFFDF7] text-slate-600"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleOpenDelete(plan, e)}
                    className="p-1.5 rounded-md border border-[#EAECEF] hover:bg-rose-50 text-rose-600"
                    title="Archive Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={plans}
          isLoading={loading}
          searchPlaceholder="Search plans by title or code..."
          filterOptions={[
            { label: 'Active', value: 'Active' },
            { label: 'Archived', value: 'Archived' },
            { label: 'Draft', value: 'Draft' }
          ]}
        />
      )}

      {/* Add / Edit Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlan ? 'Edit Plan' : 'Create Subscription Plan'}
        description="Configure recurring pricing, schedule intervals, and user entitlements."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {selectedPlan ? 'Save Changes' : 'Publish Plan'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Plan Name"
              placeholder="e.g. Professional Tier"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Plan Code"
              placeholder="e.g. PLN-PRO"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Linked Product"
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              options={products.map((p) => ({ label: p.name, value: p.id }))}
              required
            />

            <Select
              label="Billing Cycle"
              value={formData.billingCycle}
              onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
              options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
              required
            />

            <Input
              label="Price (USD)"
              type="number"
              step="0.01"
              placeholder="149.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Trial Days"
              type="number"
              placeholder="14"
              value={formData.trialPeriodDays}
              onChange={(e) => setFormData({ ...formData, trialPeriodDays: e.target.value })}
            />

            <Input
              label="Min. Quantity"
              type="number"
              value={formData.minimumQuantity}
              onChange={(e) => setFormData({ ...formData, minimumQuantity: e.target.value })}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={['Active', 'Draft', 'Archived']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Availability Start"
              type="date"
              value={formData.availabilityStart}
              onChange={(e) => setFormData({ ...formData, availabilityStart: e.target.value })}
            />

            <Input
              label="Availability End"
              type="date"
              value={formData.availabilityEnd}
              onChange={(e) => setFormData({ ...formData, availabilityEnd: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#172033] mb-1.5">
              Features (one per line)
            </label>
            <textarea
              rows={4}
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              placeholder="Unlimited operations&#10;Priority support SLA&#10;Custom domain branding"
              className="w-full rounded-lg border border-[#EAECEF] bg-white px-3 py-2 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24]"
            />
          </div>
        </form>
      </Modal>

      {/* Delete / Archive Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Archive Subscription Plan"
        message={`Are you sure you want to archive "${selectedPlan?.name}"? Existing subscribers will retain their terms, but new checkouts will be restricted.`}
        confirmText="Archive Plan"
        isDanger={false}
      />
    </div>
  );
};

export default Plans;
