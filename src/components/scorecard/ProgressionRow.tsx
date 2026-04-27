import { Card } from "@/components/ui/card";
import { Compass, CalendarRange } from "lucide-react";
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
  const overallActualAvg = overallTotal
    ? Math.round(
        strategicInitiatives.reduce(
          (s, i) => s + initiativeActualAtYear(i, latestYear),
          0,
        ) / overallTotal,
      )
    : 0;
  const overallExpectedAvg = overallTotal
    ? Math.round(
        strategicInitiatives.reduce(
          (s, i) => s + initiativeExpectedAtYear(i, latestYear),
          0,
        ) / overallTotal,
      )
    : 0;

  // ---------- Current year progression ----------
  const cy = initiativesOnPlanAtYear(year);
  const cyPct = cy.total ? Math.round((cy.onPlan / cy.total) * 100) : 0;
  const cyPrev = prev !== null ? initiativesOnPlanAtYear(prev) : null;
  const cyPctPrev =
    cyPrev && cyPrev.total
      ? Math.round((cyPrev.onPlan / cyPrev.total) * 100)
      : null;
  const cyActualAvg = cy.total
    ? Math.round(
        cy.items.reduce((s, i) => s + initiativeActualAtYear(i, year), 0) /
          cy.total,
      )
    : 0;
  const cyExpectedAvg = cy.total
    ? Math.round(
        cy.items.reduce((s, i) => s + initiativeExpectedAtYear(i, year), 0) /
          cy.total,
      )
    : 0;
  const cyActualPrev =
    cyPrev && cyPrev.total && prev !== null
      ? Math.round(
          cyPrev.items.reduce(
            (s, i) => s + initiativeActualAtYear(i, prev),
            0,
          ) / cyPrev.total,
        )
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
            Strategy window · {Math.min(...allYears)}–{latestYear}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <div
              className={`text-4xl font-bold tabular-nums ${tone(overallActualAvg)}`}
            >
              {overallActualAvg}%
              <span className="text-base text-muted-foreground font-normal">
                {" "}/ {overallExpectedAvg}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              avg initiative progress (actual vs expected)
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              On plan
            </div>
            <div className={`text-lg font-semibold tabular-nums ${tone(overallPct)}`}>
              {overallOnPlan}
              <span className="text-muted-foreground font-normal">
                /{overallTotal}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {overallPct}% of initiatives
            </div>
          </div>
        </div>

        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 ${accent(overallActualAvg)}`}
            style={{ width: `${overallActualAvg}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-foreground/60"
            style={{ left: `${overallExpectedAvg}%` }}
          />
        </div>
      </Card>

      {/* Current year progression */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Current Year Progression
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {year}
            {prev !== null ? ` · YoY vs ${prev}` : ""}
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <div
              className={`text-4xl font-bold tabular-nums ${tone(cyActualAvg)}`}
            >
              {cyActualAvg}%
              <span className="text-base text-muted-foreground font-normal">
                {" "}/ {cyExpectedAvg}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              avg initiative progress this year
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              On plan
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className={`text-lg font-semibold tabular-nums ${tone(cyPct)}`}>
                {cy.onPlan}
                <span className="text-muted-foreground font-normal">
                  /{cy.total}
                </span>
              </span>
              <YoyChip delta={yoy(cyActualAvg, cyActualPrev)} />
            </div>
            <div className="text-[11px] text-muted-foreground">
              {cyPct}% of initiatives
            </div>
          </div>
        </div>

        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 ${accent(cyActualAvg)}`}
            style={{ width: `${cyActualAvg}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-foreground/60"
            style={{ left: `${cyExpectedAvg}%` }}
          />
        </div>
      </Card>
    </div>
  );
};