
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Загальний баланс</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$0.00</p>
        </CardContent>
      </Card>
    </div>
  );
}