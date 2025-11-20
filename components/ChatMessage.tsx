import React from 'react';
import { Message, Sender } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === Sender.Bot;
  const isError = message.isError;

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm mx-2 mt-1
          ${isBot ? 'bg-gradient-to-br from-brand-600 to-brand-800' : 'bg-gray-400'}`}>
          {isBot ? 'TK' : 'U'}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 text-sm md:text-base shadow-md rounded-2xl
            ${isBot 
              ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
              : 'bg-brand-600 text-white rounded-tr-none'
            }
            ${isError ? 'border-red-500 bg-red-50 text-red-800' : ''}
          `}
        >
          {isBot ? (
             <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-brand-600 prose-strong:text-brand-700">
               <ReactMarkdown>{message.text}</ReactMarkdown>
             </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          )}
          
          <span className={`text-[10px] opacity-70 block mt-1 text-right ${isBot ? 'text-gray-400' : 'text-brand-100'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
