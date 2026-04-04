import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatsCards = ({
  stats,
}: {
  stats: { totalIncome: number; totalExpense: number };
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Всього доходів</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 font-heading">
            +{stats.totalIncome.toLocaleString()} ₴
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Всього витрат</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 font-heading">
            -{stats.totalExpense.toLocaleString()} ₴
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Чистий потік</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold font-heading ${stats.totalIncome || stats.totalExpense ? (stats.totalIncome - stats.totalExpense >= 0 ? "text-blue-600" : "text-orange-600") : "text-gray-500"}`}
          >
            {(stats.totalIncome || stats.totalExpense
              ? stats.totalIncome - stats.totalExpense
              : 0
            ).toLocaleString()}
            ₴
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
