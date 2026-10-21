import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, CheckCircle2, Sun, Moon, Eye, EyeOff, Sparkles, ArrowLeft, ShieldCheck, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../api/api';
import { useAuthStore } from '../store/authStore';
import { Logo } from '../components/ui/Logo';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      toast.error('Your session has expired. Please sign in again.', { id: 'session-expired' });
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      const { token, fullName, role } = res.data;
      login(token, { id: '', email, fullName, role });
      toast.success(`Welcome back, ${fullName}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    try {
      await authApi.forgotPassword({ email: forgotEmail });
      setForgotSuccess(true);
      toast.success('Password reset link sent to your email!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to dispatch reset email. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* LEFT COLUMN: Visual Brand & Live Intelligence Card (Hidden on mobile, 50% on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-14 relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-950 border-r border-slate-200/80 dark:border-slate-800/80">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/15 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="md" showText={true} />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            TLS 1.3 Active
          </div>
        </div>

        {/* Center: Hero Heading + Elevated Certificate Preview Card */}
        <div className="relative z-10 my-auto py-8 space-y-8 max-w-lg">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CERTIFICATE INTELLIGENCE</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Automated Certificate Intelligence & <span className="text-gradient-primary">Zero-Downtime Defense</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm xl:text-base font-medium leading-relaxed mt-3">
              Proactively inspect validity, handshake health, cipher suites, and root certificate expiration across your distributed infrastructure.
            </p>
          </div>

          {/* Elevated Glass Certificate Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-3xl glass-card border border-white/80 dark:border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  api.sslguard.security
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span>GRADE A+</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div>
                <span className="text-slate-400 block font-medium">Issuer CA</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">DigiCert TLS RSA SHA256</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Protocol</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">TLS 1.3 / ChaCha20</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">SANs Protected</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">*.sslguard.security</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Key Strength</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px] block">
                  256 bits (ECDSA)
                </span>
              </div>
            </div>

            {/* Lifetime Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>Certificate Lifetime Remaining</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Healthy (&gt;30d)</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 w-3/4" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Items */}
        <div className="relative z-10 pt-4 border-t border-slate-200/70 dark:border-slate-800/70 grid grid-cols-3 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Direct Socket 443</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Gmail SMTP Alerting</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>RFC 5280 PKI</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 relative bg-white dark:bg-slate-900/60">
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/70 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs cursor-pointer"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
          </button>
        </div>

        {/* Center: Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto my-auto py-8 space-y-6"
        >
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-2">
            <Logo size="lg" animated={true} showText={true} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign in to <span className="text-gradient-primary">SSL Guard</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Welcome back! Please enter your credentials to access your security dashboard.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Work Email Field */}
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 cursor-pointer">
                  Work Email
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 z-10 text-slate-400 pointer-events-none flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="input-field input-with-icon-left text-slate-900 dark:text-white font-medium text-sm h-11"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 cursor-pointer">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotSuccess(false);
                      setForgotModalOpen(true);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 z-10 text-slate-400 pointer-events-none flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field input-with-both-icons text-slate-900 dark:text-white font-medium tracking-wide text-sm h-11"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span>Remember this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary h-12 text-sm font-bold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 cursor-pointer mt-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying credentials...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </form>

            {/* Divider & Switch to Register */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Trust Indicators */}
        <div className="w-full text-center text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center gap-2 pt-4">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Enterprise-grade 256-bit TLS Handshake & Encrypted Session</span>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Recover Password</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Enter the email registered to your SSLGuard account. We'll send a secure one-time password recovery link valid for 60 minutes.
                  </p>
                </div>

                {forgotSuccess ? (
                  <div className="space-y-4 py-2">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">Password Reset Link Dispatched!</p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          We sent a recovery email to <strong>{forgotEmail}</strong>. Click the link in that email to create a new password.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      className="w-full btn-primary h-11 text-sm font-bold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 cursor-pointer">
                        Your Account Email
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 z-10 text-slate-400 pointer-events-none flex items-center justify-center">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="input-field input-with-icon-left text-slate-900 dark:text-white font-medium text-sm h-11"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setForgotModalOpen(false)}
                        className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-1/2 btn-primary h-11 text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
                      >
                        {forgotLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <span>Send Link</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
