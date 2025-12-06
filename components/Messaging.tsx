import React, { useState } from 'react';
import { User, ChatMessage } from '../types';
import { Send, Smile } from 'lucide-react';

interface MessagingProps {
  currentUser: User;
}

export const Messaging: React.FC<MessagingProps> = ({ currentUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'user_999',
      senderName: 'Arthur Pendragon',
      senderAvatar: 'https://picsum.photos/seed/grandpa/200/200',
      content: 'Welcome to the digital family tree! It is amazing to see everyone here.',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      senderId: 'user_888',
      senderName: 'Morgana Le Fay',
      senderAvatar: 'https://picsum.photos/seed/aunt/200/200',
      content: 'Has anyone seen the old photo album from 1985?',
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.firstName + ' ' + currentUser.lastName,
      senderAvatar: currentUser.avatarUrl || '',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-140px)] flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h2 className="font-semibold text-gray-800">Family General Chat</h2>
        <p className="text-xs text-gray-500">24 members online</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <img 
                  src={msg.senderAvatar} 
                  alt={msg.senderName} 
                  className="w-8 h-8 rounded-full mr-2 self-end mb-1"
                />
              )}
              <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isMe && <span className="text-xs text-gray-500 ml-1 mb-1">{msg.senderName}</span>}
                <div 
                  className={`px-4 py-2 rounded-2xl ${
                    isMe 
                      ? 'bg-brand-600 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-1">
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSend} className="flex gap-2">
          <button type="button" className="text-gray-400 hover:text-brand-600 p-2">
            <Smile className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border-0 bg-gray-100 rounded-full px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <button 
            type="submit" 
            className="bg-brand-600 text-white p-2 rounded-full hover:bg-brand-700 transition-colors"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};