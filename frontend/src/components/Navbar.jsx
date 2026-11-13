import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  Sun, 
  Moon, 
  Bell, 
  Check, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu,
  CheckCheck,
  ExternalLink
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
      const countRes = await api.get('/notifications/unread-count');
      if (countRes.data.success) {
        setUnreadCount(countRes.data.data.unreadCount || 0);
      }
    } catch (err) {
      // silently handle notification polling error
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll notifications every 15s
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notif) => {
    setIsNotifOpen(false);
    if (!notif.isRead) {
      api.put(`/notifications/${notif.id}/read`).catch(() => {});
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    if (notif.complaintNumber) {
      navigate(`/track?id=${notif.complaintNumber}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Resolvify
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* In-app Notifications Dropdown (Logged in only) */}
        {user && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors text-left flex items-start gap-2.5 ${
                          !n.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !n.isRead ? 'bg-indigo-600' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!n.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            title="Mark as read"
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Menu or Auth CTAs */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 transition-colors"
            >
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden sm:inline max-w-[120px] truncate">
                {user.fullName}
              </span>
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center uppercase">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <div className="mt-1.5">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {user.role === 'ROLE_ADMIN' ? 'ADMINISTRATOR' : user.role === 'ROLE_STAFF' ? 'STAFF MEMBER' : 'CITIZEN'}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
