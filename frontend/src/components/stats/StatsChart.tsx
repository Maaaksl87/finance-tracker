import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { buildCashFlowData } from "@/lib/charts/buildCashFlowData";
import { useTransactionStats } from "@/hooks/useTransactionStats";
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

export default function ChartAreaGradient() {
  const { transactions } = useTransactionStats();
  const chartData = useMemo(
    () => buildCashFlowData(transactions, "dd.MM"),
    [transactions],
  );
  const formatYAxis = (value: number) => (value === 0 ? "0" : `${value / 1000}к ₴`);

  return (
    <div className="w-full h-auto">
      {/*TODO: змінити висоту графіка використовуючі плаваючі величини: aspect-[16/9] і так далі */}
      <ChartContainer config={chartConfig} className="h-[150px] w-full aspect-video">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 0, right: 5, bottom: 0, top: 0 }}
        >
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            stroke="hsl(var(--foreground-muted))"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatYAxis}
            stroke="hsl(var(--foreground-muted))"
            style={{ fontSize: "12px" }}
          />
          <ChartTooltip
            cursor={true}
            content={
              <ChartTooltipContent
                className="border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)]"
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
              <stop offset="5%" stopColor="var(--chart-income)" stopOpacity={0.6} />
              <stop offset="85%" stopColor="var(--chart-income)" stopOpacity={0} />
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
    </div>
  );
}
