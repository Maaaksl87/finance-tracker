import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrencies } from "@/api/monobankApi";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import type { CurrencyRate } from "@/types";
import { CurrencyRow } from "./CurrencyRow";

const ListOfCurrencies = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["currencyRates"],
    queryFn: fetchCurrencies,
    staleTime: 6 * 60 * 1000,
  });

  const currencyRows = useMemo(() => {
    return data?.map((curr: CurrencyRate) => (
      <CurrencyRow key={`${curr.currencyCodeA}-${curr.currencyCodeB}`} curr={curr} />
    ));
  }, [data]);

  return (
    <Card className="overflow-hidden bg-card border-card-border">
      <CardHeader>
        <CardTitle>Курси валют</CardTitle>
      </CardHeader>


      <CardContent>
        {isPending || isError ? (
          <div className="flex items-center justify-center py-6">
            <span className={`text-sm ${isError ? "text-destructive" : "text-muted-foreground"}`}>
              {isPending ? "Завантаження..." : `Помилка: ${error?.message}`}
            </span>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-64 [&_[data-slot=table-container]]:overflow-visible">
            <Table className="[&_tr]:border-0 [&_td]:py-3 [&_th]:py-3">
              <TableHeader className="uppercase sticky top-0 bg-card z-10">
                <TableRow className="">
                  <TableHead className="uppercase dark:text-table-muted text-xs font-semibold bg-card">
                    Валюта
                  </TableHead>
                  <TableHead className="uppercase dark:text-table-muted text-xs font-semibold text-right bg-card">
                    Курс
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencyRows}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListOfCurrencies;
