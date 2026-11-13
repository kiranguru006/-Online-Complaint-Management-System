import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
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
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { addToast } = useToast();

  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assign Modal
  const [assignComplaint, setAssignComplaint] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [assigning, setAssigning] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, complaintsRes, staffRes] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/complaints'),
        api.get('/users/staff-list'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (complaintsRes.data.success) {
        setRecentComplaints(complaintsRes.data.data.slice(0, 6));
      }
      if (staffRes.data.success) {
        setStaffList(staffRes.data.data);
        if (staffRes.data.data.length > 0) {
          setSelectedStaffId(staffRes.data.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenAssign = (c) => {
    setAssignComplaint(c);
    setAssignRemarks(`Assigned to staff by administrator`);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignComplaint || !selectedStaffId) return;
    setAssigning(true);

    try {
      const res = await api.put(`/complaints/${assignComplaint.id}/assign`, {
        staffId: selectedStaffId,
        remarks: assignRemarks.trim(),
      });
      if (res.data.success) {
        addToast(`Complaint ${assignComplaint.complaintNumber} assigned successfully!`, 'success');
        setAssignComplaint(null);
        fetchDashboardData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to assign complaint.', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  const handleDownloadCsv = () => {
    window.open('/api/reports/export/csv', '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2">
      {/* Page Header with CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Administrative Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time operations, staff assignments, SLA escalations &amp; KPI analytics
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-soft hover:shadow-soft-lg transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Export All (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">Total Filed</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalComplaints || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <span className="text-[11px] font-semibold text-amber-500 block uppercase">Pending Triage</span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {stats?.pendingComplaints || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <span className="text-[11px] font-semibold text-purple-500 block uppercase">In Progress</span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {stats?.inProgressComplaints || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <span className="text-[11px] font-semibold text-emerald-500 block uppercase">Resolved</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats?.resolvedComplaints || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <span className="text-[11px] font-semibold text-rose-500 block uppercase">SLA Escalated</span>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {stats?.escalatedComplaints || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
          <span className="text-[11px] font-semibold text-indigo-500 block uppercase">Resolution Rate</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            {stats?.resolutionRate || 0}%
          </p>
        </div>
      </div>

      {/* 3 Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Category Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Category Distribution
            </h3>
            <p className="text-[11px] text-slate-400">Share of complaints per department</p>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
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

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {(stats?.categoryDistribution || []).map((cat, i) => (
              <span key={cat.name} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {cat.name} ({cat.value})
              </span>
            ))}
          </div>
        </div>

        {/* 2. Monthly Trend Line Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Monthly Submission Volume
            </h3>
            <p className="text-[11px] text-slate-400">Trend of incoming grievances over time</p>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="complaints"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#6366f1' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-[11px] text-slate-400 pt-2">
            Total active periods monitored: {(stats?.monthlyTrends || []).length}
          </p>
        </div>

        {/* 3. Resolution Time Comparison Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Avg. Resolution Time (Days)
            </h3>
            <p className="text-[11px] text-slate-400">Average days to resolve by category</p>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.resolutionTimeComparison || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val} days`, 'Avg. Resolution']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="avgDays" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-center text-[11px] text-slate-400 pt-2">
            Target SLA: ≤ 2.0 days across all departments
          </p>
        </div>
      </div>

      {/* Recent Complaints & Assign Staff Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Complaints &amp; Staff Assignments
            </h3>
            <p className="text-xs text-slate-400">
              Assign unassigned complaints directly to available support staff
            </p>
          </div>
          <Link
            to="/complaints"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {c.complaintNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100 max-w-xs truncate">
                    {c.title}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{c.category?.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {c.assignedStaff ? (
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {c.assignedStaff.fullName}
                      </span>
                    ) : (
                      <span className="text-amber-500 font-semibold text-[11px] bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleOpenAssign(c)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-colors"
                    >
                      {c.assignedStaff ? 'Reassign' : 'Assign Staff'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {assignComplaint && (
        <Modal
          isOpen={!!assignComplaint}
          onClose={() => setAssignComplaint(null)}
          title={`Assign Staff: ${assignComplaint.complaintNumber}`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Complaint Title
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {assignComplaint.title}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Category: <strong>{assignComplaint.category?.name}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Staff Representative *
              </label>
              <select
                required
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.email}) {s.department ? `- ${s.department.name}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Assignment Directives / Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Directives for the assigned agent..."
                value={assignRemarks}
                onChange={(e) => setAssignRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssignComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assigning}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {assigning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Assigning...</span>
                  </>
                ) : (
                  <span>Confirm Assignment</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
