import { cn } from "@/lib/utils";

type Status = "todo" | "in-progress" | "in-review" | "blocked" | "done";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
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
