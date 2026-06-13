import type { Transaction } from "@/types";
import DataTable from "@/components/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { memo, useEffect, useMemo, useState } from "react";
import { getTransactionsColumns } from "./getTransactionsColumns";
import { getTransactions } from "@/api/transactions";
import { TestCreateTransactionDialog } from "./TestCreateTransactionDialog";

const TransactionsTable = ({ limit }: { limit?: number }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | "expense" | "income" | "transfer">("all");
  const [isLoading, setIsLoading] = useState(true);
  const columns = useMemo(() => getTransactionsColumns(), []);

  const fetchData = async () => {
    try {
      const { transactions: data } = await getTransactions({ limit });
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = useMemo(() => {
    switch (filter) {
      case "expense":
        return transactions.filter((t) => t.type === "expense");
      case "income":
        return transactions.filter((t) => t.type === "income");
      case "transfer":
        return transactions.filter((t) => t.type === "transfer");
      default:
        return transactions;
    }
  }, [transactions, filter]);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold border-none px-3 py-2 rounded-full bg-table-badge-bg text-table-badge-text text-[13px]">
          {filteredTransactions.length} записів
        </span>
        <TestCreateTransactionDialog onSuccess={fetchData} />
      </div>
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "active" : "filter"}
          onClick={() => setFilter("all")}
        >
          Усі
        </Button>
        <Button
          variant={filter === "expense" ? "active" : "filter"}
          onClick={() => setFilter("expense")}
        >
          Витрата
        </Button>
        <Button
          variant={filter === "income" ? "active" : "filter"}
          onClick={() => setFilter("income")}
        >
          Дoхід
        </Button>
        <Button
          variant={filter === "transfer" ? "active" : "filter"}
          onClick={() => setFilter("transfer")}
        >
          Переказ
        </Button>
      </div>

      <DataTable
        data={filteredTransactions}
        columns={columns}
        className="[&_tr]:border-0 [&_td]:py-4 [&_th]:py-4"
      />
    </>
  );
};

export default memo(TransactionsTable);
