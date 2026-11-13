import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-soft animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    </div>
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
    </div>
    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-soft animate-pulse">
    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6 ml-auto"></div>
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex gap-4 items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-20 ml-auto"></div>
        </div>
      ))}
    </div>
  </div>
);
