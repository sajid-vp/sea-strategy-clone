import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { ListChecks, Target } from "lucide-react";
import {
  tasksByIndividual,
  getKeyResult,
  getObjectiveOfKR,
  getInitiative,
} from "@/data/scorecardData";

interface Props {
  individualId: string;
}

/**
 * Individual-level: KRs this person contributes to (aggregated from tasks)
 * + raw task → KR mapping table for real-time OKR progress.
 */
export const MyOkrContribution = ({ individualId }: Props) => {
  const tasks = tasksByIndividual(individualId);

  // Aggregate by KR
  const byKr = new Map<string, { share: number; progressSum: number; count: number }>();
  for (const t of tasks) {
    const cur = byKr.get(t.keyResultId) ?? { share: 0, progressSum: 0, count: 0 };
    cur.share = Math.max(cur.share, t.share); // person's share of the KR
    cur.progressSum += t.progress;
    cur.count += 1;
    byKr.set(t.keyResultId, cur);
  }

  const krRows = Array.from(byKr.entries()).map(([krId, v]) => {
    const kr = getKeyResult(krId);
    const obj = getObjectiveOfKR(krId);
    const initiatives = obj?.contributions.map((c) => getInitiative(c.initiativeId)?.name).filter(Boolean) ?? [];
    const myProgress = Math.round(v.progressSum / v.count);
    return { krId, kr, obj, initiatives, share: v.share, myProgress };
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">My OKR Contribution</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Key Results you contribute to, your share, and how strategy is downstream of them.
        </p>

        {krRows.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No tasks linked to Key Results yet.</p>
        ) : (
          <div className="space-y-3">
            {krRows.map((r) => (
              <div key={r.krId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <div className="text-xs text-muted-foreground">{r.obj?.title ?? "Objective"}</div>
                    <div className="font-medium text-foreground">{r.kr?.title ?? r.krId}</div>
                    {r.initiatives.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.initiatives.map((n) => (
                          <Badge key={n} variant="outline" className="bg-muted text-xs">
                            ↳ {n}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">My share</div>
                    <div className="text-lg font-bold text-foreground">{r.share}%</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">My contribution progress</div>
                    <Progress value={r.myProgress} className="h-2" />
                    <div className="text-xs text-foreground mt-1 font-medium">{r.myProgress}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">KR overall progress</div>
                    <Progress value={r.kr?.progress ?? 0} className="h-2" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-foreground font-medium">{r.kr?.progress ?? 0}%</span>
                      {r.kr && <StatusBadge status={r.kr.status} />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <ListChecks className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Task → Key Result Mapping</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Each task is linked to a Key Result so OKR progress updates as tasks complete.
        </p>

        <div className="grid grid-cols-12 px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b">
          <div className="col-span-5">Task</div>
          <div className="col-span-4">Key Result</div>
          <div className="col-span-1 text-right">Share</div>
          <div className="col-span-1 text-right">Progress</div>
          <div className="col-span-1 text-right">Status</div>
        </div>
        <div className="divide-y">
          {tasks.map((t) => {
            const kr = getKeyResult(t.keyResultId);
            return (
              <div key={t.id} className="grid grid-cols-12 items-center px-3 py-3 text-sm">
                <div className="col-span-5 font-medium text-foreground truncate">{t.title}</div>
                <div className="col-span-4 text-muted-foreground truncate">{kr?.title ?? t.keyResultId}</div>
                <div className="col-span-1 text-right text-foreground">{t.share}%</div>
                <div className="col-span-1 text-right text-foreground">{t.progress}%</div>
                <div className="col-span-1 text-right"><StatusBadge status={t.status} /></div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};