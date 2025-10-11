import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

const GoalNode = memo(({ data }: NodeProps) => {
  return (
    <div className={cn(
      "px-6 py-4 rounded-lg border-2 bg-card shadow-lg min-w-[280px]",
      "border-primary"
    )}>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
      
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Target className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-muted-foreground mb-1">GOAL</div>
          <div className="font-semibold text-sm text-foreground">{data.label}</div>
          {data.description && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {data.description}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
              {data.timeframe}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

GoalNode.displayName = "GoalNode";

export default GoalNode;
