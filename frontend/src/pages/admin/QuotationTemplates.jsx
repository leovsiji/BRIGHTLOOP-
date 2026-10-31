import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Eye
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { quotationsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const QuotationTemplates = () => {
  const { showNotification } = useNotification();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuot, setSelectedQuot] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    validDays: 30,
    defaultDiscount: 10,
    totalValue: 5000,
    terms: 'Net 30 terms upon acceptance. 99.9% uptime SLA included.'
  });

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await quotationsApi.getAll();
      setTemplates(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Quotations',
        message: 'Could not fetch quotation proposal templates.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      code: `QT-2025-${Math.floor(10 + Math.random() * 90)}`,
      description: '',
      validDays: 30,
      defaultDiscount: 10,
      totalValue: 7500,
      terms: 'Standard subscription agreement terms apply. Net 30 payment schedule.'
    });
    setIsModalOpen(true);
  };

  const handlePreview = (quot) => {
    setSelectedQuot(quot);
    setIsPreviewOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Quotation title is required.'
      });
      return;
    }

    try {
      await quotationsApi.create({
        ...formData,
        validDays: parseInt(formData.validDays, 10) || 30,
        defaultDiscount: parseFloat(formData.defaultDiscount || 0),
        totalValue: parseFloat(formData.totalValue || 0),
        items: [
          { name: `${formData.title} Base Package`, qty: 1, unitPrice: parseFloat(formData.totalValue) }
        ]
      });
      showNotification({
        type: 'success',
        title: 'Template Created',
        message: `Template "${formData.title}" was saved.`
      });
      setIsModalOpen(false);
      loadTemplates();
    } catch {
      showNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save quotation template.'
      });
    }
  };

  const columns = [
    {
      header: 'Template Title',
      field: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-[#172033] block">{val}</span>
          <span className="text-[11px] text-[#64748B]">{row.description}</span>
        </div>
      )
    },
    {
      header: 'Code',
      field: 'code',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-xs font-semibold text-[#172033] bg-[#FFFDF7] px-2 py-0.5 rounded border border-[#EAECEF]">
          {val}
        </span>
      )
    },
    {
      header: 'Default Discount',
      field: 'defaultDiscount',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-emerald-600 font-mono">
          {val}% OFF
        </span>
      )
    },
    {
      header: 'Validity Window',
      field: 'validDays',
      sortable: true,
      render: (val) => <span className="text-slate-600 font-medium">{val} Days</span>
    },
    {
      header: 'Approx. Contract',
      field: 'totalValue',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-[#172033] font-mono">
          ${val?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handlePreview(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Preview Template"
          >
            <Eye className="w-4 h-4" />
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
            Quotation & Proposal Templates
          </h2>
          <p className="text-xs text-[#64748B]">
            Draft enterprise sales proposals, annual volume commitments, and customized legal terms
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={Plus}
          onClick={handleOpenAdd}
        >
          Create Template
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={templates}
        isLoading={loading}
        onRowClick={handlePreview}
        searchPlaceholder="Search quotation templates..."
      />

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Proposal Template"
        description="Standardize commercial deal configurations and discount terms."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              Save Template
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Template Title"
            placeholder="e.g. Enterprise Annual Cloud Migration"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Template Code"
              placeholder="QT-2025-05"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <Input
              label="Validity (Days)"
              type="number"
              value={formData.validDays}
              onChange={(e) => setFormData({ ...formData, validDays: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Default Discount (%)"
              type="number"
              value={formData.defaultDiscount}
              onChange={(e) => setFormData({ ...formData, defaultDiscount: e.target.value })}
            />
            <Input
              label="Estimated Total Value ($)"
              type="number"
              value={formData.totalValue}
              onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#172033] mb-1.5">
              Standard Terms & SLA
            </label>
            <textarea
              rows={3}
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="w-full rounded-lg border border-[#EAECEF] bg-white px-3 py-2 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24]"
            />
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {selectedQuot && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Quotation: ${selectedQuot.title}`}
          description={`Code: ${selectedQuot.code} • Valid for ${selectedQuot.validDays} days`}
          size="lg"
          footer={
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#FFFDF7] rounded-xl border border-[#EAECEF]">
              <span className="text-[#64748B] block mb-1">Contract Valuation</span>
              <span className="text-2xl font-bold text-[#172033] font-mono">
                ${selectedQuot.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-emerald-700 ml-2 font-semibold">
                ({selectedQuot.defaultDiscount}% incentive discount applied)
              </span>
            </div>

            <div className="p-4 bg-white border border-[#EAECEF] rounded-lg space-y-2">
              <h4 className="font-semibold text-[#172033]">Proposal Line Items</h4>
              <div className="space-y-1">
                {(selectedQuot.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-medium text-[#172033]">{it.name}</span>
                    <span className="font-mono text-slate-600">${it.unitPrice?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EAECEF] rounded-lg">
              <h4 className="font-semibold text-[#172033] mb-1">Commercial Terms & Conditions</h4>
              <p className="text-slate-600 leading-relaxed">{selectedQuot.terms}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default QuotationTemplates;
