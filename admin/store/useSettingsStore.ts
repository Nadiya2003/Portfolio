import { create } from "zustand";
import api from "@/lib/api";

interface SettingsState {
  settings: any;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  setSettings: (s: any) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: true,

  fetchSettings: async () => {
    try {
      const res = await api.get("/settings");
      set({ settings: res.data.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  setSettings: (s: any) => set({ settings: s }),
}));
