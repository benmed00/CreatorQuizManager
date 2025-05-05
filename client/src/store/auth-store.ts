import { create } from "zustand";
import { signOut } from "@/lib/firebase";

export interface User {
  id: string;
  uid?: string; // Alias for id, to match Firebase User interface
  email: string;
  displayName: string;
  photoURL?: string | null;
  username?: string; // Add optional username field
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

// Utility function to ensure user has both id and uid properties
const syncUserIdProperties = (user: User | null): User | null => {
  if (!user) return null;
  
  return {
    ...user,
    // Ensure both id and uid properties are set
    id: user.id || user.uid || '',
    uid: user.uid || user.id || '',
  };
};

export const useStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user: syncUserIdProperties(user) }),
  logout: async () => {
    await signOut();
    set({ user: null });
  },
}));
