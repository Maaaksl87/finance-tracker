import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cryptoSources, type CryptoSource } from "@/types/sources";
import { CryptoTokenFields } from "./tokenField/CryptoTokenField";
import { useFormContext } from "react-hook-form";
import { cryptoProviderMeta } from "../providers";

export default function CryptoApiForm() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="cryptoConfig.provider"
      render={({ field }) => {
        const provider = (field.value ?? "binance") as CryptoSource;

        return (
          <>
            <FormItem className="grid gap-2">
              <FormLabel>Провайдер</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value ?? "binance"}
                  spacing={1}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  className="grid w-full grid-cols-2 gap-2 md:grid-cols-3"
                >
                  {cryptoSources
                    .filter((source) => cryptoProviderMeta[source].apiOnly)
                    .map((source) => {
                      const meta = cryptoProviderMeta[source];

                      return (
                        <ToggleGroupItem
                          key={source}
                          value={source}
                          disabled={meta.disabled}
                          className="group flex! h-auto w-full! items-center! justify-start! gap-2 rounded-lg! border! border-transparent! bg-input! px-2.5! py-2 text-left transition-colors hover:border-wizard-accent/40! data-[state=on]:border-wizard-accent! data-[state=on]:bg-input! disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${meta.markClass}`}
                          >
                            {meta.mark}
                          </span>
                          <span className="truncate text-[13px] font-semibold text-foreground">
                            {meta.label}
                          </span>
                        </ToggleGroupItem>
                      );
                    })}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>

            <CryptoTokenFields provider={provider} />
          </>
        );
      }}
    />
  );
}
