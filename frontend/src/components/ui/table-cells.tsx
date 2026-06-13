import type { TransactionType } from "@/types";

export const TypeCell = ({ type }: { type: TransactionType }) => {
  const styleMap: Record<TransactionType, string> = {
    income: "text-type-income before:content-['↙'] before:mr-1",
    expense: "text-type-expense before:content-['↗'] before:mr-1",
    transfer: "text-type-transfer before:content-['⇄'] before:mr-1",
  };

  const labelMap: Record<TransactionType, string> = {
    income: "Дохід",
    expense: "Витрата",
    transfer: "Переказ",
  };

  return <span className={styleMap[type]}>{labelMap[type]}</span>;
};
