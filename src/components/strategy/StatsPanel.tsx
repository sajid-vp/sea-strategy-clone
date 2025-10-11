import { AlertCircle, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsPanelProps {
  stats: {
    totalBlocked: number;
    totalAtRisk: number;
    totalOnTrack: number;
    totalDone: number;
    totalItems: number;
    onTrackPercentage: number;
  };
}

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stats.totalBlocked}</div>
            <div className="text-xs text-muted-foreground">Blocked</div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Clock className="h-5 w-5 text-warning" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stats.totalAtRisk}</div>
            <div className="text-xs text-muted-foreground">At Risk</div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stats.totalOnTrack}</div>
            <div className="text-xs text-muted-foreground">On Track</div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stats.onTrackPercentage}%</div>
            <div className="text-xs text-muted-foreground">Health Score</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
