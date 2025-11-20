import React from 'react';

interface ChatHeaderProps {
  onReset: () => void;
  onShowContact: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onReset, onShowContact }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
          TK
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-gray-900 leading-tight text-sm sm:text-base">Thai Khuong Pump</h1>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-green-600">AI Support Online</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Contact Info Button */}
        <button 
          onClick={onShowContact}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5"
          title="Xem thông tin liên hệ chi tiết"
        >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-600">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.465-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <span className="hidden md:inline">Liên hệ</span>
        </button>

        {/* Hotline Button */}
        <a 
          href="tel:0941400488"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
          title="Gọi Hotline kinh doanh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:animate-pulse">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
          </svg>
          <span className="hidden lg:inline">Hotline</span>
        </a>

        {/* Reset Button */}
        <button 
          onClick={onReset}
          className="text-gray-400 hover:text-brand-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          title="Xóa cuộc trò chuyện"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
    </header>
  );
};