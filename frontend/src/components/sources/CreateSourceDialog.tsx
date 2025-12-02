import { useState } from "react";
import type { CreateSourceDto, Source } from "@/types";
import { createSource } from "@/api/sources"; // Імпортуємо нашу API функцію
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CreateSourceDialogProps {
  onSuccess: (newSource: Source) => void; // Колбек, щоб повідомити батьківський компонент про успіх
}

export function CreateSourceDialog({ onSuccess }: CreateSourceDialogProps) {
  const [open, setOpen] = useState(false); // Керування відкриттям вікна
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: CreateSourceDto = {
        name,
        balance: Number(balance), // Конвертуємо рядок у число
      };

      const newSource = await createSource(payload);

      // 1. Повідомляємо батьківський компонент
      onSuccess(newSource);

      // 2. Закриваємо вікно і чистимо форму
      setOpen(false);
      setName("");
      setBalance("0");
    } catch (error) {
      console.error("Failed to create source", error);
      // Тут можна додати toast notification про помилку
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Додати
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Додати гаманець</DialogTitle>
            <DialogDescription>
              Створіть нове джерело фінансів (картку, готівку, депозит).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Поле Назви */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Назва
              </Label>
              <Input
                id="name"
                placeholder="Monobank, Готівка..."
                className="col-span-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Поле Балансу */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Баланс
              </Label>
              <Input
                id="balance"
                type="number"
                className="col-span-3"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                onFocus={() => {
                  if (balance === "0") setBalance("");
                }}
                required
                min={0}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Збереження..." : "Зберегти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
