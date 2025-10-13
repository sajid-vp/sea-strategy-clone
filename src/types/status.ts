// Base status type for data storage
export type BaseStatus = "todo" | "in-progress" | "in-review" | "blocked" | "done";

// Aggregated/Display status type for UI
export type AggregatedStatus = "on-track" | "at-risk" | "off-track" | "done";

// Map individual base status to aggregated status
export function mapToAggregatedStatus(
  status: BaseStatus,
  progress?: number,
  dueDate?: string
): AggregatedStatus {
  // If done, always show done
  if (status === "done") return "done";
  
  // If blocked, always off-track
  if (status === "blocked") return "off-track";
  
  // If in-review, check progress
  if (status === "in-review") {
    return progress && progress >= 80 ? "on-track" : "at-risk";
  }
  
  // If in-progress, check progress and due date
  if (status === "in-progress") {
    if (dueDate && new Date(dueDate) < new Date()) {
      return "off-track"; // overdue
    }
    return progress && progress >= 50 ? "on-track" : "at-risk";
  }
  
  // Todo is at-risk if overdue, otherwise on-track
  if (status === "todo") {
    if (dueDate && new Date(dueDate) < new Date()) {
      return "off-track";
    }
    return "on-track";
  }
  
  return "on-track";
}

// Aggregate multiple child statuses to parent status
export function aggregateChildStatuses(
  childStatuses: Array<{ status: BaseStatus; progress?: number; dueDate?: string }>
): AggregatedStatus {
  if (childStatuses.length === 0) return "on-track";
  
  const aggregated = childStatuses.map(child => 
    mapToAggregatedStatus(child.status, child.progress, child.dueDate)
  );
  
  const offTrackCount = aggregated.filter(s => s === "off-track").length;
  const atRiskCount = aggregated.filter(s => s === "at-risk").length;
  const doneCount = aggregated.filter(s => s === "done").length;
  
  // If any child is off-track, parent is off-track
  if (offTrackCount > 0) return "off-track";
  
  // If all children are done
  if (doneCount === aggregated.length) return "done";
  
  // If >30% are at-risk, parent is at-risk
  if (atRiskCount / aggregated.length >= 0.3) return "at-risk";
  
  return "on-track";
}

// Get color for aggregated status
export function getAggregatedStatusColor(status: AggregatedStatus): string {
  switch (status) {
    case "off-track": return "hsl(var(--destructive))";
    case "at-risk": return "hsl(var(--warning))";
    case "on-track": return "hsl(var(--success))";
    case "done": return "hsl(var(--primary))";
  }
}
