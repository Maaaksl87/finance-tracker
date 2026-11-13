import { useState } from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

import { BudgetCard } from "@/components/budgets/BudgetCard";
import { CreateBudgetDialog } from "@/components/budgets/CreateBudgetDialog";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/components/utils/numberUtils";
import { useBudgetStatuses } from "@/hooks/useBudgets";

export default function BudgetsPage() {
  const [month, setMonth] = useState(() => new Date());
  const { budgets, isLoading } = useBudgetStatuses(month);

  const goToPrevMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);

  const existingCategories = budgets.map((b) => b.category);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Бюджети
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Контроль щомісячних витрат за категоріями
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Month Switcher without icons */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={goToPrevMonth}
              aria-label="Попередній місяць"
              className="text-muted-foreground hover:text-foreground font-bold px-1"
            >
              ‹
            </button>
            <span className="capitalize text-foreground min-w-[110px] text-center select-none">
              {format(month, "LLLL yyyy", { locale: uk })}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Наступний місяць"
              className="text-muted-foreground hover:text-foreground font-bold px-1"
            >
              ›
            </button>
          </div>

          <CreateBudgetDialog existingCategories={existingCategories} />
        </div>
      </div>

      {/* Summary Card */}
      {budgets.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="pt-2 sm:pt-0">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Загальний ліміт
                </span>
                <p className="text-xl font-bold text-foreground mt-1 break-words">
                  {formatCurrency(totalLimit)}
                </p>
              </div>

              <div className="pt-3 sm:pt-0">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Витрачено
                </span>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 break-words">
                  {formatCurrency(totalSpent)}
                </p>
              </div>

              <div className="pt-3 sm:pt-0">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Залишок
                </span>
                <p className="text-xl font-bold text-primary mt-1 break-words">
                  {formatCurrency(totalRemaining)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Завантаження бюджетів...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && budgets.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-bold text-foreground mb-1">
              Немає встановлених бюджетів
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6">
              У вас ще немає встановлених бюджетів на цей місяць. Натисніть «Встановити бюджет», щоб почати контролювати витрати за категоріями.
            </p>
            <CreateBudgetDialog existingCategories={[]} />
          </CardContent>
        </Card>
      )}

      {/* Budgets Grid */}
      {!isLoading && budgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard key={budget._id} budget={budget} />
          ))}
        </div>
      )}
    </div>
  );
}

