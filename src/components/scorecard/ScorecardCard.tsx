import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import type { ScorecardEntity } from "@/data/scorecardData";

interface Props {
  entity: ScorecardEntity;
  to: string;
}

export const ScorecardCard = ({ entity, to }: Props) => {
  const healthColor =
    entity.healthScore >= 80 ? "text-success" :
    entity.healthScore >= 65 ? "text-warning" : "text-destructive";

  return (
    <Link to={to}>
      <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-semibold text-foreground">{entity.name}</div>
            {entity.role && <div className="text-xs text-muted-foreground">{entity.role}</div>}
            {entity.department && entity.type === "individual" && (
              <div className="text-xs text-muted-foreground">{entity.department}</div>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className={`text-3xl font-bold ${healthColor}`}>{entity.healthScore}</span>
          <span className="text-xs text-muted-foreground">Health Score</span>
        </div>
        <Progress value={entity.healthScore} className="h-1.5 mb-3" />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">On Track</span>
            <span className="font-medium text-foreground">{entity.totals.onTrack}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">At Risk</span>
            <span className="font-medium text-foreground">{entity.totals.atRisk}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Blocked</span>
            <span className="font-medium text-foreground">{entity.totals.blocked}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Done</span>
            <span className="font-medium text-foreground">{entity.totals.done}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};