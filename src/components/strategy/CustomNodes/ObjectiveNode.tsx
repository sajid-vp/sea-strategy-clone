import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/utils/statusAggregation";

const ObjectiveNode = memo(({ data }: NodeProps) => {
  const statusColor = getStatusColor(data.status);
  
  return (
    <div 
      className={cn(
        "px-5 py-3 rounded-lg border-2 bg-card shadow-md min-w-[240px]"
      )}
      style={{ borderColor: statusColor }}
    >
      <Handle type="target" position={Position.Left} className="!bg-accent" />
      <Handle type="source" position={Position.Right} className="!bg-accent" />
      
      <div className="flex items-start gap-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${statusColor}20` }}>
          <Crosshair className="h-4 w-4" style={{ color: statusColor }} />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-muted-foreground mb-0.5">OBJECTIVE</div>
          <div className="font-semibold text-sm text-foreground">{data.label}</div>
          {data.year && (
            <div className="text-xs text-muted-foreground mt-1">Year: {data.year}</div>
          )}
        </div>
      </div>
    </div>
  );
});

ObjectiveNode.displayName = "ObjectiveNode";

export default ObjectiveNode;
