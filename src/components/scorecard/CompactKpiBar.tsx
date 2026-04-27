import {
  institutionScorecard,
  strategicInitiatives,
} from "@/data/scorecardData";
import { Building2, Target, Activity, Layers } from "lucide-react";
import { useYear } from "./YearContext";
import { YoyChip } from "./YoyChip";
import {
  institutionHealthAtYear,
  initiativesOnPlanAtYear,
  annualOkrSnapshotAtYear,
  yoy,
} from "./yearMetrics";

const tone = (v: number, good = 75, warn = 60) =>
  v >= good ? "text-success" : v >= warn ? "text-warning" : "text-destructive";

/**
 * Single-row KPI bar — shows selected-year value and YoY growth.
 */
export const CompactKpiBar = () => {
  const { year, availableYears } = useYear();
  const prev = availableYears.includes(year - 1) ? year - 1 : null;

  const health = institutionHealthAtYear(year);
  const healthPrev = prev !== null ? institutionHealthAtYear(prev) : null;

  const init = initiativesOnPlanAtYear(year);
  const initPct = init.total > 0 ? Math.round((init.onPlan / init.total) * 100) : 0;
  const initPrev = prev !== null ? initiativesOnPlanAtYear(prev) : null;
  const initPctPrev =
    initPrev && initPrev.total > 0
      ? Math.round((initPrev.onPlan / initPrev.total) * 100)
      : null;

  const snap = annualOkrSnapshotAtYear(year);
  const snapPrev = prev !== null ? annualOkrSnapshotAtYear(prev) : null;

  const items = [
    {
      label: "Health",
      value: health,
      sub: "/100",
      tone: tone(health, 80, 65),
      icon: Building2,
      yoy: yoy(health, healthPrev),
    },
    {
      label: "Initiatives on plan",
      value: `${init.onPlan}/${init.total}`,
      sub: `${initPct}%`,
      tone: tone(initPct),
      icon: Target,
      yoy: yoy(initPct, initPctPrev),
    },
    {
      label: "OKR delivery",
      value: `${snap.onTrackPct}%`,
      sub: `${snap.onTrack}/${snap.totalKRs} KR`,
      tone: tone(snap.onTrackPct),
      icon: Activity,
      yoy: yoy(snap.onTrackPct, snapPrev?.onTrackPct ?? null),
    },
    {
      label: "Commitments",
      value: snap.totalObjectives,
      sub: `${institutionScorecard.totals.total ? "" : ""}${
        new Set(strategicInitiatives.map((i) => i.id)).size
      } initiatives`,
      tone: "text-foreground",
      icon: Layers,
      yoy: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border rounded-lg border bg-card">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div key={it.label} className="px-4 py-3 flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                {it.label}
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className={`text-xl font-bold ${it.tone}`}>{it.value}</span>
                <span className="text-xs text-muted-foreground">{it.sub}</span>
                {it.yoy !== null && <YoyChip delta={it.yoy} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};