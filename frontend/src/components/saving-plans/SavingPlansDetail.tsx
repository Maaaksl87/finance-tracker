import { useSavingPlan } from '@/hooks/useSavingPlans';
import { Separator } from '../ui/separator';
import { SavingPlansTransactions } from './SavingPlansTransactions';
import SavingPlanChart from './SavingPlanChart';
import ProgressBar from './ProgressBar';

function SavingPlansDetail({ selectedPlanId }: { selectedPlanId: string | null }) {
  const { data: plan, isLoading } = useSavingPlan(selectedPlanId || '');

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="flex flex-col h-full gap-4 p-4 overflow-y-auto border flex-3 border-zinc-600 rounded-xl">
      <div className="flex gap-4 h-1/3">
        <div className="flex-1 p-4 border rounded-lg border-zinc-600">
          <h2 className="mb-2 text-xl font-bold">{plan?.title}</h2>
          <p className="mb-2 text-lg">
            {plan?.currentAmount}/{plan?.targetAmount}
          </p>
          <ProgressBar selectedPlanId={selectedPlanId} />
          <p className="flex justify-between mb-2 ">
            Активно:
            <span className="">
              {plan?.targetAmount
                ? ((plan?.currentAmount / plan?.targetAmount) * 100).toFixed(2)
                : '0.00'}
              %
            </span>
          </p>
          <Separator className="my-2" />
          <p className="text-sm text-muted-foreground">{plan?.description}</p>
        </div>
        {/* TODO: зарефакторити блоки детальної фнформації та транзакцій. Переробити розташування*/}
        <div className="flex-1 p-4 border rounded-lg border-zinc-600">
          <h3 className="mb-2 text-lg font-semibold">Графік додавання коштів</h3>
          <SavingPlanChart selectedPlanId={selectedPlanId || ''} />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto border rounded-lg border-zinc-600">
        <h3 className="mb-2 text-lg font-semibold">Транзакції</h3>
        <SavingPlansTransactions selectedPlanId={selectedPlanId || null} />
      </div>
    </div>
  );
}

export default SavingPlansDetail;
