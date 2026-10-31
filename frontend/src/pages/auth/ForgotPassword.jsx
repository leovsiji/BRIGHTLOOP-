import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useNotification } from '../../context/NotificationContext';

export const ForgotPassword = () => {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showNotification({
        type: 'success',
        title: 'Instructions Sent',
        message: `Password reset email dispatched to ${email}.`
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#172033] tracking-tight">
          Reset Password
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Enter your registered email to receive recovery instructions
        </p>
      </div>

      {submitted ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <p className="font-semibold mb-1">Check Your Inbox</p>
              <p>
                We have sent an authentication link to <strong className="font-semibold">{email}</strong>.
                Follow the instructions to establish your new security password.
              </p>
            </div>
          </div>

          <Link to="/auth/login" className="block">
            <Button variant="outline" className="w-full" size="md">
              Return to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            isLoading={loading}
            iconLeft={Send}
          >
            Send Reset Instructions
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#172033]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;

