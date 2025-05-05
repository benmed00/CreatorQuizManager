import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  User,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryConstraint,
  Timestamp
} from "firebase/firestore";

/**
 * Firebase Authentication Module
 * 
 * This module handles all Firebase authentication operations.
 * It can work in two modes:
 * 1. MOCK mode: Uses mock implementations for development without real Firebase credentials
 * 2. REAL mode: Uses actual Firebase authentication when credentials are provided
 * 
 * USAGE:
 * - For local development, mockMode will be enabled automatically if Firebase credentials are missing
 * - For production, ensure all Firebase environment variables are set
 * 
 * To transition from mock to real implementation:
 * 1. Obtain Firebase credentials from Firebase Console
 * 2. Set the environment variables:
 *    - VITE_FIREBASE_API_KEY
 *    - VITE_FIREBASE_PROJECT_ID
 *    - VITE_FIREBASE_APP_ID
 * 3. The system will automatically use real Firebase when credentials are provided
 */

// Check if we have real Firebase credentials or should use mock mode
const hasMockCredentials = !import.meta.env.VITE_FIREBASE_API_KEY || 
                          import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id"
};

// Custom interface for mock Firebase user
interface MockFirebaseUser {
  email: string;
  password: string;
  displayName: string;
  id: string;
}

// Mock user database for development without Firebase
const mockUsers = new Map<string, MockFirebaseUser>();

// Add a sample user for testing
mockUsers.set("test@example.com", {
  email: "test@example.com",
  password: "password123",
  displayName: "Test User",
  id: "mock-user-1"
});

// Always initialize Firebase, even with mock credentials
// This ensures the Firebase app instance exists and prevents "No Firebase App '[DEFAULT]'" errors
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Log if we're using mock mode
if (hasMockCredentials) {
  console.log("Using mock Firebase authentication - provide real credentials to use Firebase Auth");
}

// Create a minimal mock Firebase user that satisfies the User interface
const createMockUser = (
  uid: string, 
  email: string, 
  displayName: string, 
  photoURL: string | null = null
): User => {
  return {
    uid,
    email,
    emailVerified: true,
    displayName,
    photoURL,
    isAnonymous: false,
    providerData: [],
    metadata: { 
      creationTime: Date.now().toString(),
      lastSignInTime: Date.now().toString() 
    },
    tenantId: null,
    phoneNumber: null,
    refreshToken: '',
    delete: () => Promise.resolve(),
    getIdToken: () => Promise.resolve("mock-token"),
    getIdTokenResult: () => Promise.resolve({ 
      token: "mock-token",
      authTime: new Date().toISOString(),
      issuedAtTime: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      signInProvider: "password",
      signInSecondFactor: null,
      claims: {}
    }),
    reload: () => Promise.resolve(),
    toJSON: () => ({}),
    providerId: "firebase"
  } as User;
};

// Firebase Authentication API with fallback to mock implementations

/**
 * Sign in with email and password
 * @param email User email
 * @param password User password
 * @returns Promise resolving to UserCredential
 */
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    return signInWithEmailAndPassword(auth, email, password);
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.get(email);
        
        if (user && user.password === password) {
          const mockUser = createMockUser(user.id, user.email, user.displayName);
          
          resolve({
            user: mockUser,
            providerId: "password",
            operationType: "signIn"
          } as UserCredential);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500); // Simulate network delay
    });
  }
};

/**
 * Register a new user with email, password and display name
 * @param email User email
 * @param password User password
 * @param displayName User display name
 * @returns Promise resolving to UserCredential
 */
export const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.has(email)) {
          reject(new Error("Email already in use"));
        } else {
          const id = `mock-user-${mockUsers.size + 1}`;
          mockUsers.set(email, { email, password, displayName, id });
          
          const mockUser = createMockUser(id, email, displayName);
          
          resolve({
            user: mockUser,
            providerId: "password",
            operationType: "signIn"
          } as UserCredential);
        }
      }, 500); // Simulate network delay
    });
  }
};

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export const signOut = async (): Promise<void> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    return firebaseSignOut(auth);
  } else {
    // MOCK IMPLEMENTATION
    return Promise.resolve();
  }
};

/**
 * Sign in with Google
 * @returns Promise resolving to UserCredential
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    return signInWithPopup(auth, googleProvider);
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockGoogleId = 'google-user-1';
        const mockEmail = 'google-user@example.com';
        
        if (!mockUsers.has(mockEmail)) {
          mockUsers.set(mockEmail, {
            email: mockEmail,
            password: "",
            displayName: "Google User",
            id: mockGoogleId
          });
        }
        
        const mockUser = createMockUser(
          mockGoogleId, 
          mockEmail, 
          "Google User", 
          "https://via.placeholder.com/150"
        );
        
        resolve({
          user: mockUser,
          providerId: "google.com",
          operationType: "signIn"
        } as UserCredential);
      }, 800); // Simulate network delay
    });
  }
};

/**
 * Transforms a Firebase User to our application's User model
 * @param firebaseUser Firebase User object
 * @returns Application User object
 */
/**
 * Transforms a Firebase User object into our application's User format
 * 
 * @param firebaseUser The Firebase User object to transform
 * @returns A simplified User object with only the properties we need
 */
export const transformFirebaseUser = (firebaseUser: any): User => {
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    photoURL: firebaseUser.photoURL,
  } as User;
};

/**
 * Get the currently signed-in user
 * @returns User or null if no user is signed in
 */
export const getCurrentUser = (): User | null => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    const user = auth.currentUser;
    if (user) {
      // Transform to our app's User model
      return transformFirebaseUser(user);
    }
    return null;
  } else {
    // MOCK IMPLEMENTATION - For mock mode, we don't maintain auth state
    // In a real app, you might want to use localStorage to mock persistence
    return null;
  }
};

