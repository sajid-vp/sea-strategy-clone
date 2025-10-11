import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { CheckSquare, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/utils/statusAggregation";

const TaskNode = memo(({ data }: NodeProps) => {
  const statusColor = getStatusColor(data.status);
  const isBlocked = data.status === "blocked";
  
  return (
    <div 
      className={cn(
        "px-3 py-2 rounded border bg-card shadow-sm min-w-[180px]",
        isBlocked && "animate-pulse"
      )}
      style={{ borderColor: statusColor }}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted" />
      
      <div className="flex items-start gap-2">
        <div className="p-1 rounded" style={{ backgroundColor: `${statusColor}20` }}>
          {isBlocked ? (
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
        </div>
      </div>
    </div>
  );
});

TaskNode.displayName = "TaskNode";

export default TaskNode;
