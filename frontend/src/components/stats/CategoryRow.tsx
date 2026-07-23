import { formatCurrency } from "@/components/utils/numberUtils";

interface CategoryRowProps {
  name: string;
  amount: number;
  color: string;
}

export function CategoryRow({ name, amount, color }: CategoryRowProps) {
  return (
    <div
      className="flex items-center justify-between gap-2 rounded-l-md border-l-4 px-3 py-2"
      style={{ borderLeftColor: color }}
    >
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">{name}</span>
      <span className="shrink-0 text-sm font-semibold text-foreground">{formatCurrency(amount)}</span>
    </div>
  );
}
