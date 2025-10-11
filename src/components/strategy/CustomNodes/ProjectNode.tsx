import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { FolderKanban, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/utils/statusAggregation";
import { Progress } from "@/components/ui/progress";
import { isOverdue, getDaysOverdue, formatDueDate } from "@/utils/dateUtils";
import { Badge } from "@/components/ui/badge";

const ProjectNode = memo(({ data }: NodeProps) => {
  const statusColor = getStatusColor(data.status);
  const isBlocked = data.status === "blocked";
  const progress = data.progress || 0;
  const projectOverdue = data.dueDate && isOverdue(data.dueDate);
  const daysOverdue = data.dueDate ? getDaysOverdue(data.dueDate) : 0;
  
  return (
    <div 
      className={cn(
        "px-3 py-2 rounded-lg border bg-card shadow-sm min-w-[200px]",
        isBlocked && "animate-pulse",
        projectOverdue && "border-2 border-destructive shadow-lg shadow-destructive/20"
      )}
      style={{ borderColor: projectOverdue ? undefined : statusColor }}
    >
      <Handle type="target" position={Position.Left} className="!bg-muted" />
      <Handle type="source" position={Position.Right} className="!bg-muted" />
      
      <div className="flex items-start gap-2">
        <div className="p-1 rounded" style={{ backgroundColor: projectOverdue ? 'hsl(var(--destructive) / 0.2)' : `${statusColor}20` }}>
          {projectOverdue ? (
            <Clock className="h-3.5 w-3.5 text-destructive" />
          ) : isBlocked ? (
            <AlertTriangle className="h-3.5 w-3.5" style={{ color: statusColor }} />
          ) : (
            <FolderKanban className="h-3.5 w-3.5" style={{ color: statusColor }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-muted-foreground">PROJECT</div>
          <div className="font-medium text-xs text-foreground line-clamp-1">{data.label}</div>
          <Progress value={progress} className="h-1 mt-1.5" />
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-muted-foreground">{progress}% complete</div>
            {projectOverdue && (
              <Badge variant="destructive" className="text-[10px] h-4">
                {daysOverdue}d late
              </Badge>
            )}
          </div>
          {data.dueDate && !projectOverdue && (
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Due: {formatDueDate(data.dueDate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProjectNode.displayName = "ProjectNode";

export default ProjectNode;
