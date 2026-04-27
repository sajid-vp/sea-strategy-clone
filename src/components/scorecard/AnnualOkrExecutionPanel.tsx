import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Activity, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import {
  annualOkrSnapshot,
  departmentObjectives,
  departmentScorecards,
} from "@/data/scorecardData";

export const AnnualOkrExecutionPanel = () => {
  const snap = annualOkrSnapshot();
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Annual OKR Execution</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        This year's commitments delivering the strategy — aggregated across all departments.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Tile label="Objectives" value={snap.totalObjectives} icon={<Activity className="h-4 w-4 text-primary" />} />
        <Tile label="Key Results" value={snap.totalKRs} icon={<Activity className="h-4 w-4 text-primary" />} />
        <Tile label="On Track" value={`${snap.onTrackPct}%`} icon={<CheckCircle2 className="h-4 w-4 text-success" />} />
        <Tile label="At Risk / Off" value={snap.atRisk + snap.offTrack} icon={<AlertCircle className="h-4 w-4 text-warning" />} />
      </div>

      <div className="space-y-3">
        {departmentScorecards.map((d) => {
          const objs = departmentObjectives.filter((o) => o.departmentId === d.id);
          const krs = objs.flatMap((o) => o.keyResults);
          const onTrack = krs.filter((k) => k.status === "on-track" || k.status === "done").length;
          const pct = krs.length > 0 ? Math.round((onTrack / krs.length) * 100) : 0;
          const status =
            pct >= 80 ? "on-track" : pct >= 60 ? "at-risk" : "off-track";
          return (
            <div key={d.id} className="flex items-center gap-4">
              <div className="w-44 text-sm font-medium text-foreground truncate">{d.name}</div>
              <div className="flex-1">
                <Progress value={pct} className="h-2" />
              </div>
              <div className="w-12 text-right text-sm font-semibold text-foreground">{pct}%</div>
              <div className="w-24 text-right text-xs text-muted-foreground">
                {objs.length} obj · {krs.length} KR
              </div>
              <StatusBadge status={status} />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Tile = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="border rounded-lg p-3">
    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
      {icon}
      {label}
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
  </div>
);