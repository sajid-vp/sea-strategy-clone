import { cn } from "@/lib/utils";

type Status = "on-track" | "off-track" | "at-risk";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  "on-track": {
    label: "On Track",
    className: "bg-success text-success-foreground",
  },
  "off-track": {
    label: "Off Track",
    className: "bg-destructive text-destructive-foreground",
  },
  "at-risk": {
    label: "At Risk",
    className: "bg-warning text-warning-foreground",
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
