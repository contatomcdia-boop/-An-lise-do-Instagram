
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { Message } from './types';
import { STRATEGIC_TRACKS } from './constants';
import ChatMessage from './components/ChatMessage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<(Message & { sources?: any[] })[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setMessages([{
        role: 'model',
        text: "SISTEMA ONLINE. 🛰️\nPronto para analisar o algoritmo. Para um briefing de elite, informe seu NICHO e OBJETIVO ATUAL.",
        timestamp: Date.now()
      }]);
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const modelMsgPlaceholder = { role: 'model' as const, text: '', timestamp: Date.now(), sources: [] };
    setMessages(prev => [...prev, modelMsgPlaceholder]);

    try {
      await geminiService.sendMessageStream(text, (updatedText, sources) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIdx = newMessages.length - 1;
          newMessages[lastIdx] = { ...newMessages[lastIdx], text: updatedText, sources };
          return newMessages;
        });
      });
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = "ERRO NA CENTRAL. Verifique a conexão com o servidor de inteligência.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden">
      {/* Sidebar - Professional Command Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0a0a0a] border-r border-white/5 transform transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="w-8 h-8 instagram-gradient rounded-md animate-pulse" />
            </div>
            <div>
              <h1 className="text-white font-black tracking-tighter text-xl">COMMANDER</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Elite Growth OS</p>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Trilhas de Performance</p>
              <div className="space-y-2">
                {STRATEGIC_TRACKS.map(track => (
                  <button
                    key={track.id}
                    onClick={() => {
                        handleSendMessage(track.prompt);
                        setIsSidebarOpen(false);
                    }}
                    className="w-full text-left p-4 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <p className="text-sm font-semibold text-zinc-200 group-hover:text-rose-400 transition-colors">{track.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{track.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-bold text-emerald-500/60 uppercase">System Health</span>
               <span className="text-[10px] text-zinc-500">Stable</span>
            </div>
            <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-lg bg-zinc-900 border border-white/5 text-xs font-bold hover:bg-zinc-800 transition-colors"
            >
                REINICIAR MÓDULO
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 backdrop-blur-md bg-black/40 z-30">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-zinc-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
             </button>
             <div className="hidden sm:block">
                <h2 className="text-xs font-bold text-white tracking-widest uppercase">Instagram Intelligence Unit</h2>
                <p className="text-[10px] text-zinc-500 mt-0.5">Decision-ready insights for viral scaling</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500">LIVE TREND ENGINE</span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-4">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} sources={msg.sources} />
            ))}
          </div>
        </div>

        {/* Pro Input Area */}
        <div className="p-8 backdrop-blur-xl bg-black/60 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }
                }}
                placeholder="Solicite uma análise estratégica ou briefing de tendências..."
                className="w-full bg-[#0f0f0f] border border-white/10 rounded-2xl px-6 py-5 pr-20 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all resize-none min-h-[70px] placeholder:text-zinc-600 shadow-inner"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className={`absolute right-4 bottom-4 p-3 rounded-xl transition-all ${
                  inputText.trim() && !isLoading 
                    ? 'instagram-gradient scale-100 opacity-100 shadow-[0_0_20px_rgba(253,89,73,0.3)]' 
                    : 'bg-zinc-800 scale-95 opacity-50 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
