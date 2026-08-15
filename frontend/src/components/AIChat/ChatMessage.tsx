import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types/ai';
import { PropertyCard } from '../PropertyCard';
import { Bot, User, Sparkles, Building2, HelpCircle, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const getIntentBadge = () => {
    if (!message.intent) return null;
    
    let label = '';
    let icon = <Sparkles className="w-3 h-3 text-cyan-400" />;
    
    switch (message.intent) {
      case 'PROPERTY_SEARCH':
        label = 'Property Search';
        icon = <Building2 className="w-3 h-3 text-cyan-400" />;
        break;
      case 'PROPERTY_DETAILS':
        label = 'Property Details';
        icon = <Building2 className="w-3 h-3 text-indigo-400" />;
        break;
      case 'MARKET_INSIGHT':
        label = 'Market Insight';
        icon = <TrendingUp className="w-3 h-3 text-emerald-400" />;
        break;
      case 'REAL_ESTATE_QUESTION':
        label = 'Real Estate Advisor';
        icon = <HelpCircle className="w-3 h-3 text-amber-400" />;
        break;
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-white/10 mb-2">
        {icon}
        {label}
      </span>
    );
  };

  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar for Assistant */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Content Container */}
      <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Assistant Header Badge */}
        {!isUser && getIntentBadge()}

        {/* Message Bubble */}
        <div className={`px-4 py-3 shadow-md ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
          <div className="markdown-content text-sm text-slate-100 leading-relaxed">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-[10px] text-slate-500 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </div>

        {/* Inline Property Cards Grid */}
        {!isUser && message.properties && message.properties.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Suggested Listings ({message.properties.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {message.properties.map((property) => (
                <PropertyCard key={property._id || property.title} property={property} compact />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Avatar for User */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 shrink-0 shadow-md">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
