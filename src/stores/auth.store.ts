import { create } from 'zustand';
import { User } from '@/models';
import { AuthService } from '@/services';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.signIn(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      set({ error: message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await AuthService.signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cerrar sesión';
      set({ error: message, isLoading: false });
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const user = await AuthService.getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });

      // Listen to auth changes
      AuthService.onAuthStateChange((user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
