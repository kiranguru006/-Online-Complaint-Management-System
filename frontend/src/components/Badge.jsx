import React from 'react';
import { 
  Clock, 
  Search, 
  UserCheck, 
  Loader2, 
  CheckCircle2, 
  Archive, 
  XCircle, 
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const configs = {
    SUBMITTED: {
      label: 'Submitted',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
      icon: <Search className="w-3.5 h-3.5" />
    },
    ASSIGNED: {
      label: 'Assigned',
      bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
      icon: <UserCheck className="w-3.5 h-3.5" />
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />
    },
    RESOLVED: {
      label: 'Resolved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    CLOSED: {
      label: 'Closed',
      bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: <Archive className="w-3.5 h-3.5" />
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
      icon: <XCircle className="w-3.5 h-3.5" />
    }
  };

  const config = configs[status] || {
    label: status,
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: null
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const configs = {
    LOW: {
      label: 'Low',
      bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: <ArrowDown className="w-3.5 h-3.5" />
    },
    MEDIUM: {
      label: 'Medium',
      bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      icon: <Minus className="w-3.5 h-3.5" />
    },
    HIGH: {
      label: 'High',
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: <ArrowUp className="w-3.5 h-3.5" />
    },
    URGENT: {
      label: 'Urgent',
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
    }
  };

  const config = configs[priority] || {
    label: priority,
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: null
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
