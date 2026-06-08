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
import WalletDetailsFields from "../WalletDetailsFields";

const bankOptions: Array<{
  value: BankSource;
  label: string;
  note?: string;
  mark: string;
  markClass: string;
}> = [
  {
    value: "monobank",
    label: "Monobank",
    mark: "M",
    markClass: "bg-[#101014] text-white",
  },
  {
    value: "privatbank",
    label: "ПриватБанк",
    mark: "П",
    markClass: "bg-[#0ea85f] text-white",
  },
  {
    value: "pumb",
    label: "ПУМБ",
    mark: "П",
    markClass: "bg-[#3f4bd8] text-white",
  },
  {
    value: "other",
    label: "Інший банк",
    note: "Лише вручну",
    mark: "+",
    markClass: "bg-[#3a3a43] text-white",
  },
];

const fieldLabelClass =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b6b76]";
const fieldControlClass =
  "h-12 rounded-xl border-[#22222a] bg-[#1b1b21] px-4 text-sm text-white shadow-none placeholder:text-[#6b6b76] focus-visible:border-[#f0b90b80] focus-visible:ring-0";

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
                {bankOptions.map((bank) => (
                  <ToggleGroupItem
                    key={bank.value}
                    value={bank.value}
                    aria-label={bank.label}
                    variant="default"
                    className="group flex h-auto w-full items-center justify-start gap-2 rounded-lg border border-transparent bg-[#1b1b21] px-2.5 py-2 text-left transition-colors hover:border-[#f0b90b66] data-[state=on]:border-[#f0b90b] data-[state=on]:bg-[#1b1b21]"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0e0e12] text-xs font-bold text-[#f0b90b] ${bank.markClass}`}
                    >
                      {bank.mark}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-[13px] font-semibold text-white">
                        {bank.label}
                      </span>
                      {bank.note ? (
                        <span className="text-[11px] leading-tight text-[#6b6b76]">
                          {bank.note}
                        </span>
                      ) : null}
                    </span>
                  </ToggleGroupItem>
                ))}
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
