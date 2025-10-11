import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/utils/statusAggregation";
import { StatusBadge } from "@/components/StatusBadge";

const InitiativeNode = memo(({ data }: NodeProps) => {
  const statusColor = getStatusColor(data.status);
  const isBlocked = data.status === "blocked";
  
  return (
    <div 
      className={cn(
        "px-4 py-3 rounded-lg border bg-card shadow min-w-[220px]",
        isBlocked && "animate-pulse"
      )}
      style={{ borderColor: statusColor, borderWidth: isBlocked ? 2 : 1 }}
    >
      <Handle type="target" position={Position.Left} className="!bg-accent" />
      <Handle type="source" position={Position.Right} className="!bg-accent" />
      
      <div className="flex items-start gap-2">
        <div className="p-1.5 rounded" style={{ backgroundColor: `${statusColor}20` }}>
          {isBlocked ? (
            <AlertCircle className="h-4 w-4" style={{ color: statusColor }} />
          ) : (
            <Zap className="h-4 w-4" style={{ color: statusColor }} />
          )}
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium text-muted-foreground mb-0.5">INITIATIVE</div>
          <div className="font-semibold text-xs text-foreground line-clamp-2">{data.label}</div>
          <div className="mt-1.5">
            <StatusBadge status={data.status} className="text-xs py-0 px-2" />
          </div>
          {data.owner && (
            <div className="text-xs text-muted-foreground mt-1">Owner: {data.owner}</div>
          )}
        </div>
      </div>
    </div>
  );
});

InitiativeNode.displayName = "InitiativeNode";

export default InitiativeNode;
