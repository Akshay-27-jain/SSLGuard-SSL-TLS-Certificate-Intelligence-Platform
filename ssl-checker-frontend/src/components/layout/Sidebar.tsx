import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Search,
  Bell, BarChart3, LogOut, Menu, X, Sun, Moon, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/checker', label: 'SSL Checker', icon: Search, badge: 'Live' },
  { path: '/domains', label: 'My Domains', icon: Globe },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/alerts', label: 'Alerts', icon: Bell },
];

interface SidebarProps {
  darkMode: boolean;
  toggleDark: () => void;
}

interface SidebarContentProps {
  collapsed: boolean;
  locationPath: string;
  onItemClick: () => void;
  darkMode: boolean;
  toggleDark: () => void;
  user: any;
  onLogout: () => void;
}

function SidebarContent({
  collapsed,
  locationPath,
  onItemClick,
  darkMode,
  toggleDark,
  user,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
      {/* Logo */}
      <div className={cn(
        "p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center",
        collapsed ? "justify-center px-2" : "justify-start"
      )}>
        <Logo size="md" showText={!collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = locationPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white",
                collapsed && "justify-center"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110", isActive ? "text-white" : "text-slate-500 dark:text-slate-400")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && !isActive && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {item.badge}
                </span>
              )}
              {!collapsed && isActive && (
                <ChevronRight className="w-4 h-4 ml-auto opacity-70" />
              )}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-medium">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggleDark}
          className={cn(
            "flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium",
            "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer",
            collapsed && "justify-center"
          )}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-500 flex-shrink-0" /> : <Moon className="w-5 h-5 text-blue-500 flex-shrink-0" />}
          {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User profile */}
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm text-white font-bold text-sm">
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.fullName || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold",
            "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ darkMode, toggleDark }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 flex-shrink-0 z-30 shadow-xs",
        collapsed ? "w-20" : "w-64"
      )}>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3.5 top-9 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-md z-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
        >
          <ChevronRight className={cn("w-3.5 h-3.5 text-slate-600 dark:text-slate-300 transition-transform duration-200", !collapsed && "rotate-180")} />
        </button>
        <SidebarContent
          collapsed={collapsed}
          locationPath={location.pathname}
          onItemClick={() => {}}
          darkMode={darkMode}
          toggleDark={toggleDark}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-md cursor-pointer"
      >
        <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-72 bg-white dark:bg-slate-900 h-full shadow-2xl z-10"
          >
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent
              collapsed={false}
              locationPath={location.pathname}
              onItemClick={() => setMobileOpen(false)}
              darkMode={darkMode}
              toggleDark={toggleDark}
              user={user}
              onLogout={handleLogout}
            />
          </motion.aside>
        </div>
      )}
    </>
  );
}
