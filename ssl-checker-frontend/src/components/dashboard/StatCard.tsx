import React from 'react';
import { cn } from '../../utils/helpers';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'slate';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20',
    indicator: 'bg-blue-500',
  },
  green: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    indicator: 'bg-emerald-500',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20',
    indicator: 'bg-amber-500',
  },
  red: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20',
    indicator: 'bg-rose-500',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20',
    indicator: 'bg-purple-500',
  },
  slate: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/20',
    indicator: 'bg-slate-500',
  },
};

export function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-panel rounded-2xl p-5 flex items-center gap-4 hover:shadow-xl transition-all relative overflow-hidden"
    >
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border", colors.bg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider truncate">
          {title}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
      <div className={cn("absolute top-0 right-0 w-1.5 h-full opacity-60", colors.indicator)} />
    </motion.div>
  );
}
