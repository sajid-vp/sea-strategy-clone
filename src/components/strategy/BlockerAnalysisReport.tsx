import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, ChevronDown, ChevronRight, Target } from "lucide-react";
import { BlockerChainEnhanced } from "@/utils/blockerAnalysis";
import { BlockerDetailView } from "./BlockerDetailView";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BlockerAnalysisReportProps {
  blockers: BlockerChainEnhanced[];
  groupBy: string;
}

export const BlockerAnalysisReport = ({ blockers, groupBy }: BlockerAnalysisReportProps) => {
  const [selectedBlocker, setSelectedBlocker] = useState<BlockerChainEnhanced | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (taskId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedRows(newExpanded);
  };

  const groupedBlockers = () => {
    if (groupBy === "None") {
      return { "All Blockers": blockers };
    }

    const groups: Record<string, BlockerChainEnhanced[]> = {};

    blockers.forEach(blocker => {
      let groupKey = "Unknown";

      switch (groupBy) {
        case "Impact":
          groupKey = blocker.impactLevel.charAt(0).toUpperCase() + blocker.impactLevel.slice(1);
          break;
        case "Initiative":
          groupKey = blocker.initiativeTitle || "No Initiative";
          break;
        case "Project":
          groupKey = blocker.projectTitle || "No Project";
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(blocker);
    });

    return groups;
  };

  const groups = groupedBlockers();

  if (selectedBlocker) {
    return (
      <BlockerDetailView
        blocker={selectedBlocker}
        onClose={() => setSelectedBlocker(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Blocker Table by Group */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Blocker Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(groups).map(([groupName, groupBlockers]) => (
              <Collapsible key={groupName} defaultOpen={true}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4" />
                      <span className="font-semibold">{groupName}</span>
                      <Badge variant="secondary">{groupBlockers.length}</Badge>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="rounded-md border mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]"></TableHead>
                          <TableHead>Blocker</TableHead>
                          <TableHead>Impact</TableHead>
                          <TableHead className="text-center">Affected</TableHead>
                          <TableHead>Project / Initiative</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupBlockers.map((blocker) => (
                          <>
                            <TableRow
                              key={blocker.taskId}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => toggleRow(blocker.taskId)}
                            >
                              <TableCell>
                                {expandedRows.has(blocker.taskId) ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    blocker.impactLevel === "high" ? "bg-destructive" :
                                    blocker.impactLevel === "medium" ? "bg-warning" : "bg-muted"
                                  }`} />
                                  <span className="font-medium">{blocker.taskTitle}</span>
                                  {blocker.isOnCriticalPath && (
                                    <Badge variant="outline" className="text-xs border-destructive text-destructive">
                                      CP
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  blocker.impactLevel === "high" ? "destructive" :
                                  blocker.impactLevel === "medium" ? "default" : "secondary"
                                } className="text-xs">
                                  {blocker.impactLevel}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="font-semibold">{blocker.affectedCount}</span>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm space-y-0.5">
                                  {blocker.projectTitle && (
                                    <div className="text-muted-foreground truncate max-w-[200px]">
                                      {blocker.projectTitle}
                                    </div>
                                  )}
                                  {blocker.initiativeTitle && (
                                    <div className="text-xs text-muted-foreground/70 truncate max-w-[200px]">
                                      {blocker.initiativeTitle}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBlocker(blocker);
                                  }}
                                >
                                  Details
                                </Button>
                              </TableCell>
                            </TableRow>
                            {expandedRows.has(blocker.taskId) && (
                              <TableRow>
                                <TableCell colSpan={6} className="bg-muted/30">
                                  <div className="py-3 px-4 space-y-2">
                                    {blocker.blockingReason && (
                                      <div className="text-sm">
                                        <span className="font-semibold text-muted-foreground">Reason: </span>
                                        <span>{blocker.blockingReason}</span>
                                      </div>
                                    )}
                                    {blocker.owner && (
                                      <div className="text-sm">
                                        <span className="font-semibold text-muted-foreground">Owner: </span>
                                        <span>{blocker.owner}</span>
                                      </div>
                                    )}
                                    {blocker.estimatedDelay && (
                                      <div className="text-sm">
                                        <span className="font-semibold text-muted-foreground">Estimated Delay: </span>
                                        <span>{blocker.estimatedDelay} days</span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
