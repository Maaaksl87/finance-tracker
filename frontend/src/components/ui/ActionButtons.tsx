import { Plus, Landmark, ArrowUpFromLine, Repeat } from "lucide-react";

interface ActionButtonsProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton = ({ icon, label, onClick }: ActionButtonsProps) => {
  return (
    <button onClick={onClick}>
      <div className="flex items-center justify-center w-[clamp(2em,10vw,4em)] h-[clamp(2em,6vw,3em)] dark:bg-border border dark:border-border rounded-xl text-white transition-all duration-200 ease-in-out group-hover:bg-white/10 group-active:scale-95">
        {icon}
      </div>
      <span className="text-[13px] font-medium text-gray-300 dark:text-muted transition-colors group-hover:text-white">
        {label}
      </span>
    </button>
  );
};

export default function ActionButtons() {
  const actions = [
    { label: "Дохід", icon: <Plus size={20} strokeWidth={2} /> },
    { label: "Витрати", icon: <Landmark size={20} strokeWidth={2} /> },
    { label: "Переказ", icon: <ArrowUpFromLine size={20} strokeWidth={2} /> },
    { label: "Обмін", icon: <Repeat size={20} strokeWidth={2} /> },
  ];

  return (
    <div className="flex items-center justify-center gap-4 p-6 ">
      {actions.map((action) => (
        <ActionButton
          key={action.label}
          label={action.label}
          icon={action.icon}
          onClick={() => console.log(`Clicked ${action.label}`)}
        />
      ))}
    </div>
  );
}
