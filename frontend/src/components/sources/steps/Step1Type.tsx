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
  onNextStep: () => void;
}

export function Step1Type({ onNextStep }: Step1Props) {
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
                  onNextStep();
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
                    className="hover:border-[#f0bb0b79]"
                  >
                    <div className="flex w-full flex-col gap-3 ">
                      <div className="flex w-full items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#141418] text-[#737373] transition-colors group-data-[state=on]:bg-[#262118] group-data-[state=on]:text-[#eab308]">
                          {Icon && <Icon className="h-5 w-5" />}
                        </div>
                        {type.hasApi && (
                          <div className="flex items-center gap-1.5 rounded-full bg-[#16271c] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#0ebd68]">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#0ebd68]" />
                            API
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex flex-col gap-1 text-left">
                        <span className="text-base font-bold text-white">
                          {type.label}
                        </span>
                        <span className="text-xs text-[#737373]">{type.description}</span>
                      </div>
                    </div>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </FormControl>
          <div className="flex items-center gap-3 text-muted bg-[#1b1b21] p-3 rounded-md mt-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="leading-snug text-[12px] font-normal leading-normal">
              Для <span className="text-white">банків та бірж</span> рекомендуємо API —
              баланси та транзакції оновлюються автоматично. Готівку та інше додають
              вручну.
            </span>
          </div>
        </FormItem>
      )}
    />
  );
}
