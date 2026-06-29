import { create } from 'zustand';
import { TransactionWithCategory } from '@/models';
import { TransactionService } from '@/services';
import { getStartOfMonth, getEndOfMonth, getPreviousMonth, getNextMonth } from '@/utils/formatters';

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: number;
}

interface DashboardState {
  currentMonth: Date;
  stats: DashboardStats;
  recentTransactions: TransactionWithCategory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadDashboard: () => Promise<void>;
  goToPreviousMonth: () => Promise<void>;
  goToNextMonth: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

const initialStats: DashboardStats = {
  totalBalance: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  monthlySavings: 0,
  savingsRate: 0,
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  currentMonth: new Date(),
  stats: initialStats,
  recentTransactions: [],
  isLoading: false,
  error: null,

  loadDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const { currentMonth } = get();
      const startDate = getStartOfMonth(currentMonth);
      const endDate = getEndOfMonth(currentMonth);

      // Load in parallel
      const [totalBalance, monthlyIncome, monthlyExpenses, recentTransactions] = await Promise.all([
        TransactionService.getTotalBalance(),
        TransactionService.getTotalIncome(startDate, endDate),
        TransactionService.getTotalExpenses(startDate, endDate),
        TransactionService.getTransactionsWithCategory({ limit: 5 }),
      ]);

      const monthlySavings = monthlyIncome - monthlyExpenses;
      const savingsRate = monthlyIncome > 0 ? monthlySavings / monthlyIncome : 0;

      set({
        stats: {
          totalBalance,
          monthlyIncome,
          monthlyExpenses,
          monthlySavings,
          savingsRate,
        },
        recentTransactions,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar el dashboard';
      set({ error: message, isLoading: false });
    }
  },

  goToPreviousMonth: async () => {
    const { currentMonth } = get();
    const previousMonth = getPreviousMonth(currentMonth);
    set({ currentMonth: previousMonth });
    await get().loadDashboard();
  },

  goToNextMonth: async () => {
    const { currentMonth } = get();
    const nextMonth = getNextMonth(currentMonth);
    set({ currentMonth: nextMonth });
    await get().loadDashboard();
  },

  refresh: async () => {
    await get().loadDashboard();
  },

  clearError: () => set({ error: null }),
}));
