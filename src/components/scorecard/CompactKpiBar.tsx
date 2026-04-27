import {
  institutionScorecard,
  strategicInitiatives,
  annualOkrSnapshot,
  departmentObjectives,
} from "@/data/scorecardData";
import { Building2, Target, Activity, Layers } from "lucide-react";

const tone = (v: number, good = 75, warn = 60) =>
  v >= good ? "text-success" : v >= warn ? "text-warning" : "text-destructive";

/**
 * Single-row KPI bar — fits in the executive cockpit header without scrolling.
 */
export const CompactKpiBar = () => {
  const snap = annualOkrSnapshot();
  const initiativesOnPlan = strategicInitiatives.filter(
    (i) => i.actualProgress >= i.expectedProgress,
  ).length;
  const initPct = Math.round((initiativesOnPlan / strategicInitiatives.length) * 100);

  const items = [
    {
      label: "Health",
      value: institutionScorecard.healthScore,
      sub: "/100",
      tone: tone(institutionScorecard.healthScore, 80, 65),
      icon: Building2,
    },
    {
      label: "Initiatives on plan",
      value: `${initiativesOnPlan}/${strategicInitiatives.length}`,
      sub: `${initPct}%`,
      tone: tone(initPct),
      icon: Target,
    },
    {
      label: "OKR delivery",
      value: `${snap.onTrackPct}%`,
      sub: `${snap.onTrack}/${snap.totalKRs} KR`,
      tone: tone(snap.onTrackPct),
      icon: Activity,
    },
    {
      label: "Commitments",
      value: departmentObjectives.length,
      sub: `${new Set(departmentObjectives.map((o) => o.departmentId)).size} depts`,
      tone: "text-foreground",
      icon: Layers,
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
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                {it.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${it.tone}`}>{it.value}</span>
                <span className="text-xs text-muted-foreground">{it.sub}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};