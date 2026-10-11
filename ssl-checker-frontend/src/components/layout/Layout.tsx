import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  darkMode: boolean;
  toggleDark: () => void;
}

export function Layout({ darkMode, toggleDark }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 mesh-gradient">
      <Sidebar darkMode={darkMode} toggleDark={toggleDark} />
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
