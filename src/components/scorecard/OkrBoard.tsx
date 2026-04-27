import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { Objective } from "@/data/scorecardData";

interface Props {
  objectives: Objective[];
}

const confidenceTone: Record<string, string> = {
  high: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-destructive/10 text-destructive border-destructive/20",
};

export const OkrBoard = ({ objectives }: Props) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">OKR Board</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Annual objectives and key results — progress, confidence and status.
      </p>

      {objectives.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No objectives defined for this department yet.</p>
      ) : (
        <div className="space-y-5">
          {objectives.map((o) => (
            <div key={o.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <div className="text-xs text-muted-foreground">Objective · {o.year}</div>
                  <h3 className="font-semibold text-foreground">{o.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Progress</div>
                    <div className="text-lg font-bold text-foreground">{o.progress}%</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              </div>
              <Progress value={o.progress} className="h-1.5 mb-4" />

              <div className="space-y-2">
                {o.keyResults.map((kr) => (
                  <div key={kr.id} className="grid grid-cols-12 items-center gap-3 text-sm">
                    <div className="col-span-5">
                      <div className="font-medium text-foreground">{kr.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {kr.actual}{kr.unit} / {kr.target}{kr.unit}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <Progress value={kr.progress} className="h-2" />
                    </div>
                    <div className="col-span-1 text-right font-semibold text-foreground">{kr.progress}%</div>
                    <div className="col-span-1 text-right">
                      <Badge variant="outline" className={confidenceTone[kr.confidence]}>{kr.confidence}</Badge>
                    </div>
                    <div className="col-span-1 text-right">
                      <StatusBadge status={kr.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};