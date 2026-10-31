import React, { useState, useEffect, useCallback } from 'react';
import {
  PauseCircle,
  PlayCircle,
  RotateCw,
  XCircle,
  Eye,
  CreditCard
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { subscriptionsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const Subscriptions = () => {
  const { showNotification } = useNotification();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Action states
  const [selectedSub, setSelectedSub] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    isOpen: false,
    type: '', // 'pause' | 'renew' | 'cancel'
    sub: null
  });

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionsApi.getAll();
      setSubscriptions(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading Subscriptions',
        message: 'Could not fetch active subscriptions from backend.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleActionClick = (sub, type, e) => {
    e?.stopPropagation();
    setConfirmAction({
      isOpen: true,
      type,
      sub
    });
  };

  const handleConfirmAction = async () => {
    const { type, sub } = confirmAction;
    if (!sub) return;

    try {
      if (type === 'pause') {
        await subscriptionsApi.pause(sub.id);
        showNotification({
          type: 'info',
          title: 'Subscription Paused',
          message: `${sub.customerName}'s subscription was paused.`
        });
      } else if (type === 'renew') {
        await subscriptionsApi.renew(sub.id);
        showNotification({
          type: 'success',
          title: 'Subscription Renewed',
          message: `${sub.customerName}'s renewal was processed.`
        });
      } else if (type === 'cancel') {
        await subscriptionsApi.cancel(sub.id);
        showNotification({
          type: 'success',
          title: 'Subscription Closed',
          message: `${sub.customerName}'s subscription has been canceled.`
        });
      }
      setConfirmAction({ isOpen: false, type: '', sub: null });
      loadSubscriptions();
    } catch {
      showNotification({
        type: 'error',
        title: 'Action Failed',
        message: 'Could not perform the subscription operation.'
      });
    }
  };

  const handleRowClick = (sub) => {
    setSelectedSub(sub);
    setIsDetailOpen(true);
  };

  const columns = [
    {
      header: 'Subscription',
      field: 'code',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-[#172033] block">{val}</span>
          <span className="text-[11px] text-[#64748B]">{row.planName}</span>
        </div>
      )
    },
    {
      header: 'Customer',
      field: 'customerName',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-medium text-[#172033] block">{val}</span>
          <span className="text-[11px] text-slate-500">{row.customerCompany}</span>
        </div>
      )
    },
    {
      header: 'Amount / Cycle',
      field: 'amount',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-[#172033] font-mono">
            ${val?.toFixed(2)}
          </span>
          <span className="text-[11px] text-[#64748B] block">
            {row.billingCycle}
          </span>
        </div>
      )
    },
    {
      header: 'Start Date',
      field: 'startDate',
      sortable: true,
      render: (val) => <span className="text-slate-600 font-mono text-[11px]">{val}</span>
    },
    {
      header: 'Next Renewal / Expiry',
      field: 'expiryDate',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="text-[#172033] font-mono text-[11px] block">{val}</span>
          <span className="text-[10px] text-slate-400">
            {row.autoRenew ? 'Auto-renews' : 'Manual invoice'}
          </span>
        </div>
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
            onClick={() => handleRowClick(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {row.status === 'Active' && (
            <button
              onClick={(e) => handleActionClick(row, 'pause', e)}
              className="p-1 rounded text-slate-400 hover:text-amber-700 hover:bg-amber-50"
              title="Pause Subscription"
            >
              <PauseCircle className="w-4 h-4" />
            </button>
          )}

          {row.status === 'Paused' && (
            <button
              onClick={(e) => handleActionClick(row, 'renew', e)}
              className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
              title="Resume Subscription"
            >
              <PlayCircle className="w-4 h-4" />
            </button>
          )}

          {['Active', 'Past Due'].includes(row.status) && (
            <button
              onClick={(e) => handleActionClick(row, 'renew', e)}
              className="p-1 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50"
              title="Force Renew Now"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {row.status !== 'Canceled' && (
            <button
              onClick={(e) => handleActionClick(row, 'cancel', e)}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Close / Cancel Subscription"
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
            Manage contracts, pause service, handle manual renewals, or terminate accounts
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={subscriptions}
        isLoading={loading}
        onRowClick={handleRowClick}
        searchPlaceholder="Search by customer name, code or plan..."
        filterOptions={[
          { label: 'Active', value: 'Active' },
          { label: 'Past Due', value: 'Past Due' },
          { label: 'Paused', value: 'Paused' },
          { label: 'Canceled', value: 'Canceled' }
        ]}
      />

      {/* Subscription Detail Modal */}
      {selectedSub && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Subscription: ${selectedSub.code}`}
          description={`Customer: ${selectedSub.customerName} (${selectedSub.customerCompany})`}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              {selectedSub.status === 'Active' && (
                <Button
                  variant="outline"
                  iconLeft={PauseCircle}
                  onClick={(e) => {
                    setIsDetailOpen(false);
                    handleActionClick(selectedSub, 'pause', e);
                  }}
                >
                  Pause
                </Button>
              )}
              {selectedSub.status !== 'Canceled' && (
                <Button
                  variant="danger"
                  iconLeft={XCircle}
                  onClick={(e) => {
                    setIsDetailOpen(false);
                    handleActionClick(selectedSub, 'cancel', e);
                  }}
                >
                  Cancel Subscription
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#EAECEF]">
              <div>
                <span className="text-[#64748B] block mb-0.5">Recurring Amount</span>
                <span className="text-base font-bold text-[#172033] font-mono">
                  ${selectedSub.amount?.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">per {selectedSub.billingCycle?.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Status</span>
                <Badge status={selectedSub.status} size="sm" />
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Provisioned Seats</span>
                <span className="text-base font-bold text-[#172033]">
                  {selectedSub.seats || 1}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Next Billing</span>
                <span className="text-sm font-semibold text-[#172033] font-mono">
                  {selectedSub.nextBillingDate}
                </span>
              </div>
            </div>

            <div className="border border-[#EAECEF] rounded-lg p-4 space-y-2 bg-white">
              <h4 className="font-semibold text-[#172033] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Payment & Renewal Protocol</span>
              </h4>
              <p className="text-[#64748B]">
                Method on file: <strong className="text-[#172033]">{selectedSub.paymentMethod}</strong>
              </p>
              <p className="text-[#64748B]">
                Term period: <span className="font-mono">{selectedSub.startDate}</span> through <span className="font-mono">{selectedSub.expiryDate}</span>
              </p>
              <p className="text-[#64748B]">
                Automatic Charge Policy: {selectedSub.autoRenew ? 'Enabled with 3-day dunning grace window' : 'Disabled / Manual Invoice'}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmAction.isOpen}
        onClose={() => setConfirmAction({ isOpen: false, type: '', sub: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmAction.type === 'pause'
            ? 'Pause Customer Subscription'
            : confirmAction.type === 'renew'
            ? 'Process Immediate Renewal'
            : 'Close & Cancel Subscription'
        }
        message={
          confirmAction.type === 'pause'
            ? `Are you sure you want to pause subscription ${confirmAction.sub?.code}? The customer will lose API access until unpaused.`
            : confirmAction.type === 'renew'
            ? `Trigger immediate renewal cycle for ${confirmAction.sub?.customerName}? This will bill the default payment card on file.`
            : `Are you sure you want to terminate subscription ${confirmAction.sub?.code}? This action marks the contract as Canceled.`
        }
        confirmText={
          confirmAction.type === 'pause'
            ? 'Pause Service'
            : confirmAction.type === 'renew'
            ? 'Renew Now'
            : 'Close Subscription'
        }
        isDanger={confirmAction.type === 'cancel'}
      />
    </div>
  );
};

export default Subscriptions;
