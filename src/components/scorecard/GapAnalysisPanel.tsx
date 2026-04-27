import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";
import {
  strategicInitiatives,
  initiativeOkrContribution,
} from "@/data/scorecardData";

export const GapAnalysisPanel = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <h2 className="text-lg font-semibold text-foreground">Gap Analysis</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Where execution is falling short of strategic intent — and how much OKRs are closing that gap.
      </p>

      <div className="grid grid-cols-12 px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b">
        <div className="col-span-4">Initiative</div>
        <div className="col-span-2 text-right">Expected</div>
        <div className="col-span-2 text-right">Actual</div>
        <div className="col-span-2 text-right">Gap</div>
        <div className="col-span-2 text-right">OKR Delivery</div>
      </div>
      <div className="divide-y">
        {strategicInitiatives.map((init) => {
          const gap = init.expectedProgress - init.actualProgress;
          const c = initiativeOkrContribution(init.id);
          const tone =
            gap <= 0 ? "text-success" : gap < 10 ? "text-warning" : "text-destructive";
          return (
            <div key={init.id} className="grid grid-cols-12 items-center px-3 py-3 text-sm">
              <div className="col-span-4 font-medium text-foreground truncate">{init.name}</div>
              <div className="col-span-2 text-right text-foreground">{init.expectedProgress}%</div>
              <div className="col-span-2 text-right text-foreground">{init.actualProgress}%</div>
              <div className={`col-span-2 text-right font-semibold ${tone}`}>
                {gap > 0 ? `-${gap}` : `+${Math.abs(gap)}`} pts
              </div>
              <div className="col-span-2 flex items-center gap-2 justify-end">
                <div className="w-24"><Progress value={c.contributionPct} className="h-1.5" /></div>
                <span className="text-xs font-medium text-foreground w-10 text-right">{c.contributionPct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};