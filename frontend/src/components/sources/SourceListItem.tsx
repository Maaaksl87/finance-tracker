import { Wallet } from "lucide-react";
import { colors, type Color, type Currency, sourceTypes, type Source } from "@/types";

export interface SourceListItemProps {
  source: Source;
}

export const currencySymbols: Record<string, string> = {
  UAH: "₴",
  USD: "$",
  EUR: "€",
};

export function formatBalance(amount: number): string {
  return amount.toLocaleString("uk-UA", { maximumFractionDigits: 2 });
}

export function getActiveColor(color: Color) {
  return colors.find((c) => c.value === color) ?? colors[0];
}
export function getCurrencySymbol(currency: Currency) {
  return currencySymbols[currency] ?? currency;
}

export default function SourceListItem({ source }: SourceListItemProps) {
  const activeColor = getActiveColor(source.color);
  const currencySymbol = getCurrencySymbol(source.currency);

  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{
            color: activeColor.hex,
          }}
        >
          <Wallet className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground">
            {source.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {source.currency}
          </span>
        </div>
      </div>
      <span className="font-bold text-sm text-foreground">
        {formatBalance(source.balance)} {currencySymbol}
      </span>
    </div>
  );
}
