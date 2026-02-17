import type { SavingPlan } from "@/types";
import { Button } from "../ui/button";
import AddNewPlan from "./AddNewPlan";
import { useState } from "react";

function SavingPlansList({
  plans,
  setSelectedPlanId,
}: {
  plans: SavingPlan[] | undefined;
  setSelectedPlanId: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handlePlanCreated = (planId: string) => {
    // Автоматично вибрати новостворений план
    setSelectedPlanId(planId);
  };

  return (
    <div className="border border-zinc-600 rounded-xl flex flex-col flex-1 h-full overflow-hidden">
      <div className="flex justify-between items-center p-4 font-medium">
        Saving Plans
        <span className="text-zinc-400 text-sm">Всього: {plans?.length || 0}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {plans?.map((plan) => (
          <div
            onClick={() => setSelectedPlanId(plan._id)}
            key={plan._id}
            className="border border-zinc-600 rounded-xl p-4 relative hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            <h3>{plan.title}</h3>
            <p>
              $ {plan.currentAmount} / $ {plan.targetAmount}
            </p>
            <div>
              <progress
                className="w-full h-1"
                value={plan.currentAmount}
                max={plan.targetAmount}
              />
            </div>

            <span className="flex items-center justify-end text-sm text-zinc-500 absolute top-4 right-5">
              {plan.targetAmount
                ? ((plan.currentAmount / plan.targetAmount) * 100).toFixed(2)
                : "0.00"}
              %
            </span>
          </div>
        ))}
      </div>

      <Button className="m-4" onClick={() => setOpen(true)}>
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
