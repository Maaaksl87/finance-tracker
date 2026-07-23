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
import { useState } from "react";
import { useUpdateSavingPlan } from "@/hooks/useSavingPlans";
import type { SavingPlan } from "@/types";

export default function EditPlanDialog({
  plan,
  open,
  onOpenChange,
}: {
  plan: SavingPlan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updatePlan = useUpdateSavingPlan();
  const [formData, setFormData] = useState({
    title: plan.title,
    targetAmount: String(plan.targetAmount),
    description: plan.description ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePlan.mutateAsync({
        id: plan._id,
        data: {
          title: formData.title,
          targetAmount: parseFloat(formData.targetAmount),
          description: formData.description,
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Помилка при оновленні плану:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Редагувати план</DialogTitle>
          <DialogDescription>Змініть деталі плану заощаджень.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="edit-title">Назва плану</Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="Відпустка, Машина..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="edit-targetAmount">Цільова сума (₴)</Label>
              <Input
                id="edit-targetAmount"
                name="targetAmount"
                type="number"
                placeholder="1000"
                value={formData.targetAmount}
                onChange={handleChange}
                min="0"
                step="0.10"
                required
              />
            </Field>
            <Field>
              <Label htmlFor="edit-description">Опис (опціонально)</Label>
              <Input
                id="edit-description"
                name="description"
                placeholder="Додайте коротке описання плану"
                value={formData.description}
                onChange={handleChange}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Скасувати
              </Button>
            </DialogClose>
            <Button type="submit" disabled={updatePlan.isPending}>
              {updatePlan.isPending ? "Збереження..." : "Зберегти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
