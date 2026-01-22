import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  sources?: any[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sources }) => {
  const isModel = message.role === 'model';
  
  return (
    <div className={`flex w-full mb-10 ${isModel ? 'justify-start' : 'justify-end animate-in fade-in slide-in-from-bottom-2'}`}>
      <div className={`max-w-[92%] sm:max-w-[85%] rounded-3xl overflow-hidden transition-all duration-500 ${
        isModel 
          ? 'bg-zinc-900/40 border border-white/5 shadow-2xl backdrop-blur-2xl' 
          : 'instagram-gradient text-white shadow-[0_15px_45px_rgba(253,89,73,0.25)]'
      }`}>
        <div className={`px-8 py-7 ${isModel ? 'text-zinc-200' : 'text-white'}`}>
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${isModel ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-white shadow-[0_0_10px_#fff]'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                {isModel ? 'Strategic Intelligence' : 'Command Center'}
              </span>
            </div>
            <span className="text-[10px] opacity-30 font-mono tracking-tighter">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          
          <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-normal selection:bg-rose-500/30">
            {message.text || (isModel && !message.text ? 'Processando dados do algoritmo...' : '')}
          </div>

          {isModel && sources && sources.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.25em]">Referências de Mercado</span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sources.map((source, i) => (
                  source.web && (
                    <a 
                      key={i} 
                      href={source.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                           <svg className="w-4 h-4 text-zinc-500 group-hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                           </svg>
                        </div>
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 truncate font-medium">
                          {source.web.title || 'Tendência Viral'}
                        </span>
                      </div>
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;