import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

export const BalanceCard = ({ balance }: BalanceCardProps) => {
  const isPositive = balance >= 0;

  return (
    <Card className="balance-card text-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90 mb-1">Balance Total</p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-2">
            {formatCurrency(balance)}
          </h2>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-profit" />
            ) : (
              <TrendingDown className="w-4 h-4 text-loss" />
            )}
            <span className="text-sm font-semibold">
              {isPositive ? 'Saldo positivo' : 'Saldo negativo'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
