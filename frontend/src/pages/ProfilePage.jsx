import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Mail, Phone, Lock, ShieldCheck, Loader2 } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await api.put('/users/profile', {
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      if (res.data.success) {
        addToast('Profile updated successfully!', 'success');
        updateUser({ fullName: res.data.data.fullName, phone: res.data.data.phone });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New password and confirm password do not match.', 'error');
      return;
    }

    setSavingPassword(true);

    try {
      const res = await api.put('/users/profile', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        addToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to change password. Please check your current password.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information and security credentials
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Personal Information
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address (Fixed)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/20 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Assigned Role
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled
                value={
                  user?.role === 'ROLE_ADMIN'
                    ? 'System Administrator'
                    : user?.role === 'ROLE_STAFF'
                    ? 'Staff Representative'
                    : 'Citizen / Standard User'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/20 text-xs text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="+1 555-0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Update Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Current Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
