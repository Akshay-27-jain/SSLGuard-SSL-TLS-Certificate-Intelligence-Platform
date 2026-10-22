import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, CheckCircle2, Sun, Moon, Eye, EyeOff, Sparkles, ArrowLeft, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../api/api';
import { useAuthStore } from '../store/authStore';
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
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white mesh-gradient">
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar Navigation */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs cursor-pointer backdrop-blur-md"
          title="Toggle Dark/Light Mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
        </button>
      </div>

      {/* Center Main Card & Brand Lockup (Matches media_1791562116792_35aa6d74.png) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[440px] mx-auto my-auto py-4 flex flex-col items-center"
      >
        {/* Brand Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-5">
          <Shield className="w-8 h-8 text-white fill-white/20 stroke-[2.2]" />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight text-center">
          Sign in to <span className="text-blue-600 dark:text-blue-400">SSL Guard</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center mt-2 max-w-sm">
          Monitor, inspect and protect your SSL certificates in real-time
        </p>

        {/* White / Dark Glass Container */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-[32px] p-8 sm:p-9 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden mt-8 backdrop-blur-xl">
          {/* Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-400" />

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="input-field input-with-icon-left text-slate-900 dark:text-white font-medium text-sm h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Password Field with Forgot password? link */}
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
                  className="input-field input-with-both-icons text-slate-900 dark:text-white font-medium tracking-wide text-sm h-12 rounded-xl"
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
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
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
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer mt-2"
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
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Floating Trust Pills (Matches media_1791562116792_35aa6d74.png) */}
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>256-bit TLS Handshake</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Instant Health Checks</span>
          </div>
        </div>
      </motion.div>

      {/* Subtle Footer */}
      <div className="relative z-10 w-full text-center text-xs text-slate-400 dark:text-slate-500 font-medium py-2">
        SSLGuard Enterprise Security · Automated Socket 443 Handshake
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
