import React from 'react';
import { 
  History, 
  Plus, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Bed, 
  Building, 
  Cpu, 
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';
import { AIIntent } from '../../types/ai';

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messageCount: number;
}

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
  context: Record<string, any>;
  lastIntent?: AIIntent;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearHistory,
  context,
  lastIntent
}) => {
  return (
    <aside className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
      {/* 1. New Conversation Action Button */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-lg">
        <button
          onClick={onNewSession}
          className="w-full gradient-btn py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Start New Conversation</span>
        </button>
      </div>

      {/* 2. Active Search Context & Vector Engine Card */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Search Context</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
            Vector DB
          </span>
        </div>

        {/* Detected Intent */}
        {lastIntent && (
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 text-xs flex justify-between items-center">
            <span className="text-slate-400">Current Intent:</span>
            <span className="font-semibold text-cyan-300">{lastIntent}</span>
          </div>
        )}

        {/* Filter Badges */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Location:</span>
            </div>
            <span className="font-semibold text-white">{context.location || 'Any'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Max Budget:</span>
            </div>
            <span className="font-semibold text-white">
              {context.maxPrice ? `$${context.maxPrice.toLocaleString()}` : 'Any'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Bed className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bedrooms:</span>
            </div>
            <span className="font-semibold text-white">{context.bedrooms || 'Any'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Type:</span>
            </div>
            <span className="font-semibold text-white uppercase">{context.propertyType || 'Any'}</span>
          </div>
        </div>
      </div>

      {/* 3. Saved Chat Threads List */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-lg flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <div className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Saved Conversations</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">{sessions.length} Saved</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => onSelectSession(sess.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer border group ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-1">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div className="truncate flex-1">
                      <div className="font-semibold truncate">{sess.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{sess.timestamp}</div>
                    </div>
                  </div>

                  {/* Delete individual thread */}
                  <button
                    onClick={(e) => onDeleteSession(sess.id, e)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Conversation"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear All Threads Action */}
        <button
          onClick={onClearHistory}
          className="w-full py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-4"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All History</span>
        </button>
      </div>
    </aside>
  );
};
