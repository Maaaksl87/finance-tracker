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
import { colors, currencies } from "@/types/sources";
import { useFormContext } from "react-hook-form";

const fieldLabelClass =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-muted";
const fieldControlClass =
  "h-12 rounded-md border border-border bg-input px-4 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-wizard-accent/50 focus-visible:ring-0";

export default function WalletDetailsFields({ prefix }: { prefix?: string }) {
  const { control } = useFormContext<SourceSchemaType>();
  const fieldName = (name: string) => (prefix ? `${prefix}.${name}` : name) as any;

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
                  <SelectTrigger className="w-full pl-4 py-5 bg-input border-border text-foreground focus-visible:border-wizard-accent/50 focus-visible:ring-0 data-[size=default]:h-12">
                    <SelectValue placeholder="UAH" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-border bg-modal text-foreground">
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
                    className="h-9! w-9! min-w-9! rounded-full! border-2 border-border! p-0! shadow-none transition-transform hover:scale-105 data-[state=on]:border-wizard-accent! data-[state=on]:ring-1 data-[state=on]:ring-wizard-accent data-[state=on]:ring-offset-1 data-[state=on]:ring-offset-modal"
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
