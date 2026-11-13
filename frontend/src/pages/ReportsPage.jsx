import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Download, 
  BarChart3, 
  FileSpreadsheet, 
  Filter, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters for CSV export
  const [exportStatus, setExportStatus] = useState('');
  const [exportCategory, setExportCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const [statsRes, catRes] = await Promise.all([
          api.get('/reports/dashboard'),
          api.get('/categories'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const handleExportCsv = () => {
    let url = '/api/reports/export/csv?';
    if (exportStatus) url += `status=${encodeURIComponent(exportStatus)}&`;
    if (exportCategory) url += `categoryId=${encodeURIComponent(exportCategory)}&`;
    window.open(url, '_blank');
  };

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  if (loading) {
    return (
      <div className="space-y-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Reports &amp; Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive audit reports, SLA compliance metrics, and downloadable spreadsheets
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download CSV Report</span>
        </button>
      </div>

      {/* CSV Filter Options */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>CSV Export Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={exportStatus}
            onChange={(e) => setExportStatus(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={exportCategory}
            onChange={(e) => setExportCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Filtered CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">TOTAL RESOLVED</span>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats?.resolvedComplaints || 0}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats?.resolutionRate || 0}% overall completion
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">AVG. RESOLUTION TIME</span>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {stats?.avgResolutionDays || 0} <span className="text-sm font-normal">days</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">From creation to resolved</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">ESCALATION COUNT</span>
          <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {stats?.escalatedComplaints || 0}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">&gt; 7 days unresolved</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">SUPPORT AGENTS</span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats?.totalStaff || 0}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active staff handling tickets</span>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Grievances by Category
          </h3>
          <p className="text-xs text-slate-400 mb-4">Volume breakdown across departments</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(stats?.categoryDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center pt-3">
            {(stats?.categoryDistribution || []).map((cat, i) => (
              <span key={cat.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {cat.name}: <strong>{cat.value}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Turnaround Days by Department
          </h3>
          <p className="text-xs text-slate-400 mb-4">Average days required to close tickets</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.resolutionTimeComparison || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} days`, 'Avg. Duration']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="avgDays" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
