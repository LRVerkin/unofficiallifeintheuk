interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  current,
  total,
  label = "Quiz progress",
  className = "",
}: ProgressBarProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.max(0, Math.min(current, safeTotal));
  const percentage = (safeCurrent / safeTotal) * 100;
  const visibleText = `Question ${safeCurrent} of ${safeTotal}`;

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <div className="flex items-baseline justify-between text-sm font-medium text-[var(--color-muted-foreground)]">
        <span>{visibleText}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeCurrent}
        aria-valuetext={visibleText}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
      >
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-brand-primary transition-[width] duration-300 ease-out"
        />
      </div>
    </div>
  );
}
