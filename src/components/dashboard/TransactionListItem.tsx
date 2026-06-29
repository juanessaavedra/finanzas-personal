import { TransactionWithCategory } from '@/models';
import { formatCurrency, formatRelativeDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import {
  ShoppingCart,
  Home,
  Car,
  Utensils,
  DollarSign,
  TrendingUp,
  LucideIcon
} from 'lucide-react';

interface TransactionListItemProps {
  transaction: TransactionWithCategory;
  onClick?: () => void;
}

// Map of icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  'shopping_cart': ShoppingCart,
  'home': Home,
  'directions_car': Car,
  'restaurant': Utensils,
  'attach_money': DollarSign,
  'trending_up': TrendingUp,
};

export const TransactionListItem = ({ transaction, onClick }: TransactionListItemProps) => {
  const isIncome = transaction.type === 'income';
  const Icon = iconMap[transaction.category?.iconName || 'shopping_cart'] || ShoppingCart;
  const categoryColor = transaction.category?.colorHex || '#6B7280';

  return (
    <div
      className="transaction-item group"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          className="p-2.5 rounded-lg transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: categoryColor }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {transaction.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="truncate">{transaction.category?.name}</span>
            <span>•</span>
            <span>{formatRelativeDate(transaction.date)}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          "font-bold text-lg",
          isIncome ? "text-profit" : "text-loss"
        )}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
};
