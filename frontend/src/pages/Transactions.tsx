import { useEffect, useState, useCallback } from 'react';
import type { Transaction } from '@/types';
import { getTransactions, deleteTransaction } from '@/api/transactions';
import { TestCreateTransactionDialog } from '@/components/transactions/TestCreateTransactionDialog';
import TestTransactionsTable from '@/components/transactions/TestTransactionsTable';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Функція завантаження даних
  const fetchData = async () => {
    try {
      // За замовчуванням беремо першу сторінку, останні 20 записів
      const { transactions: data } = await getTransactions({ limit: 20 });
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Завантажуємо при старті
  useEffect(() => {
    fetchData();
  }, []);

  // Видалення
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей запис?')) return;

    // Оптимістичне оновлення інтерфейсу
    setTransactions((prev) => prev.filter((t) => t._id !== id));

    try {
      await deleteTransaction(id);
      // Можна викликати fetchData(), щоб переконатися, що баланси на бекенді оновилися
      // Але поки що залишимо так для швидкості
    } catch (error) {
      console.error('Failed to delete', error);
      alert('Помилка видалення');
      fetchData(); // Відкат змін
    }
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Історія транзакцій</h1>
        {/* Передаємо fetchData, щоб після створення таблиця оновилась */}
        <TestCreateTransactionDialog onSuccess={fetchData} />
      </div>

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        // 👇 Вставляємо нашу таблицю
        <TestTransactionsTable data={transactions} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default TransactionsPage;
