import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { number } from "currency-codes-ts";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrencies } from "@/api/monobankApi";

const ListOfCurrencies = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["currencyRates"],
    queryFn: fetchCurrencies,
    staleTime: 6 * 60 * 1000,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Card className="overflow-hidden bg-card border-card-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Курси валют</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-64">
        <div className="space-y-2 text-sm text-card-foreground">
          {data?.map((curr) => (
            <div
              key={`${curr.currencyCodeA}-${curr.currencyCodeB}`}
              className="flex items-center justify-between pb-2 border-b border-card-border last:border-0"
            >
              <div className="flex gap-4">
                <span className="font-medium">
                  {number(curr.currencyCodeA)?.code || curr.currencyCodeA}
                </span>
                <span className="font-medium">
                  {number(curr.currencyCodeB)?.code || curr.currencyCodeB}
                </span>
              </div>
              <div className="text-right">
                {curr.rateCross ? (
                  <span>{curr.rateCross}</span>
                ) : (
                  <span>
                    {curr.rateBuy}/{curr.rateSell}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListOfCurrencies;
