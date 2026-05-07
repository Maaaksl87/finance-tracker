import type { TransactionType } from "@/types";

export const TypeCell = ({ type }: { type: TransactionType }) => {
  const styleMap: Record<TransactionType, string> = {
    income: "text-[#66bb6a] before:content-['↙'] before:mr-1",
    expense: "text-[#ef5350] before:content-['↗'] before:mr-1",
    transfer: "text-[#ab47bc] before:content-['⇄'] before:mr-1",
  };

  const labelMap: Record<TransactionType, string> = {
    income: "Дохід",
    expense: "Витрата",
    transfer: "Переказ",
  };

  return <span className={styleMap[type]}>{labelMap[type]}</span>;
};
