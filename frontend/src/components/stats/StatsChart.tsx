import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import { buildCashFlowData } from "@/lib/charts/buildCashFlowData";
import { useTransactions } from "@/hooks/useTransactions";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMemo } from "react";

const chartConfig = {
  balance: {
    label: "Баланс",
    color: "var(--chart-balance)",
  },
  income: {
    label: "Доходи",
    color: "var(--chart-balance)",
  },
  expense: {
    label: "Витрати",
    color: "var(--chart-expense-line)",
  },
} satisfies ChartConfig;

export default function ChartAreaGradient({ className = "w-full aspect-video" }: { className?: string }) {
  const { transactions } = useTransactions();
  const chartData = useMemo(
    () => buildCashFlowData(transactions, "dd.MM"),
    [transactions],
  );
  const formatYAxis = (value: number) => (value === 0 ? "0" : `${Math.round(value / 1000)}к`);


  return (
    <ChartContainer config={chartConfig} className={className}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: -3, right: 0, bottom: 0, top: 5 }}
      >
        <CartesianGrid vertical={false} stroke="#4e4e4eff"
          opacity={0.3} strokeDasharray="5 5 1 5" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          stroke="var(--muted)"
          style={{ fontSize: "10px" }}
        />
        <YAxis
          width={30}
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          tickFormatter={formatYAxis}
          tickCount={6}
          stroke="var(--muted)"
          style={{ fontSize: "10px" }}

          domain={['dataMin - 5000', 'dataMax + 5000']}
        />
        <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3 3 3" />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload.fullDate;
                }
                return label;
              }}
              formatter={(value) => {
                if (typeof value === "number") {
                  return `${value.toLocaleString("uk-UA")} ₴`;
                }
                return "";
              }}
            />
          }
        />
        <defs>
          <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-income)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--chart-income)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="balance"
          type="natural"
          fill="url(#fillBalance)"
          fillOpacity={1}
          stroke="var(--chart-income)"
          strokeWidth={1.5}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
