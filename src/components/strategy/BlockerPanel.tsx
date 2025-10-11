import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BlockerChain } from "@/utils/blockerAnalysis";

interface BlockerPanelProps {
  blockerChains: BlockerChain[];
}

export const BlockerPanel = ({ blockerChains }: BlockerPanelProps) => {
  if (blockerChains.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
          <p>No blockers detected! All systems go.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="font-semibold text-foreground">Critical Blockers</h3>
        <Badge variant="destructive" className="ml-auto">{blockerChains.length}</Badge>
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {blockerChains.map((chain) => (
            <Card key={chain.taskId} className="p-3 bg-muted/50">
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded ${
                  chain.impactLevel === "high" ? "bg-destructive/20" :
                  chain.impactLevel === "medium" ? "bg-warning/20" : "bg-muted"
                }`}>
                  <AlertTriangle className={`h-3 w-3 ${
                    chain.impactLevel === "high" ? "text-destructive" :
                    chain.impactLevel === "medium" ? "text-warning" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground line-clamp-1">
                    {chain.taskTitle}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {chain.projectTitle && <div>Project: {chain.projectTitle}</div>}
                    {chain.initiativeTitle && <div>Initiative: {chain.initiativeTitle}</div>}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={
                      chain.impactLevel === "high" ? "destructive" :
                      chain.impactLevel === "medium" ? "default" : "secondary"
                    } className="text-xs">
                      {chain.impactLevel.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Affects {chain.affectedCount} item{chain.affectedCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {chain.blockingReason && (
                    <div className="text-xs text-muted-foreground mt-2 p-2 rounded bg-card">
                      {chain.blockingReason}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
