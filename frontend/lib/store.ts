import { create } from "zustand";
import api from "./api";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchMe: async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      set({ user: data });
    } catch (error) {
      set({ user: null });
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
