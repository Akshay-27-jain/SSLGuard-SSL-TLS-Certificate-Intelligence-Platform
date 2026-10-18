import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Search, Bell, ArrowRight,
  Sparkles, Globe, Terminal, RefreshCw, Key,
  Sun, Moon, Server, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../components/ui/Logo';
import { sslApi } from '../api/api';
import { SslCertificate } from '../types';
import { cn, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Landing() {
  const [quickDomain, setQuickDomain] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<SslCertificate | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleQuickScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDomain.trim()) return;

    setLoading(true);
    try {
      const res = await sslApi.checkSsl(quickDomain.trim(), 443);
      setScanResult(res.data);
      toast.success(`Verified SSL handshake for ${quickDomain.trim()}`);
    } catch {
      toast.error('Could not connect to domain. Ensure port 443 is open.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Terminal,
      title: "Real-Time Cryptographic Handshake",
      description: "Direct socket-level TLS connections probe port 443, parse X.509 chains, evaluate cipher suites, and verify key algorithms in under 200ms.",
      color: "from-blue-600 via-indigo-600 to-cyan-500",
      tag: "TLS Engine"
    },
    {
      icon: Bell,
      title: "Automated Expiration Defense",
      description: "Scheduled background workers monitor your domains daily and trigger automated alerts at 30, 15, and 7-day intervals before expiry.",
      color: "from-amber-500 via-orange-500 to-rose-500",
      tag: "Proactive"
    },
    {
      icon: Shield,
      title: "Security Grade Scoring (A+ to F)",
      description: "Dynamic evaluation assessing TLS 1.2 / 1.3 protocol adherence, cipher strengths, trust chains, and hostname verification.",
      color: "from-emerald-500 via-teal-500 to-cyan-500",
      tag: "Audit"
    },
    {
      icon: Key,
      title: "Full Trust Chain Hierarchy",
      description: "Inspect the complete multi-tier certificate path from leaf end-entity to intermediate and trusted Root Certificate Authorities.",
      color: "from-purple-600 via-violet-600 to-indigo-600",
      tag: "PKI Chain"
    },
    {
      icon: Globe,
      title: "Centralized Domain Inventory",
      description: "Organize, tag, and monitor your entire fleet of web applications, APIs, and subdomains with instant manual re-checks.",
      color: "from-cyan-600 via-blue-600 to-indigo-600",
      tag: "Inventory"
    },
    {
      icon: Server,
      title: "Enterprise Architecture & API",
      description: "High-performance Spring Boot 3.2 backend with multi-tenant relational persistence and secure endpoints for seamless CI/CD pipeline hooks.",
      color: "from-slate-700 via-slate-800 to-indigo-900",
      tag: "Architecture"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Add Your Endpoints",
      desc: "Register your production domains or subdomains with a single click. Custom ports (8443, 443) are supported out of the box."
    },
    {
      num: "02",
      title: "Automated TLS Handshakes",
      desc: "Our engine executes direct socket handshakes, extracting the X.509 chain and inspecting cryptographic properties."
    },
    {
      num: "03",
      title: "Zero-Downtime Alerts",
      desc: "Receive timely warnings well before expiration. Never get caught off guard by an unexpected certificate outage."
    }
  ];

  return (
    <div className="min-h-screen mesh-gradient text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2.5s' }} />

      {/* Floating Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size="md" showText={true} />
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Live Scanner</a>
            <a href="#workflow" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-xs"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-flex btn-secondary text-xs font-bold px-4 py-2.5 cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-flex btn-primary text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-500/25 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-5 space-y-4"
            >
              <nav className="flex flex-col space-y-3 font-bold text-sm text-slate-700 dark:text-slate-200">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Live Scanner
                </a>
                <a
                  href="#workflow"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  How It Works
                </a>
              </nav>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary w-full justify-center text-sm py-2.5 font-bold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full justify-center text-sm py-2.5 font-bold shadow-md shadow-blue-500/25"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section - 2-Column Enterprise Layout as per Design Board */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (7 cols): Eyebrow, Headline, Subtitle, Inline Quick Scanner Form, Chips, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-extrabold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Enterprise TLS & SSL Certificate Intelligence</span>
            </motion.div>

            {/* Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]"
            >
              Never Let An Expired SSL{' '}
              <span className="text-gradient-primary">
                Take Down Your Service
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-xl leading-relaxed"
            >
              Automated background TLS handshakes, multi-tier chain validation, proactive 30-day expiration warnings, and real-time security grading.
            </motion.p>

            {/* Inline Live Scanner Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="pt-2 space-y-3"
            >
              <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row gap-2.5 items-stretch max-w-xl">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
                    <Globe className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={quickDomain}
                    onChange={e => setQuickDomain(e.target.value)}
                    placeholder="Enter hostname (e.g. google.com)"
                    className="input-field input-with-icon-left h-[52px] text-base text-slate-900 dark:text-white font-semibold shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !quickDomain.trim()}
                  className="btn-primary h-[52px] px-7 text-base shadow-lg shadow-blue-500/30 cursor-pointer whitespace-nowrap"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Inspecting...' : 'Analyze Handshake'}</span>
                </button>
              </form>

              {/* Suggestion Chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold select-none">Try:</span>
                {['google.com', 'github.com', 'cloudflare.com', 'microsoft.com'].map(target => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setQuickDomain(target)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 border border-slate-200 dark:border-slate-700 font-semibold transition-all cursor-pointer text-xs"
                  >
                    {target}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 pt-3 flex-wrap"
            >
              <Link
                to="/register"
                className="btn-primary py-3.5 px-7 text-sm font-bold shadow-xl shadow-blue-500/25 cursor-pointer"
              >
                <span>Start Free Monitoring</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary py-3.5 px-6 text-sm font-bold cursor-pointer"
              >
                <span>Sign In to Platform</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column (5 cols): Interactive Certificate Live Card */}
          <div className="lg:col-span-5">
            <motion.div
              id="demo"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl"
            >
              {/* Glowing Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Live Audit Preview</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct Port 443 Handshake</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>TLS 1.3 Active</span>
                </div>
              </div>

              {/* Certificate Information Preview */}
              <div className="pt-5 space-y-5">
                {/* Domain & Grade */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center border shadow-sm shrink-0",
                      (!scanResult || scanResult.grade === 'A+' || scanResult.grade === 'A') && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                      scanResult?.grade === 'B' && "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
                      scanResult?.grade === 'C' && "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
                      (scanResult?.grade === 'D' || scanResult?.grade === 'F') && "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                    )}>
                      {scanResult ? scanResult.grade : 'A+'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                          {quickDomain}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                          Valid TLS
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                        Issuer: <span className="font-semibold text-slate-700 dark:text-slate-300">{scanResult?.issuerOrg || scanResult?.issuer || 'Google Trust Services'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {scanResult ? `${scanResult.daysRemaining}d` : '66d'}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Remaining</span>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Valid From</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {scanResult ? formatDate(scanResult.validFrom) : 'Sep 29, 2026'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Expires On</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {scanResult ? formatDate(scanResult.validUntil) : 'Dec 22, 2026'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Signature</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] truncate block">
                      {scanResult ? scanResult.signatureAlgorithm : 'SHA256withECDSA'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Key Strength</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] block">
                      {scanResult ? `${scanResult.keySize} bits` : '256 bits (ECDSA)'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Certificate Lifetime Remaining</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Healthy (&gt;30d)</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 w-3/4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4-Metric Highlights Strip */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Socket Handshakes', value: '100%', sub: 'Direct TCP Socket 443' },
            { label: 'Average Latency', value: '<200ms', sub: 'Real-Time Audit Speed' },
            { label: 'Proactive Alert Window', value: '30 Days', sub: 'Zero-Downtime Defense' },
            { label: 'RFC Compliance', value: 'RFC 5280', sub: 'PKI Trust Chain Validation' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-5 text-center shadow-md hover:shadow-lg transition-all"
            >
              <div className="text-3xl font-black text-gradient-primary tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            Intuitive Workflow
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How SSL Guard Protects You
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-base">
            Continuous background protection that runs automatically so your team never misses an expiry deadline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass-panel rounded-3xl p-8 shadow-xl relative"
            >
              <div className="text-4xl font-black text-gradient-primary opacity-60 mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Comprehensive Suite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything You Need For Certificate Observability
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-base">
            From single endpoint checks to fleet-wide domain monitoring, all in one cohesive dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-panel rounded-3xl p-8 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-tr flex items-center justify-center text-white shadow-md", feature.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Ready To Eliminate Certificate Downtime?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-base max-w-xl mx-auto">
          Start monitoring your domains in under 60 seconds with automated background TLS verification.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="btn-primary py-4 px-10 text-base shadow-xl shadow-blue-500/30 cursor-pointer"
          >
            <span>Launch Free Monitor</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size="sm" showText={true} />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          © 2026 SSL Guard. Production TLS & SSL Certificate Intelligence.
        </p>
        <div className="flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-400">
          <Link to="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-blue-600 transition-colors">Register</Link>
        </div>
      </footer>
    </div>
  );
}
