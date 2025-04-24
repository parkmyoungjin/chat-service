'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 텍스트 입력에 따라 textarea 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      const newRows = Math.min(5, Math.max(1, input.split('\n').length));
      setRows(newRows);
    }
  }, [input]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      setRows(1);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <div className="p-2 md:p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1c1c1e]">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative flex items-end">
          <div className="flex-1 overflow-hidden rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 flex items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={rows}
              placeholder="메시지 입력..."
              className="flex-1 block w-full resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none text-base leading-6 sm:text-sm sm:leading-5"
              disabled={isLoading}
            />
            
            <button
              type="button"
              className="ml-2 mb-0.5 flex-shrink-0 text-gray-400 dark:text-gray-500"
              onClick={() => {/* 미구현 기능: 첨부 */}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
              </svg>
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || input.trim() === ''}
            className={`ml-2 p-2.5 rounded-full flex items-center justify-center ${
              isLoading || input.trim() === '' 
                ? 'bg-blue-300 text-blue-100 dark:bg-blue-700 dark:text-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 