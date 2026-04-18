import type { CurrencyRate } from "@/types";

export const fetchCurrencies = async (): Promise<CurrencyRate[]> => {
  const response = await fetch("http://localhost:3000/currencies");
  if (!response.ok) {
    throw new Error(`Помилка запиту: ${response.status}`);
  }
  return response.json();
};
