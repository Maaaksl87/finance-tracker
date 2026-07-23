interface CategoryBarProps {
  segments: { category: string; color: string; fraction: number }[];
}

export function CategoryBar({ segments }: CategoryBarProps) {
  return (
    <div className="flex h-5.5 w-full gap-0.5 overflow-hidden rounded-full bg-input">
      {segments.map((segment) => (
        <div
          key={segment.category}
          style={{ backgroundColor: segment.color, flexBasis: `${segment.fraction * 100}%` }}
        />
      ))}
    </div>
  );
}
