'use client';

import { useState } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  
  const isUser = role === 'user';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`flex items-end mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI 아바타 (왼쪽에만 표시) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-2 mb-1 bg-gray-300 overflow-hidden">
          <span className="text-gray-800 text-sm font-medium">AI</span>
        </div>
      )}
      
      {/* 메시지 내용 */}
      <div className="flex flex-col relative group">
        <div 
          className={`${
            isUser 
              ? 'bg-blue-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
              : 'bg-gray-200 text-gray-800 rounded-tl-xl rounded-tr-xl rounded-br-xl'
          } px-4 py-2 max-w-xs md:max-w-md text-[15px] shadow-sm relative`}
        >
          <div className="whitespace-pre-wrap break-words">{content}</div>
          
          {/* 복사 버튼 (호버 시 표시) */}
          <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={copyToClipboard}
              className="p-1.5 text-gray-400 hover:text-gray-200 rounded"
              aria-label="Copy message"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.5 3A1.501 1.501 0 0 0 9 4.5h6A1.5 1.5 0 0 0 13.5 3h-3Zm-2.693.178A3 3 0 0 1 10.5 1.5h3a3 3 0 0 1 2.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {timestamp && (
          <div className={`text-[10px] ${isUser ? 'text-right' : 'text-left'} mt-1 text-gray-400`}>
            {timestamp}
          </div>
        )}
      </div>
      
      {/* 유저 아바타 (오른쪽에만 표시) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ml-2 mb-1 bg-blue-600 overflow-hidden">
          <span className="text-white text-sm font-medium">나</span>
        </div>
      )}
    </div>
  );
} 