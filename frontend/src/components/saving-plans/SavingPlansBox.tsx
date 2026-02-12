import SavingPlansDetail from "./SavingPlansDetail";
import SavingPlansList from "./SavingPlansList";
import { useSavingPlans } from "@/hooks/useSavingPlans";

function SavingPlansBox({ children }) {
  const { data: plans, isLoading, isError } = useSavingPlans();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        {plans?.map((plan) => (<div>
          <div key={plan._id}>{plan.title}</div>
          <span>{plan.targetAmount}/</span>
          <span>{plan.currentAmount}</span>
          </div>
        ))}
      </div>
      <SavingPlansList />
      <SavingPlansDetail />
    </div>
  );
}

export default SavingPlansBox;
