
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Zap, Loader2 } from 'lucide-react';
import { askGemini } from '../services/aiService';

interface AIAssistantProps {
  onAiSearch: (query: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onAiSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const response = await askGemini(userMsg);
    setIsTyping(false);
    
    const searchMatch = response?.match(/\[SEARCH:\s*"(.*?)"\]/);
    const cleanText = response?.replace(/\[SEARCH:.*?\]/g, '').trim() || '';

    setMessages(prev => [...prev, { role: 'ai', text: cleanText }]);

    if (searchMatch && searchMatch[1]) {
      setTimeout(() => onAiSearch(searchMatch[1]), 800);
    }
  };

  return (
    <div className="fixed bottom-28 right-6 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-110 transition-all border border-emerald-400"
        >
          <Sparkles className="text-white animate-pulse" size={24} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
        </button>
      ) : (
        <div className="w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-600/20 p-4 border-b border-emerald-500/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="text-emerald-400" size={20} />
              <h3 className="font-bold text-emerald-400 tracking-wider text-sm">ORBIT AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <Zap size={32} className="mx-auto mb-2 text-emerald-500" />
                <p className="text-xs font-mono">Dime qué quieres escuchar...</p>
                <p className="text-[10px] mt-1 italic">"Radios de salsa en Colombia" o "Jazz en Nueva York"</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none shadow-lg'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-xl rounded-bl-none border border-slate-700">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-emerald-500/20 bg-slate-900 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Preguntar..."
              className="flex-1 bg-slate-950 text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 outline-none text-sm font-rajdhani"
            />
            <button type="submit" className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors text-white">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
