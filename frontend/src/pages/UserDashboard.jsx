import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Search, 
  ArrowRight, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints');
        if (res.data.success) {
          setComplaints(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(
    (c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW'
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS'
  ).length;
  const resolved = complaints.filter(
    (c) => c.status === 'RESOLVED' || c.status === 'CLOSED'
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 p-6 sm:p-8 text-white shadow-soft-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs mb-3">
            Citizen Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Track your grievances in real time, view staff remarks, and provide satisfaction feedback once resolved.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/complaints/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold text-xs shadow-md hover:bg-indigo-50 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File a Complaint</span>
            </Link>
            <Link
              to="/track"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Track Ticket</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Filed</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{total}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Under Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{pending}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{inProgress}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{resolved}</p>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Complaints</h2>
          <Link
            to="/complaints"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No complaints filed yet"
            description="Have you encountered an issue? File your first complaint in seconds."
            actionText="File a Complaint"
            actionLink="/complaints/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {c.complaintNumber}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {c.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={c.priority} />
                    <span className="text-[11px] text-slate-400">
                      {c.category?.name}
                    </span>
                  </div>

                  <Link
                    to={`/track?id=${c.complaintNumber}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
