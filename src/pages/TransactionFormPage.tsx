import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactionStore, useDashboardStore } from '@/stores';
import { TransactionCreate } from '@/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/common';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const TransactionFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { categories, loadCategories, createTransaction, updateTransaction, deleteTransaction, isLoading, isSaving, error } =
    useTransactionStore();
  const { refresh } = useDashboardStore();

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    categoryId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter categories by type
  const filteredCategories = categories.filter((cat) => cat.type === formData.type);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId || !formData.amount || !formData.description) {
      return;
    }

    const transaction: TransactionCreate = {
      type: formData.type,
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: new Date(formData.date),
    };

    try {
      if (isEditing) {
        await updateTransaction(id, transaction);
        toast.success('Transacción actualizada exitosamente');
      } else {
        await createTransaction(transaction);
        toast.success('Transacción creada exitosamente');
      }
      await refresh();
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al guardar la transacción');
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('¿Estás seguro que deseas eliminar esta transacción?')) {
      try {
        await deleteTransaction(id);
        toast.success('Transacción eliminada exitosamente');
        await refresh();
        navigate('/dashboard');
      } catch (error) {
        toast.error('Error al eliminar la transacción');
      }
    }
  };

  const handleTypeChange = (value: 'income' | 'expense') => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      categoryId: '', // Reset category when type changes
    }));
  };

  if (isLoading) {
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                {isEditing ? 'Editar Transacción' : 'Nueva Transacción'}
              </h1>
              <p className="text-sm text-gray-600">
                {isEditing ? 'Modifica los detalles de tu transacción' : 'Registra un nuevo ingreso o gasto'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-2">
              <Label>Tipo de Transacción</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === 'income'
                      ? 'border-profit bg-green-50 text-profit font-semibold'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTypeChange('income')}
                >
                  + Ingreso
                </button>
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === 'expense'
                      ? 'border-loss bg-red-50 text-loss font-semibold'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTypeChange('expense')}
                >
                  - Gasto
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Monto (COP)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50000"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                min="0"
                step="1"
                required
                disabled={isSaving}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                required
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.colorHex }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                type="text"
                placeholder="Ej: Almuerzo, Salario, Pago de servicios..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
                disabled={isSaving}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
                disabled={isSaving}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-trust hover:bg-navy-600" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSaving}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} disabled={isSaving}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};
