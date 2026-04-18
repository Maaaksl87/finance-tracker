import type { SavingPlan } from "@/types";
import { Button } from "../ui/button";
import AddNewPlan from "./AddNewPlan";
import { useState } from "react";
import ProgressBar from "./ProgressBar";

function SavingPlansList({
  plans,
  setSelectedPlanId,
}: {
  plans: SavingPlan[] | undefined;
  setSelectedPlanId: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handlePlanCreated = (planId: string) => {
    setSelectedPlanId(planId);
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden border bg-card border-card-border rounded-xl shadow-card dark:glass">
      <div className="dark:glass-overlay" />

      <div className="relative z-10 flex items-center justify-between p-4 font-medium">
        <span className="text-foreground">Saving Plans</span>

        <span className="text-sm text-foreground-muted">
          Всього: {plans?.length || 0}
        </span>

        <button className="text-foreground-muted hover:text-foreground">***</button>
      </div>

      <div className="relative z-10 flex-1 min-h-0 p-4 pt-2 space-y-2 overflow-y-auto">
        {plans?.map((plan) => (
          <div
            key={plan._id}
            onClick={() => setSelectedPlanId(plan._id)}
            className="relative p-4 transition-all border cursor-pointer rounded-xl border-card-border bg-card-list hover:bg-card-hover"
          >
            <h3 className="text-foreground">{plan.title}</h3>

            <p className="text-sm text-foreground-muted">
              $ {plan.currentAmount} / $ {plan.targetAmount}
            </p>

            <ProgressBar
              currentAmount={plan.currentAmount}
              targetAmount={plan.targetAmount}
            />

            <span className="absolute text-sm text-foreground-muted top-4 right-5">
              {plan.targetAmount
                ? ((plan.currentAmount / plan.targetAmount) * 100).toFixed(2)
                : "0.00"}
              %
            </span>
          </div>
        ))}
      </div>

      <Button className="relative z-10 m-4" onClick={() => setOpen(true)}>
        Додати новий план
      </Button>

      {open && (
        <AddNewPlan
          isOpen={open}
          onClose={() => setOpen(false)}
          onPlanCreated={handlePlanCreated}
        />
      )}
    </div>
  );
}

export default SavingPlansList;
