import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import GoalNode from "./CustomNodes/GoalNode";
import ObjectiveNode from "./CustomNodes/ObjectiveNode";
import InitiativeNode from "./CustomNodes/InitiativeNode";
import ProjectNode from "./CustomNodes/ProjectNode";
import TaskNode from "./CustomNodes/TaskNode";

const nodeTypes = {
  goalNode: GoalNode,
  objectiveNode: ObjectiveNode,
  initiativeNode: InitiativeNode,
  projectNode: ProjectNode,
  taskNode: TaskNode,
};

interface FlowCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeClick?: (node: Node) => void;
}

export const FlowCanvas = ({ initialNodes, initialEdges, onNodeClick }: FlowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        onNodeClick(node);
      }
    },
    [onNodeClick]
  );

  return (
    <div className="h-[calc(100vh-250px)] w-full border rounded-lg bg-card">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.4,
          includeHiddenNodes: false,
          minZoom: 0.5,
          maxZoom: 1.2,
          duration: 800,
        }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case "goalNode":
                return "hsl(var(--primary))";
              case "objectiveNode":
                return "hsl(var(--accent))";
              case "initiativeNode":
                return "hsl(var(--secondary))";
              case "projectNode":
                return "hsl(var(--muted))";
              case "taskNode":
                return "hsl(var(--muted-foreground))";
              default:
                return "hsl(var(--muted))";
            }
          }}
          className="bg-card border"
        />
      </ReactFlow>
    </div>
  );
};
