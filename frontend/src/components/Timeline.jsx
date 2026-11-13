import React from 'react';
import { StatusBadge } from './Badge';
import { Calendar, User } from 'lucide-react';

export const Timeline = ({ updates = [] }) => {
  if (!updates || updates.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        No status history recorded yet.
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {updates.map((update, index) => {
        const isLatest = index === updates.length - 1;

        return (
          <div key={update.id || index} className="relative group">
            {/* Dot Node */}
            <div
              className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform duration-200 ${
                isLatest
                  ? 'bg-indigo-600 border-white ring-4 ring-indigo-100 dark:ring-indigo-950/80 scale-110'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
              }`}
            />

            {/* Content Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <StatusBadge status={update.newStatus} />
                <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(update.createdAt)}
                </span>
              </div>

              {update.remarks && (
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 font-normal leading-relaxed">
                  {update.remarks}
                </p>
              )}

              {update.updatedBy && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5" />
                  <span>
                    Updated by <strong className="font-semibold text-slate-700 dark:text-slate-300">{update.updatedBy.fullName}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
