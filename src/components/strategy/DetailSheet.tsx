import { AlertTriangle, ArrowRight, Clock, Target, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlockerChainEnhanced } from "@/utils/blockerAnalysis";

interface DetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  blocker?: BlockerChainEnhanced | null;
}

export const DetailSheet = ({ isOpen, onClose, node, blocker }: DetailSheetProps) => {
  if (!node) return null;

  const impactColor = blocker ? {
    high: "text-destructive bg-destructive/10 border-destructive/20",
    medium: "text-warning bg-warning/10 border-warning/20",
    low: "text-muted-foreground bg-muted/50 border-border",
  }[blocker.impactLevel] : "";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground uppercase mb-1">
                {node.data.type}
              </div>
              <SheetTitle className="text-lg">{node.data.label}</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {node.data.status && (
            <div className="mt-2">
              <StatusBadge status={node.data.status} />
            </div>
          )}
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className={`grid w-full ${blocker ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            {blocker && (
              <TabsTrigger value="blocker" className="text-destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Blocker
              </TabsTrigger>
            )}
          </TabsList>

          <ScrollArea className="h-[calc(100vh-250px)] mt-4">
            <TabsContent value="details" className="space-y-4">
              {node.data.description && (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Description</h4>
                  <p className="text-sm text-muted-foreground">{node.data.description}</p>
                </div>
              )}
              
              {node.data.owner && (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Owner</h4>
                  <p className="text-sm text-muted-foreground">{node.data.owner}</p>
                </div>
              )}
              
              {node.data.startDate && (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Timeline</h4>
                  <p className="text-sm text-muted-foreground">
                    {node.data.startDate} - {node.data.endDate || "Ongoing"}
                  </p>
                </div>
              )}
              
              {node.data.budget && (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Budget</h4>
                  <p className="text-sm text-muted-foreground">{node.data.budget}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              {node.data.progress !== undefined && (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Completion</h4>
                  <div className="text-2xl font-bold text-foreground">{node.data.progress}%</div>
                </div>
              )}
              
              {node.data.milestones && (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Milestones</h4>
                  <div className="space-y-2">
                    {node.data.milestones.map((milestone: any, index: number) => (
                      <div key={index} className="p-2 rounded bg-muted">
                        <div className="text-sm text-foreground">{milestone.name}</div>
                        <div className="text-xs text-muted-foreground">{milestone.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              {node.data.owner && (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Owner</h4>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {node.data.owner.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{node.data.owner}</span>
                  </div>
                </div>
              )}
              
              {node.data.team && (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">Team Members</h4>
                  <div className="space-y-2">
                    {node.data.team.map((member: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium text-foreground">
                            {member.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm text-foreground">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {blocker && (
              <TabsContent value="blocker" className="space-y-6">
                {/* Blocker Header */}
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${impactColor}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Blocker Analysis</h4>
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
              </TabsContent>
            )}
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
