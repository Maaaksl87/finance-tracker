import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { Source, UpdateSourceDto } from "@/types";
import { useUpdateSource } from "@/hooks/useSources";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditSourceDialogProps {
  source: Source;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditSourceDialog({
  source,
  open,
  onOpenChange,
}: EditSourceDialogProps) {
  const { mutateAsync, isPending } = useUpdateSource();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateSourceDto>({
    name: source.name,
    balance: source.balance,
  });

  const handleFormChange = (field: keyof UpdateSourceDto, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      await mutateAsync({ id: source._id, data: formData });
      onOpenChange(false);
    } catch (error) {
      console.error("Помилка редагування гаманця", error);
      setSubmitError("Не вдалося зберегти зміни. Спробуйте ще раз.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редагувати гаманець</DialogTitle>
            <DialogDescription>Змініть назву або скоригуйте баланс.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Назва
              </Label>
              <Input
                id="edit-name"
                value={formData.name ?? ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-balance" className="text-right">
                Баланс
              </Label>
              <Input
                id="edit-balance"
                type="number"
                value={formData.balance ?? ""}
                onChange={(e) => handleFormChange("balance", Number(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
          </div>

          {submitError && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {submitError}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Збереження..." : "Зберегти зміни"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
