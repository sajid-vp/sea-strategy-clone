import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ArrowRight, Clock, Users, Target, X } from "lucide-react";
import { BlockerChainEnhanced } from "@/utils/blockerAnalysis";

interface BlockerDetailViewProps {
  blocker: BlockerChainEnhanced;
  onClose: () => void;
}

export const BlockerDetailView = ({ blocker, onClose }: BlockerDetailViewProps) => {
  const impactColor = {
    high: "text-destructive bg-destructive/10 border-destructive/20",
    medium: "text-warning bg-warning/10 border-warning/20",
    low: "text-muted-foreground bg-muted/50 border-border",
  }[blocker.impactLevel];

  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute right-2 top-2 h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader>
        <div className="flex items-start gap-3 pr-8">
          <div className={`p-2 rounded-lg ${impactColor}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{blocker.taskTitle}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant={
                blocker.impactLevel === "high" ? "destructive" :
                blocker.impactLevel === "medium" ? "default" : "secondary"
              }>
                {blocker.impactLevel.toUpperCase()} IMPACT
              </Badge>
              {blocker.isOnCriticalPath && (
                <Badge variant="outline" className="border-destructive text-destructive">
                  Critical Path
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Blocking Reason */}
        {blocker.blockingReason && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Blocking Reason
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {blocker.blockingReason}
            </p>
          </div>
        )}

        {/* Hierarchy */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Hierarchy</h4>
          <div className="space-y-2">
            {blocker.initiativeTitle && (
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Initiative:</span>
                <span className="font-medium">{blocker.initiativeTitle}</span>
              </div>
            )}
            {blocker.projectTitle && (
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-6" />
                <span className="text-muted-foreground">Project:</span>
                <span className="font-medium">{blocker.projectTitle}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Impact Metrics */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Impact Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs">Affected Items</span>
              </div>
              <div className="text-2xl font-bold">{blocker.affectedCount}</div>
            </div>
            
            {blocker.estimatedDelay && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Est. Delay</span>
                </div>
                <div className="text-2xl font-bold">{blocker.estimatedDelay}d</div>
              </div>
            )}
          </div>
        </div>

        {/* Dependency Chain */}
        {blocker.dependencyChain && blocker.dependencyChain.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-semibold mb-3">Dependency Chain</h4>
              <div className="space-y-2">
                {blocker.dependencyChain.map((dep, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      dep.status === "blocked" ? "bg-destructive" :
                      dep.status === "in-progress" ? "bg-warning" :
                      dep.status === "done" ? "bg-success" : "bg-muted"
                    }`} />
                    <span className={dep.status === "blocked" ? "font-medium" : "text-muted-foreground"}>
                      {dep.title}
                    </span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {dep.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Owner Info */}
        {blocker.owner && (
          <>
            <Separator />
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Owner:</span>
              <span className="font-medium">{blocker.owner}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
