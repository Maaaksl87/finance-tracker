import { FormField } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import CryptoApiForm from "./crypto/CryptoApiForm";
import CryptoManualForm from "./crypto/CryptoManualForm";

export default function Step2Crypto() {
  const { control, watch } = useFormContext();
  const connectionType = watch("cryptoConfig.connectionType", "api") as "api" | "manual";

  return (
    <div className="grid gap-4">
      <FormField
        control={control}
        name="cryptoConfig.connectionType"
        defaultValue="api"
        render={({ field }) => (
          <ToggleGroup
            type="single"
            value={field.value}
            onValueChange={(value) => {
              if (value) {
                field.onChange(value);
              }
            }}
            spacing={0}
            className="grid w-full grid-cols-2 gap-0 rounded-xl bg-[#1b1b21] p-1"
          >
            <ToggleGroupItem
              value="api"
              variant="default"
              className="group flex! h-auto w-full! items-center! justify-center! rounded-3xl! border-0! bg-transparent! px-4 py-4 text-center transition-colors data-[state=on]:bg-[#17171c]!"
            >
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#6b6b76] transition-colors group-data-[state=on]:text-white">
                    Через API
                  </span>
                  <span className="rounded-full bg-[#2b2108] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#f0b90b]">
                    Рекомендовано
                  </span>
                </div>
                <span className="text-xs font-medium text-[#6b6b76] transition-colors group-data-[state=on]:text-[#8a8a94]">
                  Автосинхронізація
                </span>
              </div>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="manual"
              variant="default"
              className="group flex! h-auto w-full! items-center! justify-center! rounded-3xl! border-0! bg-transparent! px-4 py-4 text-center transition-colors data-[state=on]:bg-[#17171c]!"
            >
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-base font-bold text-[#6b6b76] transition-colors group-data-[state=on]:text-white">
                  Вручну
                </span>
                <span className="text-xs font-medium text-[#6b6b76] transition-colors group-data-[state=on]:text-[#8a8a94]">
                  Самостійне ведення
                </span>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      />

      {connectionType === "api" && <CryptoApiForm />}
      {connectionType === "manual" && <CryptoManualForm />}
    </div>
  );
}