// Export the auth object
/**
 * Send password reset email
 * @param email User email
 * @returns Promise<void>
 */
export const resetPassword = async (email: string): Promise<void> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    return sendPasswordResetEmail(auth, email);
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.get(email);
        
        if (user) {
          console.log(`Mock password reset email sent to ${email}`);
          resolve();
        } else {
          reject(new Error("User not found"));
        }
      }, 500); // Simulate network delay
    });
  }
};

/**
 * Firestore Data Services
 * 
 * These functions provide access to Firestore database operations
 * They support both real and mock implementations
 */

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  QUIZZES: 'quizzes',
  QUESTIONS: 'questions',
  RESULTS: 'results',
  CATEGORIES: 'categories',
  PROFILES: 'profiles',
  TEMPLATES: 'templates'
};

// Mock firestore data for development
const mockFirestore = {
  [COLLECTIONS.USERS]: new Map(),
  [COLLECTIONS.QUIZZES]: new Map(),
  [COLLECTIONS.QUESTIONS]: new Map(),
  [COLLECTIONS.RESULTS]: new Map(),
  [COLLECTIONS.CATEGORIES]: new Map(),
  [COLLECTIONS.PROFILES]: new Map(),
  [COLLECTIONS.TEMPLATES]: new Map()
};

// Initialize some mock categories
mockFirestore[COLLECTIONS.CATEGORIES].set('1', {
  id: 1,
  name: 'General Knowledge',
  description: 'Basic knowledge across various fields',
  createdAt: new Date(),
  iconName: 'BookOpen'
});

mockFirestore[COLLECTIONS.CATEGORIES].set('2', {
  id: 2,
  name: 'Programming',
  description: 'Computer programming concepts and languages',
  createdAt: new Date(),
  iconName: 'Code'
});

mockFirestore[COLLECTIONS.CATEGORIES].set('3', {
  id: 3,
  name: 'Web Development',
  description: 'Web technologies and frameworks',
  createdAt: new Date(),
  iconName: 'Globe'
});

/**
 * Creates a document in a collection
 * @param collectionName Collection name
 * @param data Document data
 * @param id Optional document ID (if not provided, Firestore will generate one)
 * @returns Promise resolving to the document ID
 */
export const createDocument = async <T extends object>(
  collectionName: string,
  data: T,
  id?: string
): Promise<string> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    try {
      const docRef = id 
        ? doc(db, collectionName, id)
        : doc(collection(db, collectionName));
      
      const timestamp = serverTimestamp();
      const dataWithTimestamp = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      await setDoc(docRef, dataWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        const docId = id || `mock-${collectionName}-${Date.now()}`;
        const mockData = {
          ...data,
          id: docId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        mockFirestore[collectionName].set(docId, mockData);
        resolve(docId);
      }, 300);
    });
  }
};

/**
 * Updates a document in a collection
 * @param collectionName Collection name
 * @param id Document ID
 * @param data Document data to update
 * @returns Promise<void>
 */
export const updateDocument = async <T extends object>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    try {
      const docRef = doc(db, collectionName, id);
      const dataWithTimestamp = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, dataWithTimestamp);
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockFirestore[collectionName].has(id)) {
          const existingData = mockFirestore[collectionName].get(id);
          const updatedData = {
            ...existingData,
            ...data,
            updatedAt: new Date()
          };
          
          mockFirestore[collectionName].set(id, updatedData);
          resolve();
        } else {
          reject(new Error(`Document with ID ${id} not found in ${collectionName}`));
        }
      }, 300);
    });
  }
};

/**
 * Gets a document from a collection
 * @param collectionName Collection name
 * @param id Document ID
 * @returns Promise resolving to the document data or undefined if not found
 */
export const getDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | undefined> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = mockFirestore[collectionName].get(id);
        resolve(data as T);
      }, 300);
    });
  }
};

/**
 * Deletes a document from a collection
 * @param collectionName Collection name
 * @param id Document ID
 * @returns Promise<void>
 */
export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockFirestore[collectionName].has(id)) {
          mockFirestore[collectionName].delete(id);
          resolve();
        } else {
          reject(new Error(`Document with ID ${id} not found in ${collectionName}`));
        }
      }, 300);
    });
  }
};

/**
 * Queries documents from a collection
 * @param collectionName Collection name
 * @param constraints Query constraints (where, orderBy, limit, etc.)
 * @returns Promise resolving to an array of documents
 */
export const queryDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const documents: T[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() } as T);
      });
      
      return documents;
    } catch (error) {
      console.error(`Error querying documents from ${collectionName}:`, error);
      throw error;
    }
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a shallow copy of all values from the mock collection
        const allDocs = Array.from(mockFirestore[collectionName].values());
        
        // Very basic filtering support for mock data
        // This only supports simple where clauses - for a real implementation, use Firestore queries
        let filteredDocs = allDocs;
        
        for (const constraint of constraints) {
          if ('fieldPath' in constraint && 'opStr' in constraint && 'value' in constraint) {
            const fieldPath = constraint.fieldPath as string;
            const opStr = constraint.opStr as string;
            const value = constraint.value;
            
            filteredDocs = filteredDocs.filter(doc => {
              const fieldValue = doc[fieldPath];
              
              switch (opStr) {
                case '==': return fieldValue === value;
                case '!=': return fieldValue !== value;
                case '>': return fieldValue > (value as any);
                case '>=': return fieldValue >= (value as any);
                case '<': return fieldValue < (value as any);
                case '<=': return fieldValue <= (value as any);
                default: return true;
              }
            });
          }
        }
        
        resolve(filteredDocs as T[]);
      }, 500);
    });
  }
};

// Export the Firebase modules
export { db };
export default auth;
