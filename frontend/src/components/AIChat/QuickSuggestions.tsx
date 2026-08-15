import React from 'react';
import { Sparkles, Building2, TrendingUp, HelpCircle } from 'lucide-react';

interface QuickSuggestionsProps {
  onSelectSuggestion: (text: string) => void;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ onSelectSuggestion }) => {
  const suggestions = [
    {
      text: 'Find 3-bedroom apartments in Downtown under $500,000',
      icon: <Building2 className="w-3.5 h-3.5 text-cyan-400" />
    },
    {
      text: 'What are the market trends in Downtown?',
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      text: 'Tell me about the first property listing',
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
    },
    {
      text: 'What should I consider before buying a property?',
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
    }
  ];

  return (
    <div className="my-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1 px-1">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Quick Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSuggestion(item.text)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/40 text-xs transition-all duration-200 text-left hover:scale-[1.02] active:scale-[0.98]"
          >
            {item.icon}
            <span>{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
