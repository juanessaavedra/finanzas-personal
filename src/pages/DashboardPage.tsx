import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore, useAuthStore } from '@/stores';
import { BalanceCard, StatCard, TransactionListItem } from '@/components/dashboard';
import { EmptyState, LoadingSpinner, ErrorMessage } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { formatMonthYear } from '@/utils/formatters';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const {
    currentMonth,
    stats,
    recentTransactions,
    isLoading,
    error,
    loadDashboard,
    goToPreviousMonth,
    goToNextMonth,
  } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      await signOut();
      navigate('/login');
    }
  };

  const handleAddTransaction = () => {
    navigate('/transactions/new');
  };

  const handleTransactionClick = (id: string) => {
    navigate(`/transactions/${id}`);
  };

  if (isLoading && recentTransactions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                💰 Finanzas Personales
              </h1>
              <p className="text-sm text-gray-600">
                Panel de control financiero
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <ErrorMessage message={error} onRetry={loadDashboard} />
        ) : (
          <>
            {/* Balance Card */}
            <div className="mb-8">
              <BalanceCard balance={stats.totalBalance} />
            </div>

            {/* Month Navigator */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {formatMonthYear(currentMonth)}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextMonth}
                  disabled={isLoading}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Ingresos del Mes"
                amount={stats.monthlyIncome}
                icon={TrendingUp}
                type="profit"
              />
              <StatCard
                title="Gastos del Mes"
                amount={stats.monthlyExpenses}
                icon={TrendingDown}
                type="loss"
              />
              <StatCard
                title="Ahorro del Mes"
                amount={stats.monthlySavings}
                icon={PiggyBank}
                type={stats.monthlySavings >= 0 ? 'profit' : 'loss'}
                percentage={stats.savingsRate}
                subtitle={`Tasa de ahorro: ${Math.round(stats.savingsRate * 100)}%`}
              />
            </div>

            <Separator className="my-8" />

            {/* Recent Transactions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Transacciones Recientes
                </h2>
                <Button onClick={handleAddTransaction} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva
                </Button>
              </div>

              {recentTransactions.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="No hay transacciones"
                  description="Agrega tu primera transacción para comenzar a rastrear tus finanzas"
                  action={{
                    label: 'Agregar Transacción',
                    onClick: handleAddTransaction,
                  }}
                />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                  {recentTransactions.map((transaction) => (
                    <TransactionListItem
                      key={transaction.id}
                      transaction={transaction}
                      onClick={() => handleTransactionClick(transaction.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={handleAddTransaction}
        className="fixed bottom-6 right-6 w-14 h-14 bg-trust hover:bg-navy-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        title="Nueva transacción"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
