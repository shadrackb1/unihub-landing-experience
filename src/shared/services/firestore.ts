import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch,
  runTransaction,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import type { 
  University, 
  Hostel, 
  HostelRoom, 
  Apartment, 
  Room, 
  Agent, 
  Category, 
  Property, 
  SiteSettings,
  User 
} from '@/shared/types/admin';

const COLLECTIONS = {
  universities: 'universities',
  hostels: 'hostels',
  hostelRooms: 'hostelRooms',
  apartments: 'apartments',
  rooms: 'rooms',
  agents: 'agents',
  categories: 'categories',
  properties: 'properties',
  siteSettings: 'siteSettings',
  users: 'users',
  listings: 'listings',
} as const;

function timestampToDate(data: any): any {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(timestampToDate);
  if (typeof data !== 'object' || data === null) return data;
  
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } else if (value && typeof value === 'object') {
      result[key] = timestampToDate(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function dateToTimestamp(data: any): any {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(dateToTimestamp);
  if (typeof data !== 'object' || data === null) return data;
  
  const result: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) {
      result[key] = Timestamp.fromDate(value);
    } else if (value && typeof value === 'object') {
      result[key] = dateToTimestamp(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Site Settings
export async function getSiteSettings(): Promise<any | null> {
  try {
    const docRef = doc(db, COLLECTIONS.siteSettings, 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return timestampToDate(docSnap.data());
    }
    return null;
  } catch (error) {
    console.error('Error getting site settings:', error);
    throw error;
  }
}

export async function updateSiteSettings(data: any): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.siteSettings, 'global');
    await updateDoc(docRef, dateToTimestamp({
      ...data,
      updatedAt: new Date()
    }));
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
}

// Universities
export async function getUniversities(): Promise<University[]> {
  const q = query(collection(db, COLLECTIONS.universities), orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...timestampToDate(doc.data()) } as University));
}

export async function getUniversity(id: string): Promise<University | null> {
  const docRef = doc(db, COLLECTIONS.universities, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...timestampToDate(docSnap.data()) } as University;
  }
  return null;
}

export async function createUniversity(data: Omit<University, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const dataWithTimestamps = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const docRef = await addDoc(collection(db, COLLECTIONS.universities), dateToTimestamp(dataWithTimestamps));
  return docRef.id;
}

export async function updateUniversity(id: string, data: Partial<University>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.universities, id);
  await updateDoc(docRef, dateToTimestamp({ ...data, updatedAt: new Date() }));
}

export async function deleteUniversity(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.universities, id);
  await deleteDoc(docRef);
}

// Hostels
export async function getHostels(universityId?: string): Promise<Hostel[]> {
  let q = query(collection(db, COLLECTIONS.hostels), orderBy('name'));
  if (universityId) {
    q = query(collection(db, COLLECTIONS.hostels), where('universityId', '==', universityId), orderBy('name'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...timestampToDate(doc.data()) } as Hostel));
}

export async function getHostel(id: string): Promise<Hostel | null> {
  const docRef = doc(db, COLLECTIONS.hostels, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...timestampToDate(docSnap.data()) } as Hostel;
  }
  return null;
}

export async function createHostel(data: Omit<Hostel, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const dataWithTimestamps = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const docRef = await addDoc(collection(db, COLLECTIONS.hostels), dateToTimestamp(dataWithTimestamps));
  return docRef.id;
}

export async function updateHostel(id: string, data: Partial<Hostel>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.hostels, id);
  await updateDoc(docRef, dateToTimestamp({ ...data, updatedAt: new Date() }));
}

export async function deleteHostel(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.hostels, id);
  await deleteDoc(docRef);
}

// Hostel Rooms
export async function getHostelRooms(hostelId: string): Promise<any[]> {
  const q = query(collection(db, COLLECTIONS.hostelRooms), where('hostelId', '==', hostelId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...timestampToDate(doc.data()) }));
}

export async function getHostelRoom(id: string): Promise<any | null> {
  const docRef = doc(db, COLLECTIONS.hostelRooms, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...timestampToDate(docSnap.data()) };
  }
  return null;
}

export async function createHostelRoom(data: any): Promise<string> {
  const dataWithTimestamps = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const docRef = await addDoc(collection(db, COLLECTIONS.hostelRooms), dateToTimestamp(dataWithTimestamps));
  return docRef.id;
}

export async function updateHostelRoom(id: string, data: any): Promise<void> {
  const docRef = doc(db, COLLECTIONS.hostelRooms, id);
  await updateDoc(docRef, dateToTimestamp({ ...data, updatedAt: new Date() }));
}

export async function deleteHostelRoom(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.hostelRooms, id);
  await deleteDoc(docRef);
}

// Apartments
export async function getApartments(status?: string): Promise<Apartment[]> {
  let q = query(collection(db, COLLECTIONS.apartments), orderBy('name'));
  if (status) {
    q = query(collection(db, COLLECTIONS.apartments), where('status', '==', status), orderBy('name'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...timestampToDate(doc.data()) } as Apartment));
}

export async function getApartment(id: string): Promise<Apartment | null> {
  const docRef = doc(db, COLLECTIONS.apartments, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...timestampToDate(docSnap.data()) } as Apartment;
  }
  return null;
}

