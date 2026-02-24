import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSources } from "@/api/sources";
import { getTransactionStats } from "@/api/transactions";
import type { Source } from "@/types";
import type { TransactionStats } from "@/types";

export default function DashboardPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sourcesData, statsData] = await Promise.all([
          getSources(),
          getTransactionStats(),
        ]);
        setSources(sourcesData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBalance = sources.reduce((sum, s) => sum + s.balance, 0);

  if (isLoading) {
    return <p className="p-8 text-center text-muted-foreground">Завантаження...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Головна</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Загальний баланс</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalBalance.toLocaleString()} ₴
            </p>
            <p className="text-xs text-muted-foreground">
              {sources.length}{" "}
              {sources.length === 1
                ? "гаманець"
                : sources.length >= 2 && sources.length <= 4
                  ? "гаманці"
                  : "гаманців"}
            </p>
          </CardContent>
        </Card>
        {stats && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Доходи</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  +{stats.totalIncome.toLocaleString()} ₴
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.transactionCounts.income} транзакцій
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Витрати</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  -{stats.totalExpense.toLocaleString()} ₴
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.transactionCounts.expense} транзакцій
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
