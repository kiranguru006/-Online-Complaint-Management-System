import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { Modal } from '../components/Modal';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Edit2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const ManageUsersPage = () => {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Edit User Modal
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState('ROLE_USER');
  const [editActive, setEditActive] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenEdit = (u) => {
    setEditUser(u);
    setEditRole(u.role?.name || 'ROLE_USER');
    setEditActive(u.active);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    setUpdating(true);

    try {
      const res = await api.put(`/users/${editUser.id}`, {
        role: editRole,
        active: editActive,
      });

      if (res.data.success) {
        addToast(`User ${editUser.fullName} updated successfully!`, 'success');
        setEditUser(null);
        fetchUsers();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async (u) => {
    try {
      const res = await api.put(`/users/${u.id}`, {
        active: !u.active,
      });
      if (res.data.success) {
        addToast(`User status set to ${!u.active ? 'Active' : 'Inactive'}`, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast('Failed to change user status.', 'error');
    }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter ? u.role?.name === roleFilter : true;
    const matchesSearch = searchTerm
      ? u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          User Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review accounts, assign staff/administrator roles, and govern portal access
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-soft flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Roles</option>
          <option value="ROLE_ADMIN">Administrators</option>
          <option value="ROLE_STAFF">Staff Representatives</option>
          <option value="ROLE_USER">Citizens / Users</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">User</th>
                  <th className="py-3.5 px-4 sm:px-6">Role</th>
                  <th className="py-3.5 px-4 sm:px-6">Department</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6">Created</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map((u) => {
                  const roleName = u.role?.name;
                  let roleBadge = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                  if (roleName === 'ROLE_ADMIN') roleBadge = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300';
                  else if (roleName === 'ROLE_STAFF') roleBadge = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs uppercase text-slate-700 dark:text-slate-200 shrink-0">
                            {u.fullName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {u.fullName}
                            </p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleBadge}`}>
                          {roleName === 'ROLE_ADMIN' ? 'ADMIN' : roleName === 'ROLE_STAFF' ? 'STAFF' : 'USER'}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {u.department ? u.department.name : '—'}
                      </td>

                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            u.active
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.active ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(u)}
                            title={u.active ? 'Deactivate User' : 'Activate User'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.active
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                          >
                            {u.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleOpenEdit(u)}
                            title="Edit Role & Permissions"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editUser && (
        <Modal
          isOpen={!!editUser}
          onClose={() => setEditUser(null)}
          title={`Edit Account: ${editUser.fullName}`}
        >
          <form onSubmit={handleSaveUser} className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</p>
              <p className="text-sm text-slate-500">{editUser.email}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Role Permissions *
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ROLE_USER">Citizen / Standard User</option>
                <option value="ROLE_STAFF">Staff Representative</option>
                <option value="ROLE_ADMIN">System Administrator</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="activeCheckbox"
                checked={editActive}
                onChange={(e) => setEditActive(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="activeCheckbox" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Account Active &amp; Allowed to Log In
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Save Changes</span>}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
