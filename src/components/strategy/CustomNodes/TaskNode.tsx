import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { CheckSquare, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/utils/statusAggregation";
import { isOverdue, getDaysOverdue, formatDueDate } from "@/utils/dateUtils";
import { Badge } from "@/components/ui/badge";

const TaskNode = memo(({ data }: NodeProps) => {
  const statusColor = getStatusColor(data.status);
  const isBlocked = data.status === "blocked";
  const taskOverdue = data.dueDate && isOverdue(data.dueDate);
  const daysOverdue = data.dueDate ? getDaysOverdue(data.dueDate) : 0;
  
  return (
    <div 
      className={cn(
        "px-3 py-2 rounded border bg-card shadow-sm min-w-[180px]",
        isBlocked && "animate-pulse",
        taskOverdue && "border-2 border-destructive shadow-lg shadow-destructive/20"
      )}
      style={{ borderColor: taskOverdue ? undefined : statusColor }}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted" />
      
      <div className="flex items-start gap-2">
        <div className="p-1 rounded" style={{ backgroundColor: taskOverdue ? 'hsl(var(--destructive) / 0.2)' : `${statusColor}20` }}>
          {taskOverdue ? (
            <Clock className="h-3 w-3 text-destructive" />
          ) : isBlocked ? (
            <XCircle className="h-3 w-3" style={{ color: statusColor }} />
          ) : (
            <CheckSquare className="h-3 w-3" style={{ color: statusColor }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-muted-foreground">TASK</div>
          <div className="font-medium text-xs text-foreground line-clamp-1">{data.label}</div>
          {data.assignee && (
            <div className="text-xs text-muted-foreground mt-0.5">{data.assignee}</div>
          )}
          {taskOverdue && (
            <Badge variant="destructive" className="text-[10px] h-4 mt-1">
              {daysOverdue}d overdue
            </Badge>
          )}
          {data.dueDate && !taskOverdue && (
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Due: {formatDueDate(data.dueDate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TaskNode.displayName = "TaskNode";

export default TaskNode;
