import DataTable from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { getTransactionsColumns } from "./getTransactionsColumns";

// import { PeriodFilter } from '@/components/stats/PeriodFilter'

import { resolvePeriod } from "@/lib/period";
import { useSearchParams } from "react-router-dom";
import { useTransactions, useTypeFilter, type TypeFilter } from '@/hooks/useTransactions'
import { CreateTransactionDialog } from "./CreateTransactionDialog";
const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "Усі" },
  { key: "expense", label: "Витрата" },
  { key: "income", label: "Дохід" },
  { key: "transfer", label: "Переказ" },
]
const TransactionsTable = ({ limit }: { limit?: number }) => {

  const columns = useMemo(() => getTransactionsColumns(), []);

  const [searchParams] = useSearchParams();
  const { startDate, endDate } = resolvePeriod(searchParams);
  const { transactions } = useTransactions(startDate, endDate, limit);
  const { filter, setFilter, filtered } = useTypeFilter(transactions);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-6">

          <div className="flex items-center gap-2">
            {TYPE_FILTERS.map(({ key, label }) => (
              <Button
                key={key}
                variant={filter === key ? "active" : "filter"}
                onClick={() => setFilter(key)}
              >
                {label}
              </Button>
            ))}
          </div>
          <span className="text-lg font-semibold border-none px-3 py-2 rounded-full bg-table-badge-bg text-table-badge-text text-[13px]">
            {filtered.length} записів
          </span>
        </div>
        <CreateTransactionDialog />
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
