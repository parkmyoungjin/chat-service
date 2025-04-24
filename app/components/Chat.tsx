'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤 기능
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() === '') return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('API 요청:', [...messages, userMessage]);
      
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage],
      }, {
        timeout: 30000, // 30초 타임아웃
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API 응답:', response.data);
      
      if (response.data.content) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.data.content },
        ]);
      } else if (response.data.error) {
        setError(`오류: ${response.data.error}`);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `오류가 발생했습니다: ${response.data.error}` },
        ]);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      const errorMsg = error.response?.data?.details || 
                       error.response?.data?.error || 
                       error.message || 
                       '알 수 없는 오류가 발생했습니다.';
      
      setError(`오류: ${errorMsg}`);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `죄송합니다, 오류가 발생했습니다: ${errorMsg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">ChatGPT 클론</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-12">
            메시지를 입력하세요...
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-200 text-black'
              } max-w-[80%] ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))
        )}
        {isLoading && (
          <div className="p-3 rounded-lg bg-gray-200 text-black max-w-[80%]">
            <p>생각 중...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 border border-gray-300 rounded"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || input.trim() === ''}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-blue-300"
        >
          전송
        </button>
      </form>
    </div>
  );
} 