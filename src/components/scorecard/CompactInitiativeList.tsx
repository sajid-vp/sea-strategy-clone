import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { strategicInitiatives } from "@/data/scorecardData";
import { Target } from "lucide-react";
import { useYear } from "./YearContext";
import { YoyChip } from "./YoyChip";
import {
  initiativeActualAtYear,
  initiativeExpectedAtYear,
  yoy,
} from "./yearMetrics";

/**
 * Dense, no-scroll initiative list — every multi-year bet visible at once,
 * progress for the selected year + YoY delta vs previous year.
 */
export const CompactInitiativeList = () => {
  const { year, availableYears } = useYear();
  const prev = availableYears.includes(year - 1) ? year - 1 : null;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Strategic Initiatives
          </h2>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {year}
          {prev !== null ? ` · YoY vs ${prev}` : ""}
        </span>
      </div>
      <div className="space-y-3">
        {strategicInitiatives.map((init) => {
          const actual = initiativeActualAtYear(init, year);
          const expected = initiativeExpectedAtYear(init, year);
          const prevActual = prev !== null ? initiativeActualAtYear(init, prev) : null;
          const delta = yoy(actual, prevActual);
          const gap = expected - actual;
          const onPlan = gap <= 0;
          const accent = onPlan
            ? "bg-success"
            : gap < 10
            ? "bg-warning"
            : "bg-destructive";
          const gapTone = onPlan
            ? "text-success"
            : gap < 10
            ? "text-warning"
            : "text-destructive";

          return (
            <div key={init.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-medium text-foreground truncate">
                    {init.name}
                  </div>
                  {init.importance === "critical" && (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] py-0"
                    >
                      critical
                    </Badge>
                  )}
                  <YoyChip delta={delta} />
                </div>
                <div className="relative h-1.5 mt-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: `${actual}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-px bg-foreground/60"
                    style={{ left: `${expected}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0 w-24">
                <div className="text-sm font-semibold text-foreground tabular-nums">
                  {actual}%
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}/ {expected}%
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  <span className={gapTone + " font-medium"}>
                    {gap > 0 ? `−${gap}` : `+${Math.abs(gap)}`} pts
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};