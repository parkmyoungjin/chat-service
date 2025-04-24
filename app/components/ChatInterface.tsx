'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatHeader from './ChatHeader';
import Sidebar from './Sidebar';
import ChatArea, { Message } from './ChatArea';
import ChatInput from './ChatInput';
import axios from 'axios';

interface Chat {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

const LOCAL_STORAGE_KEY = 'chatgpt_clone_chats';

export default function ChatInterface() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // 로컬 스토리지에서 대화 내용 불러오기
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats) as Chat[];
        setChats(parsedChats);
        
        // 마지막 활성화 채팅이 있으면 불러오기
        const lastActiveChat = localStorage.getItem('active_chat_id');
        if (lastActiveChat && parsedChats.some(chat => chat.id === lastActiveChat)) {
          setActiveChat(lastActiveChat);
        }
      }
      
      setInitialized(true);
    } catch (error) {
      console.error('로컬 스토리지 로드 오류:', error);
      setInitialized(true);
    }
  }, []);
  
  // 채팅이 하나도 없는 경우 새 채팅 자동 생성
  useEffect(() => {
    if (initialized && chats.length === 0) {
      createNewChat();
    }
  }, [initialized, chats]);
  
  // 현재 활성화된 채팅이 변경될 때마다 메시지 업데이트
  useEffect(() => {
    if (activeChat) {
      const currentChat = chats.find(chat => chat.id === activeChat);
      if (currentChat) {
        setMessages(currentChat.messages);
        
        // 활성 채팅 ID 저장
        localStorage.setItem('active_chat_id', activeChat);
      }
    } else {
      setMessages([]);
    }
  }, [activeChat, chats]);
  
  // 채팅 내용이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats));
    }
  }, [chats, initialized]);
  
  // 새 채팅 생성
  const createNewChat = () => {
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      title: '새 채팅',
      date: new Date().toISOString(),
      messages: []
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChatId);
  };
  
  // 채팅 선택
  const selectChat = (chatId: string) => {
    setActiveChat(chatId);
  };
  
  // 채팅 삭제
  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    
    // 현재 활성화된 채팅이 삭제되는 경우
    if (activeChat === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        // 다른 채팅으로 활성화 변경
        setActiveChat(remainingChats[0].id);
      } else {
        // 채팅이 없으면 새 채팅 생성
        setTimeout(() => createNewChat(), 100);
      }
    }
  };
  
  // 메시지 전송
  const sendMessage = async (content: string) => {
    if (!activeChat || !content.trim()) return;
    
    // 유저 메시지 추가
    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // 메시지 및 채팅 상태 업데이트
    setMessages(prev => [...prev, userMessage]);
    
    // 첫 메시지인 경우 채팅 제목 업데이트
    setChats(prev => {
      return prev.map(chat => {
        if (chat.id === activeChat) {
          // 채팅 제목 업데이트 (첫 메시지인 경우)
          const updatedTitle = chat.messages.length === 0 
            ? content.length > 25 ? content.substring(0, 25) + '...' : content
            : chat.title;
            
          return {
            ...chat,
            title: updatedTitle,
            messages: [...chat.messages, userMessage]
          };
        }
        return chat;
      });
    });
    
    // API 호출
    setIsLoading(true);
    
    try {
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await axios.post('/api/chat', {
        messages: apiMessages
      });
      
      // AI 응답 메시지 추가
      const assistantMessageId = uuidv4();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // 채팅 상태 업데이트
      setChats(prev => {
        return prev.map(chat => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage]
            };
          }
          return chat;
        });
      });
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      
      // 오류 메시지 추가
      const errorMessageId = uuidv4();
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      
      const assistantErrorMessage: Message = {
        id: errorMessageId,
        role: 'assistant',
        content: `오류가 발생했습니다: ${errorMessage}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantErrorMessage]);
      
      setChats(prev => {
        return prev.map(chat => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              messages: [...chat.messages, assistantErrorMessage]
            };
          }
          return chat;
        });
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };
  
  return (
    <div className="flex h-screen bg-[#f5f5f5] dark:bg-[#1c1c1e] text-gray-900 dark:text-white">
      {/* 사이드바 */}
      {showSidebar && (
        <div className="flex-shrink-0">
          <Sidebar 
            chats={chats} 
            activeChat={activeChat} 
            onSelectChat={selectChat} 
            onNewChat={createNewChat}
            onDeleteChat={deleteChat}
          />
        </div>
      )}
      
      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader 
          onNewChat={createNewChat} 
          onToggleSidebar={toggleSidebar} 
        />
        
        <div className="flex-1 flex flex-col h-full">
          <ChatArea 
            messages={messages} 
            isLoading={isLoading} 
          />
          
          <ChatInput 
            onSendMessage={sendMessage} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
} 