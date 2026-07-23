import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/components/utils/numberUtils";
import { useCategoryStats } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryHex } from "@/lib/categoryColor";
import { cn } from "@/lib/utils";
import { CategoryBar } from "./CategoryBar";
import { CategoryRow } from "./CategoryRow";

type Tab = "income" | "expense";

export function CategoryStatsCard() {
  const [month, setMonth] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState<Tab>("expense");

  const { income, expense, isLoading } = useCategoryStats(month);
  const { categories: customCategories } = useCategories();

  const incomeTotal = income.reduce((sum, s) => sum + s.total, 0);
  const expenseTotal = expense.reduce((sum, s) => sum + s.total, 0);

  const activeList = activeTab === "income" ? income : expense;
  const activeTotal = activeTab === "income" ? incomeTotal : expenseTotal;

  const segments = activeList.map((s) => ({
    category: s.category,
    color: getCategoryHex(s.category, activeTab, customCategories),
    fraction: activeTotal > 0 ? s.total / activeTotal : 0,
  }));

  const goToPrevMonth = () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goToNextMonth = () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Статистика</CardTitle>
        <div className="flex items-center gap-1">
          <button type="button" onClick={goToPrevMonth} aria-label="Попередній місяць" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold uppercase text-foreground">
            {format(month, "LLLL", { locale: uk })}
          </span>
          <button type="button" onClick={goToNextMonth} aria-label="Наступний місяць" className="text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {(
            [
              { key: "income" as const, label: "Доходи", total: incomeTotal },
              { key: "expense" as const, label: "Витрати", total: expenseTotal },
            ]
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex flex-col items-center gap-1 border-b-2 pb-2 transition-colors",
                activeTab === tab.key ? "border-primary" : "border-transparent",
              )}
            >
              <span className={cn("text-xs font-semibold", activeTab === tab.key ? "text-foreground" : "text-muted-foreground")}>
                {tab.label}
              </span>
              <span className="text-xs text-muted-foreground">{formatCurrency(tab.total)}</span>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Всього</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(activeTotal)}</p>
        </div>

        {isLoading && null}

        {!isLoading && activeList.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">Немає даних за місяць</p>
        )}

        {!isLoading && activeList.length > 0 && (
          <>
            <CategoryBar segments={segments} />
            <div className="mt-3 flex max-h-64 flex-col gap-2 divide-y divide-border overflow-y-auto">
              {activeList.map((stat) => (
                <CategoryRow
                  key={stat.category}
                  name={stat.category}
                  amount={stat.total}
                  color={getCategoryHex(stat.category, activeTab, customCategories)}
                />
              ))}
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
}
