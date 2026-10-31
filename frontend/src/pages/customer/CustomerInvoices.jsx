import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Eye,
  CreditCard
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { invoicesApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const CustomerInvoices = () => {
  const { showNotification } = useNotification();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPayNowOpen, setIsPayNowOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await invoicesApi.getCustomerInvoices('cust-001');
      setInvoices(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading',
        message: 'Could not fetch your invoice records.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handlePayNow = (inv, e) => {
    e?.stopPropagation();
    setSelectedInvoice(inv);
    setIsPayNowOpen(true);
  };

  const handleConfirmPay = async () => {
    if (!selectedInvoice) return;
    setPaying(true);
    try {
      await invoicesApi.payInvoice(selectedInvoice.id);
      showNotification({
        type: 'success',
        title: 'Payment Succeeded',
        message: `Invoice ${selectedInvoice.invoiceNumber} ($${selectedInvoice.amount.toFixed(2)}) has been paid.`
      });
      setIsPayNowOpen(false);
      loadInvoices();
    } catch {
      showNotification({
        type: 'error',
        title: 'Payment Error',
        message: 'Could not process card payment.'
      });
    } finally {
      setPaying(false);
    }
  };

  const handleDownload = (inv, e) => {
    e?.stopPropagation();
    showNotification({
      type: 'success',
      title: 'Downloading Invoice',
      message: `Downloading PDF receipt for ${inv.invoiceNumber}...`
    });
  };

  const columns = [
    {
      header: 'Invoice #',
      field: 'invoiceNumber',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-[#172033] font-mono">
          {val}
        </span>
      )
    },
    {
      header: 'Issue Date',
      field: 'issueDate',
      sortable: true,
      render: (val) => <span className="font-mono text-slate-600 text-[11px]">{val}</span>
    },
    {
      header: 'Due Date',
      field: 'dueDate',
      sortable: true,
      render: (val) => <span className="font-mono text-slate-600 text-[11px]">{val}</span>
    },
    {
      header: 'Amount',
      field: 'amount',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-[#172033] font-mono">
          ${val?.toFixed(2)}
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
            onClick={() => {
              setSelectedInvoice(row);
              setIsDetailOpen(true);
            }}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleDownload(row, e)}
            className="p-1 rounded text-slate-400 hover:text-amber-700 hover:bg-amber-50"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          {row.status === 'Pending' && (
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => handlePayNow(row, e)}
            >
              Pay Now
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          Billing & Invoices
        </h2>
        <p className="text-xs text-[#64748B]">
          Official receipts and payment settlements for your organization
        </p>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        isLoading={loading}
        onRowClick={(inv) => {
          setSelectedInvoice(inv);
          setIsDetailOpen(true);
        }}
        searchPlaceholder="Search invoices..."
        filterOptions={[
          { label: 'Paid', value: 'Paid' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Overdue', value: 'Overdue' }
        ]}
      />

      {/* Pay Now Dialog */}
      {selectedInvoice && (
        <Modal
          isOpen={isPayNowOpen}
          onClose={() => setIsPayNowOpen(false)}
          title={`Pay Invoice ${selectedInvoice.invoiceNumber}`}
          description={`Outstanding balance: $${selectedInvoice.amount?.toFixed(2)}`}
          size="sm"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsPayNowOpen(false)} disabled={paying}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmPay} isLoading={paying}>
                Pay ${selectedInvoice.amount?.toFixed(2)}
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white border border-[#EAECEF] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="font-semibold text-[#172033] block">Corporate Visa</span>
                  <span className="text-slate-500 font-mono text-[11px]">•••• 4242</span>
                </div>
              </div>
              <Badge status="Active" size="sm">Primary</Badge>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Your default payment card will be charged immediately. A settled receipt will be dispatched to your billing contact email.
            </p>
          </div>
        </Modal>
      )}

      {/* Invoice Detail View */}
      {selectedInvoice && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Invoice ${selectedInvoice.invoiceNumber}`}
          description={`Issued ${selectedInvoice.issueDate} • Due ${selectedInvoice.dueDate}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                iconLeft={Download}
                onClick={(e) => handleDownload(selectedInvoice, e)}
              >
                Download PDF
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center p-4 bg-[#FFFDF7] rounded-xl border border-[#EAECEF]">
              <div>
                <span className="text-[#64748B] block mb-0.5">Amount Due</span>
                <span className="text-2xl font-extrabold text-[#172033] font-mono">
                  ${selectedInvoice.amount?.toFixed(2)}
                </span>
              </div>
              <Badge status={selectedInvoice.status} size="md" />
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-[#172033]">Invoice Line Items</h4>
              {(selectedInvoice.items || []).map((it) => (
                <div key={it.id} className="p-3 bg-white border border-[#EAECEF] rounded-lg flex justify-between">
                  <span className="font-medium text-[#172033]">{it.description}</span>
                  <span className="font-bold text-[#172033] font-mono">${it.amount?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerInvoices;
