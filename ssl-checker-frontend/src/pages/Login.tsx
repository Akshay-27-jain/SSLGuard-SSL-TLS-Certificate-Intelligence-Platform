import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, CheckCircle2, Sun, Moon, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '../api/api';
import { useAuthStore } from '../store/authStore';
import { Logo } from '../components/ui/Logo';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

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

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Restrained Ambient Blurred Background Lighting */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-400/15 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-400/15 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2.5s' }} />

      {/* Top Bar Navigation */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs cursor-pointer"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
        </button>
      </div>

      {/* Main Authentication Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md space-y-6 relative z-10 pt-12 sm:pt-0"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" animated={true} showText={false} />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign in to <span className="text-gradient-primary">SSL Guard</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xs mx-auto font-medium leading-relaxed">
            Monitor, inspect and protect your SSL certificates in real-time.
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-white dark:bg-slate-900/90 rounded-3xl p-8 shadow-xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden backdrop-blur-md"
        >
          {/* Cyan-to-Blue-to-Indigo Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Work Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 cursor-pointer">
                Work Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 z-10 text-slate-400 pointer-events-none flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="input-field input-with-icon-left text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-sm font-bold text-slate-800 dark:text-slate-100 cursor-pointer">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast('Password recovery link dispatched to administrator email.', { icon: 'ℹ️' })}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 z-10 text-slate-400 pointer-events-none flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field input-with-both-icons text-slate-900 dark:text-white font-medium tracking-wide"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider & Switch to Register */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Compact Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-300 font-bold flex-wrap"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>256-bit TLS Handshake</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Instant Health Checks</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
