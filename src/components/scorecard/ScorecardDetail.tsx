import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TrendingUp, TrendingDown, Minus, Activity, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { ScorecardEntity } from "@/data/scorecardData";

interface Props {
  entity: ScorecardEntity;
}

const trendIcon = (t: "up" | "down" | "flat") =>
  t === "up" ? <TrendingUp className="h-4 w-4 text-success" /> :
  t === "down" ? <TrendingDown className="h-4 w-4 text-destructive" /> :
  <Minus className="h-4 w-4 text-muted-foreground" />;

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
          value={<span className={healthColor}>{entity.healthScore}</span> as unknown as string}
          icon={<Activity className="h-4 w-4" />}
          subtitle={`${entity.onTrackPercentage}% on track`}
        >
          <Progress value={entity.healthScore} className="h-1.5" />
        </StatCard>
        <StatCard title="On Track" value={entity.totals.onTrack} icon={<TrendingUp className="h-4 w-4 text-success" />} />
        <StatCard title="At Risk" value={entity.totals.atRisk} icon={<Clock className="h-4 w-4 text-warning" />} />
        <StatCard title="Blocked" value={entity.totals.blocked} icon={<AlertCircle className="h-4 w-4 text-destructive" />} />
        <StatCard title="Done" value={entity.totals.done} icon={<CheckCircle2 className="h-4 w-4 text-success" />} />
      </div>

      {/* Perspectives */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Perspectives</h2>
        <p className="text-sm text-muted-foreground mb-5">Balanced scorecard breakdown by strategic perspective.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {entity.perspectives.map((p) => {
            const pct = Math.min(100, Math.round((p.score / p.target) * 100));
            const color =
              pct >= 100 ? "text-success" :
              pct >= 85 ? "text-warning" : "text-destructive";
            return (
              <div key={p.name} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground">{p.name}</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-foreground">{p.score}</span>
                      <span className="text-xs text-muted-foreground">/ {p.target} target</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {trendIcon(p.trend)}
                    <span className={`font-medium ${color}`}>{pct}%</span>
                  </div>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

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