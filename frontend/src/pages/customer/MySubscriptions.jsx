import React, { useState, useEffect, useCallback } from 'react';
import {
  PauseCircle,
  XCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { subscriptionsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const MySubscriptions = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'cancelled'

  // Dialog state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: '', // 'pause' | 'cancel'
    sub: null
  });

  const loadSubs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subscriptionsApi.getCustomerSubscriptions('cust-001');
      setSubscriptions(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading',
        message: 'Could not fetch your subscriptions.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSubs();
  }, [loadSubs]);

  const handleAction = (sub, type) => {
    setConfirmModal({
      isOpen: true,
      type,
      sub
    });
  };

  const handleConfirmAction = async () => {
    const { type, sub } = confirmModal;
    if (!sub) return;

    try {
      if (type === 'pause') {
        await subscriptionsApi.pause(sub.id);
        showNotification({
          type: 'info',
          title: 'Subscription Paused',
          message: `${sub.planName} has been temporarily paused.`
        });
      } else if (type === 'cancel') {
        await subscriptionsApi.cancel(sub.id);
        showNotification({
          type: 'success',
          title: 'Subscription Canceled',
          message: `${sub.planName} has been canceled.`
        });
      }
      setConfirmModal({ isOpen: false, type: '', sub: null });
      loadSubs();
    } catch {
      showNotification({
        type: 'error',
        title: 'Action Failed',
        message: 'Could not update subscription status.'
      });
    }
  };

  const filteredSubs = subscriptions.filter((sub) => {
    if (activeTab === 'active') return sub.status === 'Active';
    if (activeTab === 'cancelled') return sub.status === 'Canceled' || sub.status === 'Paused';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            My Subscriptions
          </h2>
          <p className="text-xs text-[#64748B]">
            Active recurring services, renewals, seats, and contract controls
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={Sparkles}
          onClick={() => navigate('/customer/plans')}
        >
          Add New Subscription
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EAECEF] gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 cursor-pointer transition-colors border-b-2 ${
            activeTab === 'all'
              ? 'border-amber-400 text-[#172033] font-semibold'
              : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          All Subscriptions ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 cursor-pointer transition-colors border-b-2 ${
            activeTab === 'active'
              ? 'border-amber-400 text-[#172033] font-semibold'
              : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Active Contracts ({subscriptions.filter((s) => s.status === 'Active').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 cursor-pointer transition-colors border-b-2 ${
            activeTab === 'cancelled'
              ? 'border-amber-400 text-[#172033] font-semibold'
              : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Paused / Inactive ({subscriptions.filter((s) => s.status !== 'Active').length})
        </button>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {filteredSubs.map((sub) => (
          <div
            key={sub.id}
            className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:border-amber-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAECEF]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-[#172033]">
                    {sub.planName}
                  </h3>
                  <Badge status={sub.status} size="sm" />
                </div>
                <p className="text-xs text-[#64748B] font-mono mt-0.5">
                  Subscription ID: {sub.code} • Started {sub.startDate}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#172033] font-mono">
                  ${sub.amount?.toFixed(2)}
                </span>
                <span className="text-xs text-[#64748B] ml-1">
                  / {sub.billingCycle?.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Next Renewal</span>
                <span className="font-semibold text-[#172033] font-mono">{sub.nextBillingDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Term Expiry</span>
                <span className="font-semibold text-[#172033] font-mono">{sub.expiryDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Payment Method</span>
                <span className="font-medium text-[#172033]">{sub.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Auto-Renewal</span>
                <span className="font-medium text-emerald-600">
                  {sub.autoRenew ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAECEF] flex items-center justify-between">
              <button
                onClick={() => navigate('/customer/plans')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Change Plan / Add Capacity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                {sub.status === 'Active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconLeft={PauseCircle}
                    onClick={() => handleAction(sub, 'pause')}
                  >
                    Pause
                  </Button>
                )}
                {sub.status !== 'Canceled' && (
                  <Button
                    variant="dangerOutline"
                    size="sm"
                    iconLeft={XCircle}
                    onClick={() => handleAction(sub, 'cancel')}
                  >
                    Cancel Plan
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '', sub: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'pause'
            ? 'Pause Your Subscription'
            : 'Cancel Your Subscription'
        }
        message={
          confirmModal.type === 'pause'
            ? `Pause ${confirmModal.sub?.planName}? Service access will pause after the current billing cycle.`
            : `Are you sure you want to cancel ${confirmModal.sub?.planName}? You will lose access to software licenses at the end of the term.`
        }
        confirmText={confirmModal.type === 'pause' ? 'Pause Service' : 'Cancel Subscription'}
        isDanger={confirmModal.type === 'cancel'}
      />
    </div>
  );
};

export default MySubscriptions;
