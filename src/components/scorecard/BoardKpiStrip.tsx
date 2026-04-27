import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  institutionScorecard,
  strategicInitiatives,
  annualOkrSnapshot,
  departmentObjectives,
} from "@/data/scorecardData";
import { Target, Activity, Layers, Building2 } from "lucide-react";

/**
 * Top-line numbers the board cares about — large, scannable, presentation-ready.
 */
export const BoardKpiStrip = () => {
  const snap = annualOkrSnapshot();
  const initiativesOnPlan = strategicInitiatives.filter(
    (i) => i.actualProgress >= i.expectedProgress,
  ).length;
  const totalKRs = snap.totalKRs;
  const objectivesCount = departmentObjectives.length;

  const items: Array<{
    label: string;
    value: string | number;
    sub: string;
    progress?: number;
    tone: "primary" | "success" | "warning" | "destructive";
    icon: React.ReactNode;
  }> = [
    {
      label: "Institutional Health",
      value: institutionScorecard.healthScore,
      sub: `${institutionScorecard.onTrackPercentage}% on track`,
      progress: institutionScorecard.healthScore,
      tone:
        institutionScorecard.healthScore >= 80
          ? "success"
          : institutionScorecard.healthScore >= 65
          ? "warning"
          : "destructive",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      label: "Strategic Initiatives on Plan",
      value: `${initiativesOnPlan}/${strategicInitiatives.length}`,
      sub: "Multi-year initiatives meeting expected progress",
      progress: Math.round((initiativesOnPlan / strategicInitiatives.length) * 100),
      tone:
        initiativesOnPlan / strategicInitiatives.length >= 0.75
          ? "success"
          : initiativesOnPlan / strategicInitiatives.length >= 0.5
          ? "warning"
          : "destructive",
      icon: <Target className="h-4 w-4" />,
    },
    {
      label: "Annual OKR Delivery",
      value: `${snap.onTrackPct}%`,
      sub: `${snap.onTrack} of ${totalKRs} key results on track`,
      progress: snap.onTrackPct,
      tone:
        snap.onTrackPct >= 75 ? "success" : snap.onTrackPct >= 60 ? "warning" : "destructive",
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: "Commitments in Flight",
      value: objectivesCount,
      sub: `Across ${new Set(departmentObjectives.map((o) => o.departmentId)).size} departments`,
      tone: "primary",
      icon: <Layers className="h-4 w-4" />,
    },
  ];

  const toneClasses: Record<string, { text: string; bg: string; border: string }> = {
    primary: { text: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    success: { text: "text-success", bg: "bg-success/10", border: "border-success/20" },
    warning: { text: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    destructive: {
      text: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => {
        const t = toneClasses[it.tone];
        return (
          <Card key={it.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-md ${t.bg} ${t.text}`}>{it.icon}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">
                {it.label}
              </div>
            </div>
            <div className={`text-3xl font-bold ${t.text}`}>{it.value}</div>
            <div className="text-xs text-muted-foreground mt-1 mb-3 min-h-[2.5em]">
              {it.sub}
            </div>
            {typeof it.progress === "number" && (
              <Progress value={it.progress} className="h-1.5" />
            )}
          </Card>
        );
      })}
    </div>
  );
};