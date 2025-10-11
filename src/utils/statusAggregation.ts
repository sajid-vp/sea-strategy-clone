type Status = "todo" | "in-progress" | "in-review" | "blocked" | "done";

export interface StatusCount {
  total: number;
  blocked: number;
  atRisk: number;
  onTrack: number;
  done: number;
}

export const aggregateStatus = (statuses: Status[]): "blocked" | "at-risk" | "on-track" | "done" => {
  if (statuses.length === 0) return "on-track";
  
  const counts = {
    blocked: statuses.filter(s => s === "blocked").length,
    atRisk: statuses.filter(s => s === "in-review").length,
    done: statuses.filter(s => s === "done").length,
    onTrack: statuses.filter(s => s === "in-progress").length,
  };
  
  // If any child is blocked, parent is at-risk
  if (counts.blocked > 0) return "at-risk";
  
  // If all are done
  if (counts.done === statuses.length) return "done";
  
  // If >50% on track or in progress
  const progressPercentage = (counts.onTrack + counts.done) / statuses.length;
  if (progressPercentage >= 0.5) return "on-track";
  
  return "at-risk";
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "blocked":
      return "hsl(var(--destructive))";
    case "at-risk":
      return "hsl(var(--warning))";
    case "on-track":
    case "in-progress":
      return "hsl(var(--success))";
    case "done":
      return "hsl(var(--success))";
    case "todo":
      return "hsl(var(--muted))";
    default:
      return "hsl(var(--muted))";
  }
};

export const calculateStatusCounts = (statuses: Status[]): StatusCount => {
  return {
    total: statuses.length,
    blocked: statuses.filter(s => s === "blocked").length,
    atRisk: statuses.filter(s => s === "in-review").length,
    onTrack: statuses.filter(s => s === "in-progress").length,
    done: statuses.filter(s => s === "done").length,
  };
};
