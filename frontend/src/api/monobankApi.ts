import type { CurrencyRate } from "@/types";

export const fetchCurrencies = async (): Promise<CurrencyRate[]> => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const response = await fetch(`${API_URL}/currencies`);
  if (!response.ok) {
    throw new Error(`Помилка запиту: ${response.status}`);
  }
  return response.json();
};
