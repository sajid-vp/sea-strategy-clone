import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp } from "lucide-react";
import {
  strategicInitiatives,
  initiativeOkrContribution,
} from "@/data/scorecardData";

const importanceTone: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-muted text-muted-foreground",
};

export const InitiativePerformancePanel = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Initiative Performance</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Multi-year strategic initiatives — KPI trends, expected vs actual, and OKR contribution.
      </p>
      <div className="space-y-5">
        {strategicInitiatives.map((init) => {
          const contrib = initiativeOkrContribution(init.id);
          const gap = init.expectedProgress - init.actualProgress;
          const gapTone =
            gap <= 0
              ? "text-success"
              : gap < 10
              ? "text-warning"
              : "text-destructive";
          return (
            <div key={init.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{init.name}</h3>
                    <Badge variant="outline" className={importanceTone[init.importance]}>
                      {init.importance}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {init.startYear}–{init.endYear}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{init.description}</p>
                </div>
              </div>

              {/* Expected vs actual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Expected progress</div>
                  <div className="text-lg font-semibold text-foreground">{init.expectedProgress}%</div>
                  <Progress value={init.expectedProgress} className="h-1.5 mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Actual progress</div>
                  <div className="text-lg font-semibold text-foreground">{init.actualProgress}%</div>
                  <Progress value={init.actualProgress} className="h-1.5 mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Gap</div>
                  <div className={`text-lg font-semibold ${gapTone}`}>
                    {gap > 0 ? `-${gap}` : `+${Math.abs(gap)}`} pts
                  </div>
                  <div className="text-xs text-muted-foreground">
                    OKR contribution delivered: <span className="font-medium text-foreground">{contrib.contributionPct}%</span>
                  </div>
                </div>
              </div>

              {/* KPIs multi-year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {init.kpis.map((k) => {
                  const last = k.trend[k.trend.length - 1]?.value ?? 0;
                  return (
                    <div key={k.name} className="bg-muted/40 rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-foreground">{k.name}</div>
                        <StatusBadge status={k.status} />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-foreground">
                          {last}
                          {k.unit}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          baseline {k.baseline}
                          {k.unit} → target {k.target}
                          {k.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {k.trend.map((p) => (
                          <div key={p.year} className="flex flex-col items-center text-[10px] text-muted-foreground">
                            <span>{p.value}{k.unit}</span>
                            <span>{p.year}</span>
                          </div>
                        ))}
                        <TrendingUp className="h-3.5 w-3.5 text-success ml-auto" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};