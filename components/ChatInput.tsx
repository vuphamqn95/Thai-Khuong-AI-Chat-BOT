import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 pb-6">
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2 max-w-4xl mx-auto">
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi của bạn về máy bơm..."
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 border-0 rounded-2xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none max-h-32 disabled:opacity-60"
            style={{ minHeight: '48px' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500
            ${!input.trim() || isLoading 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </form>
      <div className="text-center mt-2">
         <p className="text-xs text-gray-400 flex flex-wrap justify-center gap-1">
            AI có thể đưa ra thông tin chưa chính xác. 
            <span className="hidden sm:inline">Cần hỗ trợ gấp liên hệ:</span>
            <a href="tel:0941400488" className="text-brand-600 hover:underline font-medium flex items-center">
              Hotline 0941.400.488
            </a>
         </p>
      </div>
    </div>
  );
};