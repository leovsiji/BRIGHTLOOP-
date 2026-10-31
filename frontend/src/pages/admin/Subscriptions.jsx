import React, { useState, useEffect, useCallback } from 'react';
import { XCircle, Eye, Package } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { subscriptionsApi, getApiError } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

/**
 * Admin Subscriptions page
 *
 * Connected to: GET /api/subscriptions/ and POST /api/subscriptions/{id}/cancel/
 *
 * Backend Subscription model fields:
 *   id, user (id), product (id), product_name, status, start_date, end_date, created_at
 *
 * Status values (lowercase): active | cancelled | expired
 *
 * Operations NOT supported by backend (removed from UI):
 *   - Pause subscription
 *   - Renew subscription
 *   - Edit subscription
 */
export const Subscriptions = () => {
  const { showNotification } = useNotification();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSub, setSelectedSub] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionsApi.getAll();
      setSubscriptions(data);
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Error Loading Subscriptions',
        message: getApiError(err)
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleRowClick = (sub) => {
    setSelectedSub(sub);
    setIsDetailOpen(true);
  };

  const handleCancelClick = (sub, e) => {
    e?.stopPropagation();
    setSelectedSub(sub);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedSub) return;
    setCancelling(true);
    try {
      await subscriptionsApi.cancel(selectedSub.id);
      showNotification({
        type: 'success',
        title: 'Subscription Cancelled',
        message: `Subscription #${selectedSub.id} has been cancelled.`
      });
      setIsCancelOpen(false);
      setIsDetailOpen(false);
      loadSubscriptions();
    } catch (err) {
      showNotification({ type: 'error', title: 'Cancel Failed', message: getApiError(err) });
    } finally {
      setCancelling(false);
    }
  };

  const columns = [
    {
      header: 'ID',
      field: 'id',
      sortable: true,
      render: (val) => (
        <span className="font-mono text-[11px] text-slate-500">#{val}</span>
      )
    },
    {
      header: 'Product',
      field: 'product_name',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium text-[#172033]">{val || '—'}</span>
        </div>
      )
    },
    {
      header: 'Customer (User ID)',
      field: 'user',
      sortable: true,
      render: (val) => (
        <span className="text-slate-600 font-mono text-[11px]">User #{val}</span>
      )
    },
    {
      header: 'Status',
      field: 'status',
      sortable: true,
      render: (val) => <Badge status={val} size="sm" />
    },
    {
      header: 'Start Date',
      field: 'start_date',
      sortable: true,
      render: (val) => <span className="text-slate-500 font-mono text-[11px]">{val || '—'}</span>
    },
    {
      header: 'End Date',
      field: 'end_date',
      sortable: true,
      render: (val) => <span className="text-slate-500 font-mono text-[11px]">{val || 'Ongoing'}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleRowClick(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'active' && (
            <button
              onClick={(e) => handleCancelClick(row, e)}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Cancel Subscription"
            >
              <XCircle className="w-4 h-4" />
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
            Customer Subscriptions
          </h2>
          <p className="text-xs text-[#64748B]">
            View all active, cancelled, and expired subscriptions
          </p>
        </div>
      </div>

      {/* Backend limitation notice */}
      <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
        <span className="shrink-0 mt-0.5">⚠️</span>
        <span>
          <strong>Backend note:</strong> Subscription management is limited to viewing and cancellation.
          Pause, resume, and renewal operations are not yet implemented in the backend.
        </span>
      </div>

      <DataTable
        columns={columns}
        data={subscriptions}
        isLoading={loading}
        onRowClick={handleRowClick}
        searchPlaceholder="Search by product name or user ID..."
        filterOptions={[
          { label: 'Active', value: 'active' },
          { label: 'Cancelled', value: 'cancelled' },
          { label: 'Expired', value: 'expired' }
        ]}
      />

      {/* Subscription Detail Modal */}
      {selectedSub && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Subscription #${selectedSub.id}`}
          description={`Product: ${selectedSub.product_name || selectedSub.product}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
              {selectedSub.status === 'active' && (
                <Button
                  variant="danger"
                  iconLeft={XCircle}
                  onClick={() => { setIsDetailOpen(false); setIsCancelOpen(true); }}
                >
                  Cancel Subscription
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#EAECEF]">
              <div>
                <span className="text-[#64748B] block mb-0.5">Status</span>
                <Badge status={selectedSub.status} size="sm" />
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Start Date</span>
                <span className="font-semibold text-[#172033] font-mono">{selectedSub.start_date || '—'}</span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">End Date</span>
                <span className="font-semibold text-[#172033] font-mono">{selectedSub.end_date || 'Ongoing'}</span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">User ID</span>
                <span className="font-semibold text-[#172033] font-mono">#{selectedSub.user}</span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Product ID</span>
                <span className="font-semibold text-[#172033] font-mono">#{selectedSub.product}</span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Created</span>
                <span className="font-semibold text-[#172033] font-mono">
                  {selectedSub.created_at ? new Date(selectedSub.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Subscription"
        message={`Cancel subscription #${selectedSub?.id} for ${selectedSub?.product_name}? The status will change to "cancelled".`}
        confirmText={cancelling ? 'Cancelling...' : 'Yes, Cancel'}
        isDanger
      />
    </div>
  );
};

export default Subscriptions;
