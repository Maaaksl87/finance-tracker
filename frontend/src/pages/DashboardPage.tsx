import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { PlusCircle, ArrowRightLeft, Sparkles, PiggyBank } from "lucide-react";
import SavingPlansList from "@/components/saving-plans/SavingPlansList";

import { useTransactionStats } from "@/hooks/useTransactionStats";
import { useSavingPlans } from "@/hooks/useSavingPlans";
import StatsCards from "@/components/stats/StatsCards";
import ChartAreaGradient from "@/components/stats/StatsChart";

export default function DashboardPage() {
  const { stats, transactions, isLoading } = useTransactionStats();
  const { data: plans } = useSavingPlans();
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;

  return (
    <div className="grid h-full min-h-0 grid-cols-12 gap-4">
      {/* ===== Left area (9 cols) ===== */}
      <div className="h-full min-h-0 col-span-12 space-y-4 xl:col-span-9">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground">
              {/*TODO: при переході на інший аккаунт показує імя старого аккаунта, виправити це */}
              Вітаю, {user?.name || "користувач"}!
            </h1>
            <p className="text-sm text-foreground-muted">
              Контролюй свої фінанси для фінансового здоров'я.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Загальний баланс:</p>
            <p className="text-3xl font-bold font-heading">
              {(totalIncome - totalExpense).toLocaleString()} ₴
            </p>
          </div>
        </div>

        <div className="grid h-full min-h-0 grid-cols-12 gap-4">
          <div className="flex flex-col h-full min-h-0 col-span-12 space-y-4 md:col-span-5 xl:col-span-4">
            <Card className="mb-0 rounded-b-none bg-card">
              <CardHeader>
                <CardTitle className="font-heading">Баланс аккаунта</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-4xl font-bold tracking-tight">
                  {(totalIncome - totalExpense).toLocaleString()} ₴
                </p>
              </CardContent>
            </Card>
            <Card className="mt-0 border-t-0 rounded-t-none [mask-image:linear-gradient(to_top,black_90%,transparent)]">
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-xs text-center text-foreground-muted">
                  <div className="flex flex-col items-center gap-1">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-icon-bg hover:bg-card-hover">
                      <PlusCircle className="w-10 h-10 rounded-full bg-icon-bg text-icon-fg" />
                    </button>
                    <span>Поповнити</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRightLeft className="w-10 h-10 rounded-full bg-icon-bg text-icon-fg" />
                    <span>Переказ</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <PiggyBank className="w-10 h-10 rounded-full bg-icon-bg text-icon-fg" />
                    <span>Відкласти</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Sparkles className="w-10 h-10 rounded-full bg-icon-bg text-icon-fg" />
                    <span>AI чат</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Limit */}
            <Card>
              <CardHeader>
                <CardTitle>Денний ліміт</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-muted">₴2,500.00 з ₴330.00</p>
                <div className="w-full h-2 mt-2 rounded-full bg-limit-bar-track">
                  <div className="h-2 rounded-full w-1/8 bg-limit-bar-fill" />
                </div>
              </CardContent>
            </Card>

            {/* Savings & Goals */}
            <SavingPlansList plans={plans} setSelectedPlanId={() => {}} />
          </div>

          {/* Center column */}
          <div className="col-span-12 space-y-4 md:col-span-7 xl:col-span-8">
            {stats ? <StatsCards stats={stats} /> : null}

            {/* Overview & Cashflow */}
            <Card>
              <CardHeader>
                <CardTitle>Огляд та грошовий потік</CardTitle>
                <p className="mb-4 text-2xl font-bold font-heading">₴562,000</p>
              </CardHeader>
              <CardContent>
                <ChartAreaGradient />
              </CardContent>
            </Card>

            {/* Recent Transactions & Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Останні транзакції та активність</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "Електрика",
                      category: "Платежі",
                      date: "2028-02-01",
                      amount: "₴296.51",
                      status: "Виконано",
                    },
                    {
                      name: "Продукти",
                      category: "Покупки",
                      date: "2028-04-04",
                      amount: "₴304.47",
                      status: "Завершено",
                    },
                    {
                      name: "Кіно",
                      category: "Розваги",
                      date: "2028-02-27",
                      amount: "₴37.84",
                      status: "Очікування",
                    },
                    {
                      name: "Медичний огляд",
                      category: "Здоров'я",
                      date: "2028-02-07",
                      amount: "₴322.33",
                      status: "Очікування",
                    },
                    {
                      name: "Ресторан",
                      category: "Харчування",
                      date: "2025-03-11",
                      amount: "₴326.76",
                      status: "Очікування",
                    },
                  ].map((tx, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between pb-2 text-sm border-b last:border-0 border-table-border"
                    >
                      <div>
                        <p className="font-medium">{tx.name}</p>
                        <p className="text-xs text-table-muted">{tx.category}</p>
                      </div>
                      <div className="text-right">
                        <p>{tx.amount}</p>
                        <p className="text-xs text-table-muted">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="col-span-12 space-y-4 xl:col-span-3 xl:col-start-10 xl:row-span-full xl:row-start-1">
        {/* Statistic */}
        <Card>
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-foreground-muted">Діаграма витрат</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Оренда та проживання", amount: "₴2,100" },
                { label: "Інвестиції", amount: "₴525" },
                { label: "Освіта", amount: "₴420" },
                { label: "Їжа та напої", amount: "₴280" },
                { label: "Розваги", amount: "₴175" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-foreground-muted">{item.label}</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency Exchange Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Курси валют</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { pair: "USD / UAH", rate: "-0.533400", value: "₴82.000" },
                { pair: "USDT / UAH", rate: "-0.000222", value: "₴80.550" },
                { pair: "EUR / UAH", rate: "-6.000058", value: "₴12,534" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-2 border-b last:border-0 border-border"
                >
                  <span className="font-medium">{item.pair}</span>
                  <div className="text-right">
                    <p className="text-currency-negative">{item.rate}</p>
                    <p className="text-xs text-foreground-muted">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Фінансові поради</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-foreground-muted">
              <p>
                💡 Фінансова грамотність допомагає уникнути непотрібних витрат та
                інвестувати розумно.
              </p>
              <p>💰 Розгляньте можливість відкладати щонайменше 20% доходу щомісяця.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
