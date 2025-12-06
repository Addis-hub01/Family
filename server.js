const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- MOCK NoSQL DATABASE (Firestore-style structure) ---

// Collection: 'users'
const usersCollection = [
  {
    id: "user_123",
    email: "galahad@example.com",
    passwordHash: "$2b$10$...", // mock hash
    personId: "5", // Link to 'people' collection
    firstName: "Galahad",
    lastName: "Pendragon"
  },
  {
    id: "user_admin",
    email: "admin@kinconnect.com",
    passwordHash: "$2b$10$...", // mock hash
    personId: "1", // Link to 'people' collection (Arthur)
    firstName: "System",
    lastName: "Admin",
    isAdmin: true
  }
];

// Collection: 'people'
// Represents the family tree nodes. 
// Flexible schema allowing parent references and spouse arrays.
const peopleCollection = [
  {
    id: "1",
    firstName: "Arthur",
    lastName: "Pendragon",
    parentId: null,
    spouses: ["2"],
    birthDate: "1930-05-12",
    deathDate: "2010-03-15",
    location: "London, UK",
    bio: "The patriarch of the family. Served in the Navy.",
    photoUrl: "https://picsum.photos/seed/grandpa/200/200",
    metadata: { createdBy: "user_admin", createdAt: "2023-01-01" }
  },
  {
    id: "2",
    firstName: "Guinevere",
    lastName: "Pendragon",
    parentId: null,
    spouses: ["1"],
    birthDate: "1932-08-22",
    location: "London, UK",
    photoUrl: "https://picsum.photos/seed/grandma/200/200",
    metadata: { createdBy: "user_admin" }
  },
  {
    id: "3",
    firstName: "Lance",
    lastName: "Pendragon",
    parentId: "1", // Linked to Arthur
    spouses: ["4"],
    birthDate: "1955-02-10",
    location: "New York, USA",
    bio: "Eldest son. Architect.",
    photoUrl: "https://picsum.photos/seed/dad/200/200",
    metadata: { createdBy: "user_admin" }
  },
  {
    id: "4",
    firstName: "Elaine",
    lastName: "Corbenic",
    parentId: null,
    spouses: ["3"],
    birthDate: "1958-11-05",
    location: "New York, USA",
    photoUrl: "https://picsum.photos/seed/mom/200/200",
    metadata: { createdBy: "user_admin" }
  },
  {
    id: "5",
    firstName: "Galahad",
    lastName: "Pendragon",
    parentId: "3", // Linked to Lance
    spouses: [],
    birthDate: "1982-06-15",
    location: "San Francisco, CA",
    bio: "Software Engineer. Loves hiking.",
    photoUrl: "https://picsum.photos/seed/son/200/200",
    metadata: { createdBy: "user_123" }
  }
];

// --- ROUTES ---

// Register Endpoint
app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  // In a real app: Hash password, check duplicates, insert into usersCollection
  const newUser = {
    id: `user_${Date.now()}`,
    email,
    passwordHash: 'mock_hash',
    firstName,
    lastName,
    personId: null // Not linked yet
  };
  usersCollection.push(newUser);
  res.json({ user: newUser, token: 'mock_jwt_token' });
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = usersCollection.find(u => u.email === email);
  if (user) {
    res.json({ user, token: 'mock_jwt_token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get Tree Data
app.get('/api/tree/:rootId', (req, res) => {
  // In a real NoSQL DB, we might query by 'parentId' or fetch the whole collection if small enough.
  res.json(peopleCollection);
});

// Add Person (Self-Addition)
app.post('/api/tree/add', (req, res) => {
  const { userId, personData } = req.body;
  
  // Create new person node
  const newPerson = {
    id: `person_${Date.now()}`,
    ...personData,
    metadata: { createdBy: userId, createdAt: new Date().toISOString() }
  };
  
  peopleCollection.push(newPerson);
  
  // Link user to this person
  const user = usersCollection.find(u => u.id === userId);
  if (user) {
    user.personId = newPerson.id;
  }
  
  res.json({ success: true, person: newPerson });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});