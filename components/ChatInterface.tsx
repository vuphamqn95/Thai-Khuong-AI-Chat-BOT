import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChatSession } from '../services/geminiService';
import { Message, Sender } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { Chat, GenerateContentResponse } from "@google/genai";

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      text: "Dạ em chào Anh/Chị! Em là chuyên viên hỗ trợ kỹ thuật của Thái Khương Pump. Em có thể hỗ trợ thông số chi tiết, tư vấn chọn bơm (Lưu lượng, Cột áp) cho các dòng bơm màng, bơm ly tâm, bơm bánh răng... Anh/Chị đang quan tâm dòng nào ạ?",
      sender: Sender.Bot,
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Quick Technical Actions
  const quickActions = [
    { label: "🔧 Hướng dẫn Lắp đặt", query: "Hãy hướng dẫn những lưu ý quan trọng khi lắp đặt máy bơm công nghiệp (Bơm ly tâm, Bơm màng)?" },
    { label: "🛠️ Bảo trì định kỳ", query: "Quy trình bảo trì bảo dưỡng máy bơm cần làm những gì để đảm bảo độ bền?" },
    { label: "⚠️ Khắc phục sự cố", query: "Liệt kê các lỗi thường gặp của máy bơm (không lên nước, rung, ồn) và cách khắc phục?" },
  ];

  // Initialize Chat Session
  useEffect(() => {
    if (!isInitializedRef.current) {
      try {
        chatSessionRef.current = createChatSession();
        isInitializedRef.current = true;
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: "Lỗi khởi tạo kết nối. Vui lòng tải lại trang.",
            sender: Sender.Bot,
            timestamp: new Date(),
            isError: true
        }]);
      }
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReset = () => {
    chatSessionRef.current = createChatSession();
    setMessages([{
      id: Date.now().toString(),
      text: "Cuộc trò chuyện đã được đặt lại. Em có thể giúp gì khác cho Anh/Chị ạ?",
      sender: Sender.Bot,
      timestamp: new Date(),
    }]);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chatSessionRef.current) return;

    // 1. Add User Message
    const userMsgId = Date.now().toString();
    const userMessage: Message = {
      id: userMsgId,
      text: text,
      sender: Sender.User,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. Create Placeholder for Bot Message
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        text: "", // Empty initially, will fill with stream
        sender: Sender.Bot,
        timestamp: new Date(),
      }]);

      // 3. Call Gemini API with Streaming
      const result = await chatSessionRef.current.sendMessageStream({ message: text });
      
      let fullText = "";

      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text; // Access property directly
        if (chunkText) {
            fullText += chunkText;
            // Update the last message with accumulated text
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsgIndex = newMessages.findIndex(m => m.id === botMsgId);
                if (lastMsgIndex !== -1) {
                    newMessages[lastMsgIndex] = {
                        ...newMessages[lastMsgIndex],
                        text: fullText
                    };
                }
                return newMessages;
            });
        }
      }
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Xin lỗi, em đang gặp sự cố kết nối. Anh/Chị vui lòng thử lại sau nhé.",
        sender: Sender.Bot,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-white shadow-2xl md:rounded-2xl md:my-8 md:h-[90vh] overflow-hidden border border-gray-200">
      <ChatHeader onReset={handleReset} onShowContact={() => setShowContactModal(true)} />
      
      <main className="flex-grow overflow-y-auto p-4 md:p-6 bg-gray-50 scrollbar-hide space-y-6 relative">
        <div className="text-center py-4">
            <span className="bg-gray-200 text-gray-600 text-xs py-1 px-3 rounded-full uppercase tracking-wider font-semibold">
                Hôm nay
            </span>
        </div>

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isLoading && messages[messages.length - 1]?.sender === Sender.User && (
           <div className="flex justify-start w-full mb-4">
              <div className="flex flex-row max-w-[75%]">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-xs font-bold shadow-sm mx-2 mt-1">
                    TK
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-md border border-gray-100">
                     <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                  </div>
              </div>
           </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Quick Actions Toolbar */}
      <div className="px-4 py-2 bg-white/50 border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide justify-center items-center">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:block mr-2">Hỗ trợ kỹ thuật:</span>
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(action.query)}
            disabled={isLoading}
            className="flex-shrink-0 bg-white border border-brand-200 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-brand-50 hover:border-brand-400 transition-all shadow-sm hover:shadow transform hover:-translate-y-0.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        ))}
      </div>

      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />

      {/* Contact Info Modal */}
      {showContactModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
             if (e.target === e.currentTarget) setShowContactModal(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-brand-600 p-5 text-white flex justify-between items-center shrink-0">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.465-2.127-1.706l.71-2.836-.042.02a.75.75 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                    Thông Tin Liên Hệ
                </h3>
                <button onClick={() => setShowContactModal(false)} className="hover:bg-brand-700 p-1 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-700">
                
                {/* Hotlines */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-3">
                         <div className="bg-red-100 p-2 rounded-full text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                            </svg>
                         </div>
                         <div>
                             <p className="text-xs text-gray-500 font-semibold uppercase">Hotline Kinh Doanh</p>
                             <a href="tel:0941400488" className="text-lg font-bold text-red-600 hover:underline">0941.400.488</a>
                         </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4 pt-2 border-t border-gray-100">
                     {/* General Info */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-start gap-2">
                            <div className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                </svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-semibold text-gray-900">Email</p>
                                <a href="mailto:info@thaikhuongpump.com" className="text-brand-600 hover:underline truncate block">info@thaikhuongpump.com</a>
                            </div>
                        </div>

                         <div className="flex items-start gap-2">
                            <div className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Giờ làm việc</p>
                                <p>T2 - T6: 08:00 - 17:30</p>
                                <p>Thứ 7: 08:00 - 12:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Locations */}
                    <h4 className="text-sm font-bold text-gray-800 uppercase border-b border-gray-100 pb-2 mt-4">Hệ Thống Văn Phòng & Nhà Xưởng</h4>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 text-brand-600 shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-base">Trụ Sở Chính (TP. Hồ Chí Minh)</p>
                                <p className="text-gray-600 mb-1">30D Phan Văn Sửu, Phường 13, Quận Tân Bình, TP. Hồ Chí Minh.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Văn Phòng Hà Nội</p>
                                <p className="text-gray-600 mb-1">22 - 24 VP6 Linh Đàm, Phường Hoàng Liệt, Quận Hoàng Mai, TP. Hà Nội.</p>
                                <p className="text-gray-500 text-xs">Tel: <a href="tel:02422040101" className="hover:text-brand-600">(+84) 242 2040 101</a></p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Văn Phòng Đà Nẵng</p>
                                <p className="text-gray-600 mb-1">01 Tiên Sơn 5, Phường Hoà Cường, Quận Hải Châu, TP. Đà Nẵng.</p>
                                <p className="text-gray-500 text-xs">Tel: <a href="tel:02363538356" className="hover:text-brand-600">(+84) 236 3538 356 / 57</a></p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                                    <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                                    <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Kho - Xưởng Kỹ Thuật</p>
                                <p className="text-gray-600 mb-1">6 Đường Tân Thới Nhất 18, Phường Đông Hưng Thuận, Quận 12, TP. Hồ Chí Minh.</p>
                                <p className="text-gray-500 text-xs">Tel: <a href="tel:02836206333" className="hover:text-brand-600">(+84) 28 3620 6333 / 444</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};