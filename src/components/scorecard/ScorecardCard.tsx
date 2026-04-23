import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ScorecardEntity } from "@/data/scorecardData";

interface Props {
  entity: ScorecardEntity;
  to: string;
}

const trendIcon = (t: "up" | "down" | "flat") =>
  t === "up" ? <TrendingUp className="h-3 w-3 text-success" /> :
  t === "down" ? <TrendingDown className="h-3 w-3 text-destructive" /> :
  <Minus className="h-3 w-3 text-muted-foreground" />;

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
          {entity.perspectives.map((p) => (
            <div key={p.name} className="flex items-center justify-between">
              <span className="text-muted-foreground">{p.name}</span>
              <span className="flex items-center gap-1 font-medium text-foreground">
                {p.score}
                {trendIcon(p.trend)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </Link>
  );
};