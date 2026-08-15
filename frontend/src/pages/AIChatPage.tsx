import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, AIIntent } from '../types/ai';
import { ChatMessage } from '../components/AIChat/ChatMessage';
import { ChatInput } from '../components/AIChat/ChatInput';
import { TypingIndicator } from '../components/AIChat/TypingIndicator';
import { QuickSuggestions } from '../components/AIChat/QuickSuggestions';
import { ChatHistorySidebar, ChatSession } from '../components/AIChat/ChatHistorySidebar';
import { sendAIChatMessage, streamAIChatMessage } from '../services/aiService';
import { Bot, Sparkles, RefreshCw, Radio, Plus } from 'lucide-react';

const SESSIONS_STORAGE_KEY = 'realestate_chat_sessions_v2';
const getMsgKey = (id: string) => `realestate_chat_messages_${id}`;
const getCtxKey = (id: string) => `realestate_chat_context_${id}`;

export const AIChatPage: React.FC = () => {
  // 1. Initial State Initialization from LocalStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    const initialId = `session-${Date.now()}`;
    return [
      {
        id: initialId,
        title: 'New Property Search',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messageCount: 1
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || `session-${Date.now()}`);

  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    try {
      const savedMsgs = localStorage.getItem(getMsgKey(activeSessionId));
      if (savedMsgs) {
        const parsed = JSON.parse(savedMsgs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `Hello! 👋 I'm your **Real Estate Property Expert** powered by **Groq Llama-3.3-70B** and **Vector Embedding Search**.\n\nI can help you search listings, analyze market trends, compare properties, or answer buying questions.\n\nHow can I assist your property search today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [context, setContext] = useState<Record<string, any>>(() => {
    try {
      const savedCtx = localStorage.getItem(getCtxKey(activeSessionId));
      if (savedCtx) return JSON.parse(savedCtx);
    } catch (e) {}
    return {};
  });

  const [isLoading, setIsLoading] = useState(false);
  const [useStreaming, setUseStreaming] = useState(true);
  const [lastIntent, setLastIntent] = useState<AIIntent | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 2. Persist Sessions List to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  // 3. Persist Messages & Context of Active Session
  useEffect(() => {
    try {
      localStorage.setItem(getMsgKey(activeSessionId), JSON.stringify(messages));
      localStorage.setItem(getCtxKey(activeSessionId), JSON.stringify(context));
    } catch (e) {}
  }, [messages, context, activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 4. Session Switching
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    try {
      const savedMsgs = localStorage.getItem(getMsgKey(id));
      if (savedMsgs) {
        setMessages(JSON.parse(savedMsgs));
      } else {
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            role: 'assistant',
            content: `Welcome back to this property conversation! How can I help?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

      const savedCtx = localStorage.getItem(getCtxKey(id));
      if (savedCtx) {
        setContext(JSON.parse(savedCtx));
      } else {
        setContext({});
      }
    } catch (e) {}
  };

  // 5. Start New Conversation Thread
  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSess: ChatSession = {
      id: newId,
      title: 'New Property Search',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messageCount: 1
    };

    const initialMsgs: ChatMessageType[] = [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `New conversation started! 👋 What properties or real estate questions can I help you with?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newId);
    setMessages(initialMsgs);
    setContext({});
    setLastIntent(undefined);

    try {
      localStorage.setItem(getMsgKey(newId), JSON.stringify(initialMsgs));
      localStorage.setItem(getCtxKey(newId), JSON.stringify({}));
    } catch (e) {}
  };

  // 6. Delete Individual Session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(getMsgKey(id));
      localStorage.removeItem(getCtxKey(id));
    } catch (err) {}

    const updated = sessions.filter((s) => s.id !== id);
    if (updated.length === 0) {
      handleNewSession();
    } else {
      setSessions(updated);
      if (id === activeSessionId) {
        handleSelectSession(updated[0].id);
      }
    }
  };

  // 7. Clear All Conversations
  const handleClearHistory = () => {
    sessions.forEach((s) => {
      try {
        localStorage.removeItem(getMsgKey(s.id));
        localStorage.removeItem(getCtxKey(s.id));
      } catch (err) {}
    });
    localStorage.removeItem(SESSIONS_STORAGE_KEY);

    const newId = `session-${Date.now()}`;
    const initialSess: ChatSession = {
      id: newId,
      title: 'New Property Consultation',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messageCount: 1
    };

    setSessions([initialSess]);
    setActiveSessionId(newId);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `All conversation history cleared. How can I assist your property search?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setContext({});
    setLastIntent(undefined);
  };

  // 8. Auto-title session after first query
  const autoTitleSession = (firstUserText: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId && (s.title === 'New Property Search' || s.title === 'New Property Consultation')) {
          const trimmed = firstUserText.length > 28 ? firstUserText.substring(0, 28) + '...' : firstUserText;
          return { ...s, title: trimmed };
        }
        return s;
      })
    );
  };

  // 9. Send Message Action
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    autoTitleSession(text);

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: userTime
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const historyPayload = messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content
    }));

    if (useStreaming) {
      const assistantId = `assistant-${Date.now()}`;
      let streamText = '';

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true
        }
      ]);

      await streamAIChatMessage(
        {
          message: text,
          history: historyPayload,
          context
        },
        (chunk) => {
          streamText += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: streamText } : msg
            )
          );
        },
        (meta) => {
          setIsLoading(false);
          setLastIntent(meta.intent as AIIntent);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? {
                    ...msg,
                    intent: meta.intent as AIIntent,
                    properties: meta.properties,
                    isStreaming: false
                  }
                : msg
            )
          );
          if (meta.context) setContext(meta.context);
        },
        (err) => {
          setIsLoading(false);
          console.warn('Streaming fallback:', err);
        }
      );
    } else {
      const response = await sendAIChatMessage({
        message: text,
        history: historyPayload,
        context
      });

      setIsLoading(false);
      setLastIntent(response.intent);

      const assistantMsg: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        properties: response.properties
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (response.context) setContext(response.context);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="glass-panel p-4 rounded-2xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>AI Property Expert</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Groq Llama-3.3-70B
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Natural language search • Vector Embedding similarity ranking • Saved conversation history
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={handleNewSession}
            className="gradient-btn px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>New Conversation</span>
          </button>

          <button
            onClick={() => setUseStreaming(!useStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              useStreaming 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Streaming Mode"
          >
            <Radio className={`w-3.5 h-3.5 ${useStreaming ? 'text-cyan-400 animate-pulse' : ''}`} />
            <span>Streaming {useStreaming ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Flex Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Left Column: Messages & Input */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="glass-panel flex-1 rounded-2xl p-4 sm:p-6 mb-4 overflow-y-auto max-h-[580px] min-h-[420px] flex flex-col justify-between border border-white/10 shadow-2xl">
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isLoading && !messages[messages.length - 1]?.isStreaming && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div>
            <QuickSuggestions onSelectSuggestion={handleSendMessage} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>

        {/* Right Column: Persistent History Sidebar */}
        <ChatHistorySidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          onClearHistory={handleClearHistory}
          context={context}
          lastIntent={lastIntent}
        />
      </div>
    </div>
  );
};
