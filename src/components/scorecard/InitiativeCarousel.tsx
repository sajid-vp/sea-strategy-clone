import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Target,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  strategicInitiatives,
  initiativeOkrContribution,
} from "@/data/scorecardData";
import { useYear } from "./YearContext";
import { YoyChip } from "./YoyChip";
import {
  initiativeActualAtYear,
  initiativeExpectedAtYear,
  yoy,
} from "./yearMetrics";
import { cn } from "@/lib/utils";

const tone = (pct: number) =>
  pct >= 75 ? "text-success" : pct >= 50 ? "text-warning" : "text-destructive";

const accent = (pct: number) =>
  pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive";

const kpiPctAtYear = (
  kpi: (typeof strategicInitiatives)[number]["kpis"][number],
  year: number,
) => {
  const point = kpi.trend.find((p) => p.year === year);
  if (!point) return null;
  const span = kpi.target - kpi.baseline;
  if (span === 0) return 100;
  const pct = ((point.value - kpi.baseline) / span) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
};

/**
 * Grid of strategic initiative cards. Each card is clickable to expand
 * inline, revealing KPI multi-year trends and contributing OKRs.
 * KPI rows and OKR rows inside the expanded view are themselves clickable
 * to focus a deeper drill-down.
 */
export const InitiativeCarousel = () => {
  const { year, availableYears } = useYear();
  const prev = availableYears.includes(year - 1) ? year - 1 : null;
  const [expanded, setExpanded] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpanded((cur) => (cur === id ? null : id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {strategicInitiatives.map((init) => {
        const actual = initiativeActualAtYear(init, year);
        const expected = initiativeExpectedAtYear(init, year);
        const prevActual =
          prev !== null ? initiativeActualAtYear(init, prev) : null;
        const delta = yoy(actual, prevActual);
        const gap = expected - actual;
        const onPlan = gap <= 0;
        const okr = initiativeOkrContribution(init.id);
        const okrPct = okr.contributionPct;
        const okrTone = tone(okrPct);
        const okrAccent = accent(okrPct);
        const isOpen = expanded === init.id;

        return (
          <div
            key={init.id}
            className={cn(
              "rounded-lg border bg-card transition-all",
              isOpen
                ? "md:col-span-2 ring-1 ring-primary/30 shadow-md"
                : "hover:shadow-md hover:border-primary/30",
            )}
          >
            {/* Clickable header / summary */}
            <button
              type="button"
              onClick={() => toggle(init.id)}
              aria-expanded={isOpen}
              className="w-full text-left p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    {init.name}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-2">
                    {init.description}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {init.importance === "critical" && (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] py-0"
                    >
                      critical
                    </Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {init.startYear}–{init.endYear}
                  </span>
                </div>
              </div>

              {/* Big number */}
              <div className="flex items-end justify-between gap-3 mb-2">
                <div>
                  <div
                    className={`text-3xl font-bold tabular-nums ${tone(actual)}`}
                  >
                    {actual}%
                    <span className="text-sm text-muted-foreground font-normal">
                      {" "}/ {expected}%
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    actual vs expected
                  </div>
                </div>
                <div className="text-right">
                  <YoyChip delta={delta} />
                  <div
                    className={`text-[11px] mt-1 font-medium ${
                      onPlan ? "text-success" : "text-destructive"
                    }`}
                  >
                    {onPlan
                      ? `+${Math.abs(gap)} pts ahead`
                      : `−${gap} pts behind`}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 mb-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 ${accent(actual)}`}
                  style={{ width: `${actual}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 w-px bg-foreground/60"
                  style={{ left: `${expected}%` }}
                />
              </div>

              {/* OKR contribution */}
              <div className="rounded-md border bg-muted/30 p-3 mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      OKR Progress
                    </span>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${okrTone}`}>
                    {okrPct}%
                  </span>
                </div>
                <div className="relative h-1.5 mb-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${okrAccent}`}
                    style={{ width: `${okrPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>
                    {okr.items.length} contributing OKR
                    {okr.items.length === 1 ? "" : "s"}
                  </span>
                  <span className="tabular-nums">
                    {Math.round(okr.totalDelivered)} / {okr.totalWeight} wt pts
                  </span>
                </div>
              </div>

              {/* KPI list — clickable rows */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  KPI Achievements ({year})
                </div>
                {init.kpis.map((kpi) => {
                  const point = kpi.trend.find((p) => p.year === year);
                  const pct = kpiPctAtYear(kpi, year);
                  const key = `${init.id}::kpi::${kpi.name}`;
                  const focused = focusKey === key && isOpen;
                  return (
                    <div
                      key={kpi.name}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOpen) setExpanded(init.id);
                        setFocusKey((cur) => (cur === key ? null : key));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isOpen) setExpanded(init.id);
                          setFocusKey((cur) => (cur === key ? null : key));
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between gap-2 text-xs rounded px-1.5 py-1 -mx-1.5 cursor-pointer transition-colors",
                        focused
                          ? "bg-primary/10"
                          : "hover:bg-muted/60",
                      )}
                    >
                      <span className="text-foreground truncate flex-1 min-w-0">
                        {kpi.name}
                      </span>
                      <span className="text-muted-foreground tabular-nums shrink-0">
                        {point ? point.value : "—"} / {kpi.target}{" "}
                        {kpi.unit}
                      </span>
                      <span
                        className={`tabular-nums font-semibold w-10 text-right shrink-0 ${
                          pct === null ? "text-muted-foreground" : tone(pct)
                        }`}
                      >
                        {pct === null ? "—" : `${pct}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div className="border-t bg-muted/20 px-4 py-4 space-y-5 rounded-b-lg">
                {/* KPI multi-year detail */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      KPI Detail · multi-year trend
                    </h4>
                    {focusKey?.startsWith(`${init.id}::kpi::`) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFocusKey(null);
                        }}
                        className="text-[10px] text-muted-foreground hover:text-foreground underline"
                      >
                        Show all KPIs
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {init.kpis
                      .filter((kpi) => {
                        const key = `${init.id}::kpi::${kpi.name}`;
                        return !focusKey?.startsWith(`${init.id}::kpi::`) ||
                          focusKey === key;
                      })
                      .map((kpi) => {
                        const last = kpi.trend[kpi.trend.length - 1]?.value ?? 0;
                        const first = kpi.trend[0]?.value ?? 0;
                        const trendIcon =
                          last > first ? (
                            <TrendingUp className="h-3.5 w-3.5 text-success" />
                          ) : last < first ? (
                            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                          ) : (
                            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                          );
                        return (
                          <div
                            key={kpi.name}
                            className="rounded-md border bg-card p-3"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="text-xs font-medium text-foreground truncate">
                                {kpi.name}
                              </div>
                              <StatusBadge status={kpi.status} />
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-lg font-bold text-foreground tabular-nums">
                                {last}
                                {kpi.unit}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                base {kpi.baseline}
                                {kpi.unit} → tgt {kpi.target}
                                {kpi.unit}
                              </span>
                              <span className="ml-auto">{trendIcon}</span>
                            </div>
                            <div className="flex items-end gap-2">
                              {kpi.trend.map((p) => {
                                const span = kpi.target - kpi.baseline;
                                const pct =
                                  span === 0
                                    ? 100
                                    : Math.max(
                                        0,
                                        Math.min(
                                          100,
                                          ((p.value - kpi.baseline) / span) *
                                            100,
                                        ),
                                      );
                                return (
                                  <div
                                    key={p.year}
                                    className="flex-1 flex flex-col items-center gap-1"
                                  >
                                    <div className="w-full h-12 bg-muted rounded relative overflow-hidden">
                                      <div
                                        className={cn(
                                          "absolute bottom-0 inset-x-0",
                                          accent(pct),
                                        )}
                                        style={{ height: `${pct}%` }}
                                      />
                                    </div>
                                    <span className="text-[10px] tabular-nums text-foreground">
                                      {p.value}
                                      {kpi.unit}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground">
                                      {p.year}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Contributing OKRs */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                    Contributing OKRs ({okr.items.length})
                  </h4>
                  {okr.items.length === 0 ? (
                    <div className="text-xs text-muted-foreground italic">
                      No OKRs currently mapped to this initiative.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {okr.items.map((it) => (
                        <div
                          key={it.objective.id}
                          className="rounded-md border bg-card p-2.5 flex items-center gap-3"
                        >
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] py-0 shrink-0",
                              it.impact === "direct"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {it.impact}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-foreground truncate">
                              {it.objective.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {it.department?.name ?? "—"} · weight {it.weight}
                              %
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div
                              className={cn(
                                "text-sm font-semibold tabular-nums",
                                tone(it.objective.progress),
                              )}
                            >
                              {it.objective.progress}%
                            </div>
                            <div className="text-[10px] text-muted-foreground tabular-nums">
                              {Math.round(it.delivered)}/{it.weight} wt pts
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};