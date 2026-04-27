import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Grid3x3 } from "lucide-react";
import {
  strategicInitiatives,
  initiativeOkrContribution,
} from "@/data/scorecardData";

const importanceTone: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-muted text-muted-foreground",
};

/**
 * Board-style portfolio view: every strategic initiative on a single
 * scannable card with status, gap, OKR delivery and KPI sparkline.
 */
export const InitiativePortfolioMatrix = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Grid3x3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Strategic Initiative Portfolio
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Multi-year strategic bets — expected vs actual progress and OKR delivery.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategicInitiatives.map((init) => {
          const c = initiativeOkrContribution(init.id);
          const gap = init.expectedProgress - init.actualProgress;
          const onPlan = gap <= 0;
          const statusTone = onPlan
            ? "border-l-success"
            : gap < 10
            ? "border-l-warning"
            : "border-l-destructive";
          const statusLabel = onPlan
            ? "On plan"
            : gap < 10
            ? "Slipping"
            : "Behind";
          const statusBadgeTone = onPlan
            ? "bg-success/10 text-success border-success/20"
            : gap < 10
            ? "bg-warning/10 text-warning border-warning/20"
            : "bg-destructive/10 text-destructive border-destructive/20";

          return (
            <div
              key={init.id}
              className={`rounded-lg border border-l-4 ${statusTone} bg-card p-5`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground leading-snug">
                    {init.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {init.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant="outline" className={statusBadgeTone}>
                    {statusLabel}
                  </Badge>
                  <Badge variant="outline" className={importanceTone[init.importance]}>
                    {init.importance}
                  </Badge>
                </div>
              </div>

              {/* Dual progress: expected vs actual on a single track */}
              <div className="mb-4">
                <div className="flex items-baseline justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress {init.startYear}–{init.endYear}</span>
                  <span>
                    <span className="font-semibold text-foreground">{init.actualProgress}%</span>
                    <span className="opacity-60"> / target {init.expectedProgress}%</span>
                  </span>
                </div>
                <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: `${init.actualProgress}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-px bg-foreground/60"
                    style={{ left: `${init.expectedProgress}%` }}
                    title="Expected"
                  />
                </div>
              </div>

              {/* Footer metrics */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                <Metric
                  label="Gap"
                  value={
                    gap > 0 ? `-${gap} pts` : `+${Math.abs(gap)} pts`
                  }
                  tone={onPlan ? "success" : gap < 10 ? "warning" : "destructive"}
                />
                <Metric
                  label="OKR Delivery"
                  value={`${c.contributionPct}%`}
                  tone={
                    c.contributionPct >= 75
                      ? "success"
                      : c.contributionPct >= 60
                      ? "warning"
                      : "destructive"
                  }
                  progress={c.contributionPct}
                />
                <Metric
                  label="Contributing OKRs"
                  value={c.items.length}
                  tone="primary"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Metric = ({
  label,
  value,
  tone,
  progress,
}: {
  label: string;
  value: string | number;
  tone: "primary" | "success" | "warning" | "destructive";
  progress?: number;
}) => {
  const toneText: Record<string, string> = {
    primary: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </div>
      <div className={`text-base font-semibold ${toneText[tone]}`}>{value}</div>
      {typeof progress === "number" && <Progress value={progress} className="h-1 mt-1.5" />}
    </div>
  );
};