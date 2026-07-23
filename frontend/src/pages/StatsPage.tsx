import ChartAreaGradient from "@/components/stats/StatsChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTransactionStats } from "@/hooks/useTransactions";
import StatsCards from "@/components/stats/StatsCards";
import { CategoryStatsCard } from "@/components/stats/CategoryStatsCard";

import { FinancialCalendar } from "@/components/calendar/FinancialCalendar";

function StatsPage() {
  const { stats, isLoading } = useTransactionStats();

  if (isLoading)
    return (
      <p className="p-8 text-center text-muted-foreground">Завантаження аналітики...</p>
    );
  if (!stats) return <p className="p-8 text-center text-muted-foreground">Немає даних</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Аналітика</h1>
      <StatsCards stats={stats} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <ChartAreaGradient />
        </Card>

        <CategoryStatsCard />
        <Card>
          <CardHeader>
            <CardTitle>Календар</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialCalendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StatsPage;
