import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getApiError } from '../../services/api';

export const Register = () => {
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

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

    if (formData.password.length < 9) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Password must be at least 9 characters.'
      });
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        ...(formData.company_name ? { company_name: formData.company_name } : {})
      });
      showNotification({
        type: 'success',
        title: 'Account Created',
        message: 'Your account is ready. Please sign in.'
      });
      navigate('/auth/login');
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Registration Failed',
        message: getApiError(err)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#172033] tracking-tight">
          Create Your Account
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Start your BRIGHTLOOP subscription today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="Sarah"
            value={formData.first_name}
            onChange={set('first_name')}
            icon={User}
            required
          />
          <Input
            label="Last Name"
            placeholder="Jenkins"
            value={formData.last_name}
            onChange={set('last_name')}
            required
          />
        </div>

        <Input
          label="Work Email"
          type="email"
          placeholder="sarah@acmecorp.io"
          value={formData.email}
          onChange={set('email')}
          icon={Mail}
          required
        />

        <Input
          label="Company (optional)"
          placeholder="Acme Corporation"
          value={formData.company_name}
          onChange={set('company_name')}
          icon={Building}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            placeholder="Min. 9 characters"
            value={formData.password}
            onChange={set('password')}
            icon={Lock}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={set('confirmPassword')}
            icon={Lock}
            required
          />
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            required
            className="w-4 h-4 mt-0.5 rounded border-slate-300 accent-amber-500"
          />
          <label htmlFor="terms" className="ml-2 block text-xs text-[#64748B] leading-tight">
            I agree to BRIGHTLOOP's{' '}
            <span className="text-[#172033] underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-[#172033] underline cursor-pointer">Privacy Policy</span>.
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
        Already have an account?{' '}
        <Link to="/auth/login" className="font-semibold text-amber-700 hover:text-amber-800">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
