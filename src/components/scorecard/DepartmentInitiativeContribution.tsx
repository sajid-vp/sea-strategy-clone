import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { departmentInitiativeContributions } from "@/data/scorecardData";

interface Props {
  deptId: string;
}

/**
 * Department-level: which initiatives this department contributes to
 * and how much OKR-driven contribution it has delivered.
 */
export const DepartmentInitiativeContribution = ({ deptId }: Props) => {
  const items = departmentInitiativeContributions(deptId);
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Initiative Contribution</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Strategic initiatives this department supports through its OKRs.
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">This department's OKRs aren't linked to any initiative yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.initiative.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div>
                  <div className="font-medium text-foreground">{it.initiative.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Committed weight {it.weight}% · {it.initiative.startYear}–{it.initiative.endYear}
                  </div>
                </div>
                <Badge variant="outline" className={
                  it.impact === "direct"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted text-muted-foreground"
                }>
                  {it.impact}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress value={it.contributionPct} className="h-2" />
                </div>
                <div className="text-sm font-semibold text-foreground w-12 text-right">{it.contributionPct}%</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(it.delivered)} / {it.weight} contribution points delivered
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};