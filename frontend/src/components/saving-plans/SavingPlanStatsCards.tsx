import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSavingPlans } from "@/hooks/useSavingPlans";
import { formatCurrency } from "@/components/utils/numberUtils";

function SavingPlanStatsCards() {
  const { data: plans } = useSavingPlans();

  const totalSaved = plans?.reduce((sum, plan) => sum + plan.currentAmount, 0) || 0;
  const totalTarget = plans?.reduce((sum, plan) => sum + plan.targetAmount, 0) || 0;

  return (
    <div className="flex gap-2">
      <Card className="flex-1 text-left">
        <CardHeader className="">
          <CardTitle className="font-normal">Зібрано всього</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-heading">{formatCurrency(totalSaved)}</p>
        </CardContent>
      </Card>
      <Card className="flex-1 text-left">
        <CardHeader>
          <CardTitle className="font-normal">Цільова сума</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-heading">{formatCurrency(totalTarget)}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SavingPlanStatsCards;
