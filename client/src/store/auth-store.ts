import { create } from "zustand";
import { signOut } from "@/lib/firebase";

export interface User {
  id: string;
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

export const useStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    await signOut();
    set({ user: null });
  },
}));
