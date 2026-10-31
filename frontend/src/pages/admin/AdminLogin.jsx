import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { getApiError } from '../../services/api';

export const AdminLogin = () => {
  const { login, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });

      // Only admin and staff roles are permitted here
      if (user.role !== 'admin' && user.role !== 'staff') {
        logout();
        setError('Access denied. This login is for administrators and staff only.');
        setLoading(false);
        return;
      }

      showNotification({
        type: 'success',
        title: 'Admin Access Granted',
        message: `Welcome, ${user.first_name || user.email}! Redirecting to dashboard...`
      });
      navigate('/admin');
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center relative overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-amber-600/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative w-full max-w-md px-6">
        <div className="bg-[#161B27]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400" />

          <div className="p-8 space-y-7">
            {/* Logo & Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <Shield className="w-8 h-8 text-[#0D1117]" />
                  </div>
                  <div className="absolute -inset-1 rounded-2xl bg-amber-400/20 blur-md -z-10" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-2xl font-bold text-white tracking-tight">
                    BRIGHT<span className="text-amber-400">LOOP</span>
                  </span>
                </div>
                <p className="text-xs font-semibold text-amber-400/80 uppercase tracking-[0.15em]">
                  Admin Control Center
                </p>
              </div>
              <div className="pt-1">
                <h1 className="text-xl font-bold text-white">Administrator Sign In</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Restricted access — authorized personnel only
                </p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@brightloop.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="admin-login-submit"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0D1117] font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0D1117]/40 border-t-[#0D1117] rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access Admin Panel
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer link */}
            <div className="text-center">
              <p className="text-xs text-slate-600">
                Not an admin?{' '}
                <a href="/auth/login" className="text-amber-400/70 hover:text-amber-400 font-medium transition-colors">
                  Customer login →
                </a>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-4">
          BrightLoop Admin Suite · Secured Access · v1.0
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
