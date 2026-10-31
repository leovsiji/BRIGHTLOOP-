import React, { useState, useEffect } from 'react';
import {
  Check,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { plansApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const AvailablePlans = () => {
  const { showNotification } = useNotification();
  const [plans, setPlans] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  // Checkout modal
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await plansApi.getAll();
        setPlans(data.filter((p) => p.status === 'Active'));
      } catch {
        showNotification({
          type: 'error',
          title: 'Error Loading Plans',
          message: 'Could not fetch pricing plans.'
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setDiscountApplied(false);
    setCouponCode('');
    setIsCheckoutOpen(true);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'BRIGHT20' || couponCode.toUpperCase() === 'STARTUP50') {
      setDiscountApplied(true);
      showNotification({
        type: 'success',
        title: 'Coupon Applied',
        message: 'Promotional discount was applied to your total.'
      });
    } else {
      showNotification({
        type: 'error',
        title: 'Invalid Coupon',
        message: 'The coupon code entered is invalid or expired.'
      });
    }
  };

  const handleConfirmUpgrade = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsCheckoutOpen(false);
      showNotification({
        type: 'success',
        title: 'Subscription Confirmed',
        message: `You are now subscribed to ${selectedPlan.name}! Renewal is automatically scheduled.`
      });
    }, 800);
  };

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter Plan',
      tagline: 'Perfect for small teams and bootstrapped applications.',
      monthlyPrice: 49,
      yearlyPrice: 39,
      features: [
        'Up to 5 team members',
        '10,000 monthly API operations',
        'Standard SSL & Encryption',
        'Community & Email support (48h SLA)',
        'Basic usage telemetry & CSV exports'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional Plan',
      tagline: 'Best for rapidly scaling companies and high-volume systems.',
      monthlyPrice: 149,
      yearlyPrice: 119,
      features: [
        'Up to 25 team members',
        'Unlimited operations & burst concurrency',
        'Advanced telemetry & custom metrics',
        'Priority email & chat support (4h SLA)',
        'Automated dunning & recurring tax engine',
        'Custom webhook triggers & API key limits'
      ],
      popular: true,
      current: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Scale',
      tagline: 'Dedicated infrastructure, custom SLAs, and VIP account manager.',
      monthlyPrice: 499,
      yearlyPrice: 399,
      features: [
        'Unlimited team members & seats',
        'Dedicated VPC & isolated database cluster',
        'Custom SAML/SSO with Okta, Azure AD, Ping',
        '24/7/365 Dedicated Slack connect (15m SLA)',
        'Dedicated Technical Account Manager',
        'Custom MSA, BAA & SOC2 Type II audit compliance'
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
          Flexible Subscription Plans That Grow With You
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Choose the ideal subscription tier for your organization. Cancel or change plans anytime.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span
            className={`text-xs font-semibold cursor-pointer ${
              billingCycle === 'monthly' ? 'text-[#172033]' : 'text-[#64748B]'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly Billing
          </span>

          <button
            type="button"
            onClick={() =>
              setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))
            }
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-amber-400 transition-colors cursor-pointer"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>

          <div
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => setBillingCycle('yearly')}
          >
            <span
              className={`text-xs font-semibold ${
                billingCycle === 'yearly' ? 'text-[#172033]' : 'text-[#64748B]'
              }`}
            >
              Annual Billing
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingTiers.map((tier) => {
          const price = billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice;

          return (
            <div
              key={tier.id}
              className={`bg-white rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 relative ${
                tier.popular
                  ? 'border-2 border-amber-400 shadow-xl ring-2 ring-amber-400/20'
                  : 'border border-[#EAECEF] hover:border-amber-200 shadow-xs'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FBBF24] text-[#172033] text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-xs border border-amber-400">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-[#172033]">{tier.name}</h3>
                  {tier.current && (
                    <span className="text-[10px] font-semibold bg-[#FFF1C2] text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                      Current Plan
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#64748B] min-h-[34px] leading-relaxed mb-6">
                  {tier.tagline}
                </p>

                <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-[#EAECEF]">
                  <span className="text-4xl font-extrabold text-[#172033] font-mono">
                    ${price}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium">
                    / seat / month
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-[11px] font-bold text-[#172033] uppercase tracking-wider">
                    Plan Inclusions:
                  </p>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#172033]">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Button
                  variant={tier.popular ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                  onClick={() => handleChoosePlan(tier)}
                  disabled={tier.current}
                >
                  {tier.current ? 'Current Subscription' : `Choose ${tier.name}`}
                </Button>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                  14-day free trial • Cancel anytime
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Feature Comparison Matrix */}
      <div className="bg-white border border-[#EAECEF] rounded-2xl p-6 sm:p-8 max-w-6xl mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <h3 className="text-lg font-bold text-[#172033] mb-6 text-center">
          Comprehensive Feature Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAECEF] bg-[#FFFDF7]/60">
                <th className="py-3 px-4 font-semibold text-[#172033]">Platform Capabilities</th>
                <th className="py-3 px-4 font-semibold text-center text-[#172033]">Starter</th>
                <th className="py-3 px-4 font-semibold text-center text-[#172033] bg-[#FFF1C2]/30">Professional</th>
                <th className="py-3 px-4 font-semibold text-center text-[#172033]">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF]">
              <tr>
                <td className="py-3 px-4 font-medium text-[#172033]">Monthly Operations</td>
                <td className="py-3 px-4 text-center text-slate-600">10,000</td>
                <td className="py-3 px-4 text-center font-semibold text-[#172033] bg-[#FFF1C2]/10">Unlimited</td>
                <td className="py-3 px-4 text-center font-semibold text-[#172033]">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-[#172033]">Team Members</td>
                <td className="py-3 px-4 text-center text-slate-600">5 seats</td>
                <td className="py-3 px-4 text-center font-semibold text-[#172033] bg-[#FFF1C2]/10">25 seats</td>
                <td className="py-3 px-4 text-center font-semibold text-[#172033]">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-[#172033]">Support SLA</td>
                <td className="py-3 px-4 text-center text-slate-600">48 Hours</td>
                <td className="py-3 px-4 text-center font-semibold text-[#172033] bg-[#FFF1C2]/10">4 Hours Priority</td>
                <td className="py-3 px-4 text-center font-semibold text-emerald-600">15 Mins VIP Phone</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-[#172033]">Single Sign-On (SSO / SAML)</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center font-semibold text-emerald-600 bg-[#FFF1C2]/10">Available</td>
                <td className="py-3 px-4 text-center font-semibold text-emerald-600">Included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-[#172033]">Automated Dunning & Invoicing</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center font-semibold text-emerald-600 bg-[#FFF1C2]/10">Included</td>
                <td className="py-3 px-4 text-center font-semibold text-emerald-600">Custom Rules</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-[#172033]">Dedicated Account Manager</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-slate-400 bg-[#FFF1C2]/10">—</td>
                <td className="py-3 px-4 text-center font-semibold text-emerald-600">Dedicated TAM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout / Upgrade Modal */}
      {selectedPlan && (
        <Modal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          title={`Confirm Subscription: ${selectedPlan.name}`}
          description={`Selected cycle: ${billingCycle === 'yearly' ? 'Annual Commitment (20% off)' : 'Monthly'}`}
          size="md"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={processing}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmUpgrade}
                isLoading={processing}
                iconRight={ArrowRight}
              >
                Confirm & Upgrade
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#EAECEF] flex justify-between items-center">
              <div>
                <span className="font-bold text-sm text-[#172033] block">{selectedPlan.name}</span>
                <span className="text-[#64748B]">Billed {billingCycle}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-[#172033] font-mono">
                  ${discountApplied ? '95.20' : billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice}
                </span>
                <span className="text-slate-400 block text-[10px]">/ month</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div>
              <label className="block font-medium text-[#172033] mb-1">
                Have a Promo Code? (Try <strong className="text-amber-800">BRIGHT20</strong>)
              </label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. BRIGHT20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="p-3 bg-white border border-[#EAECEF] rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="font-semibold text-[#172033] block">Default Payment Card</span>
                  <span className="text-slate-500 text-[11px]">Visa ending in 4242</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">Active</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              By confirming, your card will be billed the subscription charge according to selected cycle.
              You can cancel or change plans at any time from your account settings.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AvailablePlans;
