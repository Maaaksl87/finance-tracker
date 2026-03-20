import { useMemo } from "react";
import { TransactionType } from "@/types";
import type { Transaction } from "@/types";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

interface ChartDataPoint {
  date: string;
  fullDate: string;
  balance: number;
  amount: number;
  type: TransactionType;
}

export function buildCashFlowData(
  transactions: Transaction[],
  dateFormat: string,
): ChartDataPoint[] {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    // Сортуємо транзакції від найстарішої до найновішої для коректного розрахунку балансу
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let currentBalance = 0;

    return sorted.map((t) => {
      const amount = t.amount;
      const isExpense = t.type === TransactionType.EXPENSE;
      const isIncome = t.type === TransactionType.INCOME;

      if (isIncome) currentBalance += amount;
      if (isExpense) currentBalance -= amount;

      return {
        date: format(new Date(t.date), dateFormat),
        fullDate: format(new Date(t.date), "d MMMM yyyy", { locale: uk }),
        balance: currentBalance,
        amount: isExpense ? -amount : amount,
        type: t.type,
      };
    });
  }, [transactions, dateFormat]);
}
