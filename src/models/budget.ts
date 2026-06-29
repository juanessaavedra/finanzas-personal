/**
 * Budget model for expense tracking and limits
 */
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BudgetCreate {
  categoryId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
}

export interface BudgetUpdate {
  amount?: number;
  spent?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface BudgetWithCategory extends Budget {
  category?: {
    id: string;
    name: string;
    iconName: string;
    colorHex: string;
  };
}
