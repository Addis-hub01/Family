import { User, Person } from '../types';
import { getPeopleCollection, insertPerson } from './mockData';

// Simulated latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock User DB
let USERS_DB: User[] = [
  {
    id: 'user_123',
    firstName: 'Galahad',
    lastName: 'Pendragon',
    email: 'test@example.com',
    avatarUrl: 'https://picsum.photos/seed/son/200/200',
    linkedPersonId: '5'
  }
];

export const login = async (email: string): Promise<User> => {
  await delay(800);
  const user = USERS_DB.find(u => u.email === email);
  if (!user) {
    // Auto-create for demo if not found, but unlinked
    const newUser: User = {
      id: `user_${Date.now()}`,
      firstName: email.split('@')[0],
      lastName: 'User',
      email: email,
      avatarUrl: `https://picsum.photos/seed/${email}/200/200`,
      linkedPersonId: null
    };
    USERS_DB.push(newUser);
    return newUser;
  }
  return user;
};

export const register = async (data: any): Promise<User> => {
  await delay(1000);
  const newUser: User = {
    id: `user_${Date.now()}`,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    avatarUrl: `https://picsum.photos/seed/${data.firstName}/200/200`,
    linkedPersonId: null // Not linked initially
  };
  USERS_DB.push(newUser);
  return newUser;
};

export const checkSession = async (): Promise<User | null> => {
  await delay(500);
  return null; 
};

export const fetchFamilyTree = async (): Promise<Person[]> => {
  await delay(600);
  // Return plain objects, D3 stratify will handle hierarchy
  // Map fields to match what UI expects combined (firstName + lastName)
  const rawData = getPeopleCollection();
  return rawData.map(p => ({
    ...p,
    name: `${p.firstName} ${p.lastName}`
  }));
};

// New Endpoint: Self-Addition / Linking
export const addPersonToTree = async (userId: string, personData: Partial<Person>): Promise<Person> => {
  await delay(800);
  
  const newPerson: Person = {
    id: `person_${Date.now()}`,
    firstName: personData.firstName || 'Unknown',
    lastName: personData.lastName || 'Unknown',
    parentId: personData.parentId || null,
    spouses: personData.spouses || [],
    birthDate: personData.birthDate,
    location: personData.location,
    photoUrl: personData.photoUrl || `https://picsum.photos/seed/${Date.now()}/200/200`,
    bio: personData.bio
  };

  insertPerson(newPerson);

  // Link user
  const userIndex = USERS_DB.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    USERS_DB[userIndex].linkedPersonId = newPerson.id;
  }

  return {
    ...newPerson,
    name: `${newPerson.firstName} ${newPerson.lastName}`
  };
};