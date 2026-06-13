import { useState } from "react";
import { ArrowUpRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { cryptoProviderMeta } from "../../providers";
import { type CryptoSource } from "@/types/sources";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

type Props = {
  provider: CryptoSource;
};

const providerTitle: Record<CryptoSource, string> = {
  binance: "Binance API",
  bybit: "Bybit API",
  okx: "OKX API",
};

export function CryptoTokenFields({ provider }: Props) {
  const meta = cryptoProviderMeta[provider];
  const { control } = useFormContext();
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${meta.markClass}`}
          >
            {meta.mark}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">{providerTitle[provider]}</span>
            <span className="text-[11px] text-muted">{meta.tokenHint}</span>
          </div>
        </div>
        {meta.docsUrl && (
          <a
            href={meta.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-wizard-accent hover:text-wizard-accent-hover"
          >
            Інструкція
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <FormField
        name="cryptoConfig.apiKey"
        control={control}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1.5">
            <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              API Key
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  type={showApiKey ? "text" : "password"}
                  placeholder="Вставте ваш ключ"
                  className="h-11 rounded-lg border-border bg-input pl-3 pr-10 text-sm text-foreground placeholder:text-sm placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey((v) => !v)}
                  aria-label={showApiKey ? "Сховати ключ" : "Показати ключ"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                >
                  {showApiKey ? (
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

      <FormField
        name="cryptoConfig.apiSecret"
        control={control}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1.5">
            <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              API Secret
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  type={showApiSecret ? "text" : "password"}
                  placeholder="Вставте ваш secret"
                  className="h-11 rounded-lg border-border bg-input pl-3 pr-10 text-sm text-foreground placeholder:text-sm placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowApiSecret((v) => !v)}
                  aria-label={showApiSecret ? "Сховати secret" : "Показати secret"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                >
                  {showApiSecret ? (
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

      {provider === "okx" && (
        <FormField
          name="cryptoConfig.passphrase"
          control={control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FormLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Passphrase
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassphrase ? "text" : "password"}
                    placeholder="Вставте ваш passphrase"
                    className="h-11 rounded-lg border-border bg-input pl-3 pr-10 text-sm text-foreground placeholder:text-sm placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase((v) => !v)}
                    aria-label={showPassphrase ? "Сховати passphrase" : "Показати passphrase"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                  >
                    {showPassphrase ? (
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
      )}

      <Button
        type="button"
        variant="outline"
        className="w-fit rounded-lg border border-border bg-input px-4 text-sm font-medium text-foreground hover:bg-input-hover hover:text-foreground"
      >
        Перевірити з'єднання
      </Button>

      <div className="flex items-center gap-3 rounded-xl bg-input p-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-api-badge-bg text-api-badge-text">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <span className="text-[11px] leading-snug text-muted">
          Використовуйте
          <span className="font-semibold text-foreground">read-only</span> права — додаток не
          виконує транзакції.
        </span>
      </div>
    </div>
  );
}
