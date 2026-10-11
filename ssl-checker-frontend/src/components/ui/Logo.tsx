import React from 'react';
import { cn } from '../../utils/helpers';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

export function Logo({ size = 'md', showText = true, className, animated = false }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* High-Tech Shield Emblem */}
      <div className={cn("relative flex-shrink-0 flex items-center justify-center", sizeMap[size])}>
        {/* Soft Background Neon Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 opacity-50 blur-md group-hover:opacity-90 group-hover:blur-lg transition-all duration-300" />
        
        {/* Vector Emblem */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "relative w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105",
            animated && "animate-float"
          )}
        >
          <defs>
            <linearGradient id="shieldGrad" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="corePadlock" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#c7d2fe" />
            </linearGradient>
          </defs>

          {/* Hexagonal Outer Cryptographic Shield */}
          <path
            d="M50 8 L85 27 L85 65 L50 92 L15 65 L15 27 Z"
            fill="url(#shieldGrad)"
            stroke="url(#borderGrad)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Darkened Cryptographic Well */}
          <path
            d="M50 18 L76 33 L76 59 L50 80 L24 59 L24 33 Z"
            fill="#0b0f19"
            fillOpacity="0.65"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />

          {/* Central Security Lock */}
          <path
            d="M50 32 C43.5 32 38 37.5 38 44 L38 50 C35.5 50 34 52 34 55 L34 68 C34 71 36 73 39 73 L61 73 C64 73 66 71 66 68 L66 55 C66 52 64.5 50 62 50 L62 44 C62 37.5 56.5 32 50 32 Z M50 37 C53.8 37 57 40.2 57 44 L57 50 L43 50 L43 44 C43 40.2 46.2 37 50 37 Z"
            fill="url(#corePadlock)"
          />

          {/* Digital Keyhole Accent */}
          <circle cx="50" cy="59" r="3" fill="#1e3a8a" />
          <path d="M48.5 61 L51.5 61 L52.5 67 L47.5 67 Z" fill="#1e3a8a" />

          {/* Top Orbit Node */}
          <circle cx="50" cy="18" r="2.5" fill="#a5f3fc" />
          <circle cx="76" cy="59" r="2" fill="#818cf8" />
          <circle cx="24" cy="59" r="2" fill="#38bdf8" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-tight text-slate-900 dark:text-white text-lg sm:text-xl leading-none">
              SSL<span className="text-gradient-primary">Guard</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              PRO
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
            Enterprise TLS Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
