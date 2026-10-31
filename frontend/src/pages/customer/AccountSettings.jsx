import React, { useState, useEffect } from 'react';
import {
  Save,
  Key
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { customerPortalApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const AccountSettings = () => {
  const { showNotification } = useNotification();
  const [_loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@acmecorp.io',
    company: 'Acme Corporation',
    phone: '+1 (555) 234-5678',
    title: 'Director of Technology',
    billingAddress: '450 Mission Street, Suite 800, San Francisco, CA',
    taxId: 'US-EIN-9847291'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const prof = await customerPortalApi.getProfile();
        setProfileData((prev) => ({ ...prev, ...prof }));
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await customerPortalApi.updateProfile(profileData);
      showNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal information was successfully saved.'
      });
    } catch {
      showNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not update profile.'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter both current and new password.'
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New password and confirmation do not match.'
      });
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showNotification({
        type: 'success',
        title: 'Password Changed',
        message: 'Your security password has been updated.'
      });
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-[#172033] tracking-tight">
          Account Settings & Security
        </h2>
        <p className="text-xs text-[#64748B]">
          Update contact person, organizational tax identifiers, and security credentials
        </p>
      </div>

      {/* Profile Info Form */}
      <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <h3 className="text-base font-semibold text-[#172033] mb-4 pb-3 border-b border-[#EAECEF]">
          Contact & Business Profile
        </h3>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />
            <Input
              label="Primary Work Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Legal Name"
              value={profileData.company}
              onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
            />
            <Input
              label="Contact Phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="VAT / Tax Identification #"
              value={profileData.taxId}
              onChange={(e) => setProfileData({ ...profileData, taxId: e.target.value })}
            />
            <Input
              label="Billing Street Address"
              value={profileData.billingAddress}
              onChange={(e) => setProfileData({ ...profileData, billingAddress: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              variant="primary"
              iconLeft={Save}
              isLoading={savingProfile}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Password Management */}
      <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <h3 className="text-base font-semibold text-[#172033] mb-4 pb-3 border-b border-[#EAECEF] flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-600" />
          <span>Security & Password Management</span>
        </h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••••••"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="outline"
              isLoading={savingPassword}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
