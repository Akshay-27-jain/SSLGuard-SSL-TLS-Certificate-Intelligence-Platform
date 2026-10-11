import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Download, Shield, TrendingUp, AlertTriangle, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { dashboardApi, domainApi } from '../api/api';
import { DashboardStats, Domain } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn, getGradeBg, getGradeColor, getStatusColor, getStatusLabel } from '../utils/helpers';

const CustomStatusTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl">
        <p className="font-bold text-slate-900 dark:text-white text-xs">{entry.payload.name}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: entry.payload.color }}>
          {entry.value} domain{entry.value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => (await dashboardApi.getStats()).data,
  });

  const { data: domains = [] } = useQuery<Domain[]>({
    queryKey: ['domains'],
    queryFn: async () => (await domainApi.getAll()).data,
  });

  const statusData = [
    { name: 'Valid', value: stats?.validDomains || 0, color: '#10b981' },
    { name: 'Expiring', value: stats?.expiringSoonDomains || 0, color: '#f59e0b' },
    { name: 'Expired', value: stats?.expiredDomains || 0, color: '#f43f5e' },
    { name: 'Invalid', value: stats?.invalidDomains || 0, color: '#94a3b8' },
    { name: 'Unreachable', value: stats?.unreachableDomains || 0, color: '#8b5cf6' },
  ];

  const expiryRanges = [
    { range: '< 7 days', count: domains.filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry >= 0 && d.daysUntilExpiry <= 7).length, color: '#f43f5e', bg: 'bg-rose-500' },
    { range: '7–30 days', count: domains.filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry > 7 && d.daysUntilExpiry <= 30).length, color: '#f59e0b', bg: 'bg-amber-500' },
    { range: '30–90 days', count: domains.filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry > 30 && d.daysUntilExpiry <= 90).length, color: '#3b82f6', bg: 'bg-blue-500' },
    { range: '90+ days', count: domains.filter(d => d.daysUntilExpiry !== null && d.daysUntilExpiry > 90).length, color: '#10b981', bg: 'bg-emerald-500' },
  ];

  const downloadReport = () => {
    const reportData = domains.map(d => ({
      hostname: d.hostname,
      port: d.port,
      status: d.status,
      grade: d.grade || 'N/A',
      daysUntilExpiry: d.daysUntilExpiry ?? 'N/A',
      issuer: d.issuer || 'N/A',
      lastChecked: d.lastChecked || 'Never',
    }));

    const csvContent = [
      ['Hostname', 'Port', 'Status', 'Grade', 'Days Until Expiry', 'Issuer', 'Last Checked'].join(','),
      ...reportData.map(r => Object.values(r).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sslguard-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <BarChart3 className="w-6 h-6" />
            </span>
            Reports & Cryptographic Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mt-1">
            Comprehensive audit reports, trust chain health scores, and exportable logs
          </p>
        </div>
        <button
          onClick={downloadReport}
          className="btn-secondary shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
        >
          <Download className="w-4 h-4 text-blue-500" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Domains', value: stats?.totalDomains || 0, icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Fleet Health Score', value: stats?.totalDomains ? `${Math.round(((stats.validDomains) / stats.totalDomains) * 100)}%` : '0%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'At Risk / Expiring', value: (stats?.expiringSoonDomains || 0) + (stats?.expiredDomains || 0), icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'TLS 1.3 Certified', value: stats?.validDomains || 0, icon: CheckCircle2, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-panel rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3 border", bg)}>
              <Icon className={cn("w-5 h-5", color)} />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Status Breakdown</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Certificates by validation status</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} margin={{ top: 8, right: 8, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200/60 dark:stroke-slate-800/80" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400 font-medium" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} className="text-slate-500 dark:text-slate-400 font-medium" axisLine={false} tickLine={false} />
              <Tooltip content={<CustomStatusTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={38}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expiry Ranges */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Expiry Timeline Projections</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Upcoming renewal distribution windows</p>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-4 pt-2">
            {expiryRanges.map(({ range, count, bg }) => (
              <div key={range} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">{range}</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {count} <span className="text-slate-400 font-normal">({domains.length > 0 ? Math.round((count / domains.length) * 100) : 0}%)</span>
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", bg)}
                    style={{
                      width: domains.length > 0 ? `${(count / domains.length) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Domain Details Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Full Certificate Inventory</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Detailed records with cryptographic grades, status and issuers</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {domains.length} Domain{domains.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800/80">
                {['Hostname', 'TLS Grade', 'Status', 'Days Remaining', 'Certificate Issuer', 'Last Audited'].map(h => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {domains.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-sm">No domain records available in the database</p>
                  </td>
                </tr>
              ) : (
                domains.map(domain => (
                  <tr key={domain.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-sm">
                      {domain.hostname}
                    </td>
                    <td className="px-6 py-4">
                      {domain.grade ? (
                        <span className={cn("px-2.5 py-1 rounded-lg text-xs font-extrabold border inline-block shadow-xs", getGradeBg(domain.grade), getGradeColor(domain.grade))}>
                          Grade {domain.grade}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border inline-block", getStatusColor(domain.status))}>
                        {getStatusLabel(domain.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {domain.daysUntilExpiry !== null ? (
                        <span className={cn(
                          domain.daysUntilExpiry < 0 ? "text-rose-600 font-bold" :
                          domain.daysUntilExpiry <= 7 ? "text-rose-500 font-bold" :
                          domain.daysUntilExpiry <= 30 ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"
                        )}>
                          {domain.daysUntilExpiry >= 0 ? `${domain.daysUntilExpiry} days` : `Expired (${Math.abs(domain.daysUntilExpiry)}d ago)`}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={domain.issuer || undefined}>
                      {domain.issuer || '—'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                      {domain.lastChecked ? new Date(domain.lastChecked).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Never'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
