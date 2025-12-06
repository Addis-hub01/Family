export type ViewState = 'tree' | 'messaging' | 'gallery';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  linkedPersonId?: string | null; // ID of the person node this user represents
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  
  // Relationships
  parentId: string | null; // For hierarchical structure (primary parent)
  spouses?: string[]; // IDs of partners
  
  // Metadata
  birthDate?: string;
  deathDate?: string;
  photoUrl: string;
  bio?: string;
  location?: string;
  
  // D3 Helper properties (optional for strict typing but useful for runtime)
  name?: string; // composite
  children?: Person[];
  _children?: Person[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  likes: number;
}