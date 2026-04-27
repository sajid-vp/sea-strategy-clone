import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import {
  strategicInitiatives,
  departmentObjectives,
} from "@/data/scorecardData";

/**
 * Closing slide for the board: explicit asks and decisions sought.
 * Auto-derived from current data so it always reflects the live picture.
 */
export const BoardAsks = () => {
  const criticalBehind = strategicInitiatives.filter(
    (i) => i.importance === "critical" && i.actualProgress < i.expectedProgress,
  );
  const offTrackObjectives = departmentObjectives.filter(
    (o) => o.status === "off-track",
  );

  const asks: { title: string; detail: string }[] = [];

  if (criticalBehind.length > 0) {
    asks.push({
      title: "Endorse recovery plans for critical initiatives behind plan",
      detail: `Specifically: ${criticalBehind.map((i) => `"${i.name}"`).join(", ")}.`,
    });
  }
  if (offTrackObjectives.length > 0) {
    asks.push({
      title: "Note off-track annual commitments and re-baseline if required",
      detail: `${offTrackObjectives.length} objective${
        offTrackObjectives.length === 1 ? "" : "s"
      } currently off track — including "${offTrackObjectives[0].title}".`,
    });
  }
  asks.push({
    title: "Reaffirm capital and resourcing for the strategic portfolio",
    detail: `${strategicInitiatives.length} multi-year initiatives currently funded; resourcing trade-offs documented in appendix.`,
  });
  asks.push({
    title: "Approve next quarter's reporting cadence and exception thresholds",
    detail: "Proposal: monthly KPI snapshot, quarterly initiative deep-dive.",
  });

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Asks of the Board
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Decisions and endorsements requested in this session.
      </p>

      <ol className="space-y-3">
        {asks.map((a, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-lg border bg-muted/30 p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {i + 1}
            </div>
            <div>
              <div className="font-medium text-foreground">{a.title}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{a.detail}</div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
};