'use client';

import { useState } from 'react';

interface Chat {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function Sidebar({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const filteredChats = searchTerm 
    ? chats.filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : chats;
  
  const handleDeleteClick = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(chatId);
  };

  const confirmDelete = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteChat) {
      onDeleteChat(chatId);
    }
    setShowDeleteConfirm(null);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };
  
  return (
    <div className="w-64 h-full bg-[#202123] text-white flex flex-col">
      <div className="p-2">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 p-2.5 border border-gray-600 rounded-md hover:bg-gray-800 transition text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>새 채팅</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 text-xs text-gray-500 font-medium">
          오늘
        </div>
        
        <div className="px-2 mb-2">
          {filteredChats.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {searchTerm ? '검색 결과가 없습니다' : '채팅 내역이 없습니다'}
            </div>
          ) : (
            filteredChats.map(chat => (
              <div 
                key={chat.id}
                className={`relative mb-1 rounded-md ${
                  activeChat === chat.id 
                    ? 'bg-[#343541]' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <div 
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left p-2 rounded-md flex items-center text-sm group cursor-pointer ${
                    activeChat === chat.id 
                      ? 'text-white' 
                      : 'text-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <div className="truncate flex-1">
                    {chat.title}
                  </div>
                  
                  {onDeleteChat && (
                    <div
                      onClick={(e) => handleDeleteClick(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 ml-1 text-gray-400 hover:text-red-500 rounded cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {showDeleteConfirm === chat.id && (
                  <div className="absolute inset-0 bg-gray-800 bg-opacity-90 rounded-md flex items-center justify-center z-10">
                    <div className="p-2 text-center">
                      <p className="text-xs mb-2">정말 삭제하시겠습니까?</p>
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={(e) => confirmDelete(chat.id, e)}
                          className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                          삭제
                        </button>
                        <button 
                          onClick={cancelDelete}
                          className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-auto border-t border-gray-700">
        <div className="space-y-1 p-2 text-sm">
          <button className="w-full text-left p-2 rounded-md hover:bg-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            설정
          </button>
          
          <button className="w-full text-left p-2 rounded-md hover:bg-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            도움말
          </button>
        </div>

        <div className="p-2 flex items-center gap-2 hover:bg-gray-800 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
            U
          </div>
          <div className="text-sm">사용자</div>
        </div>
      </div>
    </div>
  );
} 