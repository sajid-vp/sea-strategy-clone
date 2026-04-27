import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  delta: number | null;
  /** "higher is better" (default) or "lower is better" */
  invert?: boolean;
  unit?: string;
}

/**
 * Compact YoY growth chip. Green for good, red for bad, neutral for 0/null.
 */
export const YoyChip = ({ delta, invert = false, unit = "pts" }: Props) => {
  if (delta === null || delta === undefined) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
        <Minus className="h-3 w-3" />
        no prior
      </span>
    );
  }
  const sign = delta > 0 ? "+" : "";
  const isPositive = invert ? delta < 0 : delta > 0;
  const isNegative = invert ? delta > 0 : delta < 0;
  const tone =
    delta === 0
      ? "text-muted-foreground bg-muted"
      : isPositive
      ? "text-success bg-success/10"
      : "text-destructive bg-destructive/10";
  const Icon = delta === 0 ? Minus : isNegative ? TrendingDown : TrendingUp;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium ${tone}`}
      title={`Year-over-year change: ${sign}${delta} ${unit}`}
    >
      <Icon className="h-3 w-3" />
      {sign}
      {delta} {unit}
    </span>
  );
};