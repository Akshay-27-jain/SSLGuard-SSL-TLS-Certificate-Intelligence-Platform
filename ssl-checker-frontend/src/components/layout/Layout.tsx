import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { Sun, Moon, Search, Bell, ChevronRight } from 'lucide-react';

interface LayoutProps {
  darkMode: boolean;
  toggleDark: () => void;
}

const pageTitles: Record<string, { title: string; category: string }> = {
  '/dashboard': { title: 'Executive Overview', category: 'Monitoring' },
  '/checker': { title: 'SSL / TLS Inspector', category: 'Diagnostics' },
  '/domains': { title: 'Fleet Domain Inventory', category: 'Management' },
  '/reports': { title: 'Cryptographic Analytics', category: 'Compliance' },
  '/alerts': { title: 'Expiration & Alert Queue', category: 'Defense' },
};

export function Layout({ darkMode, toggleDark }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const current = pageTitles[location.pathname] || { title: 'Dashboard', category: 'Overview' };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 mesh-gradient">
      <Sidebar darkMode={darkMode} toggleDark={toggleDark} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Header */}
        <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between flex-shrink-0 z-20">
          {/* Breadcrumbs & Page Category */}
          <div className="flex items-center gap-2 pl-12 lg:pl-0">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">
              {current.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:inline" />
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              {current.title}
            </span>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* TLS Engine Status Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TLS Engine Active</span>
            </div>

            {/* Quick SSL Scanner Shortcut */}
            {location.pathname !== '/checker' && (
              <Link
                to="/checker"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-800/90 hover:border-blue-500/40 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs"
                title="Launch Instant SSL Scanner"
              >
                <Search className="w-3.5 h-3.5 text-blue-500" />
                <span>Quick Scan</span>
              </Link>
            )}

            {/* Alerts Queue Link */}
            <Link
              to="/alerts"
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all relative shadow-xs"
              title="View Expiration Queue & Alerts"
              aria-label="View Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs cursor-pointer"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>

            {/* User Profile Avatar */}
            {user && (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden xl:inline">
                  {user.fullName?.split(' ')[0] || 'User'}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
