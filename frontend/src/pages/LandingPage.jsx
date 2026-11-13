import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Zap, 
  Clock, 
  FileText, 
  BarChart3, 
  CheckCircle2, 
  Users, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trackNumber, setTrackNumber] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackNumber.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackNumber.trim())}`);
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Grievance & Issue Resolution</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Resolve Issues Faster, Smarter &amp;{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Transparently
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The modern complaint management system designed for rapid resolution, transparent live tracking, 
          SLA escalation, and end-to-end accountability.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={user ? (user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : user.role === 'ROLE_STAFF' ? '/staff/dashboard' : '/complaints/new') : '/complaints/new'}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all hover:-translate-y-0.5"
          >
            <span>File a Complaint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/track"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Track a Ticket</span>
          </Link>
        </div>

        {/* Quick Track Input Bar */}
        <div className="mt-12 max-w-lg mx-auto bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-soft">
          <form onSubmit={handleTrackSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Complaint ID (e.g. CMP-2026-0001)"
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              Track Now
            </button>
          </form>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Built for Transparency and Velocity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Everything citizens, support agents, and managers need in one seamless portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              Visual Status Timeline
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time chronological timeline with connecting nodes. Every state change, internal remark, and action is transparently visible.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              Automated 7-Day Escalation
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Built-in SLA enforcement flags unresolved tickets older than 7 days, alerting supervisors and ensuring no issue falls through the cracks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              Analytics &amp; CSV Reports
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Interactive charts for category distributions, monthly submission volumes, average turnaround time, and instant CSV spreadsheet export.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Box */}
      <section className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-blue-50/30 dark:from-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40">
        <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Interactive Demo Credentials</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5">
          Feel free to log in with any pre-configured test account to explore all three distinct role experiences:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Administrator</p>
            <p className="text-slate-500">Email: <code className="text-indigo-600 dark:text-indigo-400 font-mono">admin@demo.com</code></p>
            <p className="text-slate-500">Pass: <code className="text-indigo-600 dark:text-indigo-400 font-mono">Admin@123</code></p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Staff Member</p>
            <p className="text-slate-500">Email: <code className="text-indigo-600 dark:text-indigo-400 font-mono">staff@demo.com</code></p>
            <p className="text-slate-500">Pass: <code className="text-indigo-600 dark:text-indigo-400 font-mono">Staff@123</code></p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Citizen / User</p>
            <p className="text-slate-500">Email: <code className="text-indigo-600 dark:text-indigo-400 font-mono">user@demo.com</code></p>
            <p className="text-slate-500">Pass: <code className="text-indigo-600 dark:text-indigo-400 font-mono">User@123</code></p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 dark:text-slate-500 pt-8 border-t border-slate-200/60 dark:border-slate-800">
        &copy; 2026 Online Complaint Management System (Resolvify). Modern Full-Stack Architecture with React &amp; Spring Boot.
      </footer>
    </div>
  );
};
