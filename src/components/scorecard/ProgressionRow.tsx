import { Card } from "@/components/ui/card";
import { Compass, ListChecks } from "lucide-react";
import { strategicInitiatives } from "@/data/scorecardData";
import { useYear } from "./YearContext";
import { YoyChip } from "./YoyChip";
import {
  initiativeActualAtYear,
  initiativeExpectedAtYear,
  initiativesOnPlanAtYear,
  yoy,
} from "./yearMetrics";

const tone = (pct: number) =>
  pct >= 75 ? "text-success" : pct >= 50 ? "text-warning" : "text-destructive";

const accent = (pct: number) =>
  pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive";

/**
 * Two-card "Progression" row shown directly below the scorecard KPI strip.
 *  - Left  (1/2): Overall Progression — initiatives on plan across the entire
 *    multi-year strategy window (regardless of selected year).
 *  - Right (1/2): Initiative Progression — per-initiative on/off plan badges.
 */
export const ProgressionRow = () => {
  const { year, availableYears } = useYear();
  const prev = availableYears.includes(year - 1) ? year - 1 : null;

  // ---------- Overall progression (multi-year strategy) ----------
  const allYears = availableYears;
  const latestYear = Math.max(...allYears);
  const overallTotal = strategicInitiatives.length;
  const overallOnPlan = strategicInitiatives.filter(
    (i) =>
      initiativeActualAtYear(i, latestYear) >=
      initiativeExpectedAtYear(i, latestYear),
  ).length;
  const overallPct = overallTotal
    ? Math.round((overallOnPlan / overallTotal) * 100)
    : 0;

  // ---------- Current year progression ----------
  const cy = initiativesOnPlanAtYear(year);
  const cyPct = cy.total ? Math.round((cy.onPlan / cy.total) * 100) : 0;
  const cyPrev = prev !== null ? initiativesOnPlanAtYear(prev) : null;
  const cyPctPrev =
    cyPrev && cyPrev.total
      ? Math.round((cyPrev.onPlan / cyPrev.total) * 100)
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Overall progression */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Overall Progression
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Strategy window
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <div className={`text-4xl font-bold tabular-nums ${tone(overallPct)}`}>
              {overallOnPlan}
              <span className="text-muted-foreground font-normal">
                /{overallTotal}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              initiatives on plan ({overallPct}%)
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Current Year ({year})
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className={`text-lg font-semibold tabular-nums ${tone(cyPct)}`}>
                {cy.onPlan}/{cy.total}
              </span>
              <YoyChip delta={yoy(cyPct, cyPctPrev)} />
            </div>
            <div className="text-[11px] text-muted-foreground">
              {cyPct}% on plan
            </div>
          </div>
        </div>

        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 ${accent(overallPct)}`}
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </Card>

      {/* Initiative progression */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Initiative Progression
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {year} · KPIs on track
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {strategicInitiatives.map((init) => {
            const total = init.kpis.length;
            const onTrack = init.kpis.filter((k) => {
              const point = k.trend.find((p) => p.year === year);
              if (!point) return false;
              const span = k.target - k.baseline;
              if (span === 0) return true;
              const pct = ((point.value - k.baseline) / span) * 100;
              const expectedPct =
                ((year - init.startYear) /
                  Math.max(1, init.endYear - init.startYear)) *
                100;
              return pct >= expectedPct;
            }).length;
            const pct = total ? Math.round((onTrack / total) * 100) : 0;

            return (
              <div
                key={init.id}
                className="flex items-center justify-between gap-2 py-1"
              >
                <div className="text-xs text-foreground truncate flex-1 min-w-0">
                  {init.name}
                </div>
                <div
                  className={`text-sm font-semibold tabular-nums shrink-0 ${tone(pct)}`}
                >
                  {onTrack}
                  <span className="text-muted-foreground font-normal">
                    /{total}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};