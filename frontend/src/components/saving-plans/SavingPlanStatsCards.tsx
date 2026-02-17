import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSavingPlans } from "@/hooks/useSavingPlans";

function SavingPlanStatsCards() {
  const { data: plans } = useSavingPlans();

  return (
    <div className="flex gap-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="font-normal">Зібрано всього</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {plans?.reduce((sum, plan) => sum + plan.currentAmount, 0) || 0}
          </p>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="font-normal">Загальна сума планів</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {plans?.reduce((sum, plan) => sum + plan.targetAmount, 0) || 0}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SavingPlanStatsCards;
