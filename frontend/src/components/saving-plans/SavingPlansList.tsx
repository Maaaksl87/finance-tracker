import type { SavingPlan } from '@/types';
import { Button } from '../ui/button';
import AddNewPlan from './AddNewPlan';
import { useState } from 'react';
import ProgressBar from './ProgressBar';

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
    <div className="flex flex-col flex-1 h-full overflow-hidden border border-zinc-600 rounded-xl">
      <div className="flex items-center justify-between p-4 font-medium">
        Saving Plans
        <span className="text-sm text-zinc-400">Всього: {plans?.length || 0}</span>
        <button className="button">***</button>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {plans?.map((plan) => (
          <div
            onClick={() => setSelectedPlanId(plan._id)}
            key={plan._id}
            className="relative p-4 transition-colors border cursor-pointer border-zinc-600 rounded-xl hover:bg-zinc-800/50"
          >
            <h3>{plan.title}</h3>
            <p>
              $ {plan.currentAmount} / $ {plan.targetAmount}
            </p>
            <ProgressBar selectedPlanId={plan._id} />

            <span className="absolute flex items-center justify-end text-sm text-zinc-500 top-4 right-5">
              {plan.targetAmount
                ? ((plan.currentAmount / plan.targetAmount) * 100).toFixed(2)
                : '0.00'}
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
