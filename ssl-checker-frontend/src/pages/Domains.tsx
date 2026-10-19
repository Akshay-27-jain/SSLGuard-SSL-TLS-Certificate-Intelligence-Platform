import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Globe, Plus, RefreshCw, Trash2, CheckCircle2,
  AlertTriangle, XCircle, Clock, Search, Shield, X,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { domainApi } from '../api/api';
import { Domain, DomainRequest } from '../types';
import {
  cn, formatRelativeTime, formatDate, getStatusBg,
  getStatusColor, getStatusLabel, getDaysLabel, sanitizeDomainInput
} from '../utils/helpers';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface AddDomainModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: DomainRequest) => void;
  loading: boolean;
}

function AddDomainModal({ open, onClose, onAdd, loading }: AddDomainModalProps) {
  const [form, setForm] = useState<DomainRequest>({
    hostname: '',
    port: 443,
    notes: '',
    alertDaysBefore: 30,
    emailAlertsEnabled: true,
  });

  if (!open) return null;

  const handleHostnameBlur = () => {
    if (form.hostname) {
      const { hostname: cleanHost, port: detectedPort } = sanitizeDomainInput(form.hostname);
      setForm(f => ({
        ...f,
        hostname: cleanHost,
        port: detectedPort !== 443 && f.port === 443 ? detectedPort : f.port
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { hostname: cleanHost, port: detectedPort } = sanitizeDomainInput(form.hostname);
    if (!cleanHost) {
      toast.error('Please enter a valid domain or hostname');
      return;
    }
    onAdd({
      ...form,
      hostname: cleanHost,
      port: form.port || detectedPort || 443,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Add Monitored Domain</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4.5 mt-5">
          <div>
            <label htmlFor="domain-hostname" className="label cursor-pointer">Hostname / FQDN *</label>
            <input
              id="domain-hostname"
              type="text"
              required
              value={form.hostname}
              onChange={e => setForm(f => ({ ...f, hostname: e.target.value }))}
              onBlur={handleHostnameBlur}
              placeholder="e.g. portfolio-project-4863.vercel.app"
              className="input-field font-medium text-slate-900 dark:text-white"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Protocols (https://) and trailing slashes are automatically trimmed.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="domain-port" className="label cursor-pointer">TLS Port</label>
              <input
                id="domain-port"
                type="number"
                value={form.port}
                onChange={e => setForm(f => ({ ...f, port: parseInt(e.target.value) || 443 }))}
                className="input-field font-medium text-slate-900 dark:text-white"
                min="1" max="65535"
              />
            </div>
            <div>
              <label htmlFor="domain-alert-days" className="label cursor-pointer">Warning Threshold (days)</label>
              <input
                id="domain-alert-days"
                type="number"
                value={form.alertDaysBefore}
                onChange={e => setForm(f => ({ ...f, alertDaysBefore: parseInt(e.target.value) || 30 }))}
                className="input-field font-medium text-slate-900 dark:text-white"
                min="1" max="365"
              />
            </div>
          </div>

          <div>
            <label htmlFor="domain-notes" className="label cursor-pointer">Notes & Purpose (optional)</label>
            <textarea
              id="domain-notes"
              value={form.notes || ''}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Production API Gateway, renewal handled via Let's Encrypt"
              className="input-field resize-none h-20 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <input
              type="checkbox"
              id="emailAlerts"
              checked={form.emailAlertsEnabled}
              onChange={e => setForm(f => ({ ...f, emailAlertsEnabled: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="emailAlerts" className="text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
              Send automatic email alerts before expiration threshold
            </label>
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading || !form.hostname.trim()} className="btn-primary flex-1 shadow-md shadow-blue-500/25 cursor-pointer">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Start Monitoring</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DomainStatusBadge({ status }: { status: string }) {
  const icons: Record<string, React.ReactNode> = {
    'VALID': <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    'EXPIRING_SOON': <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
    'EXPIRED': <XCircle className="w-3.5 h-3.5 text-rose-500" />,
    'INVALID': <XCircle className="w-3.5 h-3.5 text-slate-400" />,
    'PENDING': <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />,
    'UNREACHABLE': <XCircle className="w-3.5 h-3.5 text-purple-500" />,
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border",
      getStatusBg(status)
    )}>
      {icons[status] || null}
      <span className={getStatusColor(status)}>{getStatusLabel(status)}</span>
    </span>
  );
}

export default function Domains() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'ISSUES'>('ALL');
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const queryClient = useQueryClient();

  const { data: domains = [], isLoading } = useQuery<Domain[]>({
    queryKey: ['domains'],
    queryFn: async () => {
      const res = await domainApi.getAll();
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: DomainRequest) => domainApi.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setModalOpen(false);
      toast.success('Domain added and initial SSL handshake verified!');
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.response?.status === 401 || err.response?.status === 403
          ? 'Your session has expired. Please sign in again.'
          : err.message) ||
        'Failed to add domain';
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => domainApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      if (selectedDomain?.id) setSelectedDomain(null);
      toast.success('Domain removed from monitor');
    },
    onError: () => toast.error('Failed to delete domain'),
  });

  const handleCheckNow = async (id: string) => {
    setCheckingId(id);
    try {
      await domainApi.checkNow(id);
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('SSL verification updated');
    } catch {
      toast.error('Check failed');
    } finally {
      setCheckingId(null);
    }
  };

  const countValid = domains.filter(d => d.status === 'VALID').length;
  const countExpiring = domains.filter(d => d.status === 'EXPIRING_SOON').length;
  const countExpired = domains.filter(d => d.status === 'EXPIRED').length;
  const countIssues = domains.filter(d => d.status === 'INVALID' || d.status === 'UNREACHABLE').length;

  const filtered = domains.filter(d => {
    const matchesSearch = d.hostname.toLowerCase().includes(search.toLowerCase()) ||
      (d.notes || '').toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'VALID') return d.status === 'VALID';
    if (statusFilter === 'EXPIRING_SOON') return d.status === 'EXPIRING_SOON';
    if (statusFilter === 'EXPIRED') return d.status === 'EXPIRED';
    if (statusFilter === 'ISSUES') return d.status === 'INVALID' || d.status === 'UNREACHABLE';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Globe className="w-6 h-6" />
            </span>
            Monitored Domains
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mt-1">
            Managing <span className="font-bold text-slate-900 dark:text-white">{domains.length}</span> active domain{domains.length !== 1 ? 's' : ''} with automated health monitoring
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary shadow-lg shadow-blue-500/25 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add Domain</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search domains by hostname or notes..."
              className="input-field input-with-icon-left h-[44px] text-slate-900 dark:text-white font-medium"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All', count: domains.length },
              { id: 'VALID', label: 'Healthy', count: countValid },
              { id: 'EXPIRING_SOON', label: 'Expiring', count: countExpiring },
              { id: 'EXPIRED', label: 'Expired', count: countExpired },
              { id: 'ISSUES', label: 'Issues', count: countIssues },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5",
                  statusFilter === tab.id
                    ? "bg-blue-600 text-white shadow-xs shadow-blue-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-md text-[10px]",
                  statusFilter === tab.id
                    ? "bg-white/20 text-white font-black"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Domain Cards List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No matching domains found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            {search || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filter status tab.'
              : 'Add a domain to initiate real-time cryptographic monitoring and alerts.'}
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary mt-5 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add First Domain</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map(domain => (
            <motion.div
              key={domain.id}
              whileHover={{ y: -2 }}
              className="glass-panel rounded-2xl p-5 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 flex-wrap">
                {/* Grade Badge */}
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base flex-shrink-0 shadow-sm border",
                  domain.grade === 'A+' || domain.grade === 'A' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                  domain.grade === 'B' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' :
                  domain.grade === 'C' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                  domain.grade === 'F' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300'
                )}>
                  {domain.grade || '?'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={() => setSelectedDomain(domain)}
                      className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors text-base text-left cursor-pointer"
                    >
                      <span>{domain.hostname}</span>
                      {domain.port !== 443 && <span className="text-slate-400 font-normal text-xs">:{domain.port}</span>}
                    </button>
                    <DomainStatusBadge status={domain.status} />
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {domain.lastChecked ? formatRelativeTime(domain.lastChecked) : 'Pending check'}
                    </span>
                    {domain.issuer && (
                      <span className="truncate max-w-xs">· {domain.issuer}</span>
                    )}
                    {domain.validUntil && (
                      <span>· Expires {formatDate(domain.validUntil)}</span>
                    )}
                  </div>
                </div>

                {/* Days remaining counter */}
                <div className="text-right hidden sm:block flex-shrink-0 min-w-[90px]">
                  <div className={cn(
                    "text-xl font-black",
                    (domain.daysUntilExpiry ?? 0) < 0 ? 'text-rose-600 dark:text-rose-400' :
                    (domain.daysUntilExpiry ?? 0) <= 30 ? 'text-amber-600 dark:text-amber-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  )}>
                    {domain.daysUntilExpiry !== null && domain.daysUntilExpiry !== undefined
                      ? Math.abs(domain.daysUntilExpiry)
                      : '—'}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {domain.daysUntilExpiry !== null ? getDaysLabel(domain.daysUntilExpiry).split(' ').slice(-2).join(' ') : 'days'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedDomain(domain)}
                    className="p-2.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all cursor-pointer border border-transparent hover:border-blue-500/20"
                    title="Inspect certificate details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCheckNow(domain.id)}
                    disabled={checkingId === domain.id}
                    className="p-2.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all disabled:opacity-50 cursor-pointer border border-transparent hover:border-blue-500/20"
                    title="Run instant SSL inspection"
                  >
                    <RefreshCw className={cn("w-4 h-4", checkingId === domain.id && "animate-spin text-blue-600")} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${domain.hostname} from active monitoring?`)) {
                        deleteMutation.mutate(domain.id);
                      }
                    }}
                    className="p-2.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/20"
                    title="Delete domain"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {domain.notes && (
                <div className="mt-2.5 pl-16 text-xs text-slate-500 dark:text-slate-400 font-medium italic">
                  "{domain.notes}"
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Certificate Details Drawer / Modal */}
      <AnimatePresence>
        {selectedDomain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setSelectedDomain(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border",
                    selectedDomain.grade === 'A+' || selectedDomain.grade === 'A' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                    selectedDomain.grade === 'B' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' :
                    selectedDomain.grade === 'C' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  )}>
                    {selectedDomain.grade || '?'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{selectedDomain.hostname}</span>
                      <DomainStatusBadge status={selectedDomain.status} />
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Port {selectedDomain.port} · Added {formatDate(selectedDomain.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDomain(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Expiry Overview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Expiration Schedule</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white mt-0.5 block">
                    {selectedDomain.validUntil ? formatDate(selectedDomain.validUntil) : 'Pending inspection'}
                  </span>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-2xl font-black",
                    (selectedDomain.daysUntilExpiry ?? 0) <= 7 ? 'text-rose-600' :
                    (selectedDomain.daysUntilExpiry ?? 0) <= 30 ? 'text-amber-600' : 'text-emerald-600'
                  )}>
                    {selectedDomain.daysUntilExpiry !== null ? selectedDomain.daysUntilExpiry : '—'}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 block">Days Left</span>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Certificate Issuer</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDomain.issuer || 'Pending'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Last Audited</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedDomain.lastChecked ? formatRelativeTime(selectedDomain.lastChecked) : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Warning Threshold</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDomain.alertDaysBefore} days before expiry</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Email Alerts</span>
                  <span className={cn("font-bold", selectedDomain.emailAlertsEnabled ? "text-emerald-600" : "text-slate-400")}>
                    {selectedDomain.emailAlertsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                {selectedDomain.notes && (
                  <div className="py-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Notes</span>
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {selectedDomain.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-3 pt-3">
                <Link
                  to="/checker"
                  className="btn-secondary flex-1 justify-center text-xs font-bold py-3"
                  onClick={() => setSelectedDomain(null)}
                >
                  <Search className="w-4 h-4 text-blue-500" />
                  <span>Full Live Inspection</span>
                </Link>
                <button
                  onClick={() => {
                    handleCheckNow(selectedDomain.id);
                  }}
                  disabled={checkingId === selectedDomain.id}
                  className="btn-primary flex-1 justify-center text-xs font-bold py-3 cursor-pointer"
                >
                  <RefreshCw className={cn("w-4 h-4", checkingId === selectedDomain.id && "animate-spin")} />
                  <span>Re-verify Now</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AddDomainModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(data) => addMutation.mutate(data)}
        loading={addMutation.isPending}
      />
    </motion.div>
  );
}
