import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Link2, BarChart3, FolderKanban, Target, CheckSquare } from "lucide-react";
import { TrackingSource, TrackingSourceType, AggregationMethod } from "@/types/tracking";
import { programs } from "@/data/programsData";
import { initiatives as projectInitiatives } from "@/data/projectsData";

interface TrackingSourceSelectorProps {
  initiativeId: number;
  selectedSources: TrackingSource[];
  onSourcesChange: (sources: TrackingSource[]) => void;
  aggregationMethod: AggregationMethod;
  onAggregationMethodChange: (method: AggregationMethod) => void;
}

const sourceTypeLabels: Record<TrackingSourceType, string> = {
  "program-kpi": "Program KPI",
  "project-kpi": "Project KPI",
  "project-progress": "Project Progress",
  "milestone-rate": "Milestone Completion",
  "task-rate": "Task Completion",
  "manual": "Manual Entry",
};

const sourceTypeIcons: Record<TrackingSourceType, React.ReactNode> = {
  "program-kpi": <BarChart3 className="h-4 w-4" />,
  "project-kpi": <Target className="h-4 w-4" />,
  "project-progress": <FolderKanban className="h-4 w-4" />,
  "milestone-rate": <CheckSquare className="h-4 w-4" />,
  "task-rate": <CheckSquare className="h-4 w-4" />,
  "manual": <Link2 className="h-4 w-4" />,
};

