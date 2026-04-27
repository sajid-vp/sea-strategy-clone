import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle, Compass } from "lucide-react";
import {
  strategicInitiatives,
  annualOkrSnapshot,
  departmentObjectives,
  initiativeOkrContribution,
} from "@/data/scorecardData";

/**
 * "What the board needs to know in 30 seconds."
 * Auto-derives highlights, lowlights and headline take-aways from the data.
 */
export const ExecutiveSummary = () => {
  const snap = annualOkrSnapshot();

  // Highlights — initiatives ahead of plan + best-performing OKRs
  const initiativesAhead = strategicInitiatives.filter(
    (i) => i.actualProgress >= i.expectedProgress,
  );
  const initiativesBehind = strategicInitiatives
    .filter((i) => i.actualProgress < i.expectedProgress)
    .sort(
      (a, b) =>
        b.expectedProgress - b.actualProgress - (a.expectedProgress - a.actualProgress),
    );

  const topObjective = [...departmentObjectives].sort(
    (a, b) => b.progress - a.progress,
  )[0];
  const worstObjective = [...departmentObjectives].sort(
    (a, b) => a.progress - b.progress,
  )[0];

  const criticalBehind = initiativesBehind.find((i) => i.importance === "critical");
  const headlineInitiative = criticalBehind ?? initiativesBehind[0];
  const headlineGap = headlineInitiative
    ? headlineInitiative.expectedProgress - headlineInitiative.actualProgress
    : 0;

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Executive Summary</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        The board's 30-second read on strategy, delivery and risk this period.
      </p>

      {/* Headline statement */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 mb-6">
        <div className="flex items-start gap-3">
          <Compass className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
              Headline
            </div>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {snap.onTrackPct}% of this year's commitments are on track, with{" "}
              <span className="font-semibold">{initiativesAhead.length} of {strategicInitiatives.length}</span> long-term initiatives meeting plan.
              {headlineInitiative && (
                <>
                  {" "}Board attention is requested on{" "}
                  <span className="font-semibold">"{headlineInitiative.name}"</span>,
                  currently {headlineGap} pts behind plan.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Highlights */}
        <div className="rounded-lg border bg-success/5 border-success/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-success" />
            <h3 className="font-semibold text-foreground">What's working</h3>
          </div>
          <ul className="space-y-2 text-sm text-foreground">
            {initiativesAhead.slice(0, 2).map((i) => (
              <li key={i.id} className="flex gap-2">
                <span className="text-success">▲</span>
                <span>
                  <span className="font-medium">{i.name}</span> is{" "}
                  {i.actualProgress - i.expectedProgress} pts ahead of plan
                  ({i.actualProgress}% vs {i.expectedProgress}%).
                </span>
              </li>
            ))}
            {topObjective && (
              <li className="flex gap-2">
                <span className="text-success">▲</span>
                <span>
                  Strongest annual commitment:{" "}
                  <span className="font-medium">{topObjective.title}</span> at{" "}
                  {topObjective.progress}%.
                </span>
              </li>
            )}
            <li className="flex gap-2">
              <span className="text-success">▲</span>
              <span>
                {snap.onTrack} of {snap.totalKRs} key results are on track or completed.
              </span>
            </li>
          </ul>
        </div>

        {/* Lowlights / risks */}
        <div className="rounded-lg border bg-warning/5 border-warning/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="font-semibold text-foreground">Where we need attention</h3>
          </div>
          <ul className="space-y-2 text-sm text-foreground">
            {initiativesBehind.slice(0, 2).map((i) => {
              const c = initiativeOkrContribution(i.id);
              return (
                <li key={i.id} className="flex gap-2">
                  <span className="text-warning">▼</span>
                  <span>
                    <span className="font-medium">{i.name}</span> is{" "}
                    {i.expectedProgress - i.actualProgress} pts behind plan; OKR delivery
                    at {c.contributionPct}%.
                  </span>
                </li>
              );
            })}
            {worstObjective && (
              <li className="flex gap-2">
                <span className="text-warning">▼</span>
                <span>
                  Weakest annual commitment:{" "}
                  <span className="font-medium">{worstObjective.title}</span> at{" "}
                  {worstObjective.progress}%.
                </span>
              </li>
            )}
            {snap.offTrack > 0 && (
              <li className="flex gap-2">
                <span className="text-warning">▼</span>
                <span>
                  {snap.offTrack} key result{snap.offTrack === 1 ? " is" : "s are"} off
                  track and require recovery plans.
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
};