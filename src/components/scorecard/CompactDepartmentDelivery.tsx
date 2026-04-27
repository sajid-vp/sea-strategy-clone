import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import {
  departmentScorecards,
  departmentObjectives,
} from "@/data/scorecardData";

/**
 * Tight horizontal department delivery view — every department on one row.
 */
export const CompactDepartmentDelivery = () => {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Annual OKR Delivery by Department
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {departmentScorecards.map((d) => {
          const objs = departmentObjectives.filter((o) => o.departmentId === d.id);
          const krs = objs.flatMap((o) => o.keyResults);
          const onTrack = krs.filter(
            (k) => k.status === "on-track" || k.status === "done",
          ).length;
          const pct = krs.length > 0 ? Math.round((onTrack / krs.length) * 100) : 0;
          const tone =
            pct >= 80
              ? "text-success"
              : pct >= 60
              ? "text-warning"
              : "text-destructive";
          const bar =
            pct >= 80
              ? "bg-success"
              : pct >= 60
              ? "bg-warning"
              : "bg-destructive";
          return (
            <div key={d.id} className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground truncate">{d.name}</div>
              <div className="flex items-baseline justify-between mt-1">
                <span className={`text-2xl font-bold ${tone}`}>{pct}%</span>
                <span className="text-[11px] text-muted-foreground">
                  {objs.length} obj · {krs.length} KR
                </span>
              </div>
              <div className="h-1.5 mt-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};