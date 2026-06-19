import DataTable from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { getTransactionsColumns } from "./getTransactionsColumns";
import { TestCreateTransactionDialog } from "./TestCreateTransactionDialog";
import { PeriodFilter } from '@/components/stats/PeriodFilter'
import { resolvePeriod } from "@/lib/period";
import { useSearchParams } from "react-router-dom";
import { useTransactions, useTypeFilter, type TypeFilter } from '@/hooks/useTransactions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "Усі" },
  { key: "expense", label: "Витрата" },
  { key: "income", label: "Дохід" },
  { key: "transfer", label: "Переказ" },
];

const TransactionsTable = ({ limit }: { limit?: number }) => {

  const columns = useMemo(() => getTransactionsColumns(), []);

  const [searchParams] = useSearchParams();
  const { startDate, endDate } = resolvePeriod(searchParams);
  const { transactions } = useTransactions(startDate, endDate, limit);
  const { filter, setFilter, filtered } = useTypeFilter(transactions);

  const currentTypeLabel = TYPE_FILTERS.find((f) => f.key === filter)?.label ?? "Усі";

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold border-none px-3 py-2 rounded-full bg-table-badge-bg text-table-badge-text text-[13px]">
          {filtered.length} записів
        </span>
        <TestCreateTransactionDialog />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="filter" className="flex items-center gap-1">
              {currentTypeLabel}
              <ChevronDown className="size-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {TYPE_FILTERS.map(({ key, label }) => (
              <DropdownMenuItem
                key={key}
                onSelect={() => setFilter(key)}
                className={filter === key ? "font-medium text-foreground" : ""}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <PeriodFilter />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        className="[&_tr]:border-0 [&_td]:py-4 [&_th]:py-4"
      />

    </>
  );
};

export default TransactionsTable;
