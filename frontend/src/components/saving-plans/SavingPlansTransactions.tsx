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
        return <Badge className="bg-status-positive hover:bg-status-positive/80 text-white">Поповнення</Badge>;
      case TransactionType.EXPENSE:
        return <Badge variant="destructive">Витрата</Badge>;
      case TransactionType.TRANSFER:
        return <Badge className="bg-stats-neutral hover:bg-stats-neutral/80 text-white">Переказ</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("uk-UA", { minimumFractionDigits: 2 });
  };

  return (
    <div className="border rounded-md border-table-border">
      <Table>
        <TableHeader>
          <TableRow className="border-table-border">
            <TableHead className="text-foreground">Дата</TableHead>
            <TableHead className="text-foreground">Тип</TableHead>
            <TableHead className="text-foreground">Опис</TableHead>
            <TableHead className="text-foreground">Джерело</TableHead>
            <TableHead className="text-right text-foreground">Сума</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction._id}
              className="border-table-border hover:bg-table-row-hover"
            >
              <TableCell className="text-sm text-table-cell-secondary">
                {format(new Date(transaction.date), "d MMM yyyy, HH:mm", {
                  locale: uk,
                })}
              </TableCell>
              <TableCell>{getTypeBadge(transaction.type)}</TableCell>
              <TableCell className="text-sm text-table-cell-secondary">
                {transaction.description || transaction.category || "—"}
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {typeof transaction.sourceId === "object"
                  ? transaction.sourceId.name
                  : "Гаманець"}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={`font-medium ${
                    transaction.type === TransactionType.EXPENSE
                      ? "text-status-negative"
                      : "text-status-positive"
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
