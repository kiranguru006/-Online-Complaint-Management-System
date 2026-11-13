import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Search,
  CheckSquare,
  Users,
  FolderTree,
  BarChart3,
  User,
  X,
  FileText
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Navigation</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
              Logged in as
            </p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
              {user.fullName}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {role === 'ROLE_ADMIN' ? 'Administrator' : role === 'ROLE_STAFF' ? 'Staff' : 'Citizen'}
            </span>
          </div>

          {/* Navigation Items based on Role */}
          <nav className="space-y-1">
            {/* Common / USER items */}
            {role === 'ROLE_USER' && (
              <>
                <NavLink to="/dashboard" className={navItemClass} onClick={onClose}>
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/complaints/new" className={navItemClass} onClick={onClose}>
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span>File a Complaint</span>
                </NavLink>
                <NavLink to="/complaints" className={navItemClass} onClick={onClose}>
                  <ListOrdered className="w-4 h-4 shrink-0" />
                  <span>My Complaints</span>
                </NavLink>
              </>
            )}

            {/* STAFF items */}
            {role === 'ROLE_STAFF' && (
              <>
                <NavLink to="/staff/dashboard" className={navItemClass} onClick={onClose}>
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Staff Dashboard</span>
                </NavLink>
                <NavLink to="/staff/complaints" className={navItemClass} onClick={onClose}>
                  <CheckSquare className="w-4 h-4 shrink-0" />
                  <span>Assigned Complaints</span>
                </NavLink>
              </>
            )}

            {/* ADMIN items */}
            {role === 'ROLE_ADMIN' && (
              <>
                <NavLink to="/admin/dashboard" className={navItemClass} onClick={onClose}>
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Overview</span>
                </NavLink>
                <NavLink to="/complaints" className={navItemClass} onClick={onClose}>
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>All Complaints</span>
                </NavLink>
                <NavLink to="/admin/users" className={navItemClass} onClick={onClose}>
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Manage Users</span>
                </NavLink>
                <NavLink to="/admin/categories" className={navItemClass} onClick={onClose}>
                  <FolderTree className="w-4 h-4 shrink-0" />
                  <span>Categories</span>
                </NavLink>
                <NavLink to="/admin/reports" className={navItemClass} onClick={onClose}>
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>Reports & Stats</span>
                </NavLink>
              </>
            )}

            {/* Universal items */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <NavLink to="/track" className={navItemClass} onClick={onClose}>
                <Search className="w-4 h-4 shrink-0" />
                <span>Track Complaint</span>
              </NavLink>
              <NavLink to="/profile" className={navItemClass} onClick={onClose}>
                <User className="w-4 h-4 shrink-0" />
                <span>My Profile</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="text-center p-3 text-[11px] text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-800/80">
          Resolvify v1.0 • Modern SaaS
        </div>
      </aside>
    </>
  );
};
