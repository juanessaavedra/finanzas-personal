/**
 * Category model for income/expense classification
 */
export interface Category {
  id: string;
  userId: string;
  name: string;
  iconName: string;
  colorHex: string;
  type: 'income' | 'expense';
  createdAt: Date;
}

export interface CategoryCreate {
  name: string;
  iconName: string;
  colorHex: string;
  type: 'income' | 'expense';
}

export interface CategoryUpdate {
  name?: string;
  iconName?: string;
  colorHex?: string;
}
