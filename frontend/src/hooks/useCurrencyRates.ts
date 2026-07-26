import { useQuery } from "@tanstack/react-query";
import { fetchCurrencies } from "@/api/monobankApi";

export const currencyRatesKey = ["currencyRates"] as const;

export function useCurrencyRates() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: currencyRatesKey,
    queryFn: fetchCurrencies,
    staleTime: 6 * 60 * 1000,
  });

  return { rates: data ?? [], isPending, isError, error };
}
