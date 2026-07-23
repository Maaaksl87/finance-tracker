import { useState } from "react";
import { isAxiosError } from "axios";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { colors, type Color } from "@/types/sources";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";

interface AddCategoryPopoverProps {
  type: "income" | "expense";
  onCreated: (categoryName: string) => void;
}

export function AddCategoryPopover({ type, onCreated }: AddCategoryPopoverProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState<Color>(colors[0].value);
  const [error, setError] = useState("");
  const { categories } = useCategories();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();
  const { mutate: deleteCategory, isPending: isDeleting, variables: deletingId } = useDeleteCategory();

  const ownCategories = categories.filter((c) => c.type === type);

  const resetForm = () => {
    setName("");
    setColor(colors[0].value);
    setError("");
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Введіть назву категорії");
      return;
    }
    setError("");
    try {
      const category = await createCategory({ name: trimmed, type, color });
      onCreated(category.name);
      setOpen(false);
      resetForm();
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.message : null;
      setError(message ?? "Не вдалося створити категорію");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-[11px] font-semibold text-wizard-accent hover:text-wizard-accent-hover"
        >
          <Plus className="h-3 w-3" />
          категорія
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 bg-modal border-border" align="end">
        <div className="flex flex-col gap-3">
          {ownCategories.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Ваші категорії
              </label>
              <ul className="flex max-h-32 flex-col gap-1 overflow-y-auto">
                {ownCategories.map((c) => (
                  <li
                    key={c._id}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-input"
                  >
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: colors.find((col) => col.value === c.color)?.hex }}
                      />
                      {c.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteCategory(c._id)}
                      disabled={isDeleting && deletingId === c._id}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                      aria-label={`Видалити ${c.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Назва
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Наприклад, Підписки"
              className="h-10 bg-input border-border rounded-lg px-3 text-sm text-foreground"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Колір
            </label>
            <ToggleGroup
              type="single"
              value={color}
              onValueChange={(value) => value && setColor(value as Color)}
              className="flex flex-wrap items-center gap-2"
            >
              {colors.map((c) => (
                <ToggleGroupItem
                  key={c.value}
                  value={c.value}
                  aria-label={c.label}
                  variant="default"
                  className="h-7! w-7! min-w-7! rounded-full! border-2 border-border! p-0! shadow-none data-[state=on]:border-wizard-accent! data-[state=on]:ring-1 data-[state=on]:ring-wizard-accent data-[state=on]:ring-offset-1 data-[state=on]:ring-offset-modal"
                  style={{ backgroundColor: c.hex }}
                >
                  <span className="sr-only">{c.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {error && <p className="text-xs font-semibold text-destructive">{error}</p>}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="h-9 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
          >
            {isPending ? "Створення..." : "Створити категорію"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}