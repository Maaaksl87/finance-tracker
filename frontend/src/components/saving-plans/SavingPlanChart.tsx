import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useSavingPlanTransactions } from "@/hooks/useSavingPlans";
import { buildCashFlowData } from "@/lib/charts/buildCashFlowData";

interface SavingPlanChartProps {
  selectedPlanId: string | null;
}

export default function SavingPlanChart({ selectedPlanId }: SavingPlanChartProps) {
  const { data: transactions } = useSavingPlanTransactions(selectedPlanId || "");
  const chartData = buildCashFlowData(transactions || [], "dd.MM");

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-foreground-muted">
        Немає даних для графіка
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--color-secondary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--color-secondary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--color-chart-grid))"
          opacity={0.3}
        />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--color-foreground-muted))"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="hsl(var(--color-foreground-muted))"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `${value.toLocaleString()} ₴`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--color-chart-tooltip-bg))",
            border: "1px solid hsl(var(--color-chart-tooltip-border))",
            borderRadius: "8px",
            color: "hsl(var(--color-foreground))",
          }}
          formatter={(value: number) => `${value.toLocaleString("uk-UA")} ₴`}
          labelFormatter={(label, payload) => {
            if (payload && payload.length > 0) {
              return payload[0].payload.fullDate;
            }
            return label;
          }}
        />
        <Legend
          wrapperStyle={{ color: "hsl(var(--color-foreground-muted))" }}
          formatter={() => "Накопичено"}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="hsl(var(--color-secondary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--color-secondary))", r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
