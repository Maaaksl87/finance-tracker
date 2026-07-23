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
import { useDeleteSavingPlan } from "@/hooks/useSavingPlans";
import type { SavingPlan } from "@/types";

export default function DeletePlanDialog({
  plan,
  open,
  onOpenChange,
  onDeleted,
}: {
  plan: SavingPlan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: (id: string) => void;
}) {
  const deletePlan = useDeleteSavingPlan();

  const handleDelete = async () => {
    try {
      await deletePlan.mutateAsync(plan._id);
      onDeleted?.(plan._id);
      onOpenChange(false);
    } catch (error) {
      console.error("Помилка при видаленні плану:", error);
      alert("Помилка при видаленні плану. Спробуйте ще раз.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Видалити план?</DialogTitle>
          <DialogDescription>
            План «{plan.title}» буде видалено без можливості відновлення.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Скасувати
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={deletePlan.isPending}>
            {deletePlan.isPending ? "Видалення..." : "Видалити"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
