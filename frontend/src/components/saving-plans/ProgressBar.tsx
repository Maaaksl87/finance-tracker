import { useSavingPlan } from '../../hooks/useSavingPlans';

function ProgressBar({
  selectedPlanId,
  className = '',
}: {
  selectedPlanId: string | null;
  className?: string;
}) {
  const { data: plan } = useSavingPlan(selectedPlanId || '');
  const percentage = `${plan?.currentAmount && plan?.targetAmount ? (plan?.currentAmount / plan?.targetAmount) * 100 : 0}%`;

  return (
    <div className={`w-full h-1 bg-gray-400 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-500"
        style={{
          width: percentage,
        }}
      />
    </div>
  );
}

export default ProgressBar;
