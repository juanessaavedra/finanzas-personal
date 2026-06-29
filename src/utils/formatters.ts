import { format, formatDistanceToNow, isToday, isYesterday, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format currency in Colombian Pesos (COP)
 * Example: 50000 -> "$50.000"
 */
export const formatCurrency = (amount: number): string => {
  // Format with dot as thousand separator and no decimals
  const formatted = Math.round(amount).toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `$${formatted}`;
};

/**
 * Format currency with explicit sign (+ or -)
 * Example: 50000 -> "+$50.000"
 *          -50000 -> "-$50.000"
 */
export const formatCurrencyWithSign = (amount: number): string => {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${formatCurrency(amount)}`;
};

/**
 * Format date in Colombian format
 * Example: "23 jun 2024"
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMM yyyy', { locale: es });
};

/**
 * Format date with time
 * Example: "23 jun 2024 14:30"
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMM yyyy HH:mm', { locale: es });
};

/**
 * Format date as relative time in Spanish
 * Examples: "Hoy", "Ayer", "Hace 3 días", "Hace 2 meses"
 */
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return 'Hoy';
  }

  if (isYesterday(dateObj)) {
    return 'Ayer';
  }

  const daysAgo = differenceInDays(new Date(), dateObj);

  if (daysAgo <= 7) {
    return `Hace ${daysAgo} día${daysAgo !== 1 ? 's' : ''}`;
  }

  // For older dates, use "Hace X tiempo"
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: es
  });
};

/**
 * Format month and year
 * Example: "Junio 2024"
 */
export const formatMonthYear = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM yyyy', { locale: es });
};

/**
 * Format short month and year
 * Example: "Jun 2024"
 */
export const formatShortMonthYear = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM yyyy', { locale: es });
};

/**
 * Parse Colombian currency string to number
 * Example: "$50.000" -> 50000
 */
export const parseCurrency = (value: string): number => {
  // Remove $ sign, dots, and spaces
  const cleaned = value.replace(/[$.\s]/g, '');
  return parseInt(cleaned, 10) || 0;
};

/**
 * Format percentage
 * Example: 0.25 -> "25%"
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

/**
 * Format large numbers with K, M suffixes
 * Example: 1500 -> "1.5K", 1500000 -> "1.5M"
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Get start of month
 */
export const getStartOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get end of month
 */
export const getEndOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Get previous month
 */
export const getPreviousMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

/**
 * Get next month
 */
export const getNextMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
};
