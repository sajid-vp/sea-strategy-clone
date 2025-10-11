import { Node, Edge } from "reactflow";
import { isOverdue } from "./overdueUtils";

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export const createHierarchicalLayout = (
  goals: any[],
  objectives: any[],
  initiatives: any[],
  projects: any[],
  tasks: any[]
): FlowData => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const LEVEL_SPACING = 350;
  const NODE_SPACING = 180;
  
  // Level 1: Goals
  goals.forEach((goal, index) => {
    nodes.push({
      id: `goal-${goal.id}`,
      type: "goalNode",
      position: { x: 100, y: index * NODE_SPACING },
      data: { 
        ...goal,
        label: goal.title,
        type: "goal",
      },
    });
  });
  
  // Level 2: Objectives
  let objYOffset = 0;
  goals.forEach((goal) => {
    const goalObjectives = objectives.filter(o => o.goalId === goal.id);
    
    goalObjectives.forEach((objective, index) => {
      nodes.push({
        id: `objective-${objective.id}`,
        type: "objectiveNode",
        position: { x: 100 + LEVEL_SPACING, y: objYOffset + index * NODE_SPACING },
        data: { 
          ...objective,
          label: objective.title,
          type: "objective",
        },
      });
      
      edges.push({
        id: `edge-goal-${goal.id}-obj-${objective.id}`,
        source: `goal-${goal.id}`,
        target: `objective-${objective.id}`,
        type: "smoothstep",
        animated: false,
      });
    });
    
    objYOffset += goalObjectives.length * NODE_SPACING;
  });
  
  // Level 3: Initiatives
  let initYOffset = 0;
  objectives.forEach((objective) => {
    const objInitiatives = initiatives.filter(i => i.objectiveId === objective.id);
    
    objInitiatives.forEach((initiative, index) => {
      nodes.push({
        id: `initiative-${initiative.id}`,
        type: "initiativeNode",
        position: { x: 100 + LEVEL_SPACING * 2, y: initYOffset + index * NODE_SPACING },
        data: { 
          ...initiative,
          label: initiative.title,
          type: "initiative",
        },
      });
      
      edges.push({
        id: `edge-obj-${objective.id}-init-${initiative.id}`,
        source: `objective-${objective.id}`,
        target: `initiative-${initiative.id}`,
        type: "smoothstep",
        animated: false,
        style: { stroke: initiative.status === "blocked" ? "hsl(var(--destructive))" : undefined },
      });
    });
    
    initYOffset += objInitiatives.length * NODE_SPACING;
  });
  
  // Level 4: Projects
  let projYOffset = 0;
  initiatives.forEach((initiative) => {
    const initProjects = projects.filter(p => p.initiativeId === initiative.id);
    
    initProjects.forEach((project, index) => {
      const projectOverdue = isOverdue(project.dueDate);
      
      nodes.push({
        id: `project-${project.id}`,
        type: "projectNode",
        position: { x: 100 + LEVEL_SPACING * 3, y: projYOffset + index * NODE_SPACING },
        data: { 
          ...project,
          label: project.title,
          type: "project",
        },
      });
      
      edges.push({
        id: `edge-init-${initiative.id}-proj-${project.id}`,
        source: `initiative-${initiative.id}`,
        target: `project-${project.id}`,
        type: "smoothstep",
        animated: project.status === "blocked" || projectOverdue,
        style: { 
          stroke: projectOverdue || project.status === "blocked" ? "hsl(var(--destructive))" : undefined,
          strokeWidth: projectOverdue ? 3 : undefined,
        },
      });
    });
    
    projYOffset += initProjects.length * NODE_SPACING;
  });
  
  // Level 5: Tasks (only show a few to avoid clutter)
  let taskYOffset = 0;
  projects.forEach((project) => {
    const projTasks = tasks.filter(t => t.projectId === project.id).slice(0, 3); // Limit to 3 tasks per project
    
    projTasks.forEach((task, index) => {
      const taskOverdue = isOverdue(task.dueDate);
      
      nodes.push({
        id: `task-${task.id}`,
        type: "taskNode",
        position: { x: 100 + LEVEL_SPACING * 4, y: taskYOffset + index * (NODE_SPACING / 2) },
        data: { 
          ...task,
          label: task.title,
          type: "task",
        },
      });
      
      edges.push({
        id: `edge-proj-${project.id}-task-${task.id}`,
        source: `project-${project.id}`,
        target: `task-${task.id}`,
        type: "smoothstep",
        animated: task.status === "blocked" || taskOverdue,
        style: { 
          stroke: taskOverdue || task.status === "blocked" ? "hsl(var(--destructive))" : undefined,
          strokeWidth: taskOverdue || task.status === "blocked" ? 3 : 1,
        },
      });
    });
    
    taskYOffset += Math.max(projTasks.length * (NODE_SPACING / 2), NODE_SPACING);
  });
  
  return { nodes, edges };
};

export const filterNodesByStatus = (nodes: Node[], status: string): Node[] => {
  if (status === "all") return nodes;
  return nodes.filter(node => node.data.status === status);
};

export const highlightBlockedPath = (nodes: Node[], edges: Edge[], nodeId: string): { nodes: Node[], edges: Edge[] } => {
  const highlightedNodes = nodes.map(node => ({
    ...node,
    style: {
      ...node.style,
      opacity: node.id === nodeId ? 1 : 0.3,
    },
  }));
  
  const highlightedEdges = edges.map(edge => ({
    ...edge,
    style: {
      ...edge.style,
      opacity: edge.source === nodeId || edge.target === nodeId ? 1 : 0.3,
    },
  }));
  
  return { nodes: highlightedNodes, edges: highlightedEdges };
};
