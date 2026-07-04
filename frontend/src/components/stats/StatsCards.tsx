import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatsCards = ({
  stats,
}: {
  stats: { totalIncome: number; totalExpense: number };
}) => {
  return (
    <div className="flex w-full gap-3">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Всього доходів</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-stats-positive font-heading">
            +{stats.totalIncome.toLocaleString()} ₴
          </div>
        </CardContent>
      </Card >
      <Card className="flex-1">
        <CardHeader>
          <CardTitle >Всього витрат</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-stats-negative font-heading">
            -{stats.totalExpense.toLocaleString()} ₴
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
