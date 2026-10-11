import React from 'react';
import { cn, getStatusBg, getStatusColor, getStatusLabel, formatRelativeTime } from '../../utils/helpers';
import { Shield, Clock } from 'lucide-react';
import { SslCertificate } from '../../types';

interface ActivityFeedProps {
  items: SslCertificate[];
  loading?: boolean;
}

export function ActivityFeed({ items, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-2/5" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-500">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-3">
          <Shield className="w-6 h-6 opacity-40" />
        </div>
        <p className="text-sm font-semibold">No recent certificate audits recorded</p>
        <p className="text-xs text-slate-400 mt-1">Run an analysis in the SSL Inspector to log handshake events</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => {
        const domain = item.subject?.replace('CN=', '') || 'Unknown Host';
        return (
          <div
            key={item.id || index}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-extrabold shadow-xs transition-transform group-hover:scale-105",
                getStatusBg(item.status),
                getStatusColor(item.status)
              )}>
                {item.grade || '—'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {domain}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", getStatusBg(item.status), getStatusColor(item.status))}>
                    {getStatusLabel(item.status)}
                  </span>
                  {item.daysRemaining !== undefined && item.daysRemaining !== null && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {item.daysRemaining >= 0 ? `${item.daysRemaining} days left` : 'Expired'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {item.checkedAt && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 flex-shrink-0 pl-3">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatRelativeTime(item.checkedAt)}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
