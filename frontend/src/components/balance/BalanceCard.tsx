import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import ActionButtons from "@/components/ui/ActionButtons";
import ChartAreaGradient from '@/components/stats/StatsChart'

interface BalanceCardProps {
  totalBalance: number;
}

export default function BalanceCard({ totalBalance }: BalanceCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Баланс</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <p className="text-4xl font-bold ">
            {totalBalance.toLocaleString()} ₴
          </p>
        </div>
        <div className="mt-5 mb-4 flex-1 min-h-0">
          <ChartAreaGradient className="w-full h-full aspect-auto" />
        </div>

        <ActionButtons />
      </CardContent>
    </Card>
  );
}
