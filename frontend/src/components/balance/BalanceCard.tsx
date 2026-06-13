import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import ActionButtons from "@/components/ui/ActionButtons";

interface BalanceCardProps {
  totalBalance: number;
}

export default function BalanceCard({ totalBalance }: BalanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Баланс</CardTitle>
        <CardAction>
          <button>···</button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3">
          <p className="text-4xl font-bold text-primary">
            {totalBalance.toLocaleString()} ₴
          </p>
        </div>

        <ActionButtons />
      </CardContent>
    </Card>
  );
}
