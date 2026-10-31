import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Plus,
  Lock
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { customerPortalApi, paymentsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const CustomerPayments = () => {
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Card Modal
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    holder: '',
    cardNumber: '',
    exp: '',
    cvc: ''
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prof, txns] = await Promise.all([
        customerPortalApi.getProfile(),
        paymentsApi.getAll()
      ]);
      setProfile(prof);
      // Filter transactions for current customer
      setTransactions(txns.filter((t) => t.customerEmail === 'sarah.jenkins@acmecorp.io'));
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading',
        message: 'Could not fetch payment methods.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCardSubmit = (e) => {
    e.preventDefault();
    if (!cardForm.cardNumber || !cardForm.holder) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Card number and cardholder name are required.'
      });
      return;
    }

    const last4 = cardForm.cardNumber.replace(/\s+/g, '').slice(-4) || '9911';
    const newPm = {
      id: `pm-${Date.now()}`,
      brand: 'Visa',
      last4,
      expMonth: 12,
      expYear: 2028,
      isDefault: false,
      holder: cardForm.holder
    };

    profile.paymentMethods.push(newPm);
    showNotification({
      type: 'success',
      title: 'Payment Method Saved',
      message: `Card ending in ${last4} was added.`
    });
    setIsAddCardOpen(false);
  };

  const handleSetDefault = (id) => {
    profile.paymentMethods.forEach((pm) => {
      pm.isDefault = pm.id === id;
    });
    setProfile({ ...profile });
    showNotification({
      type: 'info',
      title: 'Default Card Updated',
      message: 'Future subscription renewals will bill this card.'
    });
  };

  const txnColumns = [
    {
      header: 'Transaction ID',
      field: 'transactionId',
      sortable: true,
      render: (val) => <span className="font-semibold text-[#172033] font-mono">{val}</span>
    },
    {
      header: 'Invoice',
      field: 'invoiceNumber',
      sortable: true,
      render: (val) => <span className="text-slate-500 font-mono text-[11px]">{val}</span>
    },
    {
      header: 'Date',
      field: 'date',
      sortable: true,
      render: (val) => <span className="text-slate-600 text-[11px]">{val}</span>
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
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          Payment Methods & Settlements
        </h2>
        <p className="text-xs text-[#64748B]">
          Manage cards on file, designate primary billing instrument, and inspect ledger receipts
        </p>
      </div>

      {/* Cards On File */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#172033]">
            Saved Payment Methods
          </h3>
          <Button
            size="sm"
            variant="primary"
            iconLeft={Plus}
            onClick={() => {
              setCardForm({ holder: 'Sarah Jenkins', cardNumber: '', exp: '', cvc: '' });
              setIsAddCardOpen(true);
            }}
          >
            Add New Card
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(profile?.paymentMethods || []).map((pm) => (
            <div
              key={pm.id}
              className={`bg-white border rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between ${
                pm.isDefault ? 'border-amber-400 ring-1 ring-amber-300' : 'border-[#EAECEF]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFFDF7] border border-[#EAECEF] flex items-center justify-center font-bold text-[#172033]">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#172033]">
                      {pm.brand} •••• {pm.last4}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Expires {pm.expMonth}/{pm.expYear}
                    </p>
                  </div>
                </div>

                {pm.isDefault ? (
                  <Badge status="Active" size="sm">Primary Card</Badge>
                ) : (
                  <button
                    onClick={() => handleSetDefault(pm.id)}
                    className="text-xs text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                  >
                    Set as Primary
                  </button>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#EAECEF] flex justify-between items-center text-xs text-slate-500">
                <span>Cardholder: <strong className="text-[#172033]">{pm.holder}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[#172033]">
          Settled Payment History
        </h3>

        <DataTable
          columns={txnColumns}
          data={transactions}
          isLoading={loading}
          searchPlaceholder="Search transactions..."
        />
      </div>

      {/* Add Card Modal */}
      <Modal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        title="Add Payment Card"
        description="Encrypted through PCI-DSS Level 1 compliant gateway."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCardSubmit}>
              Save Payment Method
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddCardSubmit} className="space-y-4">
          <Input
            label="Name on Card"
            placeholder="Sarah Jenkins"
            value={cardForm.holder}
            onChange={(e) => setCardForm({ ...cardForm, holder: e.target.value })}
            required
          />

          <Input
            label="Card Number"
            placeholder="4242 •••• •••• 4242"
            value={cardForm.cardNumber}
            onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
            icon={CreditCard}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry (MM/YY)"
              placeholder="12/28"
              value={cardForm.exp}
              onChange={(e) => setCardForm({ ...cardForm, exp: e.target.value })}
              required
            />
            <Input
              label="Security CVC"
              placeholder="123"
              type="password"
              maxLength={4}
              value={cardForm.cvc}
              onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
              icon={Lock}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerPayments;
