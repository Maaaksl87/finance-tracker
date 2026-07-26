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

function buildTodayPoint(dateFormat: string, balance: number): ChartDataPoint {
  const today = new Date();
  return {
    date: format(today, dateFormat),
    fullDate: format(today, "d MMMM yyyy", { locale: uk }),
    balance,
    amount: 0,
    type: TransactionType.INCOME,
  };
}

export function buildCashFlowData(
  transactions: Transaction[],
  dateFormat: string,
  actualBalance?: number,
): ChartDataPoint[] {
  if (!transactions || transactions.length === 0) {
    return actualBalance === undefined ? [] : [buildTodayPoint(dateFormat, actualBalance)];
  }
  // Сортуємо транзакції від найстарішої до найновішої для коректного розрахунку балансу
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let currentBalance = 0;
  const dailyData: Record<string, ChartDataPoint> = {};

  sorted.forEach((t) => {
    const amount = t.amount;
    const isExpense = t.type === TransactionType.EXPENSE;
    const isIncome = t.type === TransactionType.INCOME;

    if (isIncome) currentBalance += amount;
    if (isExpense) currentBalance -= amount;

    const dateKey = format(new Date(t.date), dateFormat);

    dailyData[dateKey] = {
      date: dateKey,
      fullDate: format(new Date(t.date), "d MMMM yyyy", { locale: uk }),
      balance: currentBalance,
      amount: isExpense ? -amount : amount,
      type: t.type,
    };
  });

  const points = Object.values(dailyData);

  if (actualBalance === undefined) return points;

  const todayPoint = buildTodayPoint(dateFormat, actualBalance);
  const lastPoint = points[points.length - 1];
  if (lastPoint.date === todayPoint.date) {
    return [...points.slice(0, -1), { ...lastPoint, balance: actualBalance }];
  }

  return [...points, todayPoint];
}
