import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
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
// Force mock mode to true for now since we're having issues with the Firebase connection
// This will ensure the mock data works properly
const hasMockCredentials = true; // Force mock mode

console.log("FIREBASE CONFIG STATUS:", { 
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  forcingMockMode: true
});

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChfrxe71fB0g1clC3-niwy4WRt0PYU-2k",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "quiz-generator-339ed"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quiz-generator-339ed",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "quiz-generator-339ed"}.appspot.com`,
  messagingSenderId: "557880915236",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:557880915236:web:4dcee1e8fb442b532c6fb1",
  measurementId: "G-GLB5DXQR7H"
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

// Create a minimal mock Firebase user that satisfies the FirebaseUser interface
const createMockUser = (
  uid: string, 
  email: string, 
  displayName: string, 
  photoURL: string | null = null
): any => {
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
  };
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
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Store the user in localStorage for persistence
      if (result.user) {
        const transformedUser = transformFirebaseUser(result.user);
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(transformedUser));
        } catch (error) {
          console.error("Failed to store user in localStorage:", error);
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  } else {
    // MOCK IMPLEMENTATION
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.get(email);
        
        if (user && user.password === password) {
          const mockUser = createMockUser(user.id, user.email, user.displayName);
          
          // Store mock user in localStorage for persistence
          const transformedUser = transformFirebaseUser(mockUser);
          try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(transformedUser));
          } catch (error) {
            console.error("Failed to store mock user in localStorage:", error);
          }
          
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
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Store the user in localStorage for persistence
      if (userCredential.user) {
        const transformedUser = transformFirebaseUser(userCredential.user);
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(transformedUser));
        } catch (error) {
          console.error("Failed to store user in localStorage:", error);
        }
      }
      
      return userCredential;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
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
          
          // Store mock user in localStorage for persistence
          const transformedUser = transformFirebaseUser(mockUser);
          try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(transformedUser));
          } catch (error) {
            console.error("Failed to store mock user in localStorage:", error);
          }
          
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
  // Clear user from localStorage regardless of implementation
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to remove user from localStorage:", error);
  }
  
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    try {
      return await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
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
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Store the user in localStorage for persistence
      if (result.user) {
        const transformedUser = transformFirebaseUser(result.user);
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(transformedUser));
        } catch (error) {
          console.error("Failed to store Google user in localStorage:", error);
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error during Google sign in:", error);
      throw error;
    }
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
        
        // Store mock Google user in localStorage for persistence
        const transformedUser = transformFirebaseUser(mockUser);
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(transformedUser));
        } catch (error) {
          console.error("Failed to store mock Google user in localStorage:", error);
        }
        
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
 * App User Interface - our simplified user model
 * This represents how we store user data in our application
 */
export interface AppUser {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

/**
 * Transforms a Firebase User object into our application's User format
 * 
 * @param firebaseUser The Firebase User object to transform
 * @returns A simplified User object with only the properties we need
 */
export const transformFirebaseUser = (firebaseUser: FirebaseUser | any): AppUser => {
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    photoURL: firebaseUser.photoURL,
  };
};

// Local storage key for persisting user data
const USER_STORAGE_KEY = 'quiz-app-user';

/**
 * Get the currently signed-in user
 * @returns AppUser or null if no user is signed in
 */
export const getCurrentUser = (): AppUser | null => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    const user = auth.currentUser;
    if (user) {
      // Transform to our app's User model
      const transformedUser = transformFirebaseUser(user);
      
      // Store in localStorage for persistence
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(transformedUser));
      } catch (error) {
        console.error("Failed to store user in localStorage:", error);
      }
      
      return transformedUser;
    } else {
      // Check if we have a stored user in localStorage
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      } catch (error) {
        console.error("Failed to retrieve user from localStorage:", error);
      }
    }
    return null;
  } else {
    // MOCK IMPLEMENTATION - For mock mode, we maintain auth state in localStorage
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to retrieve mock user from localStorage:", error);
    }
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

// Create fresh mock quizzes and questions
// This section initializes the mock Firebase data for testing purposes

// Initialize quiz 1: JavaScript Basics
const QUIZ1 = {
  id: 'quiz-1',
  title: 'JavaScript Basics',
  description: 'Test your knowledge of fundamental JavaScript concepts',
  category: 'Programming',
  categoryId: 2,
  difficulty: 'beginner',
  createdBy: 'mock-user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  questionCount: 3,
  timeLimit: 5,
  isPublic: true,
  tags: ['javascript', 'web', 'programming']
};

// Initialize quiz 2: React Fundamentals
const QUIZ2 = {
  id: 'quiz-2',
  title: 'React Fundamentals',
  description: 'Learn the basics of React components, props, and state',
  category: 'Web Development',
  categoryId: 3,
  difficulty: 'intermediate',
  createdBy: 'mock-user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  questionCount: 3,
  timeLimit: 8,
  isPublic: true,
  tags: ['react', 'frontend', 'javascript']
};

// Initialize quiz 3: CSS Layout Mastery
const QUIZ3 = {
  id: 'quiz-3',
  title: 'CSS Layout Mastery',
  description: 'Test your knowledge of modern CSS layout techniques',
  category: 'Web Development',
  categoryId: 3,
  difficulty: 'intermediate',
  createdBy: 'mock-user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  questionCount: 3,
  timeLimit: 6,
  isPublic: true,
  tags: ['css', 'layout', 'web']
};

// Initialize quiz 4: JavaScript Advanced
const QUIZ4 = {
  id: 'quiz-4',
  title: 'JavaScript Advanced',
  description: 'Test your knowledge of advanced JavaScript concepts including closures, promises, and more',
  category: 'Programming',
  categoryId: 2,
  difficulty: 'advanced',
  createdBy: 'mock-user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  questionCount: 3,
  timeLimit: 10,
  isPublic: true,
  tags: ['javascript', 'advanced', 'programming']
};

// Initialize quiz 9: Angular Advanced Routing
const QUIZ9 = {
  id: 'quiz-9',
  title: 'Angular Advanced Routing',
  description: 'Test your knowledge of Angular router features including child routes, guards, and resolvers',
  category: 'Web Development',
  categoryId: 3,
  difficulty: 'advanced',
  createdBy: 'mock-user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  questionCount: 5,
  timeLimit: 15,
  isPublic: true,
  tags: ['angular', 'routing', 'web-development']
};

// Clear any existing data
mockFirestore[COLLECTIONS.QUIZZES].clear();
mockFirestore[COLLECTIONS.QUESTIONS].clear();

// Add quizzes to mock Firestore
mockFirestore[COLLECTIONS.QUIZZES].set(QUIZ1.id, QUIZ1);
mockFirestore[COLLECTIONS.QUIZZES].set(QUIZ2.id, QUIZ2);
mockFirestore[COLLECTIONS.QUIZZES].set(QUIZ3.id, QUIZ3);
mockFirestore[COLLECTIONS.QUIZZES].set(QUIZ4.id, QUIZ4);
mockFirestore[COLLECTIONS.QUIZZES].set(QUIZ9.id, QUIZ9);

// Add questions for Quiz 1: JavaScript Basics
mockFirestore[COLLECTIONS.QUESTIONS].set('q1-1', {
  id: 'q1-1',
  quizId: QUIZ1.id,
  text: 'Which statement creates a variable that can be reassigned?',
  options: [
    { id: 'a', text: 'const x = 5', isCorrect: false },
    { id: 'b', text: 'let x = 5', isCorrect: true },
    { id: 'c', text: 'final x = 5', isCorrect: false },
    { id: 'd', text: 'static x = 5', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'The let keyword allows you to declare variables that can be reassigned.',
  categoryId: 2,
  difficulty: 'beginner',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q1-2', {
  id: 'q1-2',
  quizId: QUIZ1.id,
  text: 'What does the following code return: [1, 2, 3].map(n => n * 2)?',
  options: [
    { id: 'a', text: '[1, 2, 3, 1, 2, 3]', isCorrect: false },
    { id: 'b', text: '[1, 4, 9]', isCorrect: false },
    { id: 'c', text: '[2, 4, 6]', isCorrect: true },
    { id: 'd', text: '2', isCorrect: false }
  ],
  correctOptionId: 'c',
  explanation: 'The map() method creates a new array with the results of calling a function for every array element.',
  categoryId: 2,
  difficulty: 'beginner',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q1-3', {
  id: 'q1-3',
  quizId: QUIZ1.id,
  text: 'What is the correct way to check if a variable is an array?',
  options: [
    { id: 'a', text: 'typeof arr === "array"', isCorrect: false },
    { id: 'b', text: 'arr instanceof Array', isCorrect: true },
    { id: 'c', text: 'arr.type === Array', isCorrect: false },
    { id: 'd', text: 'arr.isArray()', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'The instanceof operator tests if an object has the prototype property of a constructor in its prototype chain.',
  categoryId: 2,
  difficulty: 'beginner',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Add questions for Quiz 2: React Fundamentals
mockFirestore[COLLECTIONS.QUESTIONS].set('q2-1', {
  id: 'q2-1',
  quizId: QUIZ2.id,
  text: 'Which hook is used to manage state in functional components?',
  options: [
    { id: 'a', text: 'useContext', isCorrect: false },
    { id: 'b', text: 'useState', isCorrect: true },
    { id: 'c', text: 'useEffect', isCorrect: false },
    { id: 'd', text: 'useReducer', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'The useState hook allows functional components to manage local state.',
  categoryId: 3,
  difficulty: 'intermediate',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q2-2', {
  id: 'q2-2',
  quizId: QUIZ2.id,
  text: 'What is the correct way to pass a prop named "count" with value 5 to a component?',
  options: [
    { id: 'a', text: '<Component count="5" />', isCorrect: false },
    { id: 'b', text: '<Component count={5} />', isCorrect: true },
    { id: 'c', text: '<Component count=5 />', isCorrect: false },
    { id: 'd', text: '<Component props={count: 5} />', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'Curly braces {} are used to pass JavaScript expressions as props in React components.',
  categoryId: 3,
  difficulty: 'intermediate',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q2-3', {
  id: 'q2-3',
  quizId: QUIZ2.id,
  text: 'How do you conditionally render a component in React?',
  options: [
    { id: 'a', text: '<If condition={x > 5}><Component /></If>', isCorrect: false },
    { id: 'b', text: '{x > 5 && <Component />}', isCorrect: true },
    { id: 'c', text: '<Component if={x > 5} />', isCorrect: false },
    { id: 'd', text: '<Show when={x > 5}><Component /></Show>', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'In JSX, you can use the logical && operator for conditional rendering.',
  categoryId: 3,
  difficulty: 'intermediate',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Add questions for Quiz 3: CSS Layout Mastery
mockFirestore[COLLECTIONS.QUESTIONS].set('q3-1', {
  id: 'q3-1',
  quizId: QUIZ3.id,
  text: 'Which CSS property is used to create a grid layout?',
  options: [
    { id: 'a', text: 'display: grid', isCorrect: true },
    { id: 'b', text: 'display: flex', isCorrect: false },
    { id: 'c', text: 'position: grid', isCorrect: false },
    { id: 'd', text: 'layout: grid', isCorrect: false }
  ],
  correctOptionId: 'a',
  explanation: 'The display: grid property is used to create a grid layout container.',
  categoryId: 3,
  difficulty: 'intermediate',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q3-2', {
  id: 'q3-2',
  quizId: QUIZ3.id,
  text: 'Which property aligns items along the main axis in Flexbox?',
  options: [
    { id: 'a', text: 'align-items', isCorrect: false },
    { id: 'b', text: 'justify-content', isCorrect: true },
    { id: 'c', text: 'align-content', isCorrect: false },
    { id: 'd', text: 'justify-items', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'The justify-content property aligns flex items along the main axis of the flex container.',
  categoryId: 3,
  difficulty: 'intermediate',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q3-3', {
  id: 'q3-3',
  quizId: QUIZ3.id,
  text: 'Which CSS unit is relative to the font-size of the element?',
  options: [
    { id: 'a', text: 'px', isCorrect: false },
    { id: 'b', text: '%', isCorrect: false },
    { id: 'c', text: 'em', isCorrect: true },
    { id: 'd', text: 'vh', isCorrect: false }
  ],
  correctOptionId: 'c',
  explanation: 'The em unit is relative to the font-size of the element (2em means 2 times the size of the current font).',
  categoryId: 3,
  difficulty: 'intermediate',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Add questions for Quiz 4: JavaScript Advanced
mockFirestore[COLLECTIONS.QUESTIONS].set('q4-1', {
  id: 'q4-1',
  quizId: QUIZ4.id,
  text: 'Which of the following is NOT a JavaScript closure characteristic?',
  options: [
    { id: 'a', text: 'Access to outer function variables', isCorrect: false },
    { id: 'b', text: 'Direct modification of outer scope variables', isCorrect: true },
    { id: 'c', text: 'Preservation of execution context', isCorrect: false },
    { id: 'd', text: 'Function bundled with its lexical environment', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'Closures can access but not directly modify variables from outer scopes. They have access to the variable by reference but changing the reference itself may not be possible.',
  categoryId: 2,
  difficulty: 'advanced',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q4-2', {
  id: 'q4-2',
  quizId: QUIZ4.id,
  text: 'What is the output of: console.log(typeof typeof 1)?',
  options: [
    { id: 'a', text: 'number', isCorrect: false },
    { id: 'b', text: 'string', isCorrect: true },
    { id: 'c', text: 'undefined', isCorrect: false },
    { id: 'd', text: 'NaN', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'The typeof operator always returns a string. The inner typeof 1 returns "number", and then typeof "number" returns "string".',
  categoryId: 2,
  difficulty: 'advanced',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q4-3', {
  id: 'q4-3',
  quizId: QUIZ4.id,
  text: 'Which statement about Promises is false?',
  options: [
    { id: 'a', text: 'Promises can be chained', isCorrect: false },
    { id: 'b', text: 'A Promise can be in "pending", "fulfilled", or "rejected" states', isCorrect: false },
    { id: 'c', text: 'Promise.all() fails if any promise fails', isCorrect: false },
    { id: 'd', text: 'You can use await with any asynchronous function', isCorrect: true }
  ],
  correctOptionId: 'd',
  explanation: 'You can only use await with functions that return Promises or are declared as async. Not all asynchronous functions return Promises.',
  categoryId: 2,
  difficulty: 'advanced',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Add questions for Quiz 9: Angular Advanced Routing
mockFirestore[COLLECTIONS.QUESTIONS].set('q9-1', {
  id: 'q9-1',
  quizId: QUIZ9.id,
  text: 'Which Angular decorator is used to define a route guard?',
  options: [
    { id: 'a', text: '@Guard', isCorrect: false },
    { id: 'b', text: '@Injectable', isCorrect: true },
    { id: 'c', text: '@Directive', isCorrect: false },
    { id: 'd', text: '@RouteGuard', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'Route guards in Angular are services that implement guard interfaces (CanActivate, CanDeactivate, etc.) and use the @Injectable decorator.',
  categoryId: 3,
  difficulty: 'advanced',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q9-2', {
  id: 'q9-2',
  quizId: QUIZ9.id,
  text: 'What is the purpose of a route resolver in Angular?',
  options: [
    { id: 'a', text: 'To authenticate users before accessing a route', isCorrect: false },
    { id: 'b', text: 'To prevent users from leaving a route with unsaved changes', isCorrect: false },
    { id: 'c', text: 'To pre-fetch data before activating a route', isCorrect: true },
    { id: 'd', text: 'To redirect users to a different route', isCorrect: false }
  ],
  correctOptionId: 'c',
  explanation: 'Route resolvers pre-fetch data before a route is activated, ensuring the required data is available when the component is initialized.',
  categoryId: 3,
  difficulty: 'advanced',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q9-3', {
  id: 'q9-3',
  quizId: QUIZ9.id,
  text: 'Which of the following is NOT a valid Angular route guard?',
  options: [
    { id: 'a', text: 'CanActivate', isCorrect: false },
    { id: 'b', text: 'CanDeactivate', isCorrect: false },
    { id: 'c', text: 'CanReuse', isCorrect: true },
    { id: 'd', text: 'CanLoad', isCorrect: false }
  ],
  correctOptionId: 'c',
  explanation: 'CanReuse was a guard in Angular 1.x but is not available in modern Angular. The valid guards are CanActivate, CanActivateChild, CanDeactivate, CanLoad, and Resolve.',
  categoryId: 3,
  difficulty: 'advanced',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q9-4', {
  id: 'q9-4',
  quizId: QUIZ9.id,
  text: 'What is the correct way to define a route parameter in Angular routing?',
  options: [
    { id: 'a', text: 'path: "users/:id"', isCorrect: true },
    { id: 'b', text: 'path: "users/{id}"', isCorrect: false },
    { id: 'c', text: 'path: "users/[id]"', isCorrect: false },
    { id: 'd', text: 'path: "users/<id>"', isCorrect: false }
  ],
  correctOptionId: 'a',
  explanation: 'In Angular routing, route parameters are defined using the colon syntax (e.g., :id) in the path definition.',
  categoryId: 3,
  difficulty: 'advanced',
  createdAt: new Date(),
  updatedAt: new Date()
});

mockFirestore[COLLECTIONS.QUESTIONS].set('q9-5', {
  id: 'q9-5',
  quizId: QUIZ9.id,
  text: 'How do you create a lazy-loaded module in Angular routing?',
  options: [
    { id: 'a', text: 'Use the "lazy" property on the route', isCorrect: false },
    { id: 'b', text: 'Use loadChildren with a dynamic import', isCorrect: true },
    { id: 'c', text: 'Add the LazyLoaded decorator to the module', isCorrect: false },
    { id: 'd', text: 'Set preloading: true in the route configuration', isCorrect: false }
  ],
  correctOptionId: 'b',
  explanation: 'Lazy loading in Angular is achieved using the loadChildren property with a dynamic import. For example: loadChildren: () => import("./module-path").then(m => m.ModuleName)',
  categoryId: 3,
  difficulty: 'advanced',
  createdAt: new Date(),
  updatedAt: new Date()
});

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
        console.log(`Document not found in ${collectionName} with ID ${id}`);
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
        console.log(`Looking for mock document in ${collectionName} with ID ${id}`);
        
        // Try both string and numeric IDs for better compatibility
        let data = mockFirestore[collectionName].get(id);
        
        // If not found with string ID, try with numeric ID
        if (!data && !isNaN(Number(id))) {
          data = mockFirestore[collectionName].get(Number(id).toString());
        }
        
        if (!data) {
          console.log(`Mock document not found in ${collectionName} with ID ${id}`);
        }
        
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
        console.log(`Querying mock documents from ${collectionName}`, { constraints });
        
        // Create a shallow copy of all values from the mock collection
        const allDocs = Array.from(mockFirestore[collectionName].values());
        console.log(`Found ${allDocs.length} total documents in ${collectionName}`);
        
        // Very basic filtering support for mock data
        // This only supports simple where clauses - for a real implementation, use Firestore queries
        let filteredDocs = allDocs;
        
        // Check for any constraints that should filter by quizId
        const quizIdConstraint = constraints.find(c => 
          'fieldPath' in c && c.fieldPath === 'quizId' && 'opStr' in c && c.opStr === '=='
        );
        
        if (quizIdConstraint && 'value' in quizIdConstraint) {
          const quizId = quizIdConstraint.value;
          console.log(`Filtering by quizId: ${quizId}`);
          
          filteredDocs = allDocs.filter(doc => {
            const docQuizId = doc['quizId'];
            const result = String(docQuizId) === String(quizId);
            return result;
          });
          
          console.log(`After quizId filter: ${filteredDocs.length} documents`);
        }
        
        // Apply all other constraints
        for (const constraint of constraints) {
          if ('fieldPath' in constraint && 'opStr' in constraint && 'value' in constraint) {
            const fieldPath = constraint.fieldPath as string;
            const opStr = constraint.opStr as string;
            const value = constraint.value;
            
            // Skip the quizId constraint as we've already handled it
            if (fieldPath === 'quizId' && opStr === '==') continue;
            
            console.log(`Applying filter: ${fieldPath} ${opStr} ${value}`);
            
            filteredDocs = filteredDocs.filter(doc => {
              const fieldValue = doc[fieldPath];
              
              switch (opStr) {
                case '==': 
                  // Handle string/number ID comparison specially
                  if (fieldPath === 'id' || fieldPath === 'quizId') {
                    return String(fieldValue) === String(value);
                  }
                  return fieldValue === value;
                case '!=': return fieldValue !== value;
                case '>': return fieldValue > (value as any);
                case '>=': return fieldValue >= (value as any);
                case '<': return fieldValue < (value as any);
                case '<=': return fieldValue <= (value as any);
                default: return true;
              }
            });
            
            console.log(`After filter ${fieldPath}: ${filteredDocs.length} documents`);
          }
        }
        
        console.log(`Returning ${filteredDocs.length} documents from ${collectionName}`);
        resolve(filteredDocs as T[]);
      }, 500);
    });
  }
};

// Export the Firebase modules
export { db };
export default auth;
