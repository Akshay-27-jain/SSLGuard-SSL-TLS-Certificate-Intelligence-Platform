import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Globe, AlertTriangle, XCircle, CheckCircle2, Activity, TrendingUp, Plus, Search, RefreshCw, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardApi, sslApi } from '../api/api';
import { StatCard } from '../components/dashboard/StatCard';
import { ExpiryBarChart, GradePieChart } from '../components/dashboard/Charts';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { DashboardStats, SslCertificate } from '../types';
import { useAuthStore } from '../store/authStore';
import { formatDate, cn, sanitizeDomainInput } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [quickHost, setQuickHost] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickResult, setQuickResult] = useState<SslCertificate | null>(null);

  const { data: statsData, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { data: activityData, isLoading: activityLoading } = useQuery<SslCertificate[]>({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const res = await dashboardApi.getRecentActivity();
      return res.data;
    },
    refetchInterval: 30000,
  });

  const stats = statsData;

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  const handleQuickAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { hostname: cleanHost, port } = sanitizeDomainInput(quickHost);
    if (!cleanHost) return;

    setQuickLoading(true);
    setQuickResult(null);

    try {
      const res = await sslApi.checkSsl(cleanHost, port || 443);
      setQuickResult(res.data);
      toast.success(`Handshake verified for ${cleanHost}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Inspection failed');
    } finally {
      setQuickLoading(false);
    }
  };

  const total = stats?.totalDomains ?? 0;
  const valid = stats?.validDomains ?? 0;
  const healthPercent = total > 0 ? Math.round((valid / total) * 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{greeting}, {user?.fullName?.split(' ')[0] || 'Administrator'}</span>
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mt-1">
            Real-time SSL certificate health monitoring & automated expiry defense
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/checker"
            className="btn-secondary text-sm font-semibold"
          >
            Deep Inspector
          </Link>
          <Link
            to="/domains"
            className="btn-primary text-sm font-semibold shadow-md shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Monitored Domain
          </Link>
        </div>
      </div>

      {/* Fleet Health Meter Strip */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Fleet Security Posture</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                {healthPercent}% Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {valid} of {total} domains running valid, unexpired TLS certificates
            </p>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Overall Fleet Health</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{healthPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Interactive Audit Bar */}
      <div className="glass-panel rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-500" />
              <span>Instant TLS Handshake Audit</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Test any domain's cryptographic health on port 443 with a direct TCP socket probe
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickAudit} className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={quickHost}
              onChange={(e) => setQuickHost(e.target.value)}
              placeholder="e.g. cloudflare.com, github.com, or your production API"
              className="input-field input-with-icon-left text-sm h-11 rounded-xl text-slate-900 dark:text-white font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={quickLoading || !quickHost.trim()}
            className="btn-primary h-11 px-6 text-xs font-bold whitespace-nowrap shadow-md shadow-blue-600/20 cursor-pointer"
          >
            {quickLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Probing Socket...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Audit Now</span>
              </>
            )}
          </button>
        </form>

        {/* Inline Quick Result Banner */}
        <AnimatePresence>
          {quickResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={cn(
                    "w-12 h-12 rounded-xl font-black text-xl flex items-center justify-center border shrink-0",
                    (quickResult.grade === 'A+' || quickResult.grade === 'A') && "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
                    quickResult.grade === 'B' && "bg-blue-500/15 text-blue-600 border-blue-500/30",
                    quickResult.grade === 'C' && "bg-amber-500/15 text-amber-600 border-amber-500/30",
                    (quickResult.grade === 'D' || quickResult.grade === 'F') && "bg-rose-500/15 text-rose-600 border-rose-500/30"
                  )}>
                    {quickResult.grade}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{quickHost}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600">
                        {quickResult.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Issued by {quickResult.issuerOrg || quickResult.issuer} · Expires in <strong>{quickResult.daysRemaining} days</strong> ({formatDate(quickResult.validUntil)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    to={`/checker?domain=${encodeURIComponent(quickHost)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600"
                  >
                    <span>Full Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/domains"
                    className="btn-primary text-xs font-bold px-3 py-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Track Domain</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Domains"
          value={statsLoading ? '...' : (stats?.totalDomains ?? 0)}
          icon={<Globe className="w-5 h-5" />}
          color="blue"
          subtitle="Actively monitored"
        />
        <StatCard
          title="Valid"
          value={statsLoading ? '...' : (stats?.validDomains ?? 0)}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="green"
          subtitle="TLS healthy"
        />
        <StatCard
          title="Expiring Soon"
          value={statsLoading ? '...' : (stats?.expiringSoonDomains ?? 0)}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="amber"
          subtitle="Within 30 days"
        />
        <StatCard
          title="Expired"
          value={statsLoading ? '...' : (stats?.expiredDomains ?? 0)}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
          subtitle="Renewal required"
        />
        <StatCard
          title="Invalid"
          value={statsLoading ? '...' : (stats?.invalidDomains ?? 0)}
          icon={<Shield className="w-5 h-5" />}
          color="slate"
          subtitle="Hostname mismatch"
        />
        <StatCard
          title="Unreachable"
          value={statsLoading ? '...' : (stats?.unreachableDomains ?? 0)}
          icon={<Activity className="w-5 h-5" />}
          color="purple"
          subtitle="Port 443 closed"
        />
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiry Bar Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Expiry Timeline</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Days remaining before SSL renewal deadline</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          {statsLoading ? (
            <div className="h-[220px] flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ExpiryBarChart data={stats?.expiryTimeline || []} />
          )}
        </div>

        {/* Grade Distribution Pie */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security Grade</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Cryptographic posture breakdown</p>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          {statsLoading ? (
            <div className="h-[200px] flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <GradePieChart data={stats?.gradeDistribution || {}} />
          )}
        </div>
      </div>

      {/* Activity Stream */}
      <div className="glass-panel rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent SSL Audit Stream</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Automated background socket checks and user evaluations</p>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <ActivityFeed items={activityData || []} loading={activityLoading} />
      </div>
    </motion.div>
  );
}
