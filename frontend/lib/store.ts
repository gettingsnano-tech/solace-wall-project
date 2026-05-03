import { create } from "zustand";
import api from "./api";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_verified: boolean;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchMe: async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      set({ user: data });
      return data;
    } catch (error) {
      set({ user: null });
      return null;
    }
  },
  logout: async () => {
    try {
      await api.post("/api/auth/logout");
      set({ user: null });
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));
