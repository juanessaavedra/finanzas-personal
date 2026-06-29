import { supabase } from './supabase';
import {
  Transaction,
  TransactionCreate,
  TransactionUpdate,
  TransactionWithCategory,
} from '@/models';

/**
 * Transaction service for managing income and expenses
 */
export class TransactionService {
  /**
   * Get all transactions for current user with optional filters
   */
  static async getTransactions(params?: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
    type?: 'income' | 'expense';
    limit?: number;
  }): Promise<Transaction[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (params?.startDate) {
      query = query.gte('date', params.startDate.toISOString());
    }

    if (params?.endDate) {
      query = query.lte('date', params.endDate.toISOString());
    }

    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }

    if (params?.type) {
      query = query.eq('type', params.type);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al obtener transacciones: ${error.message}`);
    }

    return (data || []).map((t) => ({
      id: t.id,
      userId: t.user_id,
      categoryId: t.category_id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      date: new Date(t.date),
      createdAt: new Date(t.created_at),
      updatedAt: t.updated_at ? new Date(t.updated_at) : undefined,
    }));
  }

  /**
   * Get transactions with category information
   */
  static async getTransactionsWithCategory(params?: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
    type?: 'income' | 'expense';
    limit?: number;
  }): Promise<TransactionWithCategory[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    let query = supabase
      .from('transactions')
      .select(
        `
        *,
        categories (
          id,
          name,
          icon_name,
          color_hex,
          type
        )
      `
      )
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (params?.startDate) {
      query = query.gte('date', params.startDate.toISOString());
    }

    if (params?.endDate) {
      query = query.lte('date', params.endDate.toISOString());
    }

    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }

    if (params?.type) {
      query = query.eq('type', params.type);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al obtener transacciones: ${error.message}`);
    }

    return (data || []).map((t) => ({
      id: t.id,
      userId: t.user_id,
      categoryId: t.category_id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      date: new Date(t.date),
      createdAt: new Date(t.created_at),
      updatedAt: t.updated_at ? new Date(t.updated_at) : undefined,
      category: t.categories
        ? {
            id: t.categories.id,
            name: t.categories.name,
            iconName: t.categories.icon_name,
            colorHex: t.categories.color_hex,
            type: t.categories.type,
          }
        : undefined,
    }));
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      categoryId: data.category_id,
      type: data.type,
      amount: Number(data.amount),
      description: data.description,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }

  /**
   * Create new transaction
   */
  static async createTransaction(
    transaction: TransactionCreate
  ): Promise<Transaction> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        category_id: transaction.categoryId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: (transaction.date || new Date()).toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear transacción: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      categoryId: data.category_id,
      type: data.type,
      amount: Number(data.amount),
      description: data.description,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }

  /**
   * Update transaction
   */
  static async updateTransaction(
    id: string,
    updates: TransactionUpdate
  ): Promise<Transaction> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.categoryId) updateData.category_id = updates.categoryId;
    if (updates.type) updateData.type = updates.type;
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.description) updateData.description = updates.description;
    if (updates.date) updateData.date = updates.date.toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar transacción: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      categoryId: data.category_id,
      type: data.type,
      amount: Number(data.amount),
      description: data.description,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }

  /**
   * Delete transaction
   */
  static async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase.from('transactions').delete().eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar transacción: ${error.message}`);
    }
  }

  /**
   * Get total income for a period
   */
  static async getTotalIncome(startDate: Date, endDate: Date): Promise<number> {
    const transactions = await this.getTransactions({
      startDate,
      endDate,
      type: 'income',
    });

    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get total expenses for a period
   */
  static async getTotalExpenses(startDate: Date, endDate: Date): Promise<number> {
    const transactions = await this.getTransactions({
      startDate,
      endDate,
      type: 'expense',
    });

    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get balance (income - expenses)
   */
  static async getBalance(startDate: Date, endDate: Date): Promise<number> {
    const income = await this.getTotalIncome(startDate, endDate);
    const expenses = await this.getTotalExpenses(startDate, endDate);
    return income - expenses;
  }

  /**
   * Get total balance (all time)
   */
  static async getTotalBalance(): Promise<number> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Get all transactions
    const { data: incomeData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'income');

    const { data: expenseData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'expense');

    const totalIncome =
      incomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const totalExpenses =
      expenseData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return totalIncome - totalExpenses;
  }

  /**
   * Get expenses by category for a period
   */
  static async getExpensesByCategory(
    startDate: Date,
    endDate: Date
  ): Promise<Map<string, number>> {
    const transactions = await this.getTransactions({
      startDate,
      endDate,
      type: 'expense',
    });

    const expensesByCategory = new Map<string, number>();
    transactions.forEach((t) => {
      const current = expensesByCategory.get(t.categoryId) || 0;
      expensesByCategory.set(t.categoryId, current + t.amount);
    });

    return expensesByCategory;
  }
}
