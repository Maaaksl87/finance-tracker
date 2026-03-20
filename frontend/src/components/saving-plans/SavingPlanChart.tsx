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
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Немає даних для графіка
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: "12px" }} />
        <YAxis
          stroke="#9ca3af"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `${value.toLocaleString()} ₴`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f3f4f6",
          }}
          formatter={(value: number) => `${value.toLocaleString("uk-UA")} ₴`}
          labelFormatter={(label, payload) => {
            if (payload && payload.length > 0) {
              return payload[0].payload.fullDate;
            }
            return label;
          }}
        />
        <Legend wrapperStyle={{ color: "#9ca3af" }} formatter={() => "Накопичено"} />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
