import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in both email and password');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.fullName}!`, 'success');
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'ROLE_ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else if (res.user.role === 'ROLE_STAFF') {
          navigate('/staff/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-soft-lg">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Access your complaints, tracking, and dashboard
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Demo Fill:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin@demo.com', 'Admin@123')}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-600 transition-colors shadow-2xs"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemo('staff@demo.com', 'Staff@123')}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-600 transition-colors shadow-2xs"
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => fillDemo('user@demo.com', 'User@123')}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-600 transition-colors shadow-2xs"
              >
                User
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
