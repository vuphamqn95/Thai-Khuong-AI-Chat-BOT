import React from 'react';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      
      {/* Background Elements for Industrial Feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-64 bg-brand-800 transform -skew-y-3 origin-top-left translate-y-[-50%] opacity-90"></div>
        <div className="absolute top-10 right-[-10%] w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full md:p-4 flex flex-col">
        <ChatInterface />
      </div>
      
    </div>
  );
};

export default App;
