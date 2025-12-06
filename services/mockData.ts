import { Person, User } from '../types';

// Mocking a NoSQL Collection 'People'
let PEOPLE_COLLECTION: Person[] = [
  {
    id: "1",
    firstName: "Arthur",
    lastName: "Pendragon",
    parentId: null,
    spouses: ["2"],
    birthDate: "1930-05-12",
    deathDate: "2010-03-15",
    location: "London, UK",
    bio: "The patriarch. Served in the Navy.",
    photoUrl: "https://picsum.photos/seed/grandpa/200/200"
  },
  {
    id: "2",
    firstName: "Guinevere",
    lastName: "Pendragon",
    parentId: null,
    spouses: ["1"],
    birthDate: "1932-08-22",
    location: "London, UK",
    photoUrl: "https://picsum.photos/seed/grandma/200/200"
  },
  {
    id: "3",
    firstName: "Lance",
    lastName: "Pendragon",
    parentId: "1",
    spouses: ["4"],
    birthDate: "1955-02-10",
    location: "New York, USA",
    bio: "Architect.",
    photoUrl: "https://picsum.photos/seed/dad/200/200"
  },
  {
    id: "4",
    firstName: "Elaine",
    lastName: "Corbenic",
    parentId: null,
    spouses: ["3"],
    birthDate: "1958-11-05",
    location: "New York, USA",
    photoUrl: "https://picsum.photos/seed/mom/200/200"
  },
  {
    id: "5",
    firstName: "Galahad",
    lastName: "Pendragon",
    parentId: "3",
    spouses: [],
    birthDate: "1982-06-15",
    location: "San Francisco, CA",
    bio: "Software Engineer.",
    photoUrl: "https://picsum.photos/seed/son/200/200"
  },
  {
    id: "6",
    firstName: "Morgana",
    lastName: "Le Fay",
    parentId: "1",
    spouses: [],
    birthDate: "1960-12-01",
    location: "Paris, France",
    photoUrl: "https://picsum.photos/seed/aunt/200/200"
  },
  {
    id: "7",
    firstName: "Mordred",
    lastName: "Le Fay",
    parentId: "6",
    spouses: [],
    birthDate: "1990-10-31",
    location: "Berlin, Germany",
    photoUrl: "https://picsum.photos/seed/cousin/200/200"
  },
  {
    id: "8",
    firstName: "Gawain",
    lastName: "Pendragon",
    parentId: "3",
    spouses: [],
    birthDate: "1985-04-20",
    location: "Austin, TX",
    photoUrl: "https://picsum.photos/seed/brother/200/200"
  }
];

// Helper to get raw data
export const getPeopleCollection = () => [...PEOPLE_COLLECTION];

// Helper to simulate DB insert
export const insertPerson = (person: Person) => {
  PEOPLE_COLLECTION.push(person);
  return person;
};