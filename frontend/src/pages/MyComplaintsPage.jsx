import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { StarRating } from '../components/StarRating';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  ArrowUpDown, 
  Star, 
  ExternalLink, 
  Eye, 
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const MyComplaintsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  // Feedback Modal State
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Detail Modal State
  const [detailComplaint, setDetailComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.categoryId = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/complaints', { params });
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, categoryFilter]);

  // Client-side filtering by priority & sorting
  const filteredComplaints = complaints
    .filter((c) => (priorityFilter ? c.priority === priorityFilter : true))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const handleOpenFeedback = (c) => {
    setFeedbackComplaint(c);
    setFeedbackRating(5);
    setFeedbackComment('');
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackComplaint) return;
    setSubmittingFeedback(true);

    try {
      const res = await api.post(`/feedback/${feedbackComplaint.id}`, {
        rating: feedbackRating,
        comments: feedbackComment,
      });
      if (res.data.success) {
        addToast('Feedback submitted successfully! Thank you.', 'success');
        setFeedbackComplaint(null);
        fetchComplaints();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not submit feedback.', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {user?.role === 'ROLE_ADMIN' ? 'All Complaints' : 'My Complaints'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and review grievance statuses
          </p>
        </div>

        <Link
          to="/complaints/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>File Complaint</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, title, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Complaints List Table / Cards */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredComplaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="Try adjusting your search terms or filters to find what you are looking for."
          actionText={user?.role === 'ROLE_USER' ? 'File a Complaint' : undefined}
          actionLink={user?.role === 'ROLE_USER' ? '/complaints/new' : undefined}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Complaint ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Title &amp; Category</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6">Priority</th>
                  <th className="py-3.5 px-4 sm:px-6">Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {c.complaintNumber}
                        </span>
                        {c.escalated && (
                          <span
                            title="Escalated ticket (>7 days)"
                            className="w-2 h-2 rounded-full bg-rose-500 animate-ping"
                          />
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6">
                      <div className="max-w-xs sm:max-w-md">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {c.category?.name} {c.location ? `• ${c.location}` : ''}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* If resolved or closed and user is owner -> give feedback */}
                        {(c.status === 'RESOLVED' || c.status === 'CLOSED') &&
                          user?.role === 'ROLE_USER' && (
                            <button
                              onClick={() => handleOpenFeedback(c)}
                              className="px-2.5 py-1 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>Feedback</span>
                            </button>
                          )}

                        <button
                          onClick={() => setDetailComplaint(c)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <Link
                          to={`/track?id=${c.complaintNumber}`}
                          title="Track Timeline"
                          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
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

      {/* Feedback Modal */}
      {feedbackComplaint && (
        <Modal
          isOpen={!!feedbackComplaint}
          onClose={() => setFeedbackComplaint(null)}
          title={`Rate Resolution for ${feedbackComplaint.complaintNumber}`}
        >
          <form onSubmit={handleSubmitFeedback} className="space-y-5">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Complaint Title
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{feedbackComplaint.title}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Your Rating (1 to 5 Stars) *
              </label>
              <StarRating
                rating={feedbackRating}
                onChange={(val) => setFeedbackRating(val)}
                size="lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Comments &amp; Experience
              </label>
              <textarea
                rows={3}
                placeholder="Share your feedback regarding the resolution speed and support quality..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFeedbackComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingFeedback}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {submittingFeedback ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Feedback</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Detail Modal */}
      {detailComplaint && (
        <Modal
          isOpen={!!detailComplaint}
          onClose={() => setDetailComplaint(null)}
          title={`Complaint Details: ${detailComplaint.complaintNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <StatusBadge status={detailComplaint.status} />
                <PriorityBadge priority={detailComplaint.priority} />
              </div>
              <span className="text-xs text-slate-400">
                Created: {new Date(detailComplaint.createdAt).toLocaleString()}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {detailComplaint.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Category: <strong>{detailComplaint.category?.name}</strong> • Location: <strong>{detailComplaint.location || 'N/A'}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Description
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {detailComplaint.description}
              </p>
            </div>

            {detailComplaint.imageUrl && (
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Attachment
                </p>
                <img
                  src={detailComplaint.imageUrl}
                  alt="Complaint attachment"
                  className="rounded-2xl max-h-60 object-contain border border-slate-200 dark:border-slate-800"
                />
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <Link
                to={`/track?id=${detailComplaint.complaintNumber}`}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Open Full Timeline &amp; History</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setDetailComplaint(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
