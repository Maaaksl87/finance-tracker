import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateBudget } from "@/hooks/useBudgets";
import type { BudgetStatus } from "@/types";

interface EditBudgetDialogProps {
  budget: BudgetStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBudgetDialog({ budget, open, onOpenChange }: EditBudgetDialogProps) {
  const [limit, setLimit] = useState(budget.limit.toString());
  const { mutate: updateBudget, isPending } = useUpdateBudget();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numLimit = parseFloat(limit);
    if (!numLimit || numLimit <= 0) return;

    updateBudget(
      { id: budget._id, dto: { limit: numLimit } },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Змінити ліміт бюджету</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Категорія</Label>
            <div className="p-2 rounded bg-muted/40 text-sm font-medium">
              {budget.category}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Місячний ліміт (₴)</Label>
            <Input
              id="limit"
              type="number"
              min="1"
              step="any"
              required
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="Вкажіть суму"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Збереження..." : "Зберегти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

