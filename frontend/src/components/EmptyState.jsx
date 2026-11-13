import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records matching your criteria.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-soft">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 ring-8 ring-indigo-50/50 dark:ring-indigo-950/30">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
