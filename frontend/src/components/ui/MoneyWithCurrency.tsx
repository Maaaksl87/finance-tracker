import { formatCurrency } from "@/components/utils/numberUtils";
import { cn } from "@/lib/utils";

export const MoneyWithCurrency = ({ amount }: { amount: number }) => {
  return (
    <span
      className={cn({
        "text-destructive": amount < 0,
      })}
    >
      {formatCurrency(amount)}
    </span>
  );
};
