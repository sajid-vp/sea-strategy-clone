import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import {
  strategicInitiatives,
  initiativeOkrContribution,
} from "@/data/scorecardData";

/**
 * Institution-level: for each initiative, show the OKRs that contribute,
 * their weight, impact, and how much of that weight has been delivered.
 */
export const InitiativeContributionView = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Layers className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Initiative → OKR Contribution</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Bridge between long-term strategy and this year's department commitments.
      </p>

      <div className="space-y-6">
        {strategicInitiatives.map((init) => {
          const c = initiativeOkrContribution(init.id);
          return (
            <div key={init.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <h3 className="font-semibold text-foreground">{init.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {c.items.length} contributing OKR{c.items.length === 1 ? "" : "s"} · total committed weight {c.totalWeight}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">OKR contribution delivered</div>
                  <div className="text-2xl font-bold text-foreground">{c.contributionPct}%</div>
                </div>
              </div>

              {c.items.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No OKRs are contributing to this initiative yet.</p>
              ) : (
                <div className="space-y-2">
                  {c.items.map((it) => (
                    <div key={it.objective.id} className="grid grid-cols-12 items-center gap-3 text-sm">
                      <div className="col-span-5">
                        <div className="font-medium text-foreground truncate">{it.objective.title}</div>
                        <div className="text-xs text-muted-foreground">{it.department?.name ?? "—"}</div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline" className={
                          it.impact === "direct"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground"
                        }>
                          {it.impact}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-xs text-muted-foreground text-right">
                        weight {it.weight}%
                      </div>
                      <div className="col-span-3">
                        <Progress value={it.objective.progress} className="h-2" />
                      </div>
                      <div className="col-span-1 text-right font-semibold text-foreground">
                        {it.objective.progress}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};