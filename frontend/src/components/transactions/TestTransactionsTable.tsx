import { format } from "date-fns";
import { uk } from "date-fns/locale"; // Українська локалізація дати
import { Trash2, ArrowRight } from "lucide-react";

import { Transaction, TransactionType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  data: Transaction[];
  onDelete: (id: string) => void;
}

export function TestTransactionsTable({ data, onDelete }: Props) {
  // Хелпер для форматування грошей
  const formatAmount = (amount: number, type: TransactionType) => {
    const isExpense = type === TransactionType.EXPENSE;
    const isIncome = type === TransactionType.INCOME;

    // Додаємо + або - для краси
    const prefix = isIncome ? "+" : isExpense ? "-" : "";

    return (
      <span
        className={
          isIncome
            ? "text-green-600 font-bold"
            : isExpense
            ? "text-red-600 font-bold"
            : "text-blue-600 font-bold"
        }
      >
        {prefix}
        {amount.toLocaleString("uk-UA", {
          minimumFractionDigits: 2,
        })}{" "}
        ₴
      </span>
    );
  };

  // Хелпер для бейджів типу
  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return <Badge className="bg-green-500 hover:bg-green-600">Дохід</Badge>;
      case TransactionType.EXPENSE:
        return <Badge variant="destructive">Витрата</Badge>; // destructive - це червоний у shadcn
      case TransactionType.TRANSFER:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Переказ</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Категорія / Опис</TableHead>
            <TableHead>Гаманець</TableHead>
            <TableHead className="text-right">Сума</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Історія порожня.
              </TableCell>
            </TableRow>
          ) : (
            data.map((transaction) => (
              <TableRow key={transaction._id}>
                {/* 1. ДАТА */}
                <TableCell className="font-medium">
                  {format(new Date(transaction.date), "d MMM yyyy, HH:mm", {
                    locale: uk,
                  })}
                </TableCell>

                {/* 2. ТИП */}
                <TableCell>{getTypeBadge(transaction.type)}</TableCell>

                {/* 3. КАТЕГОРІЯ + ОПИС */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {transaction.category}
                    </span>
                    {transaction.description && (
                      <span className="text-xs text-muted-foreground">
                        {transaction.description}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* 4. ГАМАНЕЦЬ (Звідки -> Куди) */}
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    {/* Якщо це об'єкт (populate) - беремо name, інакше ID */}
                    <span>
                      {typeof transaction.sourceId === "object"
                        ? transaction.sourceId.name
                        : "Гаманець"}
                    </span>

                    {/* Якщо це переказ, показуємо стрілочку і куди */}
                    {transaction.type === TransactionType.TRANSFER &&
                      transaction.destinationSourceId && (
                        <>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {typeof transaction.destinationSourceId === "object"
                              ? transaction.destinationSourceId.name
                              : "Гаманець"}
                          </span>
                        </>
                      )}
                  </div>
                </TableCell>

                {/* 5. СУМА */}
                <TableCell className="text-right">
                  {formatAmount(transaction.amount, transaction.type)}
                </TableCell>

                {/* 6. ДІЇ */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => onDelete(transaction._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
