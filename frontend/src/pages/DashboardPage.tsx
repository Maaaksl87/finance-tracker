import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
} from "@/components/ui/card";
import SavingPlansList from "@/components/saving-plans/SavingPlansList";

import { useTransactionStats } from "@/hooks/useTransactions";
import { useSavingPlans } from "@/hooks/useSavingPlans";
import { useSources } from "@/hooks/useSources";
import StatsCards from "@/components/stats/StatsCards";
import ListOfCurrencies from "@/components/currencies/ListOfCurrencies";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import BalanceCard from "@/components/balance/BalanceCard";
import SourceListItem from "@/components/sources/SourceListItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateSourceDialog } from "@/components/sources/CreateSourceDialog";

export default function DashboardPage() {
  const { stats, isLoading } = useTransactionStats();
  const { data: plans } = useSavingPlans();
  const { data: sources = [] } = useSources();

  /*TODO: переробити ui завантаження компонентів, замінивши на skeleton */
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-4 overflow-hidden text-foreground">
      <div className="grid col-span-12 gap-4 md:grid-cols-12 xl:grid-cols-9 xl:col-span-9 min-h-0">

        <div className="col-span-12 md:col-span-5 xl:col-span-4">
          <BalanceCard totalBalance={totalBalance} />
        </div>

        <div className="flex flex-col gap-4 col-span-12 md:col-span-7 xl:col-span-5">
          {stats && <StatsCards stats={stats} />}

          <Card className="h-full">
            <div />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-baseline gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle>Гаманці</CardTitle>
                  <span className="bg-card-list border-0 border-card-border rounded px-2 py-0.5 text-xs text-foreground-muted font-medium">
                    {sources.length}
                  </span>
                </div>
              </div>
              <CreateSourceDialog
                trigger={
                  <Button variant="outline" >
                    <Plus className="h-4 w-4" /> Додати гаманець
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 max-h-[236px] overflow-y-auto pr-1">
                {sources.length > 0 ? (
                  sources.map((source) => (
                    <SourceListItem key={source._id} source={source} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Немає гаманців. Додайте перший!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 col-span-12 md:col-span-5 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Денний ліміт</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-foreground-muted">₴2,500.00 з ₴330.00</p>

              <div className="w-full h-2 mt-3 rounded-full bg-limit-bar-track">
                <div className="w-1/4 h-2 rounded-full bg-limit-bar-fill" />
              </div>
            </CardContent>
          </Card>

          <SavingPlansList plans={plans} setSelectedPlanId={() => { }} />
        </div>

        <div className="flex flex-col col-span-12 md:col-span-7 xl:col-span-6">
          <Card className="flex-1 min-h-0 overflow-hidden relative">

            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Останні транзакції</CardTitle>
            </CardHeader>

            <CardContent className="flex min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <TransactionsTable limit={10} />
              </div>
            </CardContent>

          </Card>
        </div>

      </div>

      <div className="flex flex-col min-h-0 col-span-12 gap-4 xl:col-span-3">
        <Card>

          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-center h-40 text-foreground-muted">
              Діаграма витрат
            </div>
          </CardContent>

        </Card>

        <ListOfCurrencies />
      </div>
    </div>
  );
}
