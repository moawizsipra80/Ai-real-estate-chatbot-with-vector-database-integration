import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Bot, Sparkles, Home, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              RealEstate<span className="gradient-text ml-1">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 tracking-wider font-semibold uppercase -mt-1">
              Property Expert
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              isActive('/') 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Properties</span>
          </Link>

          <Link
            to="/ai-hub"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              isActive('/ai-hub') 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">AI Hub</span>
          </Link>

          <Link
            to="/ai-chat"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isActive('/ai-chat') 
                ? 'gradient-btn shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/50' 
                : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-cyan-500/30'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Chat Assistant</span>
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          </Link>
        </nav>
      </div>
    </header>
  );
};
