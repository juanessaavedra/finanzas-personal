import { supabase } from './supabase';
import { Category, CategoryCreate, CategoryUpdate } from '@/models';

/**
 * Category service for managing income/expense categories
 */
export class CategoryService {
  /**
   * Get all categories for current user
   */
  static async getCategories(type?: 'income' | 'expense'): Promise<Category[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    let query = supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }

    return (data || []).map((cat) => ({
      id: cat.id,
      userId: cat.user_id,
      name: cat.name,
      iconName: cat.icon_name,
      colorHex: cat.color_hex,
      type: cat.type,
      createdAt: new Date(cat.created_at),
    }));
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      iconName: data.icon_name,
      colorHex: data.color_hex,
      type: data.type,
      createdAt: new Date(data.created_at),
    };
  }

  /**
   * Create new category
   */
  static async createCategory(category: CategoryCreate): Promise<Category> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: category.name,
        icon_name: category.iconName,
        color_hex: category.colorHex,
        type: category.type,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear categoría: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      iconName: data.icon_name,
      colorHex: data.color_hex,
      type: data.type,
      createdAt: new Date(data.created_at),
    };
  }

  /**
   * Update category
   */
  static async updateCategory(
    id: string,
    updates: CategoryUpdate
  ): Promise<Category> {
    const updateData: Record<string, unknown> = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.iconName) updateData.icon_name = updates.iconName;
    if (updates.colorHex) updateData.color_hex = updates.colorHex;

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar categoría: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      iconName: data.icon_name,
      colorHex: data.color_hex,
      type: data.type,
      createdAt: new Date(data.created_at),
    };
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar categoría: ${error.message}`);
    }
  }

  /**
   * Get default categories for a new user
   */
  static getDefaultCategories(): CategoryCreate[] {
    return [
      // Expense categories
      { name: 'Alimentación', iconName: 'restaurant', colorHex: '#EF4444', type: 'expense' },
      { name: 'Transporte', iconName: 'directions_car', colorHex: '#F97316', type: 'expense' },
      { name: 'Vivienda', iconName: 'home', colorHex: '#F59E0B', type: 'expense' },
      { name: 'Compras', iconName: 'shopping_cart', colorHex: '#3B82F6', type: 'expense' },
      { name: 'Salud', iconName: 'local_hospital', colorHex: '#10B981', type: 'expense' },
      { name: 'Educación', iconName: 'school', colorHex: '#6366F1', type: 'expense' },
      { name: 'Entretenimiento', iconName: 'sports_esports', colorHex: '#8B5CF6', type: 'expense' },
      { name: 'Viajes', iconName: 'flight', colorHex: '#06B6D4', type: 'expense' },
      // Income categories
      { name: 'Salario', iconName: 'attach_money', colorHex: '#22C55E', type: 'income' },
      { name: 'Freelance', iconName: 'work', colorHex: '#10B981', type: 'income' },
      { name: 'Inversiones', iconName: 'trending_up', colorHex: '#14B8A6', type: 'income' },
      { name: 'Otros ingresos', iconName: 'card_giftcard', colorHex: '#22C55E', type: 'income' },
    ];
  }

  /**
   * Create default categories for user
   */
  static async createDefaultCategories(): Promise<Category[]> {
    const defaults = this.getDefaultCategories();
    const categories: Category[] = [];

    for (const category of defaults) {
      try {
        const created = await this.createCategory(category);
        categories.push(created);
      } catch (error) {
        console.error('Error creating default category:', error);
      }
    }

    return categories;
  }
}
