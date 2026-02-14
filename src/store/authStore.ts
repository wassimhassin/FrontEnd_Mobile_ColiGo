import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "../types";
import { STORAGE_KEYS } from "../constants";
import { authService } from "../services";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    const result = await authService.login(email, password);

    if (result.success && result.user) {
      set({
        user: result.user,
        token: null, // Backend uses sessions, not tokens
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } else {
      set({ isLoading: false, error: result.message || "Erreur de connexion" });
      return false;
    }
  },

  // Register
  register: async (data) => {
    set({ isLoading: true, error: null });

    const result = await authService.register(data);

    // Don't set authenticated - user needs to verify email first
    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.message || "Erreur d'inscription" });
    }

    return result.success;
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  // Forgot Password
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });

    const result = await authService.forgotPassword(email);

    set({ isLoading: false });

    if (!result.success) {
      set({ error: result.error || "Erreur lors de l'envoi" });
    }

    return result.success;
  },

  // Check authentication on app start
  checkAuth: async () => {
    set({ isLoading: true });

    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        const user = JSON.parse(userData);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
