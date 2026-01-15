import { useState } from "react";
import type { Source } from "@/types";
import { updateSource } from "@/api/sources";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  source: Source;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditSourceDialog({
  source,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(source.name);
  const [balance, setBalance] = useState(source.balance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateSource(source._id, { name, balance: Number(balance) });
      onSuccess(); //оновлюємо таблицю
      onOpenChange(false); // Закриваємо діалог
    } catch (error) {
      console.error("Failed to update source", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редагувати гаманець</DialogTitle>
            <DialogDescription>
              Змініть назву або скоригуйте баланс.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Назва
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={balance}
                onChange={(e) => setBalance(+e.target.value)}
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
