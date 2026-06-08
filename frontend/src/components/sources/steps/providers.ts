import { type BankSource, type CryptoSource } from "@/types/sources";

type ProviderMeta = {
  label: string;
  mark: string; // TODO: замінити на іконки
  markClass: string;
  docsUrl?: string;
  tokenHint?: string;
  tokenPlaceholder?: string;
  note?: string;
  apiOnly?: boolean;
  disabled?: boolean;
};

export const bankProviderMeta: Record<BankSource, ProviderMeta> = {
  monobank: {
    label: "Monobank",
    mark: "M",
    markClass: "bg-[#101014] text-white",
    apiOnly: true,
  },
  privatbank: {
    label: "ПриватБанк",
    mark: "П",
    markClass: "bg-[#0ea85f] text-white",
    apiOnly: true,
    disabled: true,
  },
  pumb: {
    label: "ПУМБ",
    mark: "П",
    markClass: "bg-[#3f4bd8] text-white",
    apiOnly: true,
    disabled: true,
  },
  other: {
    label: "Інший банк",
    mark: "+",
    markClass: "bg-[#3a3a43] text-white",
    note: "Лише вручну",
    disabled: true,
  },
};

export const cryptoProviderMeta: Record<CryptoSource, ProviderMeta> = {
  bybit: {
    label: "Bybit",
    mark: "B",
    markClass: "bg-[#0ea85f] text-white",
    docsUrl: "https://www.bybit.com/app/user/api-management",
    tokenHint: "Read-only API ключ",
    apiOnly: true,
  },
  binance: {
    label: "Binance",
    mark: "B",
    markClass: "bg-[#f0b90b] text-[#0e0e12]",
    docsUrl: "https://www.binance.com/en/my/settings/api-management",
    tokenHint: "Read-only API ключ",
    apiOnly: true,
    disabled: true,
  },

  okx: {
    label: "OKX",
    mark: "O",
    markClass: "bg-[#101014] text-white",
    docsUrl: "https://www.okx.com/account/my-api",
    tokenHint: "Read-only API ключ + Passphrase",
    apiOnly: true,
    disabled: true,
  },
};
