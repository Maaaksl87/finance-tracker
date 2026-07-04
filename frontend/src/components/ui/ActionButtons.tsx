import { ArrowUp, ArrowRightLeft, Repeat } from "lucide-react";
import { forwardRef } from "react";
import { CreateTransactionDialog } from "@/components/transactions/CreateTransactionDialog";
import { TransactionType } from "@/types";

interface ActionButtonsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonsProps>(
  ({ icon, label, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`group flex flex-1 flex-col items-center justify-center gap-1.5 py-[10px] bg-transparent border border-[#283029] rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#131713] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:scale-100 ${className || ""}`}
        {...props}
      >
        <span className="text-primary transition-colors group-hover:text-primary/80 group-disabled:group-hover:text-primary">
          {icon}
        </span>
        <span className="text-[11px] font-medium text-zinc-300 transition-colors group-hover:text-white group-disabled:group-hover:text-zinc-300">
          {label}
        </span>
      </button>
    );
  });
ActionButton.displayName = "ActionButton";

export default function ActionButtons() {
  const actions = [
    { label: "Дохід", icon: <ArrowUp size={16} strokeWidth={1.8} className="rotate-180" />, type: TransactionType.INCOME },
    { label: "Витрати", icon: <ArrowUp size={16} strokeWidth={1.8} />, type: TransactionType.EXPENSE },
    { label: "Переказ", icon: <Repeat size={16} strokeWidth={1.8} className="rotate-45" />, type: TransactionType.TRANSFER },
    { label: "Обмін", icon: <ArrowRightLeft size={16} strokeWidth={1.8} />, type: TransactionType.TRANSFER, disabled: true },
  ];

  return (
    <div className="flex w-full items-center justify-between gap-3">
      {actions.map((action) => (
        <CreateTransactionDialog
          key={action.label}
          defaultType={action.type}
          trigger={
            <ActionButton
              label={action.label}
              icon={action.icon}
              disabled={action.disabled}
            />
          }
        />
      ))}
    </div>
  );
}
