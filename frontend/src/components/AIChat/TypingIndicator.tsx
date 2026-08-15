import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 my-3 justify-start items-center">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20">
        <Bot className="w-4 h-4" />
      </div>
      <div className="assistant-bubble px-4 py-3 flex items-center gap-2 text-slate-400 text-xs shadow-md">
        <span className="font-medium text-slate-300">AI is thinking</span>
        <div className="flex gap-1 items-center ml-1">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full dot-1" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full dot-2" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full dot-3" />
        </div>
      </div>
    </div>
  );
};
