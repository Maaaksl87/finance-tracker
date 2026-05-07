import type { ColumnDef } from "@tanstack/react-table";
import type { Transaction } from "@/types";
import { MoneyWithCurrency } from "../ui/MoneyWithCurrency";
import { formatDate } from "../utils/numberUtils";
import { TypeCell } from "../ui/table-cells";

export const getTransactionsColumns = (): ColumnDef<Transaction>[] => [
  {
    accessorKey: "date",
    header: "Дата",
    cell: ({ getValue }) => {
      return formatDate(getValue<Date>());
    },
    meta: {
      className: "text-sm dark:text-[#777777]",
    },
  },
  {
    accessorKey: "type",
    header: "Тип",
    cell: ({ row }) => <TypeCell type={row.original.type} />,
  },
  {
    accessorKey: "category",
    header: "Категорія",
  },
  {
    accessorKey: "sourceId.name",
    header: "Гаманець",
    meta: {
      className: "dark:text-[#aaaaaa]",
    },
  },
  {
    accessorKey: "amount",
    header: "Сума",
    meta: {
      className: "text-right",
      headerClassName: "text-right",
    },
    cell: ({ getValue }) => {
      return <MoneyWithCurrency amount={getValue<number>()} />;
    },
  },
];
