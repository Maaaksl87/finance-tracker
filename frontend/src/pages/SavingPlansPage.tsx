import SavingPlanStatsCards from "../components/saving-plans/SavingPlanStatsCards";
import { Separator } from "@/components/ui/separator";
import SavingPlansBox from "@/components/saving-plans/SavingPlansBox";
import { useState } from "react";

function SavingPlansPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  return (
    <div>
      <SavingPlanStatsCards />
      <Separator />
      <SavingPlansBox />
    </div>
  );
}

export default SavingPlansPage;
