import { TransactionType } from "@/types";
import { useSavingPlanTransactions } from "@/hooks/useSavingPlans";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SavingPlansTransactionsProps {
  selectedPlanId: string | null;
}

export function SavingPlansTransactions({
  selectedPlanId,
}: SavingPlansTransactionsProps) {
  const { data: transactions, isLoading } = useSavingPlanTransactions(
    selectedPlanId || "",
  );

  if (isLoading) {
    return (
      <div className="py-8 text-sm text-center text-muted-foreground">
        Завантаження транзакцій...
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="py-8 text-sm text-center text-muted-foreground">
        Немає транзакцій для цього плану
      </div>
    );
  }

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return <Badge className="bg-green-500 hover:bg-green-600">Поповнення</Badge>;
      case TransactionType.EXPENSE:
        return <Badge variant="destructive">Витрата</Badge>;
      case TransactionType.TRANSFER:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Переказ</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("uk-UA", { minimumFractionDigits: 2 });
  };

  return (
    <div className="border rounded-md border-zinc-700">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700">
            <TableHead className="text-zinc-400">Дата</TableHead>
            <TableHead className="text-zinc-400">Тип</TableHead>
            <TableHead className="text-zinc-400">Опис</TableHead>
            <TableHead className="text-zinc-400">Джерело</TableHead>
            <TableHead className="text-right text-zinc-400">Сума</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction._id}
              className="border-zinc-700 hover:bg-zinc-800/20"
            >
              <TableCell className="text-sm text-zinc-300">
                {format(new Date(transaction.date), "d MMM yyyy, HH:mm", {
                  locale: uk,
                })}
              </TableCell>
              <TableCell>{getTypeBadge(transaction.type)}</TableCell>
              <TableCell className="text-sm text-zinc-300">
                {transaction.description || transaction.category || "—"}
              </TableCell>
              <TableCell className="text-sm text-zinc-400">
                {typeof transaction.sourceId === "object"
                  ? transaction.sourceId.name
                  : "Гаманець"}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={`font-medium ${
                    transaction.type === TransactionType.EXPENSE
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {transaction.type === TransactionType.EXPENSE ? "-" : "+"}
                  {formatAmount(transaction.amount)} ₴
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
