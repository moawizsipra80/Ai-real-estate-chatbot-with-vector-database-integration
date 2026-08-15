import React, { useState } from 'react';
import { AIChatPage } from './AIChatPage';
import { Bot, Sparkles, TrendingUp, Calculator, Building2, Search } from 'lucide-react';

export const AIHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'estimator' | 'market'>('chat');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* AI Hub Header */}
      <div className="glass-panel p-6 rounded-3xl mb-8 border border-white/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Estate AI Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Intelligent Real Estate <span className="gradient-text">Suite</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Search properties, receive market intelligence, analyze price estimates, and converse with your dedicated AI Property Assistant.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'gradient-btn shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Chat Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'market'
                  ? 'gradient-btn shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Market Insights</span>
            </button>
            <button
              onClick={() => setActiveTab('estimator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'estimator'
                  ? 'gradient-btn shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Price Estimator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'chat' && <AIChatPage />}

      {activeTab === 'market' && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-4">
          <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Downtown Market Intelligence</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Our AI continuously aggregates regional sales records, rent yields, and economic indicators. Average appreciation in Downtown is currently +4.2% YoY with high rental demand.
          </p>
          <button 
            onClick={() => setActiveTab('chat')}
            className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            Ask AI Assistant About Trends
          </button>
        </div>
      )}

      {activeTab === 'estimator' && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-4">
          <Calculator className="w-12 h-12 text-cyan-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">AI Property Price Valuation</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Estimate valuation based on square footage, location coordinates, bedroom count, and historic sale comps.
          </p>
          <button 
            onClick={() => setActiveTab('chat')}
            className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            Ask AI to Value a Listing
          </button>
        </div>
      )}
    </div>
  );
};
