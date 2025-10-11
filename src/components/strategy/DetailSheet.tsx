import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
}

export const DetailSheet = ({ isOpen, onClose, node }: DetailSheetProps) => {
  if (!node) return null;

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
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
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
