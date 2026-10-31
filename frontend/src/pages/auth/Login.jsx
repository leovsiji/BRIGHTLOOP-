import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getApiError } from '../../services/api';

export const Login = () => {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      showNotification({
        type: 'success',
        title: 'Welcome back!',
        message: `Signed in as ${user.first_name || user.email}.`
      });
      // Customers go to /customer; admin/staff go to /customer (they use /admin/login)
      navigate('/customer');
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Login Failed',
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
          Sign In to Your Account
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Access your BRIGHTLOOP customer portal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[#172033]">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          size="lg"
          isLoading={loading}
          iconRight={ArrowRight}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-[#64748B] pt-2 border-t border-[#EAECEF]">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-semibold text-amber-700 hover:text-amber-800">
          Create an account
        </Link>
      </div>

      <div className="text-center text-xs text-[#64748B]">
        Are you an administrator?{' '}
        <Link to="/admin/login" className="font-semibold text-amber-700 hover:text-amber-800">
          Admin login →
        </Link>
      </div>
    </div>
  );
};

export default Login;
