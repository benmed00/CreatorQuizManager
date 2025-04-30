import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
