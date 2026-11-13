import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  Edit3, 
  AlertTriangle, 
  Search,
  UserCheck
} from 'lucide-react';

export const StaffDashboardPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Status Update Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchStaffComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/staff/complaints');
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffComplaints();
  }, []);

  const handleOpenStatusModal = (c) => {
    setSelectedComplaint(c);
    setNewStatus(c.status === 'ASSIGNED' ? 'IN_PROGRESS' : c.status);
    setRemarks('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setUpdating(true);

    try {
      const res = await api.put(`/complaints/${selectedComplaint.id}/status`, {
        status: newStatus,
        remarks: remarks.trim() || `Status updated to ${newStatus} by staff ${user?.fullName}`,
      });

      if (res.data.success) {
        addToast(`Complaint ${selectedComplaint.complaintNumber} updated to ${newStatus}!`, 'success');
        setSelectedComplaint(null);
        fetchStaffComplaints();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    const matchesSearch = searchTerm
      ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const totalAssigned = complaints.length;
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Staff Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Assigned tickets, investigation remarks, and resolution updates
        </p>
      </div>

      {/* KPI Mini-cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Assigned Tickets</span>
            <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalAssigned}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">In Active Progress</span>
            <Loader2 className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{inProgress}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Resolved by You</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-soft flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assigned tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Statuses</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No assigned complaints"
          description="You currently have no complaints assigned matching this filter."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Ticket ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Title &amp; Reporter</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6">Priority</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {c.complaintNumber}
                        </span>
                        {c.escalated && (
                          <span
                            title="Overdue Escalation"
                            className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                          />
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      <div className="max-w-xs sm:max-w-md">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Filed by: <strong>{c.user?.fullName}</strong> ({c.user?.email}) • {c.location || 'Location not specified'}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenStatusModal(c)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update Status</span>
                        </button>

                        <Link
                          to={`/track?id=${c.complaintNumber}`}
                          title="View Timeline"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Update Status: ${selectedComplaint.complaintNumber}`}
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Complaint
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedComplaint.title}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Current Status: <strong>{selectedComplaint.status}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                New Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Staff Remarks / Resolution Notes *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain the work done, findings, or instructions for the user..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Status</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
