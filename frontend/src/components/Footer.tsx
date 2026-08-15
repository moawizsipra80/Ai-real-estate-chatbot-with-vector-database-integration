import React from 'react';
import { Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">RealEstate AI Platform</span>
          <span>• AI Chat Assistant Assessment</span>
        </div>
        <div>
          <span>Powered by MERN + TypeScript + LLM API</span>
        </div>
      </div>
    </footer>
  );
};
