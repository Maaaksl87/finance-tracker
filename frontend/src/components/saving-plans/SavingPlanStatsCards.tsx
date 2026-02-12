import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SavingPlanStatsCards() {
  return (
    <div className="grid gap-4 mb-3 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Зібрано всього</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$2000.00</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Загальна сума планів</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$90000.00</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Загальна кількість планів</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">5</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SavingPlanStatsCards;
