import React, { useState } from 'react';
import {
  Key,
  Save
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useNotification } from '../../context/NotificationContext';

export const Settings = () => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'api' | 'notifications'
  const [saving, setSaving] = useState(false);

  // Form states
  const [generalForm, setGeneralForm] = useState({
    companyName: 'BRIGHTLOOP Technologies Inc.',
    legalEntity: 'Brightloop SaaS Solutions LLC',
    currency: 'USD ($)',
    timezone: 'America/Los_Angeles (PST)',
    supportEmail: 'support@brightloop.com',
    billingAddress: '500 Howard Street, Suite 400, San Francisco, CA 94105, USA'
  });

  const [apiForm, setApiForm] = useState({
    backendUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    liveApiKey: 'bl_live_sec_99482910394819284710',
    publishableKey: 'bl_pub_849201948201',
    webhookSecret: 'whsec_98412849102948129038',
    webhookEndpoint: 'https://api.brightloop.com/v1/webhooks/billing'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnPaymentFailure: true,
    emailOnNewSubscription: true,
    weeklyRevenueDigest: true,
    slackWebhookAlerts: false
  });

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'System profile settings have been updated.'
      });
    }, 400);
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showNotification({
      type: 'success',
      title: 'Copied to Clipboard',
      message: `${label} copied.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          System & Organization Settings
        </h2>
        <p className="text-xs text-[#64748B]">
          Configure your billing domain, API credentials for Django REST Framework, and alert routing
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EAECEF] gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 cursor-pointer transition-colors border-b-2 ${
            activeTab === 'general'
              ? 'border-amber-400 text-[#172033] font-semibold'
              : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Company Profile
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`pb-3 cursor-pointer transition-colors border-b-2 ${
            activeTab === 'api'
              ? 'border-amber-400 text-[#172033] font-semibold'
              : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Django API & Webhooks
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 cursor-pointer transition-colors border-b-2 ${
            activeTab === 'notifications'
              ? 'border-amber-400 text-[#172033] font-semibold'
              : 'border-transparent text-[#64748B] hover:text-[#172033]'
          }`}
        >
          Notifications & Alerts
        </button>
      </div>

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <form onSubmit={handleSaveGeneral} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Commercial Brand Name"
                value={generalForm.companyName}
                onChange={(e) => setGeneralForm({ ...generalForm, companyName: e.target.value })}
                required
              />
              <Input
                label="Legal Registered Entity"
                value={generalForm.legalEntity}
                onChange={(e) => setGeneralForm({ ...generalForm, legalEntity: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Primary Base Currency"
                value={generalForm.currency}
                onChange={(e) => setGeneralForm({ ...generalForm, currency: e.target.value })}
                options={['USD ($)', 'EUR (€)', 'GBP (£)', 'CAD ($)', 'AUD ($)']}
              />
              <Select
                label="Reporting Timezone"
                value={generalForm.timezone}
                onChange={(e) => setGeneralForm({ ...generalForm, timezone: e.target.value })}
                options={[
                  'America/Los_Angeles (PST)',
                  'America/New_York (EST)',
                  'Europe/London (GMT)',
                  'Europe/Stockholm (CET)',
                  'Asia/Tokyo (JST)'
                ]}
              />
            </div>

            <Input
              label="Support / Billing Contact Email"
              type="email"
              value={generalForm.supportEmail}
              onChange={(e) => setGeneralForm({ ...generalForm, supportEmail: e.target.value })}
            />

            <Input
              label="Corporate Headquarters Address"
              value={generalForm.billingAddress}
              onChange={(e) => setGeneralForm({ ...generalForm, billingAddress: e.target.value })}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                iconLeft={Save}
                isLoading={saving}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: API & Webhooks */}
      {activeTab === 'api' && (
        <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
          <div className="p-4 bg-[#FFF1C2]/50 border border-amber-300/60 rounded-xl text-xs text-amber-950 flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-[#172033] mb-1">
                Django REST Framework Integration Protocol
              </h4>
              <p className="leading-relaxed">
                BRIGHTLOOP uses a centralized Axios client pre-wired for DRF endpoints.
                Update the Base URL below to route live requests to your running Django server or Docker container.
              </p>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#172033]">
                Django Backend API Base URL
              </label>
              <div className="flex gap-2">
                <Input
                  value={apiForm.backendUrl}
                  onChange={(e) => setApiForm({ ...apiForm, backendUrl: e.target.value })}
                  placeholder="http://localhost:8000/api"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    showNotification({
                      type: 'info',
                      title: 'API Probe',
                      message: `Testing connectivity to ${apiForm.backendUrl}...`
                    })
                  }
                >
                  Test Ping
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#172033]">
                Secret API Key (Live Server)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiForm.liveApiKey}
                  className="w-full rounded-lg border border-[#EAECEF] bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(apiForm.liveApiKey, 'Live API Key')}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#172033]">
                Public Frontend Token
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={apiForm.publishableKey}
                  className="w-full rounded-lg border border-[#EAECEF] bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(apiForm.publishableKey, 'Publishable Key')}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#172033]">
                Webhook Listener Endpoint
              </label>
              <Input
                value={apiForm.webhookEndpoint}
                onChange={(e) => setApiForm({ ...apiForm, webhookEndpoint: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] max-w-2xl space-y-4">
          <h3 className="text-base font-semibold text-[#172033] mb-4">
            System Event Notifications
          </h3>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-[#EAECEF] hover:bg-[#FFFDF7] cursor-pointer">
              <div>
                <span className="font-semibold text-[#172033] block">
                  Payment Failure Dunning Alerts
                </span>
                <span className="text-[#64748B]">
                  Send instant notification when a renewal invoice card charge is declined
                </span>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailOnPaymentFailure}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    emailOnPaymentFailure: e.target.checked
                  })
                }
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-[#EAECEF] hover:bg-[#FFFDF7] cursor-pointer">
              <div>
                <span className="font-semibold text-[#172033] block">
                  New Subscription Activation Email
                </span>
                <span className="text-[#64748B]">
                  Notify finance team whenever a new customer subscribes
                </span>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailOnNewSubscription}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    emailOnNewSubscription: e.target.checked
                  })
                }
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-[#EAECEF] hover:bg-[#FFFDF7] cursor-pointer">
              <div>
                <span className="font-semibold text-[#172033] block">
                  Weekly Executive Revenue Digest
                </span>
                <span className="text-[#64748B]">
                  Receive Monday morning MRR, churn, and ARR summaries
                </span>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.weeklyRevenueDigest}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    weeklyRevenueDigest: e.target.checked
                  })
                }
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>
          </div>

          <div className="pt-4">
            <Button
              variant="primary"
              onClick={() =>
                showNotification({
                  type: 'success',
                  title: 'Preferences Updated',
                  message: 'Notification alert criteria saved.'
                })
              }
            >
              Save Alert Preferences
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
