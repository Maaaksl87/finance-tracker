import { useState, useEffect } from "react";
import { ArrowUpRight, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { bankProviderMeta } from "../providers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import type { SourceSchemaType } from "@/components/sources/source.schema";
import { bankSources, colors } from "@/types/sources";

interface Account {
  id: string;
  type: string;
  balance: number;
  creditLimit: number;
  currencyCode: number;
  maskedPan: string[];
  iban: string;
}

interface ClientInfo {
  name: string;
  accounts: Account[];
}

const CURRENCY: Record<number, string> = {
  980: "UAH",
  840: "USD",
  978: "EUR",
};

const fieldLabelClass =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-muted";

export default function BankApiForm() {
  const { control, watch, setValue } = useFormContext<SourceSchemaType>();
  const bankConfig = watch("cardConfig.bank");
  const token = watch("cardConfig.apiToken");

  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setAccounts([]);
    setError("");
    setValue("cardConfig.accountId", "");
    setValue("cardConfig.accountName", "");
    setValue("cardConfig.accountBalance", 0);
    setValue("cardConfig.accountCurrency", "");
  }, [token, bankConfig, setValue]);

  const handleCheckConnection = async () => {
    if (!token || !token.trim()) {
      setError("Будь ласка, введіть API токен");
      return;
    }
    setLoading(true);
    setError("");
    setAccounts([]);
    try {
      const res = await fetch("https://api.monobank.ua/personal/client-info", {
        headers: { "X-Token": token.trim() },
      });
      if (!res.ok) {
        throw new Error(
          res.status === 403
            ? "Невірний токен або доступ заборонено"
            : `Помилка ${res.status}: ${res.statusText}`
        );
      }
      const data: ClientInfo = await res.json();
      if (data.accounts && data.accounts.length > 0) {
        setAccounts(data.accounts);
      } else {
        setError("У клієнта немає активних рахунків");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не вдалося з'єднатися з Monobank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={control}
        name="cardConfig.bank"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Провайдер
            </FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                value={field.value ?? ""}
                spacing={1}
                onValueChange={(value) => {
                  if (value) field.onChange(value);
                }}
                className="grid w-full grid-cols-3 gap-2"
              >
                {bankSources
                  .filter((value) => bankProviderMeta[value].apiOnly)
                  .map((bank) => (
                    <ToggleGroupItem
                      key={bank}
                      value={bank}
                      disabled={bankProviderMeta[bank].disabled}
                      className="group flex! h-auto w-full! items-center! justify-start! gap-2 rounded-lg! border! border-transparent! bg-input! px-2.5! py-2 text-left transition-colors hover:border-wizard-accent/40! data-[state=on]:border-wizard-accent! data-[state=on]:bg-input! disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-input text-xs font-bold text-wizard-accent">
                        {bankProviderMeta[bank].mark}
                      </span>
                      <span className="truncate text-[13px] font-semibold text-foreground">
                        {bankProviderMeta[bank].label}
                      </span>
                    </ToggleGroupItem>
                  ))}
              </ToggleGroup>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      {bankConfig === "monobank" && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-input text-sm font-bold text-wizard-accent">
                {bankProviderMeta[bankConfig].mark}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Monobank API</span>
                <span className="text-[11px] text-muted">
                  X-Token з api.monobank.ua
                </span>
              </div>
            </div>
            <a
              href="https://api.monobank.ua/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-wizard-accent hover:text-wizard-accent-hover"
            >
              Інструкція
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <FormField
            name="cardConfig.apiToken"
            control={control}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1.5">
                <FormLabel
                  htmlFor="X-Token"
                  className="text-[11px] font-semibold uppercase tracking-wider text-muted"
                >
                  X-Token
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      id="X-Token"
                      type={showToken ? "text" : "password"}
                      placeholder="Вставте ваш ключ"
                      className="h-11 rounded-lg border-border bg-input pl-3 pr-10 text-sm text-foreground placeholder:text-sm placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken((v) => !v)}
                      aria-label={showToken ? "Сховати ключ" : "Показати ключ"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                    >
                      {showToken ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleCheckConnection}
            disabled={loading}
            className="w-fit rounded-lg border border-border bg-input px-4 text-sm font-medium text-foreground hover:bg-input-hover hover:text-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Перевірка...
              </>
            ) : (
              "Перевірити з'єднання"
            )}
          </Button>

          {error && (
            <p className="text-xs font-semibold text-red-500">
              {error}
            </p>
          )}

          {accounts.length > 0 && (
            <FormField
              name="cardConfig.accountId"
              control={control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5 mt-2">
                  <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Оберіть картку (рахунок)
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        const selectedAcc = accounts.find((a) => a.id === val);
                        if (selectedAcc) {
                          const currencySymbol = CURRENCY[selectedAcc.currencyCode] || "UAH";
                          const formattedPan = selectedAcc.maskedPan?.[0]
                            ? `*${selectedAcc.maskedPan[0].slice(-4)}`
                            : `IBAN *${selectedAcc.iban.slice(-4)}`;

                          const accTypeLabel =
                            selectedAcc.type === "black" ? "Чорна" :
                              selectedAcc.type === "white" ? "Біла" :
                                selectedAcc.type === "fop" ? "ФОП" :
                                  selectedAcc.type === "platinum" ? "Платинова" :
                                    selectedAcc.type === "gold" ? "Золота" :
                                      selectedAcc.type === "ePidtrymka" ? "єПідтримка" :
                                        selectedAcc.type;

                          const accountName = `Monobank ${accTypeLabel} ${formattedPan}`;
                          const accountBalance = selectedAcc.balance / 100;
                          const accountCurrency = currencySymbol;

                          setValue("cardConfig.accountName", accountName);
                          setValue("cardConfig.accountBalance", accountBalance);
                          setValue("cardConfig.accountCurrency", accountCurrency);
                        }
                      }}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger className="h-11 w-full! rounded-lg border border-border bg-input px-3 text-sm text-foreground placeholder:text-sm placeholder:text-muted-foreground focus:border-wizard-accent/40">
                        <SelectValue placeholder="Оберіть рахунок..." />
                      </SelectTrigger>
                      <SelectContent className="border border-border bg-modal text-foreground">
                        {accounts.map((acc) => {
                          const currencySymbol = CURRENCY[acc.currencyCode] || "UAH";
                          const cardNum = acc.maskedPan?.[0] ?? acc.iban;
                          const formattedCard = cardNum.length > 16
                            ? `${cardNum.slice(0, 4)}...${cardNum.slice(-4)}`
                            : cardNum;
                          const balanceStr = (acc.balance / 100).toFixed(2);

                          const accTypeLabel =
                            acc.type === "black" ? "Чорна" :
                              acc.type === "white" ? "Біла" :
                                acc.type === "fop" ? "ФОП" :
                                  acc.type === "platinum" ? "Платинова" :
                                    acc.type === "gold" ? "Золота" :
                                      acc.type === "ePidtrymka" ? "єПідтримка" :
                                        acc.type;

                          return (
                            <SelectItem
                              key={acc.id}
                              value={acc.id}
                              className="focus:bg-input-hover focus:text-foreground cursor-pointer"
                            >
                              <span>
                                {accTypeLabel} — {formattedCard} ({balanceStr} {currencySymbol})
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}
      <FormField
        control={control}
        name="cardConfig.color"
        defaultValue={colors[Math.floor(Math.random() * colors.length)].value}
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

      {/* {bankConfig === "other" && <div>Other bank form</div>} */}

      <div className="flex items-center gap-3 rounded-xl bg-input p-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-api-badge-bg text-api-badge-text">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <span className="text-[11px] leading-snug text-muted">
          Використовуйте <span className="font-semibold text-foreground">read-only</span> права
          — додаток не виконує транзакції.
        </span>
      </div>
    </div>
  );
}
