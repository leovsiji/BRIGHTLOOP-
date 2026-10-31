import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const Register = () => {
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Passwords do not match.'
      });
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      showNotification({
        type: 'success',
        title: 'Registration Complete',
        message: 'Your account is ready! Welcome to BRIGHTLOOP.'
      });
      navigate('/customer');
    } catch {
      showNotification({
        type: 'error',
        title: 'Registration Error',
        message: 'Could not create account.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#172033] tracking-tight">
          Create Enterprise Account
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Start your 14-day free trial on BRIGHTLOOP today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Full Name"
          placeholder="Sarah Jenkins"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={User}
          required
        />

        <Input
          label="Company / Organization"
          placeholder="Acme Corporation"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          icon={Building}
          required
        />

        <Input
          label="Work Email Address"
          type="email"
          placeholder="sarah@acmecorp.io"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={Mail}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={Lock}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            icon={Lock}
            required
          />
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            required
            defaultChecked
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 accent-amber-500"
          />
          <label htmlFor="terms" className="ml-2 block text-xs text-[#64748B] leading-tight">
            I agree to BRIGHTLOOP's <span className="text-[#172033] underline">Terms of Service</span> and <span className="text-[#172033] underline">Privacy Policy</span>.
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          size="lg"
          isLoading={loading}
          iconRight={ArrowRight}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-[#64748B] pt-2 border-t border-[#EAECEF]">
        Already registered?{' '}
        <Link to="/auth/login" className="font-semibold text-amber-700 hover:text-amber-800">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
