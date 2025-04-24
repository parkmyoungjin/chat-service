'use client';

import { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
};

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f5f5] dark:bg-[#1c1c1e]">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-300">
          <div className="text-4xl mb-5">💬</div>
          <h2 className="text-2xl font-medium mb-4 text-center">무엇을 도와드릴까요?</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 max-w-md px-4">
            채팅창에 메시지를 입력하여 대화를 시작해보세요.
          </p>
        </div>
      ) : (
        <div className="py-4 px-3 md:px-4">
          <div className="max-w-2xl mx-auto flex flex-col space-y-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp ? formatTimestamp(message.timestamp) : undefined}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-start ml-10 mb-3">
                <div className="bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-full">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      )}
    </div>
  );
} 