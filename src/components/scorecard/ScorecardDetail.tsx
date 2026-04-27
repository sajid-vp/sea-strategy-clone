import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TrendingUp, Activity, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { ScorecardEntity } from "@/data/scorecardData";

interface Props {
  entity: ScorecardEntity;
}

export const ScorecardDetail = ({ entity }: Props) => {
  const healthColor =
    entity.healthScore >= 80 ? "text-success" :
    entity.healthScore >= 65 ? "text-warning" : "text-destructive";

  return (
    <div className="space-y-6">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Health Score"
          value={entity.healthScore}
          icon={<Activity className="h-4 w-4" />}
          subtitle={`${entity.onTrackPercentage}% on track`}
          className={healthColor}
        >
          <Progress value={entity.healthScore} className="h-1.5" />
        </StatCard>
        <StatCard title="On Track" value={entity.totals.onTrack} icon={<TrendingUp className="h-4 w-4 text-success" />} />
        <StatCard title="At Risk" value={entity.totals.atRisk} icon={<Clock className="h-4 w-4 text-warning" />} />
        <StatCard title="Blocked" value={entity.totals.blocked} icon={<AlertCircle className="h-4 w-4 text-destructive" />} />
        <StatCard title="Done" value={entity.totals.done} icon={<CheckCircle2 className="h-4 w-4 text-success" />} />
      </div>

      {/* KPIs */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Key Performance Indicators</h2>
        <p className="text-sm text-muted-foreground mb-5">Tracked metrics with current value vs target.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {entity.kpis.map((k) => (
            <div key={k.name} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-medium text-foreground">{k.name}</div>
                <StatusBadge status={k.status} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">{k.value}</span>
                <span className="text-xs text-muted-foreground">{k.unit}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Target: {k.target}{k.unit}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};