import React, { useState } from 'react';
import {
  Search, Shield, CheckCircle2, XCircle, AlertTriangle, Lock,
  Key, Calendar, Globe, List, ChevronDown, ChevronUp,
  Copy, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sslApi } from '../api/api';
import { SslCertificate } from '../types';
import { cn, formatDate, getStatusColor, getStatusLabel } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function SslChecker() {
  const [hostname, setHostname] = useState('');
  const [port, setPort] = useState('443');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SslCertificate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChain, setShowChain] = useState(false);
  const [copiedSan, setCopiedSan] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostname.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await sslApi.checkSsl(hostname.trim(), parseInt(port) || 443);
      setResult(res.data);
      toast.success(`SSL certificate analyzed for ${hostname.trim()}`);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to inspect SSL certificate';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copySan = (san: string) => {
    navigator.clipboard.writeText(san);
    setCopiedSan(san);
    toast.success(`Copied: ${san}`);
    setTimeout(() => setCopiedSan(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALID': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'EXPIRING_SOON': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'EXPIRED': return <XCircle className="w-5 h-5 text-rose-500" />;
      default: return <XCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const examples = ['google.com', 'github.com', 'cloudflare.com', 'amazon.com', 'microsoft.com'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Search className="w-6 h-6" />
            </span>
            SSL Certificate Inspector
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1.5 font-medium">
            Perform live cryptographic TLS handshakes and deep certificate inspection
          </p>
        </div>
      </motion.div>

      {/* Search Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl"
      >
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="check-hostname" className="label cursor-pointer">Domain Name or URL</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  id="check-hostname"
                  type="text"
                  required
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  placeholder="e.g. google.com, github.com, or https://example.com"
                  className="input-field input-with-icon-left text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
            <div className="w-full sm:w-28">
              <label htmlFor="check-port" className="label cursor-pointer">Port</label>
              <input
                id="check-port"
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="input-field text-slate-900 dark:text-white font-medium"
                min="1"
                max="65535"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !hostname.trim()}
                className="btn-primary w-full sm:w-auto h-[46px] px-8 text-base shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{loading ? 'Inspecting...' : 'Analyze'}</span>
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Popular targets:</span>
            {examples.map(example => (
              <button
                key={example}
                type="button"
                onClick={() => { setHostname(example); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer"
              >
                {example}
              </button>
            ))}
          </div>
        </form>
      </motion.div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/40 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-rose-800 dark:text-rose-300 text-sm">Inspection Failed</p>
                <p className="text-sm text-rose-600 dark:text-rose-400 mt-0.5">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Overview Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  {/* Grade Badge */}
                  <div className={cn(
                    "w-20 h-20 rounded-3xl flex flex-col items-center justify-center font-black text-3xl shadow-lg border-2 flex-shrink-0",
                    result.grade === 'A+' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                    result.grade === 'A' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                    result.grade === 'B' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' :
                    result.grade === 'C' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                  )}>
                    <span>{result.grade || '?'}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest mt-0.5 opacity-80">Grade</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className={cn("font-bold text-lg", getStatusColor(result.status))}>
                        {getStatusLabel(result.status)}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {hostname}
                    </h2>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                      Issuer: <span className="text-slate-800 dark:text-slate-200 font-semibold">{result.issuerOrg || result.issuer || 'Unknown'}</span>
                    </p>
                  </div>
                </div>

                {/* Expiry Pill */}
                <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-center sm:text-right min-w-[140px]">
                  <div className={cn(
                    "text-3xl font-extrabold tracking-tight",
                    result.daysRemaining < 0 ? 'text-rose-600 dark:text-rose-400' :
                    result.daysRemaining <= 30 ? 'text-amber-600 dark:text-amber-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  )}>
                    {result.daysRemaining < 0 ? Math.abs(result.daysRemaining) : result.daysRemaining}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                    {result.daysRemaining < 0 ? 'Days Expired' : 'Days Remaining'}
                  </div>
                </div>
              </div>

              {/* Security Health Pills */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Certificate Trusted', value: result.isTrusted, icon: Shield },
                  { label: 'Hostname Verified', value: result.hostnameVerified, icon: Globe },
                  { label: 'Wildcard Match', value: result.isWildcard, icon: Key, neutral: true },
                  { label: 'Self-Signed', value: result.isSelfSigned, icon: Lock, invert: true },
                ].map(({ label, value, icon: Icon, neutral, invert }) => (
                  <div key={label} className={cn(
                    "flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-xs font-semibold border",
                    neutral ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20' :
                    (invert ? !value : value)
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                  )}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{label}</span>
                    <span className="ml-auto font-black text-sm">
                      {neutral ? (value ? 'Yes' : 'No') : (invert ? !value : value) ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Validity */}
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4 text-base">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Validity Schedule
                </h3>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Valid From</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formatDate(result.validFrom)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Valid Until</span>
                    <span className={cn("font-semibold", getStatusColor(result.status))}>
                      {formatDate(result.validUntil)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>Timeline Health</span>
                      <span>{result.daysRemaining >= 0 ? `${result.daysRemaining} days left` : 'Expired'}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700",
                          result.daysRemaining < 0 ? 'bg-rose-500' :
                          result.daysRemaining <= 30 ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        )}
                        style={{ width: `${Math.max(5, Math.min(100, (result.daysRemaining / 365) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptography Info */}
              <div className="card p-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4 text-base">
                  <Lock className="w-5 h-5 text-blue-500" />
                  Cryptographic Properties
                </h3>
                <div className="space-y-3.5">
                  {[
                    { label: 'Signature Algorithm', value: result.signatureAlgorithm },
                    { label: 'Key Algorithm', value: result.keyAlgorithm },
                    { label: 'Key Strength', value: result.keySize ? `${result.keySize} bits` : 'N/A' },
                    { label: 'Serial Number', value: result.serialNumber ? result.serialNumber.substring(0, 18) + '...' : 'N/A' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{value || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject Alternative Names (SANs) */}
            {result.sanList && result.sanList.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                    <List className="w-5 h-5 text-blue-500" />
                    Subject Alternative Names ({result.sanList.length})
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Click to copy</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                  {result.sanList.map((san) => (
                    <button
                      key={san}
                      onClick={() => copySan(san)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                    >
                      {copiedSan === san ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{san}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate Chain */}
            {result.chainInfo && result.chainInfo.length > 0 && (
              <div className="card p-6">
                <button
                  onClick={() => setShowChain(!showChain)}
                  className="flex items-center justify-between w-full cursor-pointer"
                >
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Certificate Trust Chain ({result.chainInfo.length} tiers)
                  </h3>
                  {showChain ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {showChain && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-5 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800"
                  >
                    {result.chainInfo.map((cert, i) => (
                      <div key={i} className="flex items-start gap-3.5">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 shadow-sm",
                            cert.type === 'root' ? 'bg-purple-500 text-white' :
                            cert.type === 'intermediate' ? 'bg-blue-500 text-white' :
                            'bg-emerald-500 text-white'
                          )}>
                            {i + 1}
                          </div>
                          {i < result.chainInfo.length - 1 && (
                            <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {cert.subject?.replace(/CN=/g, '').split(',')[0] || 'Unknown'}
                            </span>
                            <span className={cn("text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md",
                              cert.type === 'root' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                              cert.type === 'intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            )}>
                              {cert.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Issued by: {cert.issuer?.replace(/CN=/g, '').split(',')[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