export async function createApartment(data: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const dataWithTimestamps = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const docRef = await addDoc(collection(db, COLLECTIONS.apartments), dateToTimestamp(dataWithTimestamps));
  return docRef.id;
}

export async function updateApartment(id: string, data: Partial<Apartment>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.apartments, id);
  await updateDoc(docRef, dateToTimestamp({ ...data, updatedAt: new Date() }));
}

export async function deleteApartment(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.apartments, id);
  await deleteDoc(docRef);
}

// Rooms
export async function getRooms(apartmentId?: string): Promise<Room[]> {
  let q = query(collection(db, COLLECTIONS.rooms), orderBy('room_number'));
  if (apartmentId) {
    q = query(collection(db, COLLECTIONS.rooms), where('apartmentId', '==', apartmentId), orderBy('room_number'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...timestampToDate(doc.data()) } as Room));
}

export async function getRoom(id: string): Promise<Room | null> {
  const docRef = doc(db, COLLECTIONS.rooms, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...timestampToDate(docSnap.data()) } as Room;
  }
  return null;
}

export async function createRoom(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const dataWithTimestamps = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const docRef = await addDoc(collection(db, COLLECTIONS.rooms), dateToTimestamp(dataWithTimestamps));
  return docRef.id;
}

export async function updateRoom(id: string, data: Partial<Room>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.rooms, id);
  await updateDoc(docRef, dateToTimestamp({ ...data, updatedAt: new Date() }));
}

export async function deleteRoom(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.rooms, id);
  await deleteDoc(docRef);
}

// Agents
export async function getAgents(): Promise<Agent[]> {
  const q = query(collection(db, COLLECTIONS.agents), orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
}

export async function getAgent(id: string): Promise<Agent | null> {
  const docRef = doc(db, COLLECTIONS.agents, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Agent;
  }
  return null;
}

export async function createAgent(data: Omit<Agent, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.agents), data);
  return docRef.id;
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.agents, id);
  await updateDoc(docRef, data);
}

export async function deleteAgent(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.agents, id);
  await deleteDoc(docRef);
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, COLLECTIONS.categories), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.categories), data);
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.categories, id);
  await updateDoc(docRef, data);
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.categories, id);
  await deleteDoc(docRef);
}

// Aliases for backward compatibility
export const getCategoriesList = getCategories;
export const getAgentsList = getAgents;

// Properties
export async function getProperties(status?: string): Promise<Property[]> {
  let q = query(collection(db, COLLECTIONS.properties), orderBy('createdAt', 'desc'));
  if (status) {
    q = query(collection(db, COLLECTIONS.properties), where('status', '==', status), orderBy('createdAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...timestampToDate(doc.data()) } as Property));
}

export async function getProperty(id: string): Promise<Property | null> {
  const docRef = doc(db, COLLECTIONS.properties, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...timestampToDate(docSnap.data()) } as Property;
  }
  return null;
}

export async function createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const dataWithTimestamps = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const docRef = await addDoc(collection(db, COLLECTIONS.properties), dateToTimestamp(dataWithTimestamps));
  return docRef.id;
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.properties, id);
  await updateDoc(docRef, dateToTimestamp({ ...data, updatedAt: new Date() }));
}

export async function deleteProperty(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.properties, id);
  await deleteDoc(docRef);
}

// Site Settings
export async function getSiteSettingsData(): Promise<any | null> {
  try {
    const docRef = doc(db, COLLECTIONS.siteSettings, 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting site settings:', error);
    throw error;
  }
}

export async function updateSiteSettingsData(data: any): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.siteSettings, 'global');
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
}

// Seed Data
export async function seedData(): Promise<void> {
  const batch = writeBatch(db);
  
  // Add default universities
  const universities = [
    { name: 'University of Nairobi', slug: 'uon', location: 'Nairobi', verified: true, status: 'active' },
    { name: 'Jomo Kenyatta University', slug: 'jkuat', location: 'Juja', verified: true, status: 'active' },
    { name: 'Kenyatta University', slug: 'ku', location: 'Kahawa', verified: true, status: 'active' },
    { name: 'Strathmore University', slug: 'su', location: 'Madaraka', verified: true, status: 'active' },
    { name: 'Moi University', slug: 'mu', location: 'Kesses', verified: true, status: 'active' },
  ];
  
  for (const uni of universities) {
    const ref = doc(collection(db, COLLECTIONS.universities));
    batch.set(ref, { ...uni, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
  
  // Add default categories
  const categories = [
    { name: 'Hostels', slug: 'hostels', isActive: true, order: 1 },
    { name: 'Apartments', slug: 'apartments', isActive: true, order: 2 },
    { name: 'Bedsitters', slug: 'bedsitters', isActive: true, order: 3 },
  ];
  
  for (let i = 0; i < categories.length; i++) {
    const ref = doc(collection(db, COLLECTIONS.categories));
    batch.set(ref, { ...categories[i], order: i + 1 });
  }
  
  await batch.commit();
}

// Push mock listings to live
export async function pushMockListingsLive(): Promise<void> {
  const { sampleListings } = await import('@/data/listings');
  const batch = writeBatch(db);
  
  for (const listing of sampleListings) {
    const ref = doc(collection(db, COLLECTIONS.listings));
    batch.set(ref, {
      ...listing,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  
  await batch.commit();
}