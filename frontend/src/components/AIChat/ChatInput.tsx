import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      onSendMessage(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-end gap-2 p-2 bg-slate-900/90 glass-panel rounded-2xl border border-white/10 shadow-xl">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about properties, market trends, or real estate advice... (Press Enter to send)"
        rows={1}
        disabled={isLoading}
        className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none resize-none min-h-[44px] max-h-32 rounded-xl"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className={`p-3 rounded-xl gradient-btn flex items-center justify-center shrink-0 transition-all ${
          !input.trim() || isLoading 
            ? 'opacity-40 cursor-not-allowed shadow-none' 
            : 'hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/20'
        }`}
        title="Send Message"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-white" />
        ) : (
          <Send className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
};
