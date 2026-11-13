import { useState } from "react";

import { formatCurrency } from "@/components/utils/numberUtils";
import { useDeleteBudget } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { getCategoryHex } from "@/lib/categoryColor";
import { cn } from "@/lib/utils";
import type { BudgetStatus } from "@/types";
import { EditBudgetDialog } from "./EditBudgetDialog";

interface BudgetCardProps {
  budget: BudgetStatus;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { categories } = useCategories();
  const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget();

  const color = getCategoryHex(budget.category, "expense", categories);
  const progressPercent = Math.min(100, budget.percentage);
  const isWarning = budget.status === "warning";
  const isExceeded = budget.status === "exceeded";

  const handleDelete = () => {
    if (window.confirm(`Видалити бюджет для категорії «${budget.category}»?`)) {
      deleteBudget(budget._id);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors",
          isExceeded && "border-destructive bg-destructive/5",
          isWarning && "border-amber-500/50 bg-amber-500/5",
          !isExceeded && !isWarning && "border-border",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="font-semibold text-foreground text-sm truncate">
              {budget.category}
            </span>
          </div>

          <span
            className={cn(
              "shrink-0 rounded px-2 py-0.5 text-xs font-semibold",
              budget.status === "normal" && "bg-primary/10 text-primary",
              isWarning && "bg-amber-500/15 text-amber-700 dark:text-amber-400",
              isExceeded && "bg-destructive/15 text-destructive",
            )}
          >
            {isExceeded
              ? `Перевищено на ${formatCurrency(budget.spent - budget.limit)}`
              : isWarning
                ? `${budget.percentage}% ліміту`
                : `${budget.percentage}%`}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <span
            className={cn(
              "text-lg font-bold",
              isExceeded ? "text-destructive" : "text-foreground",
            )}
          >
            {formatCurrency(budget.spent)}
          </span>
          <span className="text-xs text-muted-foreground">
            із {formatCurrency(budget.limit)}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              budget.status === "normal" && "bg-primary",
              isWarning && "bg-amber-500",
              isExceeded && "bg-destructive",
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          <span
            className={cn(
              "text-muted-foreground",
              isWarning && "font-medium text-amber-700 dark:text-amber-400",
              isExceeded && "font-medium text-destructive",
            )}
          >
            {isExceeded
              ? `Перевитрата: +${budget.percentage - 100}%`
              : `Залишок: ${formatCurrency(budget.remaining)}`}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="rounded border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-card-hover transition-colors"
            >
              Змінити
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded border border-border px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              Видалити
            </button>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <EditBudgetDialog
          budget={budget}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </>
  );
}

