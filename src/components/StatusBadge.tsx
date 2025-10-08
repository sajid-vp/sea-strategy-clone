import { cn } from "@/lib/utils";

type Status = "todo" | "in-progress" | "in-review" | "blocked" | "done";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  "todo": {
    label: "To Do",
    className: "bg-muted/80 text-muted-foreground border border-border",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-primary/10 text-primary border border-primary/30 shadow-sm",
  },
  "in-review": {
    label: "In Review",
    className: "bg-warning/10 text-warning border border-warning/30 shadow-sm",
  },
  "blocked": {
    label: "Blocked",
    className: "bg-destructive/10 text-destructive border border-destructive/30 shadow-sm",
  },
  "done": {
    label: "Done",
    className: "bg-success/10 text-success border border-success/30 shadow-sm",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-all",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
