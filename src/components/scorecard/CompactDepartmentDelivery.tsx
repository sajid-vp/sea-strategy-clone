import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { departmentScorecards } from "@/data/scorecardData";
import { useYear } from "./YearContext";
import { YoyChip } from "./YoyChip";
import { departmentOkrDeliveryAtYear, yoy } from "./yearMetrics";

/**
 * Tight horizontal department delivery view — every department on one row,
 * with selected-year delivery % and YoY growth.
 */
export const CompactDepartmentDelivery = () => {
  const { year, availableYears } = useYear();
  const prev = availableYears.includes(year - 1) ? year - 1 : null;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Annual OKR Delivery by Department
          </h2>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {year}
          {prev !== null ? ` · YoY vs ${prev}` : ""}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {departmentScorecards.map((d) => {
          const cur = departmentOkrDeliveryAtYear(d.id, year);
          const prv = prev !== null ? departmentOkrDeliveryAtYear(d.id, prev) : null;
          const delta = yoy(cur.pct, prv?.pct ?? null);
          const tone =
            cur.pct >= 80
              ? "text-success"
              : cur.pct >= 60
              ? "text-warning"
              : "text-destructive";
          const bar =
            cur.pct >= 80
              ? "bg-success"
              : cur.pct >= 60
              ? "bg-warning"
              : "bg-destructive";
          return (
            <div key={d.id} className="rounded-md border p-3">
              <div className="text-xs text-muted-foreground truncate">{d.name}</div>
              <div className="flex items-baseline justify-between mt-1 gap-2">
                <span className={`text-2xl font-bold ${tone}`}>{cur.pct}%</span>
                <YoyChip delta={delta} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {cur.objectives} obj · {cur.keyResults} KR
              </div>
              <div className="h-1.5 mt-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${bar}`} style={{ width: `${cur.pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};