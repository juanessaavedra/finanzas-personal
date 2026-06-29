/**
 * Transaction model representing income or expense
 */
export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TransactionCreate {
  categoryId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date?: Date;
}

export interface TransactionUpdate {
  categoryId?: string;
  type?: 'income' | 'expense';
  amount?: number;
  description?: string;
  date?: Date;
}

export interface TransactionWithCategory extends Transaction {
  category?: {
    id: string;
    name: string;
    iconName: string;
    colorHex: string;
    type: 'income' | 'expense';
  };
}
