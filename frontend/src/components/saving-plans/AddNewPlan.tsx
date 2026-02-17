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
import { createSavingPlan } from "@/api/savingPlans";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddNewPlan({
  isOpen,
  onClose,
  onPlanCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated?: (planId: string) => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    description: "",
  });

  const mutation = useMutation({
    mutationFn: createSavingPlan,
    onSuccess: (data) => {
        // оновлюємо кеш після створення плану
      queryClient.invalidateQueries({ queryKey: ["saving-plans", "list"] });
      setFormData({ title: "", targetAmount: "", description: "" });
      
      // калбек з id нового плану
      if (data?._id) {
        onPlanCreated?.(data._id);
      }
      
      onClose();
    },
    onError: (error) => {
      console.error("Помилка при створенні плану:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      description: formData.description,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Додати новий план</DialogTitle>
          <DialogDescription>Введіть деталі нового плану заощаджень.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Назва плану</Label>
              <Input
                id="title"
                name="title"
                placeholder="Відпустка, Машина..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="targetAmount">Цільова сума ($)</Label>
              <Input
                id="targetAmount"
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
              <Label htmlFor="description">Опис (опціонально)</Label>
              <Input
                id="description"
                name="description"
                placeholder="Додайте коротке описання плану"
                value={formData.description}
                onChange={handleChange}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Скасувати</Button>
            </DialogClose>
            <Button type="submit">Додати план</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
