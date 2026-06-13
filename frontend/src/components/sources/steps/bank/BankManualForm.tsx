import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { SourceSchemaType } from "@/components/sources/source.schema";
import { colors, currencies, bankSources, type BankSource } from "@/types/sources";
import { useFormContext } from "react-hook-form";
import WalletDetailsFields from "../WalletDetailsFields";
import { bankProviderMeta } from "../providers";

const fieldLabelClass =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-muted";

export default function BankManualForm() {
  const { control } = useFormContext<SourceSchemaType>();

  return (
    <div className="grid gap-5">
      <FormField
        control={control}
        name="cardConfig.bank"
        defaultValue="monobank"
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel className={fieldLabelClass}>БРЕНД (НЕОБОВ'ЯЗКОВО)</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                spacing={1}
                value={field.value ?? ""}
                onValueChange={(value) => {
                  if (value) {
                    field.onChange(value);
                  }
                }}
                className="grid w-full grid-cols-2 gap-3 md:grid-cols-3"
              >
                {bankSources.map((bank) => {
                  const meta = bankProviderMeta[bank];
                  return (
                    <ToggleGroupItem
                      key={bank}
                      value={bank}
                      aria-label={meta.label}
                      disabled={meta.disabled}
                      variant="default"
                      className="group flex h-auto w-full items-center justify-start gap-2 rounded-lg border border-transparent bg-input px-2.5 py-2 text-left transition-colors hover:border-wizard-accent/40 data-[state=on]:border-wizard-accent data-[state=on]:bg-input disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${meta.markClass}`}
                      >
                        {meta.mark}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-[13px] font-semibold text-foreground">
                          {meta.label}
                        </span>
                        {meta.note ? (
                          <span className="text-[11px] leading-tight text-muted">
                            {meta.note}
                          </span>
                        ) : null}
                      </span>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <WalletDetailsFields prefix="cardConfig" />
    </div>
  );
}
