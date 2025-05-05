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
 * Get the currently signed-in user
 * @returns User or null if no user is signed in
 */
export const getCurrentUser = (): User | null => {
  if (!hasMockCredentials) {
    // REAL IMPLEMENTATION
    return auth.currentUser;
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

export default auth;
