import { useSavingPlan } from '@/hooks/useSavingPlans';
import { Separator } from '../ui/separator';

function SavingPlansDetail({ selectedPlanId }: { selectedPlanId: string | null }) {
  const { data: plan, isLoading } = useSavingPlan(selectedPlanId || '');

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="flex flex-3 flex-col gap-4 border border-zinc-600 rounded-xl p-4 h-full overflow-y-auto">
      <div className="flex gap-4 h-1/3">
        <div className="flex-1 border border-zinc-600 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">{plan?.title}</h2>
          <p className="text-lg mb-2">
            {plan?.currentAmount}/{plan?.targetAmount}
          </p>
          {/* TODO: переробити на окремий компонент прогресу, додати анімацію*/}
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${plan?.currentAmount && plan?.targetAmount ? (plan?.currentAmount / plan?.targetAmount) * 100 : 0}%`,
              }} 
            />
          </div>
          <p className="mb-2">
            Активно:
            {plan?.targetAmount
              ? ((plan?.currentAmount / plan?.targetAmount) * 100).toFixed(2)
              : '0.00'}
            %
          </p>
          <Separator className="my-2" />
          <p className="text-sm text-muted-foreground">{plan?.description}</p>
        </div>
        {/* TODO: зарефакторити блоки детальної фнформації та транзакцій. Переробити розташування*/}
        <div className="flex-1 border border-zinc-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Графік додавання коштів</h3>
          {/* Тут буде графік */}
        </div>
      </div>

      <div className="flex-1 border border-zinc-600 rounded-lg p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-2">Транзакції</h3>
        {/* Тут буде список транзакцій */}
      </div>
    </div>
  );
}

export default SavingPlansDetail;
