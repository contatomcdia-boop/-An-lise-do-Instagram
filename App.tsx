
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
      setMessages([{
        role: 'model',
        text: "SISTEMA OPERACIONAL 2026 INICIADO. 🛰️\nCalendário: 22 de Janeiro de 2026. \n\nO algoritmo evoluiu e a competição está em nível máximo. Digite seu NICHO para que eu possa cruzar dados de tendências de 2026 e desenhar sua rota de crescimento.",
        timestamp: Date.now()
      }]);
    };
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
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
          newMessages[lastIdx] = { 
            ...newMessages[lastIdx], 
            text: updatedText, 
            sources: sources || newMessages[lastIdx].sources 
          };
          return newMessages;
        });
      });
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = "⚠️ FALHA NO NÚCLEO 2026. Verifique sua conexão com o servidor de inteligência.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      {/* Sidebar Móvel Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Principal */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/5 transform transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 instagram-gradient rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/10">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-black tracking-tighter text-lg leading-none">COMMANDER</h1>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1">Growth Intel 2026</p>
            </div>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-4 ml-2">Protocolos Atuais</p>
              <div className="space-y-2">
                {STRATEGIC_TRACKS.map(track => (
                  <button
                    key={track.id}
                    onClick={() => {
                        handleSendMessage(track.prompt);
                        setIsSidebarOpen(false);
                    }}
                    className="w-full text-left p-4 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden"
                  >
                    <p className="text-xs font-bold text-zinc-300 group-hover:text-rose-400 transition-colors relative z-10">{track.label}</p>
                    <p className="text-[9px] text-zinc-600 mt-1 line-clamp-1 group-hover:text-zinc-400 relative z-10">{track.prompt}</p>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-rose-500/0 group-hover:from-rose-500/5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Relógio: 2026-01-22</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            </div>
            <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl bg-zinc-900 border border-white/5 text-[10px] font-black tracking-widest uppercase hover:bg-rose-500 hover:text-white transition-all duration-300"
            >
                Resetar Módulo
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal de Chat */}
      <main className="flex-1 flex flex-col min-w-0 bg-black">
        <header className="h-20 flex items-center justify-between px-6 sm:px-10 border-b border-white/5 backdrop-blur-xl bg-black/60 z-30">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(true)} 
               className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
             </button>
             <div className="hidden sm:block">
                <h2 className="text-[10px] font-black text-white tracking-[0.3em] uppercase opacity-90">Algorithmic Engine 2026.4</h2>
                <p className="text-[10px] text-zinc-600 font-medium italic">Analisando ondas de Janeiro/2026</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Live Search 2026</span>
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-12 space-y-6">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} sources={msg.sources} />
            ))}
            {isLoading && messages[messages.length-1].role === 'user' && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-10 border-t border-white/5 bg-gradient-to-t from-[#050505] to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl opacity-10 group-focus-within:opacity-30 transition duration-500 blur" />
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }
                }}
                placeholder="Nicho ou objetivo em 2026..."
                className="relative w-full bg-[#0d0d0d] border border-white/10 rounded-2xl px-6 py-5 pr-16 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all resize-none min-h-[72px] placeholder:text-zinc-700 font-medium"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className={`absolute right-4 bottom-4 p-3 rounded-xl transition-all duration-300 ${
                  inputText.trim() && !isLoading 
                    ? 'instagram-gradient scale-100 opacity-100 shadow-lg shadow-rose-500/20 active:scale-90' 
                    : 'bg-zinc-800 scale-95 opacity-50 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <p className="text-center mt-4 text-[9px] text-zinc-700 font-bold uppercase tracking-[0.2em]">
              Real-Time Search: 22 de Janeiro de 2026 | Google Gemini 3
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
