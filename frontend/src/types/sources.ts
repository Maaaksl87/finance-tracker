export const sourceTypes = [
  {
    value: "card",
    label: "Банк",
    description: "Monobank, ПриватБанк, інші",
    hasApi: true,
  },
  {
    value: "crypto",
    label: "Криптобіржа",
    description: "Binance, Bybit, OKX, інші",
    hasApi: true,
  },
  {
    value: "cash",
    label: "Готівка",
    description: "Готівковий рахунок, скарбничка",
    hasApi: false,
  },
  {
    value: "deposit",
    label: "Інше",
    description: "Депозит, борг, інвестиція",
    hasApi: false,
    disabled: true,
  },
] as const;

export const cryptoConnectionTypes = [
  { value: "binance", label: "Binance" },
  { value: "bybit", label: "Bybit" },
  { value: "okx", label: "OKX" },
] as const;

export type SourceType = (typeof sourceTypes)[number]["value"];

export const currencies = ["UAH", "USD", "EUR"] as const;
export type Currency = (typeof currencies)[number];

export const bankSources = ["monobank", "privatbank", "pumb", "other"] as const;
export const cryptoSources = ["binance", "bybit", "okx"] as const;

export const colors = [
  { value: "teal", label: "Бірюзовий", hex: "#2dd4bf" },
  { value: "green", label: "Зелений", hex: "#22c55e" },
  { value: "yellow", label: "Жовтий", hex: "#fbbf24" },
  { value: "red", label: "Червоний", hex: "#f87171" },
  { value: "blue", label: "Синій", hex: "#60a5fa" },
  { value: "purple", label: "Фіолетовий", hex: "#a78bfa" },
  { value: "gray", label: "Сірий", hex: "#9ca3af" },
] as const;

export type BankSource = (typeof bankSources)[number];
export type CryptoSource = (typeof cryptoSources)[number];
export type Color = (typeof colors)[number]["value"];

export interface Source {
  _id: string;
  name: string;
  balance: number;
  type: SourceType;
  currency: Currency;
  color: Color;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSourceDto {
  name: string;
  balance: number;
  currency: Currency;
  color: Color;
  type: SourceType;
}

export interface UpdateSourceDto {
  name?: string;
  balance?: number;
  color?: Color;
  type?: SourceType;
  currency?: Currency;
}
