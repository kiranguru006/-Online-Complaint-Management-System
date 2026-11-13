import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { 
  FilePlus2, 
  Upload, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  X, 
  Image as ImageIcon 
} from 'lucide-react';

export const FileComplaintPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    priority: 'MEDIUM',
    location: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/active');
        if (res.data.success) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: res.data.data[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Attached image file must be smaller than 10MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId || !formData.description) {
      setErrorMsg('Please fill in title, category, and description.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('categoryId', formData.categoryId);
      payload.append('priority', formData.priority);
      payload.append('location', formData.location.trim());
      payload.append('description', formData.description.trim());
      if (selectedFile) {
        payload.append('image', selectedFile);
      }

      const res = await api.post('/complaints', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const complaint = res.data.data;
        addToast(`Complaint ${complaint.complaintNumber} submitted successfully!`, 'success');
        navigate(`/track?id=${complaint.complaintNumber}`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const priorities = [
    { value: 'LOW', label: 'Low', desc: 'Minor inconvenience' },
    { value: 'MEDIUM', label: 'Medium', desc: 'Standard support issue' },
    { value: 'HIGH', label: 'High', desc: 'Significant productivity blocker' },
    { value: 'URGENT', label: 'Urgent', desc: 'Critical safety or infrastructure failure' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          File a New Complaint
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Provide as much detail as possible to help our team resolve your issue quickly.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Complaint Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Issue Summary / Title *
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={150}
              placeholder="e.g. Broken monitor in East Wing Workstation 12"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <select
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.department ? `(${cat.department.name})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Location / Department
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Building B, 2nd Floor"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Priority Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {priorities.map((p) => {
                const selected = formData.priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, priority: p.value }))}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {p.label}
                      </span>
                      {selected && <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Detailed Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              maxLength={3000}
              placeholder="Describe the problem, when it started, and any symptoms or error messages observed..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
            />
          </div>

          {/* Image Upload Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Photo / Attachment (Optional)
            </label>

            {previewUrl ? (
              <div className="relative inline-block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                <img
                  src={previewUrl}
                  alt="Attachment preview"
                  className="max-h-48 max-w-full object-contain rounded-2xl"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/40 dark:bg-slate-800/20 transition-colors">
                <Upload className="w-7 h-7 text-slate-400 mb-2" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Click to upload screenshot or photo
                </span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
