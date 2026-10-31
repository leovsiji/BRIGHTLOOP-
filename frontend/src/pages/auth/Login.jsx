import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Shield, User } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const Login = () => {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@brightloop.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      showNotification({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${user.name}!`
      });
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } catch {
      showNotification({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid credentials. Please verify and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    try {
      const demoEmail = role === 'admin' ? 'admin@brightloop.com' : 'sarah.jenkins@acmecorp.io';
      setEmail(demoEmail);
      const user = await login({ email: demoEmail, password: 'password123' });
      showNotification({
        type: 'success',
        title: `Logged In as ${role === 'admin' ? 'Administrator' : 'Customer'}`,
        message: `Session initialized for ${user.name}.`
      });
      navigate(role === 'admin' ? '/admin' : '/customer');
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
          Access your management console or customer billing dashboard
        </p>
      </div>

      {/* Demo Credentials Quick-Switch Pills */}
      <div className="p-3 bg-[#FFFDF7] rounded-xl border border-amber-200/60 space-y-2">
        <span className="text-[10px] font-semibold text-amber-900 uppercase tracking-wider block">
          Quick Demo Credentials
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-[#EAECEF] hover:border-amber-300 text-xs font-semibold text-[#172033] shadow-2xs hover:bg-[#FFF1C2]/30 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin Suite</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('customer')}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-[#EAECEF] hover:border-amber-300 text-xs font-semibold text-[#172033] shadow-2xs hover:bg-[#FFF1C2]/30 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span>Customer Portal</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Work Email"
          type="email"
          placeholder="name@company.com"
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

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            defaultChecked
            className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 accent-amber-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs text-[#64748B]">
            Keep me signed in on this workstation
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
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-[#64748B] pt-2 border-t border-[#EAECEF]">
        Don't have an enterprise account?{' '}
        <Link to="/auth/register" className="font-semibold text-amber-700 hover:text-amber-800">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;

