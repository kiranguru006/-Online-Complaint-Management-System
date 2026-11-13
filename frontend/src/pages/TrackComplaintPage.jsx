import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import { Timeline } from '../components/Timeline';
import { StarRating } from '../components/StarRating';
import { 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Star, 
  Loader2, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const TrackComplaintPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [complaintNumber, setComplaintNumber] = useState(searchParams.get('id') || '');
  const [complaintData, setComplaintData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // New Feedback State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchTrackData = async (numberToTrack) => {
    if (!numberToTrack || !numberToTrack.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get(`/complaints/track/${encodeURIComponent(numberToTrack.trim())}`);
      if (res.data.success) {
        setComplaintData(res.data.data.complaint);
        setTimeline(res.data.data.timeline || []);

        // Fetch feedback if any
        if (res.data.data.complaint?.id) {
          try {
            const feedRes = await api.get(`/feedback/${res.data.data.complaint.id}`);
            if (feedRes.data.success) {
              setFeedback(feedRes.data.data);
            }
          } catch (e) {}
        }
      }
    } catch (err) {
      setComplaintData(null);
      setTimeline([]);
      setFeedback(null);
      setErrorMsg(err.response?.data?.message || 'Complaint not found. Please verify the ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setComplaintNumber(idParam);
      fetchTrackData(idParam);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (complaintNumber.trim()) {
      setSearchParams({ id: complaintNumber.trim() });
      fetchTrackData(complaintNumber.trim());
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!complaintData) return;
    setSubmittingFeedback(true);

    try {
      const res = await api.post(`/feedback/${complaintData.id}`, {
        rating: newRating,
        comments: newComment,
      });
      if (res.data.success) {
        addToast('Feedback submitted successfully!', 'success');
        setFeedback(res.data.data);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit feedback.', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Track Grievance Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your unique complaint reference code to view chronological updates &amp; remarks.
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. CMP-2026-0001"
              value={complaintNumber}
              onChange={(e) => setComplaintNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-soft focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
          </button>
        </form>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm text-center">
          {errorMsg}
        </div>
      )}

      {/* Complaint Info & Visual Timeline */}
      {complaintData && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                  {complaintData.complaintNumber}
                </span>
                <StatusBadge status={complaintData.status} />
                <PriorityBadge priority={complaintData.priority} />
              </div>

              {complaintData.escalated && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 dark:bg-rose-950/60 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>SLA Escalated (&gt;7 Days)</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {complaintData.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {complaintData.description}
              </p>
            </div>

            {complaintData.imageUrl && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Attached Evidence
                </p>
                <img
                  src={complaintData.imageUrl}
                  alt="Evidence"
                  className="rounded-2xl max-h-72 object-contain border border-slate-200 dark:border-slate-800"
                />
              </div>
            )}

            {/* Metadata Pills */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {complaintData.category?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {complaintData.location || 'Not Specified'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Reported By</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {complaintData.user?.fullName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Staff</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {complaintData.assignedStaff?.fullName || 'Pending Assignment'}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Status Progression &amp; Timeline
              </h3>
            </div>

            <Timeline updates={timeline} />
          </div>

          {/* Feedback & Rating Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Citizen Feedback &amp; Rating
              </h3>
            </div>

            {feedback ? (
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={feedback.rating} readOnly={true} size="md" />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    {feedback.rating} / 5 Stars
                  </span>
                </div>
                {feedback.comments && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 italic">
                    "{feedback.comments}"
                  </p>
                )}
                <span className="text-[10px] text-slate-400 block mt-2">
                  Submitted on {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
            ) : complaintData.status === 'RESOLVED' || complaintData.status === 'CLOSED' ? (
              user?.id === complaintData.user?.id ? (
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This complaint has been resolved. How satisfied are you with the resolution?
                  </p>
                  <div>
                    <StarRating
                      rating={newRating}
                      onChange={(r) => setNewRating(r)}
                      size="lg"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Share your experience (optional)..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
                  >
                    {submittingFeedback ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Submit Feedback</span>
                    )}
                  </button>
                </form>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Awaiting feedback from the reporting citizen ({complaintData.user?.fullName}).
                </p>
              )
            ) : (
              <p className="text-xs text-slate-400 italic">
                Feedback can be submitted once this ticket reaches RESOLVED status.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