export function TrackingSourceSelector({
  initiativeId,
  selectedSources,
  onSourcesChange,
  aggregationMethod,
  onAggregationMethodChange,
}: TrackingSourceSelectorProps) {
  const [activeSourceType, setActiveSourceType] = useState<TrackingSourceType | null>(null);

  // Get related programs and projects for this initiative
  const relatedPrograms = useMemo(() => {
    return programs.filter((p) => p.initiativeId === initiativeId);
  }, [initiativeId]);

  const relatedProjects = useMemo(() => {
    const initiative = projectInitiatives.find((i) => i.id === initiativeId);
    return initiative?.projects || [];
  }, [initiativeId]);

  const handleAddSource = (source: Omit<TrackingSource, "id">) => {
    const newSource: TrackingSource = {
      ...source,
      id: `${source.type}-${source.entityId}-${source.kpiId || "main"}-${Date.now()}`,
    };
    onSourcesChange([...selectedSources, newSource]);
  };

  const handleRemoveSource = (sourceId: string) => {
    onSourcesChange(selectedSources.filter((s) => s.id !== sourceId));
  };

  const handleUpdateWeight = (sourceId: string, weight: number) => {
    onSourcesChange(
      selectedSources.map((s) =>
        s.id === sourceId ? { ...s, weight } : s
      )
    );
  };

  const calculateProjectProgress = (project: any) => project.progress || 0;

  const calculateMilestoneRate = (project: any) => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completed = project.milestones.filter((m: any) => m.status === "done").length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  const calculateTaskRate = (project: any) => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completed = project.tasks.filter((t: any) => t.status === "done").length;
    return Math.round((completed / project.tasks.length) * 100);
  };

  const isSourceSelected = (type: TrackingSourceType, entityId: number, kpiId?: string) => {
    return selectedSources.some(
      (s) => s.type === type && s.entityId === entityId && (kpiId ? s.kpiId === kpiId : true)
    );
  };

  const totalWeight = selectedSources.reduce((sum, s) => sum + (s.weight || 1), 0);
  
  const calculatedValue = useMemo(() => {
    if (selectedSources.length === 0) return 0;
    
    switch (aggregationMethod) {
      case "sum":
        return selectedSources.reduce((sum, s) => sum + s.currentValue, 0);
      case "average":
        return selectedSources.reduce((sum, s) => sum + s.currentValue, 0) / selectedSources.length;
      case "weighted":
        const weightedSum = selectedSources.reduce((sum, s) => sum + s.currentValue * (s.weight || 1), 0);
        return totalWeight > 0 ? weightedSum / totalWeight : 0;
      case "max":
        return Math.max(...selectedSources.map((s) => s.currentValue));
      case "min":
        return Math.min(...selectedSources.map((s) => s.currentValue));
      default:
        return 0;
    }
  }, [selectedSources, aggregationMethod, totalWeight]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Tracking Sources</Label>
        <Badge variant="secondary" className="gap-1">
          <Link2 className="h-3 w-3" />
          {selectedSources.length} source{selectedSources.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Source Type Selection */}
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(sourceTypeLabels) as TrackingSourceType[]).map((type) => (
          <Button
            key={type}
            type="button"
            variant={activeSourceType === type ? "default" : "outline"}
            size="sm"
            className="gap-1 text-xs"
            onClick={() => setActiveSourceType(activeSourceType === type ? null : type)}
          >
            {sourceTypeIcons[type]}
            {sourceTypeLabels[type]}
          </Button>
        ))}
      </div>

      {/* Source Selection Panel */}
      {activeSourceType && (
        <Card className="p-4 border-dashed">
          {activeSourceType === "program-kpi" && (
            <div className="space-y-3">
              <Label className="text-sm">Select Program KPIs</Label>
              {relatedPrograms.length === 0 ? (
                <p className="text-sm text-muted-foreground">No programs linked to this initiative</p>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {relatedPrograms.map((program) => (
                    <AccordionItem key={program.id} value={`program-${program.id}`}>
                      <AccordionTrigger className="text-sm py-2">
                        {program.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {program.kpis.map((kpi, idx) => {
                            const currentVal = parseFloat(kpi.current) || 0;
                            const selected = isSourceSelected("program-kpi", program.id, `kpi-${idx}`);
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={selected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleAddSource({
                                          type: "program-kpi",
                                          entityId: program.id,
                                          entityName: program.title,
                                          kpiId: `kpi-${idx}`,
                                          kpiName: kpi.name,
                                          currentValue: currentVal,
                                          unit: kpi.unit,
                                        });
                                      } else {
                                        const source = selectedSources.find(
                                          (s) =>
                                            s.type === "program-kpi" &&
                                            s.entityId === program.id &&
                                            s.kpiId === `kpi-${idx}`
                                        );
                                        if (source) handleRemoveSource(source.id);
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{kpi.name}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {kpi.current} / {kpi.target} {kpi.unit}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          )}

          {(activeSourceType === "project-progress" ||
            activeSourceType === "milestone-rate" ||
            activeSourceType === "task-rate") && (
            <div className="space-y-3">
              <Label className="text-sm">
                Select Projects for {sourceTypeLabels[activeSourceType]}
              </Label>
              {relatedProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects in this initiative</p>
              ) : (
                <div className="space-y-2">
                  {relatedProjects.map((project) => {
                    let currentVal = 0;
                    if (activeSourceType === "project-progress") {
                      currentVal = calculateProjectProgress(project);
                    } else if (activeSourceType === "milestone-rate") {
                      currentVal = calculateMilestoneRate(project);
                    } else if (activeSourceType === "task-rate") {
                      currentVal = calculateTaskRate(project);
                    }

                    const selected = isSourceSelected(activeSourceType, project.id);

                    return (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleAddSource({
                                  type: activeSourceType,
                                  entityId: project.id,
                                  entityName: project.title,
                                  currentValue: currentVal,
                                  unit: "%",
                                });
                              } else {
                                const source = selectedSources.find(
                                  (s) => s.type === activeSourceType && s.entityId === project.id
                                );
                                if (source) handleRemoveSource(source.id);
                              }
                            }}
                          />
                          <span className="text-sm">{project.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {currentVal}%
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeSourceType === "project-kpi" && (
            <div className="space-y-3">
              <Label className="text-sm">Select Project KPIs</Label>
              <p className="text-xs text-muted-foreground">
                Project KPIs are currently text-based. Consider using Project Progress instead.
              </p>
              {relatedProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects in this initiative</p>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {relatedProjects.map((project) => (
                    <AccordionItem key={project.id} value={`project-${project.id}`}>
                      <AccordionTrigger className="text-sm py-2">
                        {project.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {(project.kpis || []).map((kpi, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground py-1">
                              • {kpi}
                            </div>
                          ))}
                          {(!project.kpis || project.kpis.length === 0) && (
                            <p className="text-sm text-muted-foreground">No KPIs defined</p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          )}

          {activeSourceType === "manual" && (
            <div className="space-y-3">
              <Label className="text-sm">Manual Entry</Label>
              <p className="text-sm text-muted-foreground">
                Use manual entry when data comes from external sources or spreadsheets.
                You can update the current value directly in the Key Result.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  handleAddSource({
                    type: "manual",
                    entityId: 0,
                    entityName: "Manual Entry",
                    currentValue: 0,
                    unit: "%",
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Manual Source
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Selected Sources List */}
      {selectedSources.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selected Sources</Label>
          <div className="space-y-2">
            {selectedSources.map((source) => (
              <Card key={source.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sourceTypeIcons[source.type]}
                    <div>
                      <div className="text-sm font-medium">
                        {source.kpiName || source.entityName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sourceTypeLabels[source.type]}
                        {source.kpiName && ` • ${source.entityName}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{source.currentValue}{source.unit}</Badge>
                    {aggregationMethod === "weighted" && (
                      <Input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={source.weight || 1}
                        onChange={(e) =>
                          handleUpdateWeight(source.id, parseFloat(e.target.value) || 1)
                        }
                        className="w-16 h-8 text-xs"
                      />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSource(source.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Aggregation Method */}
      {selectedSources.length > 1 && (
        <div className="space-y-2">
          <Label>Aggregation Method</Label>
          <Select value={aggregationMethod} onValueChange={(v) => onAggregationMethodChange(v as AggregationMethod)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sum">Sum (add all values)</SelectItem>
              <SelectItem value="average">Average (mean of values)</SelectItem>
              <SelectItem value="weighted">Weighted Average</SelectItem>
              <SelectItem value="max">Maximum (highest value)</SelectItem>
              <SelectItem value="min">Minimum (lowest value)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Preview */}
      {selectedSources.length > 0 && (
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Calculated Current Value</span>
            <span className="text-lg font-semibold">
              {calculatedValue.toFixed(1)}
              {selectedSources[0]?.unit || ""}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
