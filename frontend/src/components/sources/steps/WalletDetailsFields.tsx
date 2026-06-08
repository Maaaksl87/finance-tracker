import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { SourceSchemaType } from "@/components/sources/source.schema";
import { colors, currencies, type BankSource } from "@/types/sources";
import { useFormContext } from "react-hook-form";

const fieldLabelClass =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b6b76]";
const fieldControlClass =
  "h-12 rounded-xl border-[#22222a] bg-[#1b1b21] px-4 text-sm text-white shadow-none placeholder:text-[#6b6b76] focus-visible:border-[#f0b90b80] focus-visible:ring-0";

export default function WalletDetailsFields({ prefix }: { prefix?: string }) {
  const { control } = useFormContext<SourceSchemaType>();
  const fieldName = (name: string) => (prefix ? `${prefix}.${name}` : name);

  return (
    <>
      <FormField
        control={control}
        name={fieldName("name")}
        defaultValue=""
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel className={fieldLabelClass}>НАЗВА</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={String(field.value ?? "")}
                placeholder="Напр. Сімейна картка"
                className={fieldControlClass}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_112px]">
        <FormField
          control={control}
          name={fieldName("balance")}
          defaultValue=""
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className={fieldLabelClass}>ПОЧАТКОВИЙ БАЛАНС</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={String(field.value ?? "")}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={fieldControlClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={fieldName("currency")}
          defaultValue="UAH"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className={fieldLabelClass}>ВАЛЮТА</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full pl-4 py-5 dark:bg-[#1b1b21] border-[#22222a] placeholder:text-[#737373] placeholder:text-sm focus-visible:border-[#f0b90b80] focus-visible:ring-0">
                    <SelectValue placeholder="UAH" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#22222a] bg-[#15151a] text-white">
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={fieldName("color")}
        defaultValue={colors[0].value}
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel className={fieldLabelClass}>КОЛІР КАРТКИ</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                spacing={0}
                value={field.value ?? ""}
                onValueChange={(value) => {
                  if (value) {
                    field.onChange(value);
                  }
                }}
                className="flex flex-wrap items-center gap-3"
              >
                {colors.map((color) => (
                  <ToggleGroupItem
                    key={color.value}
                    value={color.value}
                    aria-label={color.label}
                    variant="default"
                    className="h-9! w-9! min-w-9! rounded-full! border-2 border-[#23232b]! p-0! shadow-none transition-transform hover:scale-105 data-[state=on]:border-[#f0b90b]! data-[state=on]:ring-1 data-[state=on]:ring-[#f0b90b] data-[state=on]:ring-offset-1 data-[state=on]:ring-offset-[#15151a]"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="sr-only">{color.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
