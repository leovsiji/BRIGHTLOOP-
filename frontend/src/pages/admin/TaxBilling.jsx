import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Save
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { taxBillingApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const TaxBilling = () => {
  const { showNotification } = useNotification();
  const [taxConfig, setTaxConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Form states
  const [billingSettings, setBillingSettings] = useState({});
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [newTaxRate, setNewTaxRate] = useState({
    country: '',
    region: '',
    rate: '',
    name: 'Sales Tax',
    taxIdRequired: false
  });

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const config = await taxBillingApi.getConfig();
      setTaxConfig(config);
      setBillingSettings(config.billingSettings || {});
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Settings',
        message: 'Could not fetch tax and billing configurations.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSaveBillingSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await taxBillingApi.updateSettings(billingSettings);
      showNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Billing parameters and dunning configuration updated.'
      });
    } catch {
      showNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to update billing settings.'
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddTaxRate = async (e) => {
    e.preventDefault();
    if (!newTaxRate.country || !newTaxRate.rate) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Country and rate percentage are required.'
      });
      return;
    }

    try {
      await taxBillingApi.addTaxRate({
        ...newTaxRate,
        rate: parseFloat(newTaxRate.rate)
      });
      showNotification({
        type: 'success',
        title: 'Tax Rate Added',
        message: `Tax rate for ${newTaxRate.country} (${newTaxRate.rate}%) was configured.`
      });
      setIsTaxModalOpen(false);
      loadConfig();
    } catch {
      showNotification({
        type: 'error',
        title: 'Add Failed',
        message: 'Could not register tax rate.'
      });
    }
  };

  const taxColumns = [
    {
      header: 'Country / Jurisdiction',
      field: 'country',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-[#172033] block">{val}</span>
          <span className="text-[11px] text-[#64748B]">{row.region}</span>
        </div>
      )
    },
    {
      header: 'Tax Type',
      field: 'name',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FFF1C2] text-amber-900 border border-amber-300">
          {val}
        </span>
      )
    },
    {
      header: 'Rate Percentage',
      field: 'rate',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-[#172033] font-mono">
          {val}%
        </span>
      )
    },
    {
      header: 'Tax ID Required',
      field: 'taxIdRequired',
      sortable: true,
      render: (val) => (
        <Badge
          status={val ? 'Active' : 'Draft'}
          dot={false}
          size="sm"
        >
          {val ? 'Mandatory' : 'Optional'}
        </Badge>
      )
    },
    {
      header: 'Default Rule',
      field: 'isDefault',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-medium text-slate-500">
          {val ? 'Fallback Default' : 'Regional Match'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          Tax & Billing Protocols
        </h2>
        <p className="text-xs text-[#64748B]">
          Jurisdictional tax compliance, VAT ID validation, invoice numbering, and dunning retries
        </p>
      </div>

      {/* Tax Rates Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#172033]">
              Jurisdictional Tax Rates
            </h3>
            <p className="text-xs text-[#64748B]">
              Standard sales tax, VAT, and GST levied on digital subscriptions
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            iconLeft={Plus}
            onClick={() => {
              setNewTaxRate({
                country: '',
                region: '',
                rate: '',
                name: 'Sales Tax',
                taxIdRequired: false
              });
              setIsTaxModalOpen(true);
            }}
          >
            Add Tax Rate
          </Button>
        </div>

        <DataTable
          columns={taxColumns}
          data={taxConfig?.taxRates || []}
          isLoading={loading}
          searchPlaceholder="Search country or tax code..."
        />
      </div>

      {/* General Billing & Dunning Configuration */}
      <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="mb-6 pb-4 border-b border-[#EAECEF]">
          <h3 className="text-base font-semibold text-[#172033]">
            Billing & Invoicing Rules
          </h3>
          <p className="text-xs text-[#64748B]">
            Automated dunning cycles, invoice sequence formatting, and grace periods
          </p>
        </div>

        <form onSubmit={handleSaveBillingSettings} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Legal Entity Name"
              value={billingSettings.companyName || ''}
              onChange={(e) =>
                setBillingSettings({ ...billingSettings, companyName: e.target.value })
              }
              required
            />
            <Input
              label="Tax Registration ID"
              value={billingSettings.taxId || ''}
              onChange={(e) =>
                setBillingSettings({ ...billingSettings, taxId: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Invoice Number Prefix"
              value={billingSettings.invoicePrefix || ''}
              onChange={(e) =>
                setBillingSettings({ ...billingSettings, invoicePrefix: e.target.value })
              }
              required
            />
            <Input
              label="Next Sequence #"
              type="number"
              value={billingSettings.nextInvoiceNumber || 0}
              onChange={(e) =>
                setBillingSettings({
                  ...billingSettings,
                  nextInvoiceNumber: parseInt(e.target.value, 10)
                })
              }
            />
            <Input
              label="Payment Grace Period (Days)"
              type="number"
              value={billingSettings.paymentGracePeriodDays || 14}
              onChange={(e) =>
                setBillingSettings({
                  ...billingSettings,
                  paymentGracePeriodDays: parseInt(e.target.value, 10)
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Dunning Retries Before Cancellation"
              type="number"
              value={billingSettings.dunningRetries || 4}
              onChange={(e) =>
                setBillingSettings({
                  ...billingSettings,
                  dunningRetries: parseInt(e.target.value, 10)
                })
              }
            />
            <Input
              label="Billing Contact Email"
              type="email"
              value={billingSettings.billingEmail || ''}
              onChange={(e) =>
                setBillingSettings({ ...billingSettings, billingEmail: e.target.value })
              }
            />
          </div>

          {/* Feature Toggles */}
          <div className="p-4 bg-[#FFFDF7] rounded-xl border border-[#EAECEF] space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={billingSettings.autoInvoicing ?? true}
                onChange={(e) =>
                  setBillingSettings({ ...billingSettings, autoInvoicing: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <div>
                <span className="text-xs font-semibold text-[#172033] block">
                  Automatic Recurring Invoicing
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Automatically generate and dispatch digital invoices upon subscription renewal
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={billingSettings.digitalExemptionEnabled ?? true}
                onChange={(e) =>
                  setBillingSettings({
                    ...billingSettings,
                    digitalExemptionEnabled: e.target.checked
                  })
                }
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <div>
                <span className="text-xs font-semibold text-[#172033] block">
                  B2B Reverse Charge VAT Exemption
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Exempt VAT automatically for verified EU VIES companies with registered VAT ID
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              iconLeft={Save}
              isLoading={savingSettings}
            >
              Save Billing Rules
            </Button>
          </div>
        </form>
      </div>

      {/* Add Tax Rate Modal */}
      <Modal
        isOpen={isTaxModalOpen}
        onClose={() => setIsTaxModalOpen(false)}
        title="Add Tax Jurisdiction"
        description="Configure tax rates applied automatically during customer checkout."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsTaxModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddTaxRate}>
              Add Jurisdiction
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddTaxRate} className="space-y-4">
          <Input
            label="Country"
            placeholder="e.g. Germany"
            value={newTaxRate.country}
            onChange={(e) => setNewTaxRate({ ...newTaxRate, country: e.target.value })}
            required
          />

          <Input
            label="Region / State (Optional)"
            placeholder="e.g. Bavaria (or leave blank for federal)"
            value={newTaxRate.region}
            onChange={(e) => setNewTaxRate({ ...newTaxRate, region: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Rate (%)"
              type="number"
              step="0.01"
              placeholder="19.00"
              value={newTaxRate.rate}
              onChange={(e) => setNewTaxRate({ ...newTaxRate, rate: e.target.value })}
              required
            />
            <Select
              label="Tax Type"
              value={newTaxRate.name}
              onChange={(e) => setNewTaxRate({ ...newTaxRate, name: e.target.value })}
              options={['Sales Tax', 'VAT', 'GST', 'HST']}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={newTaxRate.taxIdRequired}
              onChange={(e) =>
                setNewTaxRate({ ...newTaxRate, taxIdRequired: e.target.checked })
              }
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-xs text-[#172033]">Require Tax / VAT registration ID from customer</span>
          </label>
        </form>
      </Modal>
    </div>
  );
};

export default TaxBilling;
