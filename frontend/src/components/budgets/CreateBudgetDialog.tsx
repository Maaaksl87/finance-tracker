import { useState } from "react";

import { EXPENSE_CATEGORIES } from "@/components/transactions/transaction.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBudget } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";

interface CreateBudgetDialogProps {
  existingCategories: string[];
}

export function CreateBudgetDialog({ existingCategories }: CreateBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { categories } = useCategories();
  const { mutate: createBudget, isPending } = useCreateBudget();

  // Combine custom expense categories with default expense categories
  const customExpenses = categories.filter((c) => c.type === "expense").map((c) => c.name);
  const defaultExpenses = EXPENSE_CATEGORIES.map((c) => c.name);
  const allCategories = Array.from(new Set([...customExpenses, ...defaultExpenses]));
  const availableCategories = allCategories.filter((cat) => !existingCategories.includes(cat));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const selectedCategory = category || availableCategories[0];
    const numLimit = parseFloat(limit);

    if (!selectedCategory) {
      setError("Оберіть категорію витрат");
      return;
    }
    if (!numLimit || numLimit <= 0) {
      setError("Вкажіть суму ліміту більше нуля");
      return;
    }

    createBudget(
      { category: selectedCategory, limit: numLimit },
      {
        onSuccess: () => {
          setOpen(false);
          setCategory("");
          setLimit("");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Помилка при створенні бюджету";
          setError(typeof msg === "string" ? msg : "Помилка валідації");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold text-xs sm:text-sm">
          + Встановити бюджет
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Встановити бюджет категорії</DialogTitle>
        </DialogHeader>

        {availableCategories.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Усі доступні категорії витрат уже мають встановлені бюджети.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {error && (
              <div className="p-2 text-xs font-medium text-destructive bg-destructive/10 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="budget-category">Категорія витрат</Label>
              <select
                id="budget-category"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={category || availableCategories[0]}
                onChange={(e) => setCategory(e.target.value)}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-limit">Місячний ліміт (₴)</Label>
              <Input
                id="budget-limit"
                type="number"
                min="1"
                step="any"
                required
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="наприклад, 8000"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Скасувати
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Збереження..." : "Зберегти"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

