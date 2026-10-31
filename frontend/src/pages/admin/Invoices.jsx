import React, { useState, useEffect, useCallback } from 'react';
import { Eye, CreditCard } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { invoicesApi, getApiError } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

/**
 * Admin Invoices page
 *
 * Connected to: GET /api/billing/invoices/ and POST /api/billing/invoices/{id}/pay/
 *
 * Backend Invoice model fields:
 *   id, user (id), subscription (id), amount, status, issued_at, paid_at
 *
 * Status values (lowercase): pending | paid | failed
 *
 * Fields NOT in backend (removed from UI):
 *   invoiceNumber, customerName, customerCompany, dueDate, items, taxAmount, taxRate, subtotal
 */
export const Invoices = () => {
  const { showNotification } = useNotification();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await invoicesApi.getAll();
      setInvoices(data);
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Error Loading Invoices',
        message: getApiError(err)
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleViewInvoice = (inv) => {
    setSelectedInvoice(inv);
    setIsDetailOpen(true);
  };

  const handlePayClick = (inv, e) => {
    e?.stopPropagation();
    setSelectedInvoice(inv);
    setIsPayOpen(true);
  };

  const handleConfirmPay = async () => {
    if (!selectedInvoice) return;
    setPaying(true);
    try {
      await invoicesApi.pay(selectedInvoice.id);
      showNotification({
        type: 'success',
        title: 'Invoice Marked Paid',
        message: `Invoice #${selectedInvoice.id} ($${parseFloat(selectedInvoice.amount).toFixed(2)}) marked as paid.`
      });
      setIsPayOpen(false);
      loadInvoices();
    } catch (err) {
      showNotification({ type: 'error', title: 'Payment Error', message: getApiError(err) });
    } finally {
      setPaying(false);
    }
  };

  const columns = [
    {
      header: 'Invoice ID',
      field: 'id',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-[#172033] font-mono">INV-{String(val).padStart(6, '0')}</span>
      )
    },
    {
      header: 'User / Subscription',
      field: 'user',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-medium text-[#172033] block">User #{val}</span>
          <span className="text-[11px] text-slate-500">Sub #{row.subscription}</span>
        </div>
      )
    },
    {
      header: 'Amount',
      field: 'amount',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-[#172033] font-mono">
          ${parseFloat(val).toFixed(2)}
        </span>
      )
    },
    {
      header: 'Issued At',
      field: 'issued_at',
      sortable: true,
      render: (val) => (
        <span className="text-slate-500 font-mono text-[11px]">
          {val ? new Date(val).toLocaleDateString() : '—'}
        </span>
      )
    },
    {
      header: 'Paid At',
      field: 'paid_at',
      sortable: true,
      render: (val) => (
        <span className="text-slate-500 font-mono text-[11px]">
          {val ? new Date(val).toLocaleDateString() : '—'}
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
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleViewInvoice(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="View Invoice"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'pending' && (
            <button
              onClick={(e) => handlePayClick(row, e)}
              className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
              title="Mark as Paid"
            >
              <CreditCard className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Invoices & Billing History
          </h2>
          <p className="text-xs text-[#64748B]">
            All subscription billing records across customers
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        isLoading={loading}
        onRowClick={handleViewInvoice}
        searchPlaceholder="Search by invoice ID, user or subscription..."
        filterOptions={[
          { label: 'Pending', value: 'pending' },
          { label: 'Paid', value: 'paid' },
          { label: 'Failed', value: 'failed' }
        ]}
      />

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Invoice INV-${String(selectedInvoice.id).padStart(6, '0')}`}
          description={`Issued: ${selectedInvoice.issued_at ? new Date(selectedInvoice.issued_at).toLocaleString() : '—'}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
              {selectedInvoice.status === 'pending' && (
                <Button
                  variant="primary"
                  iconLeft={CreditCard}
                  onClick={() => { setIsDetailOpen(false); setIsPayOpen(true); }}
                >
                  Mark as Paid
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#EAECEF]">
              <div>
                <span className="text-[#64748B] block mb-0.5">Amount</span>
                <span className="text-xl font-extrabold text-[#172033] font-mono">
                  ${parseFloat(selectedInvoice.amount).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Status</span>
                <Badge status={selectedInvoice.status} size="md" />
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">User ID</span>
                <span className="font-semibold text-[#172033] font-mono">#{selectedInvoice.user}</span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Subscription ID</span>
                <span className="font-semibold text-[#172033] font-mono">#{selectedInvoice.subscription}</span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Issued At</span>
                <span className="font-semibold text-[#172033] font-mono">
                  {selectedInvoice.issued_at ? new Date(selectedInvoice.issued_at).toLocaleString() : '—'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Paid At</span>
                <span className={`font-semibold font-mono ${selectedInvoice.paid_at ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {selectedInvoice.paid_at ? new Date(selectedInvoice.paid_at).toLocaleString() : 'Not paid'}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Pay Confirmation */}
      {selectedInvoice && (
        <Modal
          isOpen={isPayOpen}
          onClose={() => setIsPayOpen(false)}
          title="Mark Invoice as Paid"
          description={`INV-${String(selectedInvoice.id).padStart(6, '0')} — $${parseFloat(selectedInvoice.amount).toFixed(2)}`}
          size="sm"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsPayOpen(false)} disabled={paying}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmPay} isLoading={paying}>
                Confirm Payment
              </Button>
            </>
          }
        >
          <p className="text-xs text-[#64748B] leading-relaxed">
            This will mark the invoice as paid and record the payment timestamp.
            This action calls <code className="font-mono bg-slate-100 px-1 rounded">POST /api/billing/invoices/{selectedInvoice.id}/pay/</code>.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Invoices;
