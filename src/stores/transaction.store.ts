import { create } from 'zustand';
import { Transaction, TransactionCreate, TransactionUpdate, Category } from '@/models';
import { TransactionService, CategoryService } from '@/services';

interface TransactionFormState {
  categories: Category[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  loadCategories: () => Promise<void>;
  createTransaction: (transaction: TransactionCreate) => Promise<Transaction>;
  updateTransaction: (id: string, updates: TransactionUpdate) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionFormState>((set) => ({
  categories: [],
  isLoading: false,
  isSaving: false,
  error: null,

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await CategoryService.getCategories();

      // If no categories exist, create defaults
      if (categories.length === 0) {
        const defaultCategories = await CategoryService.createDefaultCategories();
        set({ categories: defaultCategories, isLoading: false });
      } else {
        set({ categories, isLoading: false });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar categorías';
      set({ error: message, isLoading: false });
    }
  },

  createTransaction: async (transaction: TransactionCreate) => {
    set({ isSaving: true, error: null });
    try {
      const created = await TransactionService.createTransaction(transaction);
      set({ isSaving: false });
      return created;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear transacción';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  updateTransaction: async (id: string, updates: TransactionUpdate) => {
    set({ isSaving: true, error: null });
    try {
      const updated = await TransactionService.updateTransaction(id, updates);
      set({ isSaving: false });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar transacción';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    set({ isSaving: true, error: null });
    try {
      await TransactionService.deleteTransaction(id);
      set({ isSaving: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar transacción';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
