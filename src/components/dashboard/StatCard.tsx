import { Card } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  type?: 'profit' | 'loss' | 'neutral';
  percentage?: number;
  subtitle?: string;
}

export const StatCard = ({
  title,
  amount,
  icon: Icon,
  type = 'neutral',
  percentage,
  subtitle
}: StatCardProps) => {
  const colorClasses = {
    profit: 'text-profit border-profit',
    loss: 'text-loss border-loss',
    neutral: 'text-trust border-trust',
  };

  return (
    <Card className={cn(
      "p-6 border-l-4 transition-all hover:shadow-md",
      type === 'profit' && 'border-profit',
      type === 'loss' && 'border-loss',
      type === 'neutral' && 'border-trust'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
          <h3 className={cn(
            "text-2xl font-bold mb-1",
            colorClasses[type].split(' ')[0]
          )}>
            {formatCurrency(amount)}
          </h3>
          {percentage !== undefined && (
            <p className="text-sm text-gray-500">
              {subtitle || `${formatPercentage(percentage)} del ingreso`}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          type === 'profit' && 'bg-green-50',
          type === 'loss' && 'bg-red-50',
          type === 'neutral' && 'bg-blue-50'
        )}>
          <Icon className={cn("w-6 h-6", colorClasses[type].split(' ')[0])} />
        </div>
      </div>
    </Card>
  );
};
