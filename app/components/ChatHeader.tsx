'use client';

import { useState } from 'react';

interface ChatHeaderProps {
  onNewChat: () => void;
  onToggleSidebar?: () => void;
}

export default function ChatHeader({ onNewChat, onToggleSidebar }: ChatHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-[#202123] text-white p-2 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="mr-2 p-2 rounded hover:bg-gray-700"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
        <h1 className="text-base font-medium flex items-center">
          ChatGPT
          <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded">4o</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded hover:bg-gray-700 text-xs">
          공유
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="p-1.5 rounded hover:bg-gray-700"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
              <div className="py-1">
                <button 
                  onClick={() => {
                    onNewChat();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                >
                  새 채팅
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  onClick={() => setShowMenu(false)}
                >
                  모델 설정
                </button>
                <hr className="border-gray-700 my-1" />
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  onClick={() => setShowMenu(false)}
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 