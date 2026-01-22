
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  sources?: any[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sources }) => {
  const isModel = message.role === 'model';
  
  return (
    <div className={`flex w-full mb-8 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl ${
        isModel 
          ? 'bg-zinc-900/50 border border-white/10 shadow-2xl' 
          : 'instagram-gradient text-white shadow-lg'
      }`}>
        <div className={`px-5 py-4 ${isModel ? 'text-zinc-100' : 'text-white'}`}>
          <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              {isModel ? 'Strategic Intelligence' : 'Command'}
            </span>
            <span className="text-[10px] opacity-30">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="text-sm leading-relaxed whitespace-pre-wrap font-light">
            {message.text}
          </div>

          {isModel && sources && sources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Fontes de Tendências:</p>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, i) => (
                  source.web && (
                    <a 
                      key={i} 
                      href={source.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-rose-400 truncate max-w-[200px]"
                    >
                      {source.web.title || 'Ver Fonte'}
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
