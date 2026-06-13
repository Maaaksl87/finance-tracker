import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sourceTypes } from "@/types/sources";
import { type SourceType } from "@/types/sources";
import {
  type LucideIcon,
  DollarSign,
  TrendingUp,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

interface Step1Props {
  onTypeSelect: (type: SourceType) => void;
}

export function Step1Type({ onTypeSelect }: Step1Props) {
  const sourceIcons: Record<SourceType, LucideIcon> = {
    card: Wallet,
    cash: DollarSign,
    deposit: TrendingUp,
    crypto: TrendingUp,
  };
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="sourceType"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <ToggleGroup
              type="single"
              value={field.value}
              onValueChange={(value) => {
                if (value) {
                  field.onChange(value);
                  onTypeSelect(value as SourceType);
                }
              }}
              spacing={1}
              size="wallet"
              className="w-full justify-between gap-3 grid grid-cols-2"
            >
              {sourceTypes.map((type) => {
                const Icon = sourceIcons[type.value];

                return (
                  <ToggleGroupItem
                    key={type.value}
                    value={type.value}
                    disabled={type.disabled}
                    variant="wallet"
                    className="hover:border-wizard-accent/50"
                  >
                    <div className="flex w-full flex-col gap-3 ">
                      <div className="flex w-full items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-input text-foreground transition-colors group-data-[state=on]:bg-wizard-accent/20 group-data-[state=on]:text-wizard-accent">
                          {Icon && <Icon className="h-5 w-5" />}
                        </div>
                        {type.hasApi && (
                          <div className="flex items-center gap-1.5 rounded-full bg-api-badge-bg px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-api-badge-text">
                            <div className="h-1.5 w-1.5 rounded-full bg-api-badge-text" />
                            API
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex flex-col gap-1 text-left">
                        <span className="text-base font-bold text-foreground">
                          {type.label}
                        </span>
                        <span className="text-xs text-muted">{type.description}</span>
                      </div>
                    </div>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </FormControl>
          <div className="flex items-center gap-3 text-muted bg-input p-3 rounded-md mt-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="leading-snug text-[12px] font-normal leading-normal">
              Для <span className="text-foreground font-semibold">банків та бірж</span> рекомендуємо API —
              баланси та транзакції оновлюються автоматично. Готівку та інше додають
              вручну.
            </span>
          </div>
        </FormItem>
      )}
    />
  );
}
