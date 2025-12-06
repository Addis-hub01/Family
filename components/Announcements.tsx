import React from 'react';
import { Announcement } from '../types';
import { Heart, MessageCircle, Share2, Calendar } from 'lucide-react';

const MOCK_NEWS: Announcement[] = [
  {
    id: '1',
    title: 'Summer Reunion 2024',
    content: 'The annual reunion is set for July 15th at the Lake House! Please RSVP by the end of this month so we can get the catering sorted. Can’t wait to see everyone!',
    author: 'Elaine Corbenic',
    date: '2 hours ago',
    likes: 12,
    imageUrl: 'https://picsum.photos/seed/reunion/800/400'
  },
  {
    id: '2',
    title: 'New Baby Alert! 🍼',
    content: 'Welcome to the world, little Thomas! Born yesterday at 7lbs 4oz. Mother and baby are doing great.',
    author: 'Gawain Pendragon',
    date: '1 day ago',
    likes: 45,
    imageUrl: 'https://picsum.photos/seed/baby/800/400'
  }
];

export const Announcements: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Family News & Gallery</h2>
        <button className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700">
          Post Update
        </button>
      </div>

      {MOCK_NEWS.map((post) => (
        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {post.imageUrl && (
            <div className="h-48 w-full bg-gray-100 overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
              <span className="font-semibold text-brand-600">{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>
            
            <div className="flex items-center pt-4 border-t border-gray-100 space-x-6">
              <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5 mr-1.5" />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-brand-600 transition-colors">
                <MessageCircle className="w-5 h-5 mr-1.5" />
                <span className="text-sm font-medium">Comment</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-900 transition-colors ml-auto">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
          <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500">You're all caught up!</p>
      </div>
    </div>
  );
};