import { KeyResult, InitiativeObjective } from "@/types/initiative";
import { AggregatedStatus } from "@/types/status";

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
