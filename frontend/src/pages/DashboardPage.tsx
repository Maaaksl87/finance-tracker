import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
  CardAction,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import SavingPlansList from "@/components/saving-plans/SavingPlansList";

import { useTransactionStats } from "@/hooks/useTransactions";
import { useSavingPlans } from "@/hooks/useSavingPlans";
import StatsCards from "@/components/stats/StatsCards";
import ChartAreaGradient from "@/components/stats/StatsChart";
import ListOfCurrencies from "@/components/currencies/ListOfCurrencies";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import BalanceCard from "@/components/balance/BalanceCard";

export default function DashboardPage() {
  const { stats, transactions, isLoading } = useTransactionStats();
  const { data: plans } = useSavingPlans();
  const user = useAuthStore((state) => state.user);

  /*TODO: переробити ui завантаження компонентів, замінивши на skeleton */
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-4 overflow-hidden text-foreground">
      <div className="flex flex-col min-h-0 col-span-12 gap-4 xl:col-span-9">
        <div className="grid flex-1 min-h-0 grid-cols-12 gap-4">
          <div className="flex flex-col min-h-0 col-span-12 gap-4 md:col-span-5 xl:col-span-4">
            <BalanceCard totalBalance={totalBalance} trendPercentage={20} />
            <Card>
              <CardHeader className="relative z-10">
                <CardTitle>Денний ліміт</CardTitle>
              </CardHeader>

              <CardContent className="relative z-10">
                <p className="text-sm text-foreground-muted">₴2,500.00 з ₴330.00</p>

                <div className="w-full h-2 mt-3 rounded-full bg-limit-bar-track">
                  <div className="w-1/4 h-2 rounded-full bg-limit-bar-fill" />
                </div>
              </CardContent>
            </Card>

            <div className="flex-1 min-h-0">
              <SavingPlansList plans={plans} setSelectedPlanId={() => { }} />
            </div>
          </div>

          <div className="flex flex-col h-full min-h-0 col-span-12 gap-4 md:col-span-7 xl:col-span-8">
            {stats && <StatsCards stats={stats} />}

            <Card>
              <div />

              <CardHeader className="relative z-10">
                <CardTitle>Огляд та грошовий потік</CardTitle>
                <p className="text-2xl font-bold text-primary">
                  ₴{totalBalance.toLocaleString()}
                </p>
              </CardHeader>

              <CardContent className="relative z-10 h-100%">
                <ChartAreaGradient />
              </CardContent>
            </Card>

            <Card className="flex-1 min-h-0 overflow-hidden">
              <div />

              <CardHeader className="relative z-10">
                <CardTitle>Останні транзакції</CardTitle>
              </CardHeader>

              <CardContent className="flex min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto ">
                  <TransactionsTable limit={5} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="min-h-0 col-span-12 space-y-4 xl:col-span-3">
        <Card>
          <div />

          <CardHeader className="relative z-10">
            <CardTitle>Статистика</CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="flex items-center justify-center h-40 text-foreground-muted">
              Діаграма витрат
            </div>
          </CardContent>
        </Card>

        <ListOfCurrencies />
        {/*TODO: доповнити картку з фін. порадами*/}
        <Card>
          <div />

          <CardHeader className="relative z-10">
            <CardTitle>Фінансові поради</CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 space-y-2 text-sm text-foreground-muted">
            <p>💡 Відкладай 20% доходу</p>
            <p>💰 Контролюй витрати щодня</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
