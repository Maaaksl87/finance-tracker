import { useState, useEffect } from "react";
import SavingPlanStatsCards from "../components/saving-plans/SavingPlanStatsCards";
import SavingPlansList from "@/components/saving-plans/SavingPlansList";
import SavingPlansDetail from "@/components/saving-plans/SavingPlansDetail";
import { useSavingPlans } from "@/hooks/useSavingPlans";

function SavingPlansPage() {
  const { data: plans, isLoading } = useSavingPlans();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPlanId && plans?.length) {
      setSelectedPlanId(plans[0]._id);
    }
  }, [plans, selectedPlanId]);

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="flex h-full overflow-hidden gap-4 p-4">
      <div className="flex flex-col w-1/3 gap-4">
        <SavingPlanStatsCards />
        <SavingPlansList plans={plans} setSelectedPlanId={setSelectedPlanId} />
      </div>
      <div className="flex-1">
        <SavingPlansDetail selectedPlanId={selectedPlanId} />
      </div>
    </div>
  );
}

export default SavingPlansPage;
