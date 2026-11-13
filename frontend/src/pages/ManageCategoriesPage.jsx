import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { Modal } from '../components/Modal';
import { 
  FolderTree, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Loader2 
} from 'lucide-react';

export const ManageCategoriesPage = () => {
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', active: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.id);
    setFormData({
      name: c.name,
      description: c.description || '',
      active: c.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
        addToast('Category updated successfully!', 'success');
      } else {
        await api.post('/categories', formData);
        addToast('Category created successfully!', 'success');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      addToast(`Category "${name}" deleted.`, 'success');
      fetchCategories();
    } catch (err) {
      addToast('Cannot delete category in use by existing complaints.', 'error');
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure grievance classifications and routing departments
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Category Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Description</th>
                  <th className="py-3.5 px-4 sm:px-6">Department</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
                      {c.name}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400 max-w-sm truncate">
                      {c.description || 'No description provided'}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-500">
                      {c.department ? c.department.name : 'General'}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          c.active
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.active ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {c.active ? 'Active' : 'Archived'}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Category' : 'Add New Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Category Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Electrical &amp; Power Supply"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe what grievances fall under this classification..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="catActive"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="catActive" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Category Active (Selectable in File Complaint dropdown)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Save Category</span>}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
