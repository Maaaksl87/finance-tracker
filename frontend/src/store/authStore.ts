import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;

  setToken: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuth: false,

      setToken: (token, user) =>
        set({ token: token, user: user, isAuth: true }),

      logout: () => {
        // При виході чистимо все
        localStorage.removeItem("token");
        set({ token: null, user: null, isAuth: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
