import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Globe, Shield, BarChart3, Bell,
  Sun, Moon, CornerDownLeft, X, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sanitizeDomainInput } from '../../utils/helpers';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleDark: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  category: 'Navigation' | 'Actions' | 'Inspect';
  action: () => void;
}

export function CommandPalette({ open, onClose, darkMode, toggleDark }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Clean domain if user entered a URL or domain pattern
  const { hostname: cleanHost } = sanitizeDomainInput(query);
  const isDomainInput = Boolean(cleanHost && cleanHost.includes('.'));

  const staticItems = useMemo<CommandItem[]>(() => [
    {
      id: 'nav-dashboard',
      title: 'Executive Dashboard',
      subtitle: 'Overview of fleet SSL health and statistics',
      icon: <Shield className="w-4 h-4 text-blue-500" />,
      category: 'Navigation',
      action: () => { navigate('/dashboard'); onClose(); },
    },
    {
      id: 'nav-domains',
      title: 'Fleet Monitored Domains',
      subtitle: 'Manage and inspect tracked domain certificates',
      icon: <Globe className="w-4 h-4 text-emerald-500" />,
      category: 'Navigation',
      action: () => { navigate('/domains'); onClose(); },
    },
    {
      id: 'nav-checker',
      title: 'SSL / TLS Inspector',
      subtitle: 'Perform live cryptographic socket checks',
      icon: <Search className="w-4 h-4 text-indigo-500" />,
      category: 'Navigation',
      action: () => { navigate('/checker'); onClose(); },
    },
    {
      id: 'nav-reports',
      title: 'Cryptographic Analytics',
      subtitle: 'Comprehensive audit scores and CSV export',
      icon: <BarChart3 className="w-4 h-4 text-cyan-500" />,
      category: 'Navigation',
      action: () => { navigate('/reports'); onClose(); },
    },
    {
      id: 'nav-alerts',
      title: 'Expiration & Alert Queue',
      subtitle: 'View 30-day proactive expiration alerts',
      icon: <Bell className="w-4 h-4 text-amber-500" />,
      category: 'Navigation',
      action: () => { navigate('/alerts'); onClose(); },
    },
    {
      id: 'act-theme',
      title: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Toggle interface visual theme',
      icon: darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />,
      category: 'Actions',
      action: () => { toggleDark(); onClose(); },
    },
  ], [navigate, onClose, darkMode, toggleDark]);

  const allItems = useMemo(() => {
    const list: CommandItem[] = [];
    if (isDomainInput) {
      list.push({
        id: `inspect-${cleanHost}`,
        title: `Analyze TLS Handshake: ${cleanHost}`,
        subtitle: 'Perform instant socket inspection on port 443',
        icon: <Terminal className="w-4 h-4 text-blue-500" />,
        category: 'Inspect',
        action: () => {
          navigate(`/checker?domain=${encodeURIComponent(cleanHost)}`);
          onClose();
        },
      });
    }

    const filtered = staticItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
    );

    return [...list, ...filtered];
  }, [isDomainInput, cleanHost, staticItems, query, navigate, onClose]);

  const allItemsRef = useRef(allItems);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    allItemsRef.current = allItems;
    selectedIndexRef.current = selectedIndex;
  }, [allItems, selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = allItemsRef.current;
      const currentIdx = selectedIndexRef.current;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((currentIdx + 1) % (items.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((currentIdx - 1 + (items.length || 1)) % (items.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[currentIdx]) {
          items[currentIdx].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleClose = () => {
    setQuery('');
    setSelectedIndex(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 gap-3">
              <Search className="w-5 h-5 text-blue-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a domain (e.g. google.com) or search pages..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium text-sm outline-none"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                  ESC
                </kbd>
                <button
                  onClick={handleClose}
                  aria-label="Close command palette"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {allItems.length === 0 ? (
                <div className="p-8 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                  No matching commands or domains found.
                </div>
              ) : (
                allItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl border ${
                          isSelected
                            ? 'bg-blue-500/15 border-blue-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate font-medium">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                            Select <CornerDownLeft className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-2">
                <span>Navigate:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">↓</kbd>
                <span>Select:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">↵</kbd>
              </div>
              <div className="flex items-center gap-1">
                <span>Google Stitch Standard</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
