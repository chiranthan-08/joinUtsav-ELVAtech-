import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';
import { 
  Sparkles, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I am UtsavMitra AI, your celebration planning companion. Ask me anything about Indian wedding rituals, auspicious muhurats, event budgeting, or our QR ticketing system!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'How does QR gate check-in work?',
    'Haldi ceremony essential checklist',
    'Budget breakdown for 350 guests',
    'Wedding timeline & muhurat flow'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const newHistory = [...messages, { role: 'user', content: query }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { 
        prompt: query, 
        history: newHistory.slice(-6) 
      });
      if (res.success && res.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered a brief issue. Please try asking again!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-saffron-500 via-rose-500 to-amber-500 text-white font-bold text-xs shadow-2xl shadow-saffron-500/40 hover:scale-105 active:scale-95 transition-all"
          title="Chat with UtsavMitra AI"
        >
          <span className="text-lg group-hover:rotate-12 transition-transform">🪔</span>
          <span>Ask Utsav AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Floating Chat Modal (when open) */}
      {isOpen && (
        <div className={`bg-slate-900 border border-saffron-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 sm:w-[420px] h-[550px]'
        }`}>
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-950 via-saffron-950/40 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-saffron-500 to-rose-600 flex items-center justify-center text-sm shadow-md">
                🪔
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-serif">
                  UtsavMitra AI
                  <span className="text-[9px] font-sans px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">Celebration &amp; Event Assistant</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-saffron-600 to-rose-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-2xl text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-saffron-400 animate-ping" />
                      <span>Utsav AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions chips */}
              <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(p)}
                    className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-saffron-500/50 hover:text-white transition-colors shrink-0"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask about wedding rituals, fests, budgets..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white disabled:opacity-40 transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

