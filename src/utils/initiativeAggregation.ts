import { KeyResult, InitiativeObjective } from "@/types/initiative";
import { AggregatedStatus } from "@/types/status";
import { TrackingSource, AggregationMethod } from "@/types/tracking";
import { programs } from "@/data/programsData";
import { initiatives as projectInitiatives } from "@/data/projectsData";

/**
 * Calculate progress for a key result based on current vs target value
 */
export function calculateKeyResultProgress(keyResult: KeyResult): number {
  if (keyResult.targetValue === 0) return 0;
  return Math.min(100, Math.round((keyResult.currentValue / keyResult.targetValue) * 100));
}

/**
 * Determine status based on progress and dates
 */
export function calculateKeyResultStatus(
  progress: number,
  endDate: string
): AggregatedStatus {
  const now = new Date();
  const end = new Date(endDate);
  const isOverdue = now > end;

  if (progress >= 100) return "done";
  if (isOverdue) return "off-track";
  if (progress >= 70) return "on-track";
  if (progress >= 40) return "at-risk";
  return "off-track";
}

/**
 * Aggregate key results to calculate objective status
 */
export function aggregateObjectiveStatus(
  keyResults: KeyResult[]
): AggregatedStatus {
  if (keyResults.length === 0) return "on-track";

  const statuses = keyResults.map(kr => kr.status);
  const doneCount = statuses.filter(s => s === "done").length;
  const offTrackCount = statuses.filter(s => s === "off-track").length;
  const atRiskCount = statuses.filter(s => s === "at-risk").length;

  // All done
  if (doneCount === statuses.length) return "done";
  
  // Any off-track means objective is off-track
  if (offTrackCount > 0) return "off-track";
  
  // More than 30% at-risk means objective is at-risk
  if (atRiskCount / statuses.length >= 0.3) return "at-risk";
  
  return "on-track";
}

/**
 * Calculate objective progress from key results
 */
export function calculateObjectiveProgress(
  keyResults: KeyResult[]
): number {
  if (keyResults.length === 0) return 0;
  
  const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0);
  return Math.round(totalProgress / keyResults.length);
}

/**
 * Auto-aggregate project KPI values to update key result
 */
export function aggregateProjectKPIsToKeyResult(
  keyResult: KeyResult
): number {
  if (keyResult.linkedProjectKPIs.length === 0) {
    return keyResult.currentValue;
  }

  // Sum up all linked project KPI values
  const totalValue = keyResult.linkedProjectKPIs.reduce(
    (sum, kpi) => sum + kpi.kpiValue,
    0
  );

  return totalValue;
}

/**
 * Aggregate tracking sources based on the aggregation method
 */
export function aggregateTrackingSources(
  sources: TrackingSource[],
  method: AggregationMethod
): number {
  if (sources.length === 0) return 0;

  switch (method) {
    case "sum":
      return sources.reduce((sum, s) => sum + s.currentValue, 0);
    case "average":
      return sources.reduce((sum, s) => sum + s.currentValue, 0) / sources.length;
    case "weighted":
      const totalWeight = sources.reduce((sum, s) => sum + (s.weight || 1), 0);
      const weightedSum = sources.reduce((sum, s) => sum + s.currentValue * (s.weight || 1), 0);
      return totalWeight > 0 ? weightedSum / totalWeight : 0;
    case "max":
      return Math.max(...sources.map((s) => s.currentValue));
    case "min":
      return Math.min(...sources.map((s) => s.currentValue));
    default:
      return 0;
  }
}

/**
 * Get the current value for a tracking source by fetching fresh data
 */
export function getTrackingSourceValue(source: TrackingSource): number {
  switch (source.type) {
    case "program-kpi": {
      const program = programs.find(p => p.id === source.entityId);
      if (!program) return source.currentValue;
      const kpiIndex = parseInt(source.kpiId?.replace("kpi-", "") || "0");
      const kpi = program.kpis[kpiIndex];
      return kpi ? parseFloat(kpi.current) || 0 : source.currentValue;
    }
    case "project-progress": {
      const initiative = projectInitiatives.find(i => 
        i.projects.some(p => p.id === source.entityId)
      );
      const project = initiative?.projects.find(p => p.id === source.entityId);
      return project?.progress || 0;
    }
    case "milestone-rate": {
      const initiative = projectInitiatives.find(i => 
        i.projects.some(p => p.id === source.entityId)
      );
      const project = initiative?.projects.find(p => p.id === source.entityId);
      if (!project?.milestones?.length) return 0;
      const completed = project.milestones.filter(m => m.status === "done").length;
      return Math.round((completed / project.milestones.length) * 100);
    }
    case "task-rate": {
      const initiative = projectInitiatives.find(i => 
        i.projects.some(p => p.id === source.entityId)
      );
      const project = initiative?.projects.find(p => p.id === source.entityId);
      if (!project?.tasks?.length) return 0;
      const completed = project.tasks.filter(t => t.status === "done").length;
      return Math.round((completed / project.tasks.length) * 100);
    }
    case "manual":
    default:
      return source.currentValue;
  }
}

/**
 * Refresh all tracking sources with current values
 */
export function refreshTrackingSources(sources: TrackingSource[]): TrackingSource[] {
  return sources.map(source => ({
    ...source,
    currentValue: getTrackingSourceValue(source),
  }));
}

/**
 * Calculate the current value for a Key Result from its tracking sources
 */
export function calculateKeyResultFromSources(keyResult: KeyResult): number {
  if (!keyResult.trackingSources || keyResult.trackingSources.length === 0) {
    return keyResult.currentValue;
  }

  // Check for manual override
  if (keyResult.manualOverride !== undefined) {
    return keyResult.manualOverride;
  }

  // Refresh sources and aggregate
  const refreshedSources = refreshTrackingSources(keyResult.trackingSources);
  return aggregateTrackingSources(
    refreshedSources,
    keyResult.aggregationMethod || "average"
  );
}
