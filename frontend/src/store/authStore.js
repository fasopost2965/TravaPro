import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("travapro_token", token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem("travapro_token");
        set({ user: null, token: null });
      },
    }),
    { name: "travapro-auth" }
  )
);

export default useAuthStore;
