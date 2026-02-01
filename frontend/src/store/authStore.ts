import { create } from "zustand";
import { api } from "../api/axios";

interface AuthStore {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("token"),

  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });
    // console.log(res);
    

    const token = res.data.token;

    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
}));
