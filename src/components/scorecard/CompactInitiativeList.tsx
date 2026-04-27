import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  strategicInitiatives,
  initiativeOkrContribution,
} from "@/data/scorecardData";
import { Target } from "lucide-react";

/**
 * Dense, no-scroll initiative list — every multi-year bet visible at once.
 */
export const CompactInitiativeList = () => {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Strategic Initiatives
        </h2>
      </div>
      <div className="space-y-3">
        {strategicInitiatives.map((init) => {
          const c = initiativeOkrContribution(init.id);
          const gap = init.expectedProgress - init.actualProgress;
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
              <span className={`h-8 w-1 rounded-full ${accent} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
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
                </div>
                <div className="relative h-1.5 mt-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: `${init.actualProgress}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-px bg-foreground/60"
                    style={{ left: `${init.expectedProgress}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0 w-28">
                <div className="text-sm font-semibold text-foreground tabular-nums">
                  {init.actualProgress}%
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}/ {init.expectedProgress}%
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  <span className={gapTone + " font-medium"}>
                    {gap > 0 ? `−${gap}` : `+${Math.abs(gap)}`} pts
                  </span>
                  {" · "}OKR {c.contributionPct}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};