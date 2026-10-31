import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  ChevronDown,
  Send,
  LifeBuoy
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { customerPortalApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const CustomerSupport = () => {
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState(null);
  const [_loading, setLoading] = useState(true);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    priority: 'Medium',
    message: ''
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customerPortalApi.getProfile();
      setProfile(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Error Loading',
        message: 'Could not fetch support tickets.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Subject and detailed message are required.'
      });
      return;
    }

    try {
      await customerPortalApi.createTicket(ticketForm);
      showNotification({
        type: 'success',
        title: 'Ticket Submitted',
        message: 'Our concierge support team has received your inquiry.'
      });
      setIsTicketModalOpen(false);
      setTicketForm({ subject: '', priority: 'Medium', message: '' });
      loadData();
    } catch {
      showNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not send support request.'
      });
    }
  };

  const faqs = [
    {
      q: 'How does automatic renewal billing work?',
      a: 'All monthly and annual subscriptions renew automatically on their stated renewal date using your primary payment card. You will receive an email receipt immediately upon successful payment.'
    },
    {
      q: 'Can I add or decrease team seats mid-cycle?',
      a: 'Yes, seat changes can be made anytime from the Available Plans or My Subscriptions tab. Pro-rated charges will appear automatically on your next billing receipt.'
    },
    {
      q: 'Where do I find official VAT/Tax invoices for accounting?',
      a: 'Head over to the Invoices tab in the sidebar. You can inspect line item breakdowns and download compliant PDF receipts with our corporate VAT/Tax registration credentials.'
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept all major corporate credit cards (Visa, Mastercard, Amex), SEPA Direct Debit for EU businesses, and ACH Direct Debit / Wire Transfer for enterprise annual accounts.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Customer Support & Help Desk
          </h2>
          <p className="text-xs text-[#64748B]">
            Submit technical tickets, track resolution status, and access knowledge articles
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={Plus}
          onClick={() => setIsTicketModalOpen(true)}
        >
          Open Support Ticket
        </Button>
      </div>

      {/* Tickets List */}
      <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-base font-semibold text-[#172033]">
          My Support Requests
        </h3>

        {(profile?.tickets || []).length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No active support inquiries.
          </p>
        ) : (
          <div className="divide-y divide-[#EAECEF]">
            {profile?.tickets.map((t) => (
              <div key={t.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#172033]">{t.subject}</span>
                    <Badge status={t.status} size="sm" />
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Ticket ID: {t.id} • Opened on {t.date} • Priority: {t.priority}
                  </p>
                </div>

                <span className="text-[11px] font-medium text-amber-700 bg-[#FFF1C2]/60 px-2.5 py-1 rounded">
                  {t.status === 'Resolved' ? 'Closed' : 'Assigned to Agent'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-base font-semibold text-[#172033] flex items-center gap-2">
          <LifeBuoy className="w-4 h-4 text-amber-600" />
          <span>Billing Knowledge Base & FAQ</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#EAECEF] rounded-lg overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full text-left p-3.5 bg-[#FFFDF7]/60 hover:bg-[#FFFDF7] flex justify-between items-center text-xs font-semibold text-[#172033] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-3.5 text-xs text-[#64748B] bg-white leading-relaxed border-t border-[#EAECEF]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* New Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Open Support Inquiry"
        description="Priority SLA routing to your designated account manager."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsTicketModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateTicket} iconLeft={Send}>
              Submit Ticket
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Inquiry Subject"
            placeholder="e.g. Question regarding October subscription charge"
            value={ticketForm.subject}
            onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
            required
          />

          <Select
            label="Priority Urgency"
            value={ticketForm.priority}
            onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
            options={['Low', 'Medium', 'High', 'Urgent SLA']}
          />

          <div>
            <label className="block text-xs font-medium text-[#172033] mb-1.5">
              Detailed Description
            </label>
            <textarea
              rows={4}
              value={ticketForm.message}
              onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
              placeholder="Please provide steps, invoice number, or error messages..."
              className="w-full rounded-lg border border-[#EAECEF] bg-white px-3 py-2 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24]"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerSupport;
