import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";
import {
  strategicInitiatives,
  departmentObjectives,
  annualOkrSnapshot,
} from "@/data/scorecardData";

/**
 * Compact highlights + risks block — auto-derived from current data.
 */
export const HighlightsRisksCard = () => {
  const snap = annualOkrSnapshot();
  const ahead = strategicInitiatives.filter(
    (i) => i.actualProgress >= i.expectedProgress,
  );
  const behind = [...strategicInitiatives]
    .filter((i) => i.actualProgress < i.expectedProgress)
    .sort(
      (a, b) =>
        b.expectedProgress - b.actualProgress - (a.expectedProgress - a.actualProgress),
    );
  const topObj = [...departmentObjectives].sort((a, b) => b.progress - a.progress)[0];
  const worstObj = [...departmentObjectives].sort((a, b) => a.progress - b.progress)[0];

  return (
    <Card className="p-5">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Highlights
            </h3>
          </div>
          <ul className="space-y-1.5 text-sm text-foreground">
            {ahead.slice(0, 2).map((i) => (
              <li key={i.id} className="flex gap-2">
                <span className="text-success shrink-0">▲</span>
                <span className="leading-snug">
                  <span className="font-medium">{i.name}</span> ahead by{" "}
                  {i.actualProgress - i.expectedProgress} pts.
                </span>
              </li>
            ))}
            {topObj && (
              <li className="flex gap-2">
                <span className="text-success shrink-0">▲</span>
                <span className="leading-snug">
                  Top OKR: <span className="font-medium">{topObj.title}</span> at{" "}
                  {topObj.progress}%.
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Needs attention
            </h3>
          </div>
          <ul className="space-y-1.5 text-sm text-foreground">
            {behind.slice(0, 2).map((i) => (
              <li key={i.id} className="flex gap-2">
                <span className="text-warning shrink-0">▼</span>
                <span className="leading-snug">
                  <span className="font-medium">{i.name}</span> behind by{" "}
                  {i.expectedProgress - i.actualProgress} pts.
                </span>
              </li>
            ))}
            {worstObj && (
              <li className="flex gap-2">
                <span className="text-warning shrink-0">▼</span>
                <span className="leading-snug">
                  Weakest OKR:{" "}
                  <span className="font-medium">{worstObj.title}</span> at{" "}
                  {worstObj.progress}%.
                </span>
              </li>
            )}
            {snap.offTrack > 0 && (
              <li className="flex gap-2">
                <span className="text-warning shrink-0">▼</span>
                <span className="leading-snug">
                  {snap.offTrack} key result{snap.offTrack === 1 ? "" : "s"} off track.
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
};