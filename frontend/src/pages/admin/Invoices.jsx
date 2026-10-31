import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Printer,
  Eye
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { invoicesApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const Invoices = () => {
  const { showNotification } = useNotification();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await invoicesApi.getAll();
      setInvoices(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Invoices',
        message: 'Could not fetch invoices from billing service.'
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (inv, e) => {
    e?.stopPropagation();
    showNotification({
      type: 'success',
      title: 'Invoice PDF Download',
      message: `Generating digital receipt for ${inv.invoiceNumber}...`
    });
  };

  const columns = [
    {
      header: 'Invoice Number',
      field: 'invoiceNumber',
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
      header: 'Issue Date',
      field: 'issueDate',
      sortable: true,
      render: (val) => <span className="text-slate-600 font-mono text-[11px]">{val}</span>
    },
    {
      header: 'Due Date',
      field: 'dueDate',
      sortable: true,
      render: (val) => <span className="text-slate-600 font-mono text-[11px]">{val}</span>
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
            onClick={() => handleViewInvoice(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Inspect Invoice"
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
            Automated recurrent invoices, tax assessments, and collection statuses
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        isLoading={loading}
        onRowClick={handleViewInvoice}
        searchPlaceholder="Search invoice #, customer or company..."
        filterOptions={[
          { label: 'Paid', value: 'Paid' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Overdue', value: 'Overdue' },
          { label: 'Draft', value: 'Draft' }
        ]}
      />

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Invoice ${selectedInvoice.invoiceNumber}`}
          description={`Issued to ${selectedInvoice.customerName} on ${selectedInvoice.issueDate}`}
          size="xl"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              <Button
                variant="outline"
                iconLeft={Printer}
                onClick={handlePrint}
              >
                Print Invoice
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
          <div className="p-6 bg-white border border-[#EAECEF] rounded-xl space-y-6 text-xs printable-content">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-[#EAECEF] pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded bg-[#FBBF24] flex items-center justify-center font-bold text-[#172033]">
                    BL
                  </div>
                  <span className="text-base font-bold text-[#172033]">
                    BRIGHT<span className="text-amber-500">LOOP</span> Inc.
                  </span>
                </div>
                <p className="text-slate-500">500 Howard Street, Suite 400</p>
                <p className="text-slate-500">San Francisco, CA 94105, USA</p>
                <p className="text-slate-500 font-mono text-[11px] mt-1">Tax ID: US-EIN-94-3829104</p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#64748B] block">
                  INVOICE
                </span>
                <span className="text-lg font-bold text-[#172033] font-mono">
                  {selectedInvoice.invoiceNumber}
                </span>
                <div className="mt-2">
                  <Badge status={selectedInvoice.status} size="sm" />
                </div>
              </div>
            </div>

            {/* Bill To & Details */}
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-[#EAECEF]">
              <div>
                <span className="text-[#64748B] block font-semibold text-[11px] uppercase tracking-wider mb-1">
                  Billed To
                </span>
                <p className="font-bold text-[#172033] text-sm">{selectedInvoice.customerName}</p>
                <p className="text-slate-600">{selectedInvoice.customerCompany}</p>
                <p className="text-slate-500">{selectedInvoice.customerEmail}</p>
              </div>

              <div className="space-y-1 text-right">
                <div>
                  <span className="text-slate-400">Issue Date: </span>
                  <span className="font-semibold text-[#172033] font-mono">{selectedInvoice.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">Due Date: </span>
                  <span className="font-semibold text-[#172033] font-mono">{selectedInvoice.dueDate}</span>
                </div>
                {selectedInvoice.paidAt && (
                  <div>
                    <span className="text-slate-400">Settled On: </span>
                    <span className="font-semibold text-emerald-600 font-mono">{selectedInvoice.paidAt}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Payment Method: </span>
                  <span className="text-[#172033]">{selectedInvoice.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#EAECEF] text-slate-400 text-[11px] uppercase font-semibold">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECEF]">
                  {(selectedInvoice.items || []).map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-[#172033]">
                        {item.description}
                      </td>
                      <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-3 text-right font-mono text-slate-600">${item.unitPrice?.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono font-semibold text-[#172033]">${item.amount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end pt-4 border-t border-[#EAECEF]">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">${selectedInvoice.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax ({selectedInvoice.taxRate || '10%'}):</span>
                  <span className="font-mono">${selectedInvoice.taxAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#172033] pt-2 border-t border-[#EAECEF]">
                  <span>Total Amount Due:</span>
                  <span className="font-mono">${selectedInvoice.amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms Footer */}
            <div className="pt-4 border-t border-[#EAECEF] text-[11px] text-slate-400">
              <p>Payment terms: Net 15 days. Unpaid balances subject to standard retry protocol.</p>
              <p className="mt-0.5">Questions? Contact billing@brightloop.com</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Invoices;
