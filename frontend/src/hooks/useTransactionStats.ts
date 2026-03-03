import { useEffect, useState } from 'react';
import { getTransactions, getTransactionStats } from '@/api/transactions';
import type { Transaction, TransactionStats } from '@/types';

export function useTransactionStats() {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, transactionsData] = await Promise.all([
          getTransactionStats(),
          getTransactions({ limit: 100 }),
        ]);

        setStats(statsData);
        setTransactions(transactionsData.transactions);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { stats, transactions, isLoading };
}
