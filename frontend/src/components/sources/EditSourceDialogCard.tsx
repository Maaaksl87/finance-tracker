import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface EditSourceFormData {
  name: string;
  balance: number;
}

interface EditSourceDialogCardProps {
  formData: EditSourceFormData;
  isLoading: boolean;
  onFormChange: (field: keyof EditSourceFormData, value: string | number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditSourceDialogCard({
  isLoading,
  formData,
  onFormChange,
  open,
  onOpenChange,
  onSubmit,
}: EditSourceDialogCardProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
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
                value={formData.name}
                onChange={(e) => onFormChange("name", e.target.value)}
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
                value={formData.balance}
                onChange={(e) => onFormChange("balance", Number(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Збереження..." : "Зберегти зміни"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
