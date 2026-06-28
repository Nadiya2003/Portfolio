import { create } from "zustand";
import api from "@/lib/api";

interface Admin {
  _id: string;
  name: string;
  email: string;
  profilePhoto: string;
  role: string;
  lastLogin: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  setAdmin: (admin: Admin) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: typeof window !== "undefined" && localStorage.getItem("admin_user") ? (() => { try { return JSON.parse(localStorage.getItem("admin_user") as string); } catch { return null; } })() : null,
  token: typeof window !== "undefined" ? localStorage.getItem("admin_token") : null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    const res = await api.post("/auth/login", { email, password });
    const { token, admin } = res.data;
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(admin));
    set({ token, admin, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    set({ token: null, admin: null });
  },

  fetchMe: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ admin: res.data.admin });
      localStorage.setItem("admin_user", JSON.stringify(res.data.admin));
    } catch (error: any) {
      if (error.response?.status === 401) {
        set({ token: null, admin: null });
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
  },

  setAdmin: (admin) => set({ admin }),
}));
