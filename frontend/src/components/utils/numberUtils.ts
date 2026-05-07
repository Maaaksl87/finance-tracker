type CurrencyFormatOptions = {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
};

type DateFormatOptions = {
  locale?: string;
  day?: "2-digit" | "numeric";
  month?: "2-digit" | "numeric" | "short" | "long" | "narrow";
  year?: "2-digit" | "numeric";
  hour?: "2-digit" | "numeric";
  minute?: "2-digit" | "numeric";
};

const currencyFormatters = new Map<string, Intl.NumberFormat>();
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

const defaultCurrency: Required<CurrencyFormatOptions> = {
  locale: "uk-UA",
  currency: "UAH",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currencyDisplay: "symbol",
};

const defaultDateTime: DateFormatOptions = {
  locale: "uk-UA",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

function getCurrencyFormatter(options: Required<CurrencyFormatOptions>) {
  const key = JSON.stringify(options);
  let formatter = currencyFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(options.locale, {
      style: "currency",
      currency: options.currency,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits,
      currencyDisplay: options.currencyDisplay,
    });
    currencyFormatters.set(key, formatter);
  }
  return formatter;
}

function getDateFormatter(options: DateFormatOptions) {
  const key = JSON.stringify(options);
  let formatter = dateFormatters.get(key);
  if (!formatter) {
    const { locale = "uk-UA", ...dateTimeOptions } = options;
    formatter = new Intl.DateTimeFormat(locale, dateTimeOptions);
    dateFormatters.set(key, formatter);
  }
  return formatter;
}

export function formatCurrency(amount: number, options: CurrencyFormatOptions = {}) {
  const config: Required<CurrencyFormatOptions> = { ...defaultCurrency, ...options };
  return getCurrencyFormatter(config).format(amount);
}

export function formatDate(
  value: Date | string | number,
  options: DateFormatOptions = {},
) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return getDateFormatter({ ...defaultDateTime, ...options }).format(date);
}
