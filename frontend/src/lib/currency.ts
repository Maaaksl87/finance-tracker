import { code as getCurrencyRecord } from "currency-codes-ts";
import type { Currency, CurrencyRate } from "@/types";

const UAH_NUMERIC_CODE = "980";

export function getUahRate(currency: Currency, rates: CurrencyRate[]): number | undefined {
  if (currency === "UAH") return 1;

  const targetCode = getCurrencyRecord(currency)?.number;
  if (!targetCode) return undefined;

  const pair = rates.find((r) => {
    const a = String(r.currencyCodeA);
    const b = String(r.currencyCodeB);
    return (a === targetCode && b === UAH_NUMERIC_CODE) || (b === targetCode && a === UAH_NUMERIC_CODE);
  });
  if (!pair) return undefined;

  const rate = pair.rateCross ?? (
    pair.rateBuy !== undefined && pair.rateSell !== undefined
      ? (pair.rateBuy + pair.rateSell) / 2
      : (pair.rateBuy ?? pair.rateSell)
  );
  if (rate === undefined) return undefined;

  const isTargetBase = String(pair.currencyCodeA) === targetCode;
  return isTargetBase ? rate : 1 / rate;
}

export function convertToUAH(amount: number, currency: Currency, rates: CurrencyRate[]): number {
  const rate = getUahRate(currency, rates);
  return rate === undefined ? amount : amount * rate;
}
