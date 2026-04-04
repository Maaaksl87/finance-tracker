import ChartAreaGradient from "@/components/stats/StatsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactionStats } from "@/hooks/useTransactionStats";
import StatsCards from "@/components/stats/StatsCards";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";

const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

function StatsPage() {
  const { stats, transactions, isLoading } = useTransactionStats();

  const pieChartData = stats
    ? [
        { name: "Доходи", value: stats.totalIncome },
        { name: "Витрати", value: stats.totalExpense },
      ].filter((item) => item.value > 0)
    : [];

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

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Структура</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => `${value.toLocaleString()} ₴`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Немає даних
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StatsPage;
