import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Globe, AlertTriangle, XCircle, CheckCircle2, Activity, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dashboardApi } from '../api/api';
import { StatCard } from '../components/dashboard/StatCard';
import { ExpiryBarChart, GradePieChart } from '../components/dashboard/Charts';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { DashboardStats, SslCertificate } from '../types';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

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
            Quick Check
          </Link>
          <Link
            to="/domains"
            className="btn-primary text-sm font-semibold shadow-md shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            Add Domain
          </Link>
        </div>
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
