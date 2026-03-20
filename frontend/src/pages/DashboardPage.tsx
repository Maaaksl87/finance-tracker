import {
  CardHeader,
  CardTitle,
  CardContent,
  CardWithBackdrop,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { PlusCircle, ArrowRightLeft, Sparkles, PiggyBank } from "lucide-react";

import { useTransactionStats } from "@/hooks/useTransactionStats";

export default function DashboardPage() {
  const { stats, isLoading } = useTransactionStats();
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* ===== Left area (9 cols) ===== */}
      <div className="col-span-12 space-y-4 xl:col-span-9">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Вітаю, {user?.name || "користувач"}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Контролюй свої фінанси для фінансового здоров'я.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Загальний баланс:</p>
            <p className="text-3xl font-bold">
              {(totalIncome - totalExpense).toLocaleString()} ₴
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-4 md:col-span-5 xl:col-span-4">
            <CardWithBackdrop className="mb-0 rounded-b-none">
              <CardHeader>
                <CardTitle>Баланс аккаунта</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {(totalIncome - totalExpense).toLocaleString()} ₴
                </p>
              </CardContent>
            </CardWithBackdrop>
            <CardWithBackdrop className="mt-0 border-t-0 rounded-t-none [mask-image:linear-gradient(to_top,black_90%,transparent)]">
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-xs text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/80">
                      <PlusCircle className="w-10 h-10 rounded-full bg-muted" />
                    </button>
                    <span>Поповнити</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRightLeft className="w-10 h-10 rounded-full bg-muted" />
                    <span>Переказ</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <PiggyBank className="w-10 h-10 rounded-full bg-muted" />
                    <span>Відкласти</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Sparkles className="w-10 h-10 rounded-full bg-muted" />
                    <span>AI чат</span>
                  </div>
                </div>
              </CardContent>
            </CardWithBackdrop>

            {/* Daily Limit */}
            <CardWithBackdrop>
              <CardHeader>
                <CardTitle>Денний ліміт</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">₴2,500.00 з ₴330.00</p>
                <div className="w-full h-2 mt-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full w-1/8 bg-primary" />
                </div>
              </CardContent>
            </CardWithBackdrop>

            {/* Savings & Goals */}
            <CardWithBackdrop>
              <CardHeader>
                <CardTitle>Збереження та цілі</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Загальні збереження</p>
                <p className="text-2xl font-bold">₴84,500</p>

                <div className="pt-2 space-y-2">
                  {/* Emergency Fund */}
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Екстрений фонд</p>
                    <p className="text-xs text-muted-foreground">₴6,000 · Ціль: ₴4,000</p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-1.5 w-full rounded-full bg-green-500" />
                    </div>
                  </div>

                  {/* Vacation Fund */}
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Фонд відпустки</p>
                    <p className="text-xs text-muted-foreground">₴5,600 · Ціль: ₴5,300</p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-1.5 w-[95%] rounded-full bg-blue-500" />
                    </div>
                  </div>

                  {/* Home Down Payment */}
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Перший внесок за житло</p>
                    <p className="text-xs text-muted-foreground">
                      ₴7,260 · Ціль: ₴30,000
                    </p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-1.5 w-1/4 rounded-full bg-orange-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </CardWithBackdrop>
          </div>

          {/* Center column */}
          <div className="col-span-12 space-y-4 md:col-span-7 xl:col-span-8">
            <div className="grid grid-cols-3 gap-4">
              {/* Total Income */}
              <CardWithBackdrop>
                <CardHeader>
                  <CardTitle>Загальні надходження</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    +{totalIncome.toLocaleString()} ₴
                  </div>
                </CardContent>
              </CardWithBackdrop>

              {/* Total Expenses */}
              <CardWithBackdrop>
                <CardHeader>
                  <CardTitle>Загальні витрати</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    -{totalExpense.toLocaleString()} ₴
                  </div>
                </CardContent>
              </CardWithBackdrop>

              {/* Total Savings */}
              <CardWithBackdrop>
                <CardHeader>
                  <CardTitle>Загальні збереження</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="">—</p>
                </CardContent>
              </CardWithBackdrop>
            </div>
            {/* Overview & Cashflow */}
            <CardWithBackdrop>
              <CardHeader>
                <CardTitle>Огляд та грошовий потік</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-muted-foreground">Загальний баланс</p>
                <p className="mb-4 text-2xl font-bold">₴562,000</p>
                <div className="flex items-center justify-center w-full h-48 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">
                    Графік доходів та витрат
                  </p>
                </div>
              </CardContent>
            </CardWithBackdrop>

            {/* Recent Transactions & Activity */}
            <CardWithBackdrop>
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
                      className="flex items-center justify-between pb-2 text-sm border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{tx.name}</p>
                        <p className="text-xs text-muted-foreground">{tx.category}</p>
                      </div>
                      <div className="text-right">
                        <p>{tx.amount}</p>
                        <p className="text-xs text-muted-foreground">{tx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CardWithBackdrop>
          </div>
        </div>
      </div>

      {/* ===== Right column — full height ===== */}
      <div className="col-span-12 space-y-4 xl:col-span-3 xl:col-start-10 xl:row-span-full xl:row-start-1">
        {/* Statistic */}
        <CardWithBackdrop>
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-muted-foreground">Діаграма витрат</p>
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
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </CardWithBackdrop>

        {/* Currency Exchange Rates */}
        <CardWithBackdrop>
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
                  className="flex items-center justify-between pb-2 border-b last:border-0"
                >
                  <span className="font-medium">{item.pair}</span>
                  <div className="text-right">
                    <p className="text-red-500">{item.rate}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CardWithBackdrop>

        {/* Financial Tips */}
        <CardWithBackdrop>
          <CardHeader>
            <CardTitle>Фінансові поради</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                💡 Фінансова грамотність допомагає уникнути непотрібних витрат та
                інвестувати розумно.
              </p>
              <p>💰 Розгляньте можливість відкладати щонайменше 20% доходу щомісяця.</p>
            </div>
          </CardContent>
        </CardWithBackdrop>
      </div>
    </div>
  );
}
