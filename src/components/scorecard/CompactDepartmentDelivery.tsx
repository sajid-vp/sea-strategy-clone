import { departmentScorecards } from "@/data/scorecardData";
import { useYear } from "./YearContext";
import { YoyChip } from "./YoyChip";
import { departmentOkrDeliveryAtYear, yoy } from "./yearMetrics";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

/**
 * Tight horizontal department delivery view — every department on one row,
 * with selected-year delivery % and YoY growth.
 */
export const CompactDepartmentDelivery = () => {
  const { year, availableYears } = useYear();
  const prev = availableYears.includes(year - 1) ? year - 1 : null;
  const [selected, setSelected] = useState<string[]>(() =>
    departmentScorecards.map((d) => d.id)
  );

  const toggle = (id: string) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  const allOn = selected.length === departmentScorecards.length;

  const visible = useMemo(
    () => departmentScorecards.filter((d) => selected.includes(d.id)),
    [selected]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            <Button
              size="sm"
              variant={allOn ? "secondary" : "outline"}
              className="h-6 px-2 text-[11px]"
              onClick={() =>
                setSelected(departmentScorecards.map((d) => d.id))
              }
            >
              All
            </Button>
            {departmentScorecards.map((d) => {
              const on = selected.includes(d.id);
              return (
                <Button
                  key={d.id}
                  size="sm"
                  variant={on ? "secondary" : "outline"}
                  className="h-6 px-2 text-[11px]"
                  onClick={() => toggle(d.id)}
                >
                  {d.name}
                </Button>
              );
            })}
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {year}
            {prev !== null ? ` · YoY vs ${prev}` : ""}
          </span>
        </div>
      </div>
      {visible.length === 0 ? (
        <div className="text-xs text-muted-foreground py-6 text-center">
          No departments selected.
        </div>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {visible.map((d) => {
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
            <div key={d.id} className="rounded-lg border border-border/60 p-3 bg-gradient-to-br from-card to-muted/20 hover:shadow-md hover:border-primary/30 transition-all">
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
      )}
    </div>
  );
};