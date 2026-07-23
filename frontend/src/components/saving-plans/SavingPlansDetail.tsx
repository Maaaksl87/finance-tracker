import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useSavingPlan } from "@/hooks/useSavingPlans";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { SavingPlansTransactions } from "./SavingPlansTransactions";
import SavingPlanChart from "./SavingPlanChart";
import ProgressBar from "./ProgressBar";
import PlanFundsDialog, { type FundsMode } from "./PlanFundsDialog";
import { formatCurrency } from "@/components/utils/numberUtils";

function DetailPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-full text-sm border bg-card border-border rounded-xl text-muted-foreground">
      {children}
    </div>
  );
}

function SavingPlansDetail({ selectedPlanId }: { selectedPlanId: string | null }) {
  const { data: plan, isLoading } = useSavingPlan(selectedPlanId || "");
  const [fundsMode, setFundsMode] = useState<FundsMode | null>(null);

  if (!selectedPlanId) return <DetailPlaceholder>Оберіть план заощаджень</DetailPlaceholder>;
  if (isLoading) return <DetailPlaceholder>Завантаження...</DetailPlaceholder>;
  if (!plan) return <DetailPlaceholder>План не знайдено</DetailPlaceholder>;

  const percentage = plan.targetAmount
    ? Math.min(Math.max((plan.currentAmount / plan.targetAmount) * 100, 0), 100)
    : 0;

  return (
    <div className="flex flex-col h-full min-h-0 gap-4 lg:flex-row">
      <div className="flex flex-col shrink-0 lg:w-2/5">
        <div className="flex flex-col flex-1 p-5 border bg-card border-border rounded-xl">
          <h2 className="mb-1 text-xl font-bold text-foreground font-heading">{plan.title}</h2>
          <p className="mb-4 font-heading">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(plan.currentAmount)}
            </span>
            <span className="ml-1 text-base font-medium text-muted-foreground">
              / {formatCurrency(plan.targetAmount)}
            </span>
          </p>
          <ProgressBar
            currentAmount={plan.currentAmount}
            targetAmount={plan.targetAmount}
            className="mb-3"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Прогрес</span>
            <span className="font-medium text-foreground">{percentage.toFixed(2)}%</span>
          </div>
          {plan.description && (
            <>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </>
          )}

          <div className="grid grid-cols-2 gap-3 pt-4 mt-auto">
            <Button onClick={() => setFundsMode("add")}>
              <ArrowDownToLine className="w-4 h-4" />
              Поповнити
            </Button>
            <Button
              variant="outline"
              onClick={() => setFundsMode("withdraw")}
              disabled={plan.currentAmount <= 0}
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Зняти
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 gap-4">
        <div className="flex flex-col p-5 border bg-card border-border rounded-xl h-[220px] lg:h-2/5 shrink-0">
          <h3 className="mb-2 text-sm font-semibold text-foreground font-heading">
            Графік додавання коштів
          </h3>
          <div className="flex-1 min-h-0">
            <SavingPlanChart selectedPlanId={selectedPlanId} />
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0 p-5 border bg-card border-border rounded-xl">
          <h3 className="mb-3 text-sm font-semibold text-foreground font-heading">Транзакції</h3>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <SavingPlansTransactions selectedPlanId={selectedPlanId} />
          </div>
        </div>
      </div>

      {fundsMode && (
        <PlanFundsDialog
          key={fundsMode}
          plan={plan}
          mode={fundsMode}
          open={!!fundsMode}
          onOpenChange={(o) => !o && setFundsMode(null)}
        />
      )}
    </div>
  );
}

export default SavingPlansDetail;
