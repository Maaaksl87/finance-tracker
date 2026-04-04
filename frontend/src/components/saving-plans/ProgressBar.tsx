function ProgressBar({
  currentAmount,
  targetAmount,
  className = "",
}: {
  currentAmount?: number;
  targetAmount?: number;
  className?: string;
}) {
  const rawPercentage =
    currentAmount && targetAmount ? (currentAmount / targetAmount) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(rawPercentage, 0), 100);
  const percentage = `${clampedPercentage}%`;

  return (
    <div
      className={`w-full h-1 bg-progress-track rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-progress-fill-blue"
        style={{
          width: percentage,
        }}
      />
    </div>
  );
}

export default ProgressBar;
