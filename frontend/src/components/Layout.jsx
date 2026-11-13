import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {user && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        )}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 ${!user ? 'w-full' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
