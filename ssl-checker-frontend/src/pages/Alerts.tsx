import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, AlertTriangle, CheckCircle2, XCircle, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { domainApi } from '../api/api';
import { Domain } from '../types';
import { cn, formatDate } from '../utils/helpers';

interface AlertSectionProps {
  title: string;
  subtitle: string;
  items: Domain[];
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  borderColor: string;
  countColor: string;
}

function AlertSection({
  title, subtitle, items, color, icon: Icon, iconColor, borderColor, countColor
}: AlertSectionProps) {
  return (
    <div className={cn("glass-panel rounded-3xl overflow-hidden shadow-xl border-l-4", borderColor)}>
      <div className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border", color)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span className={cn("text-2xl font-black px-3.5 py-1 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs", countColor)}>
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
          No domain certificates currently falling into this tier
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {items.map(domain => (
            <div
              key={domain.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors duration-150"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{domain.hostname}</p>
                  {domain.validUntil && (
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      Valid until {formatDate(domain.validUntil)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 pl-3">
                <span className={cn("text-xs font-extrabold px-2.5 py-1 rounded-lg border", countColor, color)}>
                  {domain.daysUntilExpiry !== null && domain.daysUntilExpiry >= 0
                    ? `${domain.daysUntilExpiry}d remaining`
                    : `Expired ${Math.abs(domain.daysUntilExpiry ?? 0)}d ago`}
                </span>
                {domain.emailAlertsEnabled ? (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Alert Active
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700">
                    Muted
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Alerts() {
  const { data: domains = [], isLoading } = useQuery<Domain[]>({
    queryKey: ['domains'],
    queryFn: async () => (await domainApi.getAll()).data,
  });

  const critical = domains.filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry >= 0 && d.daysUntilExpiry <= 7);
  const warning = domains.filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry > 7 && d.daysUntilExpiry <= 30);
  const expired = domains.filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry < 0);
  const healthy = domains.filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry > 30);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <span className="p-2 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Bell className="w-6 h-6" />
          </span>
          Alerts & Expiration Queue
        </h1>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mt-1">
          Automated proactive alerts, multi-tier expiration warnings, and broadcast status
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Critical (≤7 days)', count: critical.length, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Warning (≤30 days)', count: warning.length, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Expired (Past Due)', count: expired.length, color: 'text-slate-500', bg: 'bg-slate-500/10 border-slate-500/20' },
          { label: 'Healthy (>30 days)', count: healthy.length, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className="glass-panel rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className={cn("text-xs font-bold uppercase tracking-wider", color)}>{label}</span>
              <div className={cn("w-3 h-3 rounded-full border", bg)} />
            </div>
            <div className={cn("text-3xl font-black tracking-tight", color)}>
              {isLoading ? '...' : count}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              {count === 1 ? '1 certificate' : `${count} certificates`}
            </div>
          </div>
        ))}
      </div>

      {/* Alert Sections */}
      <div className="space-y-6">
        <AlertSection
          title="Critical Expiration Tier (≤ 7 Days)"
          subtitle="Immediate certificate renewal required to avoid service downtime"
          items={critical}
          color="bg-rose-500/10 border-rose-500/20"
          icon={AlertTriangle}
          iconColor="text-rose-500"
          borderColor="border-rose-500"
          countColor="text-rose-500"
        />
        <AlertSection
          title="Warning Window (≤ 30 Days)"
          subtitle="Schedule automated renewal or issue ACME requests soon"
          items={warning}
          color="bg-amber-500/10 border-amber-500/20"
          icon={Clock}
          iconColor="text-amber-500"
          borderColor="border-amber-500"
          countColor="text-amber-500"
        />
        <AlertSection
          title="Expired Certificates"
          subtitle="Certificates that have exceeded their validity deadline"
          items={expired}
          color="bg-slate-500/10 border-slate-500/20"
          icon={XCircle}
          iconColor="text-slate-500"
          borderColor="border-slate-500"
          countColor="text-slate-500"
        />
        <AlertSection
          title="Healthy & Compliant Tier"
          subtitle="Optimal trust chains with over 30 days of active lifetime"
          items={healthy}
          color="bg-emerald-500/10 border-emerald-500/20"
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          borderColor="border-emerald-500"
          countColor="text-emerald-500"
        />
      </div>
    </motion.div>
  );
}
