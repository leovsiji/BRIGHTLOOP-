import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Eye,
  Clock
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { customersApi, subscriptionsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const Customers = () => {
  const { showNotification } = useNotification();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [customerSubs, setCustomerSubs] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'Active',
    tier: 'Professional',
    billingAddress: '',
    taxId: ''
  });

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customersApi.getAll();
      setCustomers(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Customers',
        message: 'Could not fetch customer directory.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      status: 'Active',
      tier: 'Starter',
      billingAddress: '',
      taxId: ''
    });
    setIsModalOpen(true);
  };

  const handleViewProfile = async (cust) => {
    setSelectedCust(cust);
    setIsProfileOpen(true);
    try {
      const subs = await subscriptionsApi.getCustomerSubscriptions(cust.id);
      setCustomerSubs(subs);
    } catch {
      setCustomerSubs([]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Name and email are mandatory.'
      });
      return;
    }

    try {
      await customersApi.create(formData);
      showNotification({
        type: 'success',
        title: 'Customer Added',
        message: `${formData.name} was registered.`
      });
      setIsModalOpen(false);
      loadCustomers();
    } catch {
      showNotification({
        type: 'error',
        title: 'Create Failed',
        message: 'Failed to create customer record.'
      });
    }
  };

  const columns = [
    {
      header: 'Customer',
      field: 'name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={val}
            className="w-8 h-8 rounded-full object-cover border border-[#EAECEF]"
          />
          <div>
            <span className="font-semibold text-[#172033] block">{val}</span>
            <span className="text-[11px] text-[#64748B]">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Company',
      field: 'company',
      sortable: true,
      render: (val) => <span className="font-medium text-[#172033]">{val}</span>
    },
    {
      header: 'Tier',
      field: 'tier',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FFF1C2]/80 text-amber-900 border border-amber-200">
          {val}
        </span>
      )
    },
    {
      header: 'Active Subs',
      field: 'activeSubscriptionsCount',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="font-semibold text-[#172033]">
          {val}
        </span>
      )
    },
    {
      header: 'Total Spent (LTV)',
      field: 'totalSpent',
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
            onClick={() => handleViewProfile(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Customer Profile & History"
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
            Customer Directory
          </h2>
          <p className="text-xs text-[#64748B]">
            Manage enterprise accounts, contacts, and account-level subscription history
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={Plus}
          onClick={handleOpenAdd}
        >
          Add Customer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        isLoading={loading}
        onRowClick={handleViewProfile}
        searchPlaceholder="Search customer by name, email or company..."
        filterOptions={[
          { label: 'Active', value: 'Active' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Suspended', value: 'Suspended' }
        ]}
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Customer Account"
        description="Create a new business contact profile and tax record."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              Save Customer
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Sarah Jenkins"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. sarah@acmecorp.io"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="Acme Corporation"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Account Tier"
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
              options={['Starter', 'Professional', 'Enterprise']}
            />
            <Input
              label="Tax / VAT ID"
              placeholder="e.g. US-EIN-9847291"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            />
          </div>

          <Input
            label="Billing Street Address"
            placeholder="450 Mission Street, Suite 800, San Francisco, CA"
            value={formData.billingAddress}
            onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
          />
        </form>
      </Modal>

      {/* Customer Profile & Subscription History Modal */}
      {selectedCust && (
        <Modal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          title={selectedCust.name}
          description={`Customer Profile • ${selectedCust.company}`}
          size="lg"
          footer={
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-5 text-xs">
            {/* Header snippet */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFFDF7] border border-[#EAECEF]">
              <img
                src={selectedCust.avatar}
                alt={selectedCust.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#172033]">
                    {selectedCust.name}
                  </h3>
                  <Badge status={selectedCust.status} size="sm" />
                </div>
                <p className="text-slate-500 mt-0.5">{selectedCust.company} • {selectedCust.email}</p>
                <p className="text-slate-500 font-mono text-[11px] mt-0.5">Tax ID: {selectedCust.taxId || 'N/A'}</p>
              </div>

              <div className="text-right">
                <span className="text-[#64748B] block text-[11px]">Lifetime Value</span>
                <span className="text-base font-bold text-[#172033] font-mono">
                  ${selectedCust.totalSpent?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="p-3 bg-white border border-[#EAECEF] rounded-lg">
              <span className="font-semibold text-[#172033] block mb-1">Billing Address</span>
              <p className="text-[#64748B]">{selectedCust.billingAddress || 'No billing address provided.'}</p>
            </div>

            {/* Subscription History */}
            <div>
              <h4 className="font-semibold text-[#172033] mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Subscription Contracts & History</span>
              </h4>

              {customerSubs.length === 0 ? (
                <p className="text-slate-500 p-4 text-center bg-slate-50 rounded-lg">
                  No subscription records linked to this customer yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {customerSubs.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 bg-white border border-[#EAECEF] rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#172033]">{sub.planName}</span>
                          <Badge status={sub.status} size="sm" />
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {sub.code} • Since {sub.startDate}
                        </span>
                      </div>

                      <div className="text-right font-mono font-semibold text-[#172033]">
                        ${sub.amount?.toFixed(2)} / {sub.billingCycle?.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Customers;
