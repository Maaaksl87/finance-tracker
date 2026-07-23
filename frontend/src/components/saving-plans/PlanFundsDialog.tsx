import { useState } from "react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSources } from "@/hooks/useSources";
import { useAddFunds, useWithdrawFunds } from "@/hooks/useSavingPlans";
import { formatCurrency } from "@/components/utils/numberUtils";
import type { SavingPlan } from "@/types";

export type FundsMode = "add" | "withdraw";

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  return fallback;
}

export default function PlanFundsDialog({
  plan,
  mode,
  open,
  onOpenChange,
}: {
  plan: SavingPlan;
  mode: FundsMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: sources } = useSources();
  const addFunds = useAddFunds();
  const withdrawFunds = useWithdrawFunds();

  const [amount, setAmount] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isAdd = mode === "add";
  const mutation = isAdd ? addFunds : withdrawFunds;
  const title = isAdd ? "Поповнити план" : "Зняти кошти";
  const description = isAdd
    ? "Додайте дохід до цього плану заощаджень."
    : "Зніміть кошти (витрату) з цього плану заощаджень.";
  const actionLabel = isAdd ? "Поповнити" : "Зняти";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Введіть суму більшу за 0");
      return;
    }
    if (!sourceId) {
      setError("Оберіть гаманець");
      return;
    }
    if (!isAdd && parsed > plan.currentAmount) {
      setError("Недостатньо коштів у плані");
      return;
    }

    try {
      await mutation.mutateAsync({ id: plan._id, amount: parsed, sourceId });
      onOpenChange(false);
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося виконати операцію. Спробуйте ще раз."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <p className="text-sm text-muted-foreground">
              {plan.title} · {formatCurrency(plan.currentAmount)} /{" "}
              {formatCurrency(plan.targetAmount)}
            </p>
            <Field>
              <Label htmlFor="funds-amount">Сума (₴)</Label>
              <Input
                id="funds-amount"
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="funds-source">Гаманець</Label>
              <Select value={sourceId} onValueChange={setSourceId}>
                <SelectTrigger id="funds-source" className="w-full">
                  <SelectValue placeholder="Оберіть гаманець..." />
                </SelectTrigger>
                <SelectContent>
                  {sources?.length ? (
                    sources.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name} ({s.balance} {s.currency})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Немає гаманців
                    </div>
                  )}
                </SelectContent>
              </Select>
            </Field>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Скасувати
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Збереження..." : actionLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
