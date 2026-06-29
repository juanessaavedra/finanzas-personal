/**
 * Application Constants
 */

export const APP_NAME = 'Finanzas Personales';
export const APP_VERSION = '2.0.0';

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Security
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Pagination
export const DEFAULT_PAGE_SIZE = 100;
export const RECENT_TRANSACTIONS_LIMIT = 5;

// Currency
export const DEFAULT_CURRENCY = 'COP';
export const CURRENCY_SYMBOL = '$';

// Date formats
export const DATE_FORMAT = 'dd MMM yyyy';
export const DATE_TIME_FORMAT = 'dd MMM yyyy HH:mm';

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

// Category icons (Material Icons names)
export const CATEGORY_ICONS = [
  'restaurant',
  'directions_car',
  'home',
  'shopping_cart',
  'local_hospital',
  'school',
  'sports_esports',
  'flight',
  'attach_money',
  'work',
  'card_giftcard',
  'fitness_center',
] as const;

// Category colors
export const CATEGORY_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#EC4899', // Pink
] as const;
