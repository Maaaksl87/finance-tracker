import type { SavingPlan } from "@/types";
import { Button } from "../ui/button";
import AddNewPlan from "./AddNewPlan";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Plus, MoreVertical } from "lucide-react";

function SavingPlansList({
  plans,
  setSelectedPlanId,
  className,
}: {
  plans: SavingPlan[] | undefined;
  setSelectedPlanId: (id: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const handlePlanCreated = (planId: string) => {
    setSelectedPlanId(planId);
  };

  return (
    <Card className={`${className} flex flex-col h-[472px] border bg-card border-card-border rounded-xl`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Плани заощаджень</CardTitle>
          <span className="bg-card-list border-0 rounded px-2 py-0.5 text-xs text-foreground-muted font-medium">
            {plans?.length || 0}
          </span>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex-1 min-h-0 pt-2 space-y-3 overflow-y-auto">
        {plans?.map((plan) => {
          const percentage = plan.targetAmount
            ? Math.min(Math.max((plan.currentAmount / plan.targetAmount) * 100, 0), 100)
            : 0;

          return (
            <div
              key={plan._id}
              onClick={() => setSelectedPlanId(plan._id)}
              className="p-5 transition-all bg-card dark:bg-transparent border cursor-pointer rounded-2xl border-border dark:border-[#283029] hover:bg-card-hover dark:hover:bg-[#131713]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-foreground">{plan.title}</h3>
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="w-full h-2.5 bg-[#bce381] dark:bg-[var(--color-dark-primary)] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-secondary-foreground dark:bg-primary"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <div>
                  <span className="font-semibold text-foreground">${plan.currentAmount}</span>
                  <span className="ml-2 font-medium text-muted-foreground">
                    {Math.round(percentage)}%
                  </span>
                </div>
                <span className="font-medium text-muted-foreground">${plan.targetAmount}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="pt-4">
        <Button variant={"outline"} className="relative z-10 w-full" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4 text-accent-foreground" />Додати новий план
        </Button>
      </CardFooter>
      {open && (
        <AddNewPlan
          isOpen={open}
          onClose={() => setOpen(false)}
          onPlanCreated={handlePlanCreated}
        />
      )}
    </Card>
  );
}

export default SavingPlansList;
