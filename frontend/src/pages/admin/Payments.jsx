import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  RefreshCw,
  RotateCcw,
  Eye
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { paymentsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const Payments = () => {
  const { showNotification } = useNotification();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refund modal state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentsApi.getAll();
      setPayments(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Payments',
        message: 'Could not fetch payments telemetry.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleOpenRefund = (payment, e) => {
    e?.stopPropagation();
    setSelectedPayment(payment);
    setIsRefundOpen(true);
  };

  const handleRefundConfirm = async () => {
    if (!selectedPayment) return;
    try {
      await paymentsApi.refund(selectedPayment.id);
      showNotification({
        type: 'success',
        title: 'Refund Processed',
        message: `Refund for ${selectedPayment.transactionId} ($${selectedPayment.amount.toFixed(2)}) has been initiated.`
      });
      setIsRefundOpen(false);
      loadPayments();
    } catch {
      showNotification({
        type: 'error',
        title: 'Refund Failed',
        message: 'Could not process refund through gateway.'
      });
    }
  };

  const handleViewDetail = (payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  };

  const columns = [
    {
      header: 'Transaction ID',
      field: 'transactionId',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-[#172033] font-mono">
          {val}
        </span>
      )
    },
    {
      header: 'Customer',
      field: 'customerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-medium text-[#172033] block">{val}</span>
          <span className="text-[11px] text-[#64748B]">{row.customerCompany}</span>
        </div>
      )
    },
    {
      header: 'Invoice',
      field: 'invoiceNumber',
      sortable: true,
      render: (val) => <span className="font-mono text-[11px] text-slate-500">{val}</span>
    },
    {
      header: 'Payment Method',
      field: 'method',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-[#172033]">
            {row.cardBrand} •••• {row.cardLast4}
          </span>
        </div>
      )
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
      header: 'Date & Time',
      field: 'date',
      sortable: true,
      render: (val) => <span className="text-slate-500 text-[11px]">{val}</span>
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
            onClick={() => handleViewDetail(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Inspect Transaction"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'Succeeded' && (
            <button
              onClick={(e) => handleOpenRefund(row, e)}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Issue Refund"
            >
              <RotateCcw className="w-4 h-4" />
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
            Payments & Gateway Records
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time ledger of card charges, bank transfers, failed retries, and refunds
          </p>
        </div>

        <Button
          variant="outline"
          iconLeft={RefreshCw}
          onClick={loadPayments}
          isLoading={loading}
        >
          Sync Gateway
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        isLoading={loading}
        onRowClick={handleViewDetail}
        searchPlaceholder="Search by transaction ID, invoice or customer..."
        filterOptions={[
          { label: 'Succeeded', value: 'Succeeded' },
          { label: 'Processing', value: 'Processing' },
          { label: 'Failed', value: 'Failed' },
          { label: 'Refunded', value: 'Refunded' }
        ]}
      />

      {/* Transaction Detail Modal */}
      {selectedPayment && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Payment: ${selectedPayment.transactionId}`}
          description={`Processed via ${selectedPayment.gateway || 'Stripe Direct'}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              {selectedPayment.status === 'Succeeded' && (
                <Button
                  variant="danger"
                  iconLeft={RotateCcw}
                  onClick={(e) => {
                    setIsDetailOpen(false);
                    handleOpenRefund(selectedPayment, e);
                  }}
                >
                  Refund Payment
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#EAECEF]">
              <div>
                <span className="text-[#64748B] block mb-0.5">Charged Amount</span>
                <span className="text-base font-bold text-[#172033] font-mono">
                  ${selectedPayment.amount?.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">{selectedPayment.currency}</span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Status</span>
                <Badge status={selectedPayment.status} size="sm" />
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Method</span>
                <span className="text-sm font-semibold text-[#172033]">
                  {selectedPayment.cardBrand} •••• {selectedPayment.cardLast4}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Invoice</span>
                <span className="text-sm font-mono font-semibold text-[#172033]">
                  {selectedPayment.invoiceNumber}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#EAECEF] rounded-lg space-y-2">
              <h4 className="font-semibold text-[#172033]">Customer Billing Account</h4>
              <p className="text-slate-600">
                Payer: <strong className="text-[#172033]">{selectedPayment.customerName}</strong> ({selectedPayment.customerCompany})
              </p>
              <p className="text-slate-500 font-mono text-[11px]">
                Email: {selectedPayment.customerEmail}
              </p>
              <p className="text-slate-500 text-[11px]">
                Timestamp: {selectedPayment.date}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Refund Confirmation */}
      <ConfirmDialog
        isOpen={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
        onConfirm={handleRefundConfirm}
        title="Confirm Payment Refund"
        message={`Are you sure you want to refund $${selectedPayment?.amount.toFixed(2)} back to ${selectedPayment?.customerName}'s card? The funds will return to the customer in 3-5 business days.`}
        confirmText="Confirm Refund"
        isDanger={true}
      />
    </div>
  );
};

export default Payments;
