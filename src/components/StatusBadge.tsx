import { cn } from "@/lib/utils";
import { BaseStatus, AggregatedStatus } from "@/types/status";

type Status = BaseStatus | AggregatedStatus;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  "todo": {
    label: "To Do",
    className: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-primary/10 text-primary border border-primary/20",
  },
  "in-review": {
    label: "In Review",
    className: "bg-warning/10 text-warning border border-warning/20",
  },
  "blocked": {
    label: "Blocked",
    className: "bg-destructive text-destructive-foreground",
  },
  "done": {
    label: "Done",
    className: "bg-success text-success-foreground",
  },
  "on-track": {
    label: "On Track",
    className: "bg-success/10 text-success border border-success/20",
  },
  "at-risk": {
    label: "At Risk",
    className: "bg-warning/10 text-warning border border-warning/20",
  },
  "off-track": {
    label: "Off Track",
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
